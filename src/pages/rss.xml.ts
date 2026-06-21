import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: "聽雨",
    description: "在雨聲中，讀懂人性的溫度。",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}`,
      categories: post.data.tags,
    })),
  });
}
