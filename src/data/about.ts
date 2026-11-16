/**
 * Facts about Mohit that are not projects, posts or publications.
 * Edit the lists here; the About page and the Lab index read from them.
 * Nothing in this file needs layout code to change.
 */

/* ── Bio ────────────────────────────────────────────────────────────────────
   TODO(mohit): these paragraphs only restate your CV. Rewrite them in your
   own voice. One paragraph per entry.                                       */
export const bio: string[] = [
  'I’m a final-year B.Tech student in Pharmaceutical Chemistry & Technology at ICT Mumbai, with a minor in AI/ML. I graduate in August 2027.',
  'Most of what I build is machine learning for chemistry and drug problems: a calculator that scores reactions on green chemistry metrics, a multimodal model for detecting fake news, and a Hindi text-to-speech fine-tune. I have also published a critical review of carbon capture, utilisation and storage.',
  'Alongside that I’m making a visual novel, with its art and video generated in ComfyUI using open-source models. VR and AR are next.',
];

/* ── Skills ─────────────────────────────────────────────────────────────── */
export interface SkillGroup {
  title: string;
  skills: string[];
}

export const skills: SkillGroup[] = [
  { title: 'Programming & data', skills: ['Python', 'Pandas', 'NumPy', 'SQL'] },
  { title: 'Machine learning', skills: ['scikit-learn', 'PyTorch', 'TensorFlow'] },
  { title: 'NLP, vision & speech', skills: ['Hugging Face', 'BERT', 'ResNet-50', 'XTTS-v2'] },
  { title: 'Cheminformatics', skills: ['RDKit'] },
  { title: 'Analytical chemistry', skills: ['HPLC', 'GC', 'NMR', 'UV-Vis'] },
  { title: 'Tools', skills: ['Docker', 'Streamlit', 'ComfyUI'] },
];

/* ── Education ──────────────────────────────────────────────────────────── */
export interface Education {
  degree: string;
  school: string;
  /** Extra line, e.g. a minor or honours. */
  detail?: string;
  /** As printed, e.g. "Expected Aug 2027". */
  date: string;
}

export const education: Education[] = [
  {
    degree: 'B.Tech, Pharmaceutical Chemistry & Technology',
    school: 'Institute of Chemical Technology (ICT), Mumbai',
    detail: 'Minor in AI/ML',
    date: 'Expected Aug 2027',
  },
];

/* ── Certifications ─────────────────────────────────────────────────────── */
export interface Certification {
  title: string;
  issuer: string;
  /** Month and year as printed, e.g. "Oct 2024". */
  date: string;
  /** Link to the certificate, if there is one to share. */
  url?: string;
}

export const certifications: Certification[] = [
  { title: 'Data Science for Engineers', issuer: 'NPTEL', date: 'Oct 2024' },
];

/* ── Activities ─────────────────────────────────────────────────────────── */
export interface Activity {
  role: string;
  /** Organisation or place. Leave out when the role says it all. */
  where?: string;
}

export const activities: Activity[] = [
  { role: 'Volunteer instructor', where: 'Sparsh NGO' },
  { role: 'Student member', where: 'American Chemical Society (ACS)' },
  { role: 'Beach clean-up volunteer', where: 'Bandra' },
  { role: 'Competitive chess' },
];

/* ── Currently exploring ────────────────────────────────────────────────── */
export const exploring: string[] = ['VR and AR'];

/* ── Life photo strip ───────────────────────────────────────────────────────
   One entry per photo, in display order (4 to 8 reads best).

   TODO(mohit): to add a photo, save it as src/assets/life/<file>.jpg (or
   .png / .webp / .avif) using the `file` name below, then rewrite its
   caption as one line about that photo. Until the file exists, the page
   draws a stand-in tile with the icon and world named in `standIn`.
   Add, remove or reorder entries freely.                                    */
export interface LifePhoto {
  /** File name in src/assets/life/, without the extension. */
  file: string;
  /** One line shown under the photo. */
  caption: string;
  /** Describes the photo for people who cannot see it. Defaults to the caption. */
  alt?: string;
  standIn: {
    icon: 'flask' | 'chess' | 'wave' | 'book' | 'compass';
    world: 'neutral' | 'lab' | 'studio' | 'journal';
  };
}

export const lifePhotos: LifePhoto[] = [
  { file: 'lab', caption: 'In the lab', standIn: { icon: 'flask', world: 'lab' } },
  { file: 'chess', caption: 'Chess', standIn: { icon: 'chess', world: 'studio' } },
  { file: 'sparsh', caption: 'Teaching at Sparsh', standIn: { icon: 'book', world: 'journal' } },
  { file: 'beach-cleanup', caption: 'Beach clean-up, Bandra', standIn: { icon: 'wave', world: 'lab' } },
  { file: 'travel', caption: 'Travel', standIn: { icon: 'compass', world: 'neutral' } },
];
