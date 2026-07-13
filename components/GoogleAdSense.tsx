"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useAds, toClientId } from "./AdsProvider";

/**
 * Loads the Google AdSense loader script (required for BOTH Auto Ads and
 * manual <AdUnit> blocks).
 *
 * The configuration (on/off + Publisher-ID) is managed from the admin
 * dashboard (/admin-secure/ads) and shared via <AdsProvider>, so no code
 * change is needed to enable/disable ads or switch accounts.
 *
 * Excluded from the admin dashboard and API routes.
 */
export default function GoogleAdSense() {
  const pathname = usePathname();
  const ads = useAds();

  // Do NOT load AdSense on the admin dashboard or API routes.
  const isAdminOrApi =
    pathname?.startsWith("/admin") || pathname?.startsWith("/api");
  if (isAdminOrApi) return null;

  if (!ads || !ads.enabled || !ads.publisherId) return null;
  const clientId = toClientId(ads.publisherId);

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
