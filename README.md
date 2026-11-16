# mohity24k.github.io

Mohit Gedam's personal site: one home base with three visual worlds.

| World | Path | For |
|---|---|---|
| Lab | `/lab/`, `/lab/<project>/`, `/lab/publications/<paper>/` | AI, chemistry, pharma and research projects; publications; certifications |
| Studio | `/studio/`, `/studio/<project>/`, `/studio/gallery/` | Games, AI art gallery, XR |
| Journal | `/journal/`, `/journal/<post>/`, `/rss.xml` | Posts and devlogs, with an RSS feed |
| Neutral | `/`, `/about/` | Home hub, About, contact, CV |
| Neutral | `/tags/<tag>/` | Everything with one tag, across worlds. Good links for a CV, e.g. `/tags/pharma/` |

Built with [Astro](https://astro.build) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. The design brief is in [`docs/DESIGN.md`](docs/DESIGN.md).

## Run it locally

Needs Node 22.23 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:4321. The token reference is at http://localhost:4321/styleguide/.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local preview with live reload |
| `npm run build` | Production build into `dist/`. Fails with a clear message if a content entry is invalid |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type-check `.astro` and `.ts` files |
| `npm run check:contrast` | WCAG contrast check for every world's colour tokens |
| `npm run todo` | List everything that is still a placeholder |

## Where things live

```
src/
  content/            ← the only folder you edit to add work
    projects/           one .md per project
    posts/              one .md/.mdx per post or devlog
    publications/       one .md per publication
    gallery/            one .yaml per image or clip
  content.config.ts   schemas that validate every entry
  data/
    site.ts             name, links, CV path, contact-form key
    studio.ts           the dialogue lines that open /studio/
    about.ts            bio, skills, education, certifications, activities, photo captions
    taxonomy.ts         tags, platforms, statuses
  styles/
    tokens.css          skeleton tokens + one block of tokens per world
    base.css            reset and shared classes; reads tokens only
    motion.css          page transitions and the CSS half of the animations
  scripts/
    motion.ts           always loaded, tiny: transitions, reading progress
    motion-gsap.ts      GSAP effects per world; loaded when idle, never under reduced motion
  layouts/Base.astro  the one layout: sets data-world, top bar, footer
  lib/
    feed.ts             turns projects, posts and publications into cards
    art.ts              generated cover artwork (used until an entry has a cover)
  assets/             drop portrait.jpg here to replace the stand-in portrait
    life/               photos for the About page strip (lab.jpg, chess.jpg, …)
  components/         shared pieces
  pages/              routes
public/cv/            the downloadable CV (stable file name)
```

## One-time GitHub setup

In the repository: **Settings → Pages → Source → GitHub Actions**.
