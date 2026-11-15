/**
 * Facts about Mohit that are not projects, posts or publications.
 * Edit the lists here; the About page and the Lab index read from them.
 */

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
