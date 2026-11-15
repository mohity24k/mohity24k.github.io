// RSS feed of Journal posts: /rss.xml
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { TAGS } from '../data/taxonomy';
import { getPosts } from '../lib/feed';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: `${site.name} · Journal`,
    description: 'Posts and devlogs on machine learning, chemistry and making a visual novel with generative models.',
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/journal/${post.id}/`,
      categories: post.data.tags.map((tag) => TAGS[tag]),
    })),
    customData: `<language>${site.locale}</language>`,
  });
}
