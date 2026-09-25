import StoriesTray from "@/components/StoriesTray";
import { getActiveStories } from "@/lib/cloudinary";

/**
 * Story rings under the header on every page (rendered in the root layout).
 *
 * Server-rendered so the row is in the HTML from the first byte — a tray that
 * popped in after a client-side fetch would push the whole page down (CLS).
 * Renders nothing when there are no active stories or Cloudinary isn't set up.
 */
export default async function StoriesBar() {
  const stories = await getActiveStories();
  if (stories.length === 0) return null;
  return <StoriesTray stories={stories} />;
}
