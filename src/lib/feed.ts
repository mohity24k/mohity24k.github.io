/**
 * The feed: projects, posts and publications normalised into one shape that
 * cards, filters and the home page read. Pages never look at raw collection
 * entries, so a new field or a new collection is handled here once.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { PLATFORMS, STATUSES, TAGS, type Tag, type World } from '../data/taxonomy';

export type ItemWorld = Exclude<World, 'neutral'>;
export type ArtMotif = 'molecule' | 'network' | 'waveform' | 'citation' | 'scene' | 'monogram';

export interface FeedLink {
  label: string;
  /** `null` means the link is on its way: rendered as "Coming soon", never as a dead link. */
  href: string | null;
}

export interface FeedItem {
  /** Unique across collections, e.g. "projects/hindi-tts-xtts". */
  key: string;
  collection: 'projects' | 'posts' | 'publications';
  id: string;
  world: ItemWorld;
  /** The on-site page for this item. */
  href: string;
  title: string;
  summary: string;
  /** Used for sorting. May be a stand-in; see `dateText`. */
  date: Date;
  /** What to print, or `null` when the date is still a placeholder. */
  dateText: string | null;
  tags: Tag[];
  /** Where it lives, or what kind of thing it is. */
  badge: string | null;
  /** Pill text when the work is not finished. */
  status: string | null;
  metrics: { value: string; label: string }[];
  cover?: ImageMetadata;
  coverAlt: string;
  /** Generated artwork used when there is no cover. */
  art: ArtMotif;
  /** Words drawn into typographic artwork (citation, monogram). */
  artText: { big: string; small: string[] };
  links: FeedLink[];
  featured: boolean;
  featuredOrder: number;
}

const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** ISO date for <time datetime>. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** A link that exists, a link that is coming, or nothing at all. */
function link(label: string, href: string | undefined, isPlaceholder: boolean): FeedLink[] {
  if (href) return [{ label, href }];
  return isPlaceholder ? [{ label, href: null }] : [];
}

function fromProject({ id, data }: CollectionEntry<'projects'>): FeedItem {
  const has = (field: (typeof data.placeholder)[number]) => data.placeholder.includes(field);
  const defaultArt: ArtMotif =
    data.world === 'studio' ? 'scene' : data.tags.some((t) => t === 'chemistry' || t === 'pharma') ? 'molecule' : 'network';

  return {
    key: `projects/${id}`,
    collection: 'projects',
    id,
    world: data.world,
    href: `/${data.world}/${id}/`,
    title: data.title,
    summary: data.summary,
    date: data.date,
    dateText: has('date') ? null : month.format(data.date),
    tags: data.tags,
    badge: data.platform === 'unreleased' ? null : PLATFORMS[data.platform],
    status: data.status === 'completed' ? null : STATUSES[data.status],
    metrics: data.metrics,
    cover: data.cover,
    coverAlt: data.coverAlt ?? '',
    art: data.art ?? defaultArt,
    artText: { big: '', small: [] },
    links: [
      ...link('Live', data.liveUrl, has('liveUrl')),
      ...link('Code', data.codeUrl, has('codeUrl')),
      ...link('Paper', data.paperUrl, has('paperUrl')),
    ],
    featured: data.featured,
    featuredOrder: data.featuredOrder ?? Number.MAX_SAFE_INTEGER,
  };
}

function fromPost({ id, data }: CollectionEntry<'posts'>): FeedItem {
  const kind = data.tags.includes('devlog') ? 'Devlog' : 'Post';
  const dateText = data.placeholder.includes('date') ? null : day.format(data.date);

  return {
    key: `posts/${id}`,
    collection: 'posts',
    id,
    world: 'journal',
    href: `/journal/${id}/`,
    title: data.title,
    summary: data.summary,
    date: data.date,
    dateText,
    tags: data.tags,
    badge: kind,
    status: null,
    metrics: [],
    cover: data.cover,
    coverAlt: data.coverAlt ?? '',
    art: 'monogram',
    artText: { big: data.title.match(/[\p{L}\p{N}]/u)?.[0]?.toUpperCase() ?? '¶', small: [] },
    links: [],
    featured: false,
    featuredOrder: Number.MAX_SAFE_INTEGER,
  };
}

function fromPublication({ id, data }: CollectionEntry<'publications'>): FeedItem {
  const issue = [data.volume && `Vol. ${data.volume}`, data.issue && `No. ${data.issue}`].filter(Boolean).join(' · ');

  return {
    key: `publications/${id}`,
    collection: 'publications',
    id,
    world: 'lab',
    href: `/lab/publications/${id}/`,
    title: data.title,
    summary: data.summary,
    date: data.date,
    // The year comes from the citation itself, so it is real even while the exact date is a stand-in.
    dateText: String(data.year),
    tags: data.tags,
    badge: 'Publication',
    status: null,
    metrics: [],
    cover: data.cover,
    coverAlt: data.coverAlt ?? '',
    art: 'citation',
    artText: { big: String(data.year), small: [data.venue, issue] },
    links: data.doi
      ? [{ label: 'DOI', href: `https://doi.org/${data.doi}` }]
      : data.url
        ? [{ label: 'Read', href: data.url }]
        : link('DOI', undefined, data.placeholder.includes('doi')),
    featured: false,
    featuredOrder: Number.MAX_SAFE_INTEGER,
  };
}

/** Published posts: drafts show up in `npm run dev` only. */
export const getPosts = () => getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);

/** Every feed item, newest first. */
export async function getFeed(): Promise<FeedItem[]> {
  const [projects, posts, publications] = await Promise.all([
    getCollection('projects'),
    getPosts(),
    getCollection('publications'),
  ]);

  return [...projects.map(fromProject), ...posts.map(fromPost), ...publications.map(fromPublication)].sort(
    (a, b) => b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title),
  );
}

/** "Selected work" first (in its fixed order), then everything else newest first. */
export function splitFeatured(items: FeedItem[]) {
  return {
    featured: items.filter((i) => i.featured).sort((a, b) => a.featuredOrder - b.featuredOrder),
    rest: items.filter((i) => !i.featured),
  };
}

export interface TagCount {
  tag: Tag;
  label: string;
  count: number;
}

/** Tags that have at least one item, in the order they are declared in taxonomy.ts. */
export function countTags(items: FeedItem[]): TagCount[] {
  return (Object.keys(TAGS) as Tag[])
    .map((tag) => ({ tag, label: TAGS[tag], count: items.filter((i) => i.tags.includes(tag)).length }))
    .filter(({ count }) => count > 0);
}

export interface Building {
  item: FeedItem;
  /** The newest post written about it, if there is one. */
  latestPost: { title: string; href: string } | null;
}

/** Work in progress, each with its latest devlog. Drives "Currently building". */
export async function getCurrentlyBuilding(): Promise<Building[]> {
  const [projects, posts] = await Promise.all([
    getCollection('projects', ({ data }) => data.status === 'in-progress'),
    getPosts(),
  ]);

  return projects
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((project) => {
      const latest = posts
        .filter((post) => post.data.relatedProject?.id === project.id)
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())[0];
      return {
        item: fromProject(project),
        latestPost: latest ? { title: latest.data.title, href: `/journal/${latest.id}/` } : null,
      };
    });
}
