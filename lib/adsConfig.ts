/**
 * Static AdSense configuration.
 *
 * The publisher ID is a constant — it never changes at runtime and was already
 * hard-coded in the root layout's `google-adsense-account` meta tag. Keeping it
 * here (rather than behind the `/api/settings/ads` DB lookup) lets the AdSense
 * loader ship in the initial HTML `<head>`.
 *
 * Why that matters: the loader used to be injected by a client component that
 * first had to hydrate, then fetch `/api/settings/ads`, which in turn hit MySQL.
 * Measured on production (2026-08-21, desktop broadband):
 *
 *   DOMContentLoaded        1460 ms
 *   /api/settings/ads       2749 ms
 *   adsbygoogle.js          2982 ms   ← ad script only *starts* here
 *   Funding Choices (CMP)   3754 ms   ← consent prompt only appears here
 *
 * On mobile that chain lands around 8–12 s. Sessions on a calculator site are
 * short, so a large share of visits ended before a single ad — or the consent
 * prompt — was ever requested. Serving the tag from `<head>` moves the start
 * from ~3.0 s to ~0.1 s.
 */

/** AdSense publisher ID, "pub-" form (as stored in the admin settings table). */
export const PUBLISHER_ID = "pub-5005860402493815";

/** AdSense client ID, "ca-pub-" form (as required by the loader and ad units). */
export const AD_CLIENT = `ca-${PUBLISHER_ID}`;

/** URL of the AdSense loader script for this publisher. */
export const ADSENSE_LOADER_SRC =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;

/**
 * Ad slot IDs for the manually placed units, keyed by position.
 *
 * Auto Ads alone is under-filling this site badly: on 2026-08-21 the homepage
 * was 10.575 px tall (14.7 viewports) and carried exactly **one** `<ins>`, which
 * came back `unfilled`. Manual units guarantee the inventory exists instead of
 * hoping Auto Ads finds a spot.
 *
 * An empty string disables that position — `<AdUnit>` renders nothing rather
 * than emitting a slot-less `<ins>` that can never fill. Create the units in
 * AdSense → Ads → By ad unit, then paste the `data-ad-slot` values here.
 */
export const AD_SLOTS = {
  /** In-content, directly under the calculator result — the highest-attention moment. */
  result: "",
  /** End of the article/content body, above the related-tools block. */
  contentEnd: "",
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;
