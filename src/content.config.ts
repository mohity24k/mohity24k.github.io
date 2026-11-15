/**
 * Content collections and their schemas.
 *
 * Every entry in src/content/ is validated against these at build time. A
 * missing date, an unknown tag or a malformed URL stops the build with a
 * message that names the file, the field and the fix. Adding content never
 * requires touching layout code; adding a new tag or platform is one line in
 * src/data/taxonomy.ts.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PLATFORM_IDS, STATUS_IDS, TAG_IDS } from './data/taxonomy';

/* ── Shared field builders ──────────────────────────────────────────────── */

const list = (ids: readonly string[]) => ids.join(', ');

const text = (field: string, max: number) =>
  z
    .string({ error: `"${field}" is required and must be text.` })
    .trim()
    .min(1, `"${field}" cannot be empty.`)
    .max(max, `"${field}" is too long (max ${max} characters). Keep it to one line.`);

const date = z.coerce.date({
  error: '"date" is required. Write it as YYYY-MM-DD, for example: date: 2026-11-15',
});

const tags = z
  .array(
    z.enum(TAG_IDS, {
      error: (issue) =>
        `Unknown tag "${String(issue.input)}". Use one of: ${list(TAG_IDS)}. ` +
        'To create a new tag, add it to TAGS in src/data/taxonomy.ts.',
    }),
    { error: '"tags" is required. Write it as a list, for example: tags: [ai, research]' },
  )
  .min(1, 'Add at least one tag so the entry can be found through the filters.');

const url = (field: string) =>
  z.url({
    protocol: /^https?$/,
    error: `"${field}" must be a full URL starting with https://. If the link does not exist yet, delete the line and list ${field} under "placeholder" instead.`,
  });

/**
 * `placeholder` lists the fields of an entry that are stand-ins waiting for
 * real material, e.g. `placeholder: [date, cover, codeUrl]`.
 *
 * It does three jobs:
 *   - placeholder dates are used for sorting but never printed;
 *   - a placeholder link field renders as a disabled "Coming soon" badge
 *     (a link field that is simply absent renders nothing);
 *   - `npm run todo` lists every remaining placeholder across the site.
 * Remove a name from the list once the real value is in.
 */
const placeholder = <const T extends [string, ...string[]]>(fields: T) =>
  z
    .array(
      z.enum(fields, {
        error: (issue) =>
          `"${String(issue.input)}" is not a field that can be marked as a placeholder here. Use any of: ${list(fields)}.`,
      }),
    )
    .default([]);

/* ── Projects ───────────────────────────────────────────────────────────────
   src/content/projects/<slug>.md
   The body is the write-up: Problem → What I built → Results → Stack.      */

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: text('title', 90),
      summary: text('summary', 200),
      /** Which world styles this project. */
      world: z.enum(['lab', 'studio'], {
        error: '"world" must be lab (AI, chemistry, pharma, research) or studio (games, art, XR).',
      }),
      tags,
      status: z.enum(STATUS_IDS, { error: `"status" must be one of: ${list(STATUS_IDS)}.` }),
      /** Completion date (or last milestone for work in progress). Sorts the feed. */
      date,
      /** Where the work lives; shown as the badge on the card. */
      platform: z.enum(PLATFORM_IDS, {
        error: `"platform" must be one of: ${list(PLATFORM_IDS)}. To add one, edit PLATFORMS in src/data/taxonomy.ts.`,
      }),
      liveUrl: url('liveUrl').optional(),
      codeUrl: url('codeUrl').optional(),
      paperUrl: url('paperUrl').optional(),
      /** Headline numbers. Cards show the first two; the detail page shows all. */
      metrics: z
        .array(z.object({ value: text('metrics.value', 16), label: text('metrics.label', 40) }))
        .max(4, 'Keep "metrics" to four at most. Cards only show the first two.')
        .default([]),
      /** Path to an image next to this file, e.g. ./my-project.png. Without
          one the card draws generated artwork in its world's style. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Which generated artwork to draw when there is no cover image.
          Leave it out to let the site choose from the world and tags. */
      art: z
        .enum(['molecule', 'network', 'waveform', 'scene'], {
          error: '"art" must be one of: molecule, network, waveform (Lab) or scene (Studio).',
        })
        .optional(),
      /** Gallery pieces to show on the project page: file names (without
          .yaml) from src/content/gallery/, e.g. gallery: [heroine-sheet]. */
      gallery: z.array(reference('gallery')).default([]),
      /** Featured projects appear in "Selected work" on the home page. */
      featured: z.boolean().default(false),
      /** Lower numbers come first in "Selected work". */
      featuredOrder: z.number().int().positive().optional(),
      placeholder: placeholder(['date', 'cover', 'liveUrl', 'codeUrl', 'paperUrl', 'body']),
    }),
});

/* ── Posts ──────────────────────────────────────────────────────────────────
   src/content/posts/<slug>.md (or .mdx)
   Every post lives in Journal. A devlog is a post tagged `devlog`.         */

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: text('title', 110),
      summary: text('summary', 200),
      date,
      /** Optional "last edited" date, shown under the title. */
      updated: z.coerce.date().optional(),
      tags,
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** File name (without .md) of the project this post is about. Devlogs
          with a relatedProject show up on that project's page and in the
          "Currently building" strip. */
      relatedProject: reference('projects').optional(),
      /** Drafts are visible in `npm run dev` and left out of the published site. */
      draft: z.boolean().default(false),
      placeholder: placeholder(['date', 'cover', 'body']),
    }),
});

/* ── Publications ───────────────────────────────────────────────────────────
   src/content/publications/<slug>.md
   Always part of Lab. The body is optional (abstract or notes).            */

const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: text('title', 200),
      summary: text('summary', 200),
      /** Authors as they appear in the citation, e.g. ["Gedam, M."]. */
      authors: z
        .array(text('authors', 80), { error: '"authors" is required, for example: authors: ["Gedam, M."]' })
        .min(1, 'List at least one author.'),
      year: z
        .number({ error: '"year" is required, as a number: year: 2023' })
        .int()
        .min(1900)
        .max(2100),
      /** Journal, conference or publisher. */
      venue: text('venue', 120),
      volume: z.union([z.string(), z.number()]).optional(),
      issue: z.union([z.string(), z.number()]).optional(),
      pages: z.string().optional(),
      /** The bare DOI, e.g. 10.1234/abcd.5678 (not the full URL). */
      doi: z
        .string()
        .regex(/^10\.\d{4,9}\/\S+$/, 'Write "doi" as the bare identifier starting with 10., without https://doi.org/')
        .optional(),
      /** Use when there is no DOI but there is a page for the paper. */
      url: url('url').optional(),
      /** Publication date. Sorts the feed. */
      date,
      tags,
      cover: image().optional(),
      coverAlt: z.string().optional(),
      placeholder: placeholder(['date', 'cover', 'doi']),
    }),
});

/* ── Gallery ────────────────────────────────────────────────────────────────
   src/content/gallery/<slug>.yaml, one file per piece.
   Studio only; gallery pieces are not part of the home feed.               */

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.{yaml,yml}' }),
  schema: ({ image }) =>
    z
      .object({
        /** Path to an image next to this file, e.g. ./heroine-sheet.png */
        image: image().optional(),
        /** Path under public/ to a short muted loop, e.g. /gallery/rain-loop.mp4 */
        video: z
          .string()
          .regex(/^\/.+\.(mp4|webm)$/, '"video" must be a path under public/ ending in .mp4 or .webm, e.g. /gallery/loop.mp4')
          .optional(),
        /** Still frame shown before a video plays. Required when `video` is set. */
        poster: image().optional(),
        /** Describes the picture for people who cannot see it. */
        alt: text('alt', 240),
        /** One line shown under the piece. */
        caption: text('caption', 160),
        /** Model(s) used, e.g. "SDXL + IP-Adapter". */
        model: text('model', 80),
        /** How it was made, e.g. "ComfyUI, 2-pass upscale". */
        workflow: text('workflow', 120),
        /** What it is for, e.g. "character sheet for VN ch.1". */
        purpose: text('purpose', 120),
        date,
        /** File name (without .md) of the devlog that explains this piece. */
        relatedPost: reference('posts').optional(),
        placeholder: placeholder(['image', 'video', 'caption', 'model', 'workflow', 'purpose', 'date']),
      })
      .refine((piece) => Boolean(piece.image) !== Boolean(piece.video), {
        error: 'A gallery piece needs exactly one of "image" or "video".',
        path: ['image'],
      })
      .refine((piece) => !piece.video || Boolean(piece.poster), {
        error: 'A video piece needs a "poster" image (a still frame), so the page does not jump while it loads.',
        path: ['poster'],
      }),
});

export const collections = { projects, posts, publications, gallery };
