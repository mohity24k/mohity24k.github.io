/**
 * Site-wide settings. Edit values here; no layout code reads anything else
 * for names, links or keys.
 *
 * `null` (or an empty string for the form key) means "not supplied yet":
 * the site shows a "Coming soon" badge or a fallback instead of a dead link.
 */
export interface SocialLink {
  id: string;
  label: string;
  url: string | null;
  hideIfMissing?: boolean;
}

export const site = {
  name: 'Mohit Gedam',
  /** Canonical origin. Must match `site` in astro.config.mjs. */
  url: 'https://mohity24k.github.io',
  /** One-line positioning used on the home page and in meta descriptions. */
  tagline: 'I build ML for chemistry & drug problems, and games with generative AI.',
  description:
    'Mohit Gedam: final-year B.Tech student in Pharmaceutical Chemistry & Technology at ICT Mumbai, minor in AI/ML. Machine learning for chemistry and drug problems, a visual novel made with open-source generative models, and a monthly journal.',
  locale: 'en',

  email: 'mohity24k@gmail.com',

  /**
   * Profile links, in display order.
   * `url: null` renders a "Coming soon" badge instead of a dead link.
   * `hideIfMissing: true` leaves the entry off the site until it has a URL.
   */
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      // Taken from the repository owner (mohity24k/mohity24k.github.io).
      // TODO(mohit): confirm this is the profile you want linked.
      url: 'https://github.com/mohity24k',
    },
    {
      id: 'orcid',
      label: 'ORCID',
      // TODO(mohit): add your ORCID iD URL, e.g. 'https://orcid.org/0000-0000-0000-0000'
      url: null,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      // TODO(mohit): add your LinkedIn URL, or leave null to keep it off the site
      url: null,
      hideIfMissing: true,
    },
  ] as SocialLink[],

  /**
   * Stable path. Replace the file in public/cv/ to update the CV.
   * TODO(mohit): public/cv/Mohit_Gedam_CV.pdf is a one-page placeholder.
   * Overwrite it with your phone-free web CV, keeping the same file name.
   */
  cvPath: '/cv/Mohit_Gedam_CV.pdf',

  /**
   * Web3Forms access key (public by design).
   * TODO(mohit): paste your key from https://web3forms.com.
   * While this is empty the contact form falls back to a mailto: link.
   */
  web3formsKey: '',
};

export type Site = typeof site;
