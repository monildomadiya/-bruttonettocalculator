import { revalidatePath, revalidateTag } from "next/cache";
import { STORIES_CACHE_TAG } from "@/lib/cloudinary";
import { POSTS_CACHE_TAG } from "@/lib/postsStore";
import { checkStoriesAdmin } from "@/lib/storiesAuth";

/**
 * "Cache aktualisieren" in the admin: re-reads stories and infographics from
 * Cloudinary and re-renders every page on its next visit. Only needed after a
 * change made directly in the Cloudinary console — the admin's own saves
 * refresh what they touch.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const denied = await checkStoriesAdmin(req);
  if (denied) return denied;
  revalidateTag(STORIES_CACHE_TAG);
  revalidateTag(POSTS_CACHE_TAG);
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
