import { getCloudinaryConfig, STORY_TRANSFORMS } from "@/lib/cloudinary";
import { isStoryId } from "@/lib/stories";

/**
 * Serves story images from our own origin. Cloudinary still does the resizing
 * and WebP encoding; this route only relays the bytes, so visitors never
 * connect to a third party (no IP transfer to declare in the Datenschutz page).
 *
 * The URL carries the asset version, so a response never changes and can be
 * cached for a year by the browser and any proxy in front of the app.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const id = params.get("id") ?? "";
  const version = params.get("v") ?? "";
  const size = params.get("s") === "thumb" ? "thumb" : "full";

  const cfg = getCloudinaryConfig();
  if (!cfg || !isStoryId(id) || !/^\d{1,12}$/.test(version)) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(
    `https://res.cloudinary.com/${cfg.cloudName}/image/upload/${STORY_TRANSFORMS[size]}/v${version}/${id}`,
    { cache: "no-store" }
  ).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Robots-Tag": "noindex",
    },
  });
}
