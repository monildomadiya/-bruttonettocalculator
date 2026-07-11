"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Loads the Google AdSense script site-wide (Auto Ads).
 * Excluded from the admin dashboard and API routes.
 */
export default function GoogleAdSense({
  clientId = "ca-pub-5005860402493815",
}: { clientId?: string }) {
  const pathname = usePathname();

  // Do NOT load AdSense on the admin dashboard or API routes.
  const isAdminOrApi = pathname?.startsWith("/admin") || pathname?.startsWith("/api");
  if (isAdminOrApi) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
