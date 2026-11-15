/**
 * The controlled vocabularies content entries are validated against.
 *
 * To add a tag or platform: add one line here. Nothing else needs to change;
 * filter chips, badges and schema validation all read from these lists.
 * A tag only shows up as a filter chip once at least one entry uses it.
 */

/** The three styled worlds plus the neutral shared pages. */
export const WORLDS = {
  neutral: { label: 'Home', path: '/' },
  lab: { label: 'Lab', path: '/lab/' },
  studio: { label: 'Studio', path: '/studio/' },
  journal: { label: 'Journal', path: '/journal/' },
} as const;

export type World = keyof typeof WORLDS;

/** Interest tags. They filter across worlds. Order here is chip order. */
export const TAGS = {
  ai: 'AI',
  pharma: 'Pharma',
  chemistry: 'Chemistry',
  research: 'Research',
  gamedev: 'Game Dev',
  'generative-art': 'Generative Art',
  xr: 'XR',
  devlog: 'Devlog',
} as const;

export type Tag = keyof typeof TAGS;
export const TAG_IDS = Object.keys(TAGS) as [Tag, ...Tag[]];

/** Where a piece of work lives. Shown as the platform badge on its card. */
export const PLATFORMS = {
  streamlit: 'Streamlit',
  vercel: 'Vercel',
  netlify: 'Netlify',
  github: 'GitHub',
  huggingface: 'Hugging Face',
  itch: 'itch.io',
  journal: 'Journal',
  doi: 'DOI',
  unreleased: 'Not released yet',
} as const;

export type Platform = keyof typeof PLATFORMS;
export const PLATFORM_IDS = Object.keys(PLATFORMS) as [Platform, ...Platform[]];

/** Project status. `completed` shows no pill; the others do. */
export const STATUSES = {
  completed: 'Completed',
  'in-progress': 'In progress',
  exploring: 'Exploring',
} as const;

export type Status = keyof typeof STATUSES;
export const STATUS_IDS = Object.keys(STATUSES) as [Status, ...Status[]];
