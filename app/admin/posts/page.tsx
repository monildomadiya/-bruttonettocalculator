import type { Metadata } from "next";
import PostsAdmin from "@/components/PostsAdmin";
import { calculatorGroups } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Infografiken verwalten",
  robots: { index: false, follow: false },
};

/** Infografiken admin. Same password as /admin/stories, checked by the API on every call. */
export default function PostsAdminPage() {
  const calculators = calculatorGroups.flatMap((g) =>
    g.items.map((i) => ({ href: i.href, label: i.label, group: g.label }))
  );
  return <PostsAdmin calculators={calculators} />;
}
