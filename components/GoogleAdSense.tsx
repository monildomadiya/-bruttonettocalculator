"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAds } from "./AdsProvider";

/**
 * Ad-serving guard.
 *
 * The AdSense loader itself now ships statically in the root layout's `<head>`
 * (see `lib/adsConfig.ts` for why), so this component no longer gates the
 * script — gating it behind a fetch was costing ~3 s before the first ad
 * request. What's left is the part that genuinely needs the client:
 *
 *  - the admin dashboard must never request ads (own-traffic / invalid-traffic
 *    hygiene — the publisher browses those pages themselves), and
 *  - the admin "ads on/off" switch must still be able to stop ad serving.
 *
 * Both are handled with `pauseAdRequests`, which tells Auto Ads to stop
 * requesting. It is set synchronously via the `adsbygoogle` command queue, so
 * it applies even though the loader started earlier.
 */
export default function GoogleAdSense() {
  const pathname = usePathname();
  const ads = useAds();

  const isAdminOrApi =
    pathname?.startsWith("/admin") || pathname?.startsWith("/api");

  // `ads` is null until the settings request resolves; only an explicit
  // `enabled: false` counts as "off", so a slow or failing settings lookup
  // never silently switches ads off.
  const disabledByAdmin = ads !== null && !ads.enabled;
  const shouldPause = Boolean(isAdminOrApi) || disabledByAdmin;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.pauseAdRequests = shouldPause ? 1 : 0;
  }, [shouldPause]);

  return null;
}
