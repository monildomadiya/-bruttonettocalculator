"use client";

import { useEffect } from "react";

/**
 * Marks the current page as "no ads may be requested here".
 *
 * Used by `app/not-found.tsx`. AdSense's Google Publisher Policies do not allow
 * ads on screens without publisher content, and a 404 is the canonical example —
 * yet the two site-wide `<SiteWideAd>` units live in the root layout, which the
 * 404 page inherits like any other route. On a 300-page site that is reached by
 * crawlers and stale links constantly, that is a steady trickle of ad requests
 * against pages that contain nothing but an apology and two links.
 *
 * Two mechanisms, because a 404 can be reached two different ways:
 *
 *  - The inline script covers a **direct hit** (someone opens a dead URL). It
 *    runs while the HTML is still parsing, so it beats the async AdSense loader
 *    and Auto Ads never scans the page.
 *  - The effect covers a **client-side navigation** into a dead route, where no
 *    new document is parsed and the inline script therefore never runs again.
 *
 * The effect's cleanup removes the marker, so navigating from the 404 back into
 * real content restores ad serving for that page.
 */
export default function NoAdsOnPage() {
  useEffect(() => {
    const el = document.documentElement;
    const hadMarker = el.getAttribute("data-ads-off");
    el.setAttribute("data-ads-off", "no-content");

    // The command queue is an *array* — the loader drains it by shifting items
    // off. Initialising it as anything else breaks ad serving site-wide.
    const w = window as any;
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.pauseAdRequests = 1;

    return () => {
      // Only undo what this page did — never re-enable ads for a browser that
      // opted out via ?noads=1, or for the admin area.
      if (hadMarker) {
        el.setAttribute("data-ads-off", hadMarker);
      } else {
        el.removeAttribute("data-ads-off");
        w.adsbygoogle.pauseAdRequests = 0;
      }
    };
  }, []);

  return (
    <script
      id="no-ads-on-page"
      dangerouslySetInnerHTML={{
        __html:
          'try{window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.pauseAdRequests=1;document.documentElement.setAttribute("data-ads-off","no-content")}catch(e){}',
      }}
    />
  );
}
