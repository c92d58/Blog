import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection('posts');
  return rss({
    title: 'WAHSUN | Blog',
    description: 'WAHSUN 的个人博客',
    site: 'https://blog.wahsun.org',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-TW</language>`,
  });
}
