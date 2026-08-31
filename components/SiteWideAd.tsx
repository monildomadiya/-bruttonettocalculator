"use client";

import { usePathname } from "next/navigation";
import AdUnit from "./AdUnit";
import type { AdSlotName } from "@/lib/adsConfig";

/**
 * Site-wide ad placement, rendered from the root layout so every content page
 * gets guaranteed inventory without wiring ~70 pages by hand.
 *
 * Two positions are used (see `app/layout.tsx`):
 *  - `contentEnd` sits between <main> and the related-tools block — the reader
 *    has finished the page, so it is high-viewability without pushing content
 *    down;
 *  - `afterRelated` sits below the related tools, the last thing before the
 *    footer — the natural end-of-session position, where the visitor is already
 *    scanning "what next?" links.
 *
 * Skipped on the admin area and on the embeddable widget, neither of which may
 * request ads (own-traffic hygiene, and the widget renders inside third-party
 * pages where we have no consent basis).
 */
export default function SiteWideAd({
  slot = "contentEnd",
  format = "display",
}: {
  slot?: AdSlotName;
  format?: "display" | "in-article";
}) {
  const pathname = usePathname() || "/";

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/embed")
  ) {
    return null;
  }

  return <AdUnit slot={slot} format={format} />;
}
