"use client";

import { usePathname } from "next/navigation";
import SupportButton, { isEmbedRoute, langFromPath } from "@/components/SupportButton";
import { hasRelatedTools } from "@/components/RelatedToolsAuto";
import { isSlotEnabled } from "@/lib/adsConfig";

/**
 * Closing "support this site" section at the end of every regular page.
 *
 * Placement rule (AdSense): the section sits below the related-tools block,
 * which separates it from the end-of-content ad above. So it renders only
 * where that block renders, and not at all while the `afterRelated` slot is
 * active — that ad would sit directly beneath it.
 */
export default function SupportStory() {
  const pathname = usePathname() || "/";
  if (isEmbedRoute(pathname) || !hasRelatedTools(pathname) || isSlotEnabled("afterRelated")) {
    return null;
  }
  return <SupportButton variant="story" lang={langFromPath(pathname)} placement="page_end" />;
}
