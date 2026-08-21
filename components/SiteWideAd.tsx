"use client";

import { usePathname } from "next/navigation";
import AdUnit from "./AdUnit";

/**
 * End-of-content ad, rendered once in the root layout so every content page
 * gets a guaranteed slot without wiring 65 pages by hand.
 *
 * It sits between <main> and the related-tools block: the reader has finished
 * the page, so it is high-viewability without pushing content down. Skipped on
 * the admin area, which must never request ads.
 */
export default function SiteWideAd() {
  const pathname = usePathname() || "/";

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return null;

  return <AdUnit slot="contentEnd" />;
}
