import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection('posts');
  return rss({
    title: 'WAHSUN | Blog',
    description: 'WAHSUN 的个人博客',
    site: 'https://c92d58.github.io/blog',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/posts/${post.id}/`,
    })),
    customData: `<language>zh-TW</language>`,
  });
}
