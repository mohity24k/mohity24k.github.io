// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * Fonts are self-hosted from the @fontsource-variable/* packages in
 * node_modules, so a build never depends on a font CDN being reachable.
 * Each family is one variable .woff2 (Latin subset). Astro copies it into the
 * build and generates a metrics-matched fallback so text doesn't jump when the
 * web font arrives.
 *
 * @param {string} name        CSS family name
 * @param {`--${string}`} cssVariable  what tokens.css refers to
 * @param {string[]} fallbacks last entry must be a generic family
 * @param {Array<{ file: string, weight: string, style?: 'normal' | 'italic', stretch?: string }>} variants
 */
const selfHosted = (name, cssVariable, fallbacks, variants) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks,
  options: {
    variants: /** @type {any} */ (
      variants.map(({ file, weight, style = 'normal', stretch }) => ({
        src: [`@fontsource-variable/${file}.woff2`],
        weight,
        style,
        ...(stretch ? { stretch } : {}),
      }))
    ),
  },
});

export default defineConfig({
  // The repo is <username>.github.io, so the site lives at the root: no `base`.
  site: 'https://mohity24k.github.io',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    // sitemap-index.xml, listed in public/robots.txt. The style guide is a
    // working reference, not a page for search engines.
    sitemap({ filter: (page) => !page.includes('/styleguide/') }),
  ],
  fonts: [
    // Shared chrome everywhere; body text in Neutral, Lab and Studio.
    selfHosted('Schibsted Grotesk', '--font-schibsted', ['system-ui', 'sans-serif'], [
      { file: 'schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal', weight: '400 900' },
    ]),
    // Lab: data, measurements, code.
    selfHosted('Martian Mono', '--font-martian', ['ui-monospace', 'monospace'], [
      { file: 'martian-mono/files/martian-mono-latin-wdth-normal', weight: '100 800', stretch: '75% 112.5%' },
    ]),
    // Studio: wide title-card display.
    selfHosted('Mona Sans', '--font-mona', ['system-ui', 'sans-serif'], [
      { file: 'mona-sans/files/mona-sans-latin-wdth-normal', weight: '200 900', stretch: '75% 125%' },
    ]),
    // Journal: reading serif with an italic display voice.
    selfHosted('Brygada 1918', '--font-brygada', ['Georgia', 'serif'], [
      { file: 'brygada-1918/files/brygada-1918-latin-wght-normal', weight: '400 700' },
      { file: 'brygada-1918/files/brygada-1918-latin-wght-italic', weight: '400 700', style: 'italic' },
    ]),
  ],
});
