import type { Metadata } from "next";
import StoriesAdmin from "@/components/StoriesAdmin";
import { getPublishedPosts } from "@/lib/postsStore";
import { storyLinkOptions } from "@/lib/storyLinks";

export const metadata: Metadata = {
  title: "Stories verwalten",
  robots: { index: false, follow: false },
};

/**
 * Story admin: upload an image, attach a post, pick a lifetime. Protected by
 * STORIES_ADMIN_PASSWORD, which the API checks on every call — this page itself
 * holds nothing secret (only the list of linkable pages).
 */
export default async function StoriesAdminPage() {
  return <StoriesAdmin linkOptions={storyLinkOptions(await getPublishedPosts())} />;
}
