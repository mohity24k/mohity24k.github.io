// Step 1 scaffold only. Step 2 replaces this with the real feed module.
import { getCollection } from 'astro:content';
import type { ScaffoldItem } from '../components/ScaffoldList.astro';

type Dated = ScaffoldItem & { date: Date };

export async function scaffoldItems(): Promise<ScaffoldItem[]> {
  const [projects, posts, publications] = await Promise.all([
    getCollection('projects'),
    getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft),
    getCollection('publications'),
  ]);

  const items: Dated[] = [
    ...projects.map(({ data }) => ({ kind: 'Project', world: data.world, ...pick(data) })),
    ...posts.map(({ data }) => ({ kind: 'Post', world: 'journal' as const, ...pick(data) })),
    ...publications.map(({ data }) => ({ kind: 'Publication', world: 'lab' as const, ...pick(data) })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

const pick = (data: { title: string; summary: string; tags: string[]; date: Date }) => ({
  title: data.title,
  summary: data.summary,
  tags: data.tags,
  date: data.date,
});
