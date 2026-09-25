import { redirect } from "next/navigation";

/** Moved into the combined admin; keeps old bookmarks working. */
export default function StoriesAdminRedirect() {
  redirect("/admin?tab=stories");
}
