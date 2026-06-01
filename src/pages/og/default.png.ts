import type { APIContext } from "astro";
import { generateOgImage } from "../../lib/og";

export async function GET(_context: APIContext) {
  const png = await generateOgImage({
    title: "BLOG",
    description: "A quiet place to read — writing about systems, technology, and the world around us.",
  });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
