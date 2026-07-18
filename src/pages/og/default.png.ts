import type { APIContext } from "astro";
import { generateOgImage } from "../../lib/og";

export async function GET(_context: APIContext) {
  const png = await generateOgImage({
    title: "聽雨",
    description: "在雨聲中，讀懂人性的溫度。",
  });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
