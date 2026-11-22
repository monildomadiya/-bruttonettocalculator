"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ADS_OFF_STORAGE_KEY, AD_FREE_PAGES, isAdFreePath } from "@/lib/adsConfig";

/**
 * Ad-serving guard — client-side navigation half.
 *
 * The AdSense loader itself ships statically in the root layout (see
 * `lib/adsConfig.ts` for why) and the *first* page load is guarded
 * synchronously by `<AdGuard>`, before the loader ever runs. What is left for
 * this component is the case an inline script cannot cover: App Router route
 * changes, where no new document is parsed and the guard script never runs
 * again. A visitor who lands on a calculator and then clicks into `/admin`
 * would otherwise keep requesting ads.
 *
 * So this re-evaluates the same two conditions on every pathname change:
 *
 *  - internal routes (`/admin`, `/api`, `/embed`) must never request ads —
 *    own-traffic / invalid-traffic hygiene for the first two, no consent basis
 *    for the third;
 *  - a browser that opted out via `?noads=1` stays opted out (this is the
 *    publisher's own-traffic switch — missing it here was a real hole: the old
 *    version set `pauseAdRequests = 0` on every route change, which re-enabled
 *    ads for the opted-out browser as soon as it navigated anywhere).
 *
 * The former admin "ads on/off" switch (a MySQL setting fetched on every page
 * view) is gone; ad serving is controlled in code via lib/adsConfig.ts.
 *
 * `data-ads-off` is kept in sync with the decision so `<AdUnit>` can skip
 * rendering its `<ins>` entirely rather than leaving claimed-but-empty slots.
 */
export default function GoogleAdSense() {
  const pathname = usePathname();

  // Same rule as <AdGuard>, from the same source, so the first load and every
  // client-side navigation can never disagree about a page.
  const adFree = isAdFreePath(pathname || "/");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let optedOut = false;
    try {
      optedOut = localStorage.getItem(ADS_OFF_STORAGE_KEY) === "1";
    } catch {
      /* storage blocked (private mode, cookie settings) — treat as opted in */
    }

    // Same host rule as <AdGuard>: previews and localhost are own traffic.
    const host = window.location.hostname;
    const offHost = host !== "bruttonettocalculator.com" && host !== "www.bruttonettocalculator.com";

    /*
     * A legal page gets its own reason, "no-inventory" — deliberately NOT
     * "no-content". That exact string is owned by `<NoAdsOnPage>` on the 404 and
     * is special-cased below so this component never clears it; reusing it here
     * would mean that navigating from /impressum into a calculator leaves the
     * marker in place and silently kills ads for the rest of the session.
     */
    const reason = offHost
      ? "internal"
      : adFree
      ? AD_FREE_PAGES.includes(pathname || "/")
        ? "no-inventory"
        : "internal"
      : optedOut
      ? "own-traffic"
      : "";

    const w = window as any;
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.pauseAdRequests = reason ? 1 : 0;

    const el = document.documentElement;
    // Never clear a marker this component did not set — `<NoAdsOnPage>` owns
    // the "no-content" marker on the 404 and cleans it up itself.
    if (reason) {
      el.setAttribute("data-ads-off", reason);
    } else if (el.getAttribute("data-ads-off") !== "no-content") {
      el.removeAttribute("data-ads-off");
      /*
       * A visitor whose first page load was suppressed (landed on /admin, or on
       * a 404) never got the loader injected, because `<AdGuard>` only injects
       * it when the *initial* page may serve ads. Client-side navigation parses
       * no new document, so without this the rest of the session would silently
       * carry no ads at all. `__bncLoadAds` is idempotent.
       */
      w.__bncLoadAds?.();
    }
  }, [adFree, pathname]);

  return null;
}
