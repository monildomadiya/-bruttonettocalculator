import { getCloudinaryConfig } from "@/lib/cloudinary";
import { isPostImageId, isPostSlug, type PostImageSize } from "@/lib/posts";
import { POST_TRANSFORMS } from "@/lib/postsStore";

/**
 * Infografik images: /bilder/<size>/<version>/<key>/<post-slug>.<ext>
 *
 * Served from our own origin so they are crawlable (robots.txt blocks /api/)
 * and can rank in Google Images; the file name is the post slug because Google
 * reads image file names as a relevance signal. Cloudinary still does the
 * resizing — this route only relays the bytes, so visitors never contact a
 * third party. The URL carries the asset version, so responses never change.
 */
export const dynamic = "force-dynamic";

const EXT: Record<PostImageSize, string> = { thumb: "webp", full: "webp", og: "jpg" };

export async function GET(
  _req: Request,
  { params }: { params: { size: string; version: string; key: string; file: string } }
) {
  const size = params.size as PostImageSize;
  const [name, ext] = params.file.split(/\.(?=[^.]+$)/);
  const id = `posts/img-${params.key}`;
  const cfg = getCloudinaryConfig();

  if (
    !cfg ||
    !(size in POST_TRANSFORMS) ||
    !/^\d{1,12}$/.test(params.version) ||
    !isPostImageId(id) ||
    !isPostSlug(name ?? "") ||
    ext !== EXT[size]
  ) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(
    `https://res.cloudinary.com/${cfg.cloudName}/image/upload/${POST_TRANSFORMS[size]}/v${params.version}/${id}`,
    { cache: "no-store" }
  ).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? (ext === "jpg" ? "image/jpeg" : "image/webp"),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
