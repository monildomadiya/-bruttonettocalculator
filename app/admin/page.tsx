import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";
import { calculatorGroups } from "@/lib/navigation";
import { storyLinkOptions } from "@/lib/storyLinks";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * One admin for everything: dashboard, stories, infographics, tools. Protected
 * by STORIES_ADMIN_PASSWORD, which every API call checks — this page itself
 * holds nothing secret, only the lists of linkable pages. Infographic link
 * targets are added client-side from the live post list.
 */
export default function AdminPage() {
  const calculators = calculatorGroups.flatMap((g) =>
    g.items.map((i) => ({ href: i.href, label: i.label, group: g.label }))
  );
  return <AdminApp linkOptions={storyLinkOptions()} calculators={calculators} />;
}
