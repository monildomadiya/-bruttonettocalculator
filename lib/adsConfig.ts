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

/** AdSense publisher ID, "pub-" form. */
export const PUBLISHER_ID = "pub-5005860402493815";

/** AdSense client ID, "ca-pub-" form (as required by the loader and ad units). */
export const AD_CLIENT = `ca-${PUBLISHER_ID}`;

/** URL of the AdSense loader script for this publisher. */
export const ADSENSE_LOADER_SRC =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;

/**
 * Ad slot IDs for the manually placed units, keyed by position.
 *
 * ── Why manual units exist at all ────────────────────────────────────────────
 * Auto Ads alone under-fills this site badly. Measured live on 2026-08-31,
 * `/minijob-rechner` was 6 viewports tall and carried exactly **one** `<ins>`,
 * `data-ad-status="unfilled"`, with a `.google-auto-placed` count of **0** — the
 * page served no ads at all.
 *
 * There is a second, structural reason that matters even more here. Auto Ads
 * scans the DOM on **page load only**. This is a Next.js App Router site whose
 * internal linking (footer, "Ähnliche Rechner", in-body links) is all
 * client-side navigation — so a visitor who lands on the homepage and then
 * clicks through four calculators triggers exactly one Auto Ads scan and sees
 * ad inventory on the first page alone. Manual units do not have that problem:
 * `<AdUnit>` keys its `<ins>` on the pathname, so React mounts a fresh element
 * and pushes it again on every route change.
 *
 * ── The four live units (created 2026-08-31) ─────────────────────────────────
 * IDs are hard-coded on purpose. They are stable account-level identifiers, not
 * configuration: routing them through `/api/settings/ads` was what previously
 * delayed the first ad request to ~3 s (see the loader note above), and a DB
 * round-trip buys nothing for a value that changes once a year at most.
 *
 * An empty string disables a position — `<AdUnit>` then renders nothing rather
 * than emitting a slot-less `<ins>` that can never fill.
 */
export const AD_SLOTS = {
  /**
   * "In-Article Ads" — directly under the calculator result
   * (`components/Calculator.tsx`).
   *
   * The single highest-value position on the site. The visitor has just received
   * their number, attention is at its peak, and the intent ("what do I do with
   * this salary?") is exactly what the high-CPC German finance advertisers —
   * Kredit, Baufinanzierung, PKV, Altersvorsorge — are bidding on. Rendered with
   * `format="in-article"`: a native fluid block that reads as part of the page
   * rather than a boxed banner, which out-earns display inside body content.
   */
  result: "7625715860",
  /**
   * "Display Ads Square" — mid-content, inside the long-form block
   * (`components/ToolContent.tsx`), between the key figures and the method steps.
   *
   * A square renders well when it is surrounded by body text on both sides, and
   * this is the point where a reader who came for one number starts reading
   * rather than bouncing — so it is seen, but only after the page has done its
   * job. Appears on the pages that carry a `ToolContent` config.
   */
  midContent: "4125454553",
  /**
   * "Display Ads Horizontal" — end of the content body, above the related-tools
   * block (`components/SiteWideAd.tsx`, site-wide via the layout).
   *
   * Full-width horizontal fits the container, and the reader has finished the
   * page, so it is high-viewability without pushing content down.
   */
  contentEnd: "2620645668",
  /**
   * "Native Ads Horizontal" — below the related-tools block, the last thing
   * before the footer (`components/SiteWideAd.tsx`, site-wide via the layout).
   *
   * End-of-session position: the visitor is already scanning a grid of "what
   * next?" links, which is the context a native horizontal unit is built for.
   *
   * NOTE: rendered as a responsive **display** unit (`data-ad-format="auto"`),
   * the tolerant format that serves whatever the unit is configured as. If this
   * was created in AdSense as an **In-feed** unit rather than Display, it also
   * needs the `data-ad-layout-key` string from its snippet to render in its
   * intended shape — it will still fill without it, just not natively.
   */
  afterRelated: "8994482329",
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;

/**
 * Whether to emit Google Consent Mode v2 defaults from `components/ConsentMode.tsx`.
 *
 * A Google-certified CMP **is** live on this site: verified on production
 * 2026-08-31 from the browser, where `window.__tcfapi` is a function and
 * `window.googlefc` exposes the full Funding Choices API. (Do not re-diagnose a
 * missing CMP by probing `fundingchoicesmessages.google.com` from a shell — that
 * request answers for the *caller's* geography, so a non-EEA IP gets an empty
 * message and a `googlefcInactive` signal even when the message is published and
 * serving correctly to German visitors. Check the live page, not the endpoint.)
 *
 * The flag is still off because Funding Choices already negotiates consent with
 * the Google tags on its own. Turning explicit Consent Mode defaults on is only
 * worthwhile alongside a deliberate measurement setup — the defaults deny
 * `analytics_storage` until the CMP updates them, so if the wiring is ever wrong
 * the failure mode is silently blinded GA4 rather than a visible error.
 *
 * Flip to `true` only together with verifying in GA4 DebugView that consent
 * updates actually arrive.
 */
export const CMP_ACTIVE = false;

/* ═══════════════════════════════════════════════════════════════════════════
   Invalid-traffic recovery (ad serving limit, 09/2026)
   ═══════════════════════════════════════════════════════════════════════════

   AdSense placed an ad serving limit on the account for "potentially invalid
   traffic". The three code-side contributors, in order of likelihood:

   1. AD DENSITY. Between 2026-08-31 and 2026-09-01 the site went from Auto-Ads-
      only to four manual units per page *plus* `data-ad-frequency-hint="30s"`
      — the most aggressive Auto Ads density setting there is. A calculator page
      carrying ToolContent ended up with result + midContent + contentEnd +
      afterRelated on top of whatever Auto Ads injected. Ad requests multiplied
      overnight while sessions stayed flat, which is exactly the shape of an
      invalid-traffic signal.

   2. ACCIDENTAL CLICKS. `<AdUnit>` reserved no space, so a slot that filled late
      pushed the content below it down — under a finger that was already moving
      toward a button. The result unit sat 24 px above the Bundesland accordion
      button, the mid-content unit 8 px from a table.

   3. OWN TRAFFIC. The publisher has been testing ad behaviour on production
      repeatedly (see the measurement notes above — they were taken on the live
      site). Every one of those page loads was a real ad request from the
      account owner.

   `AD_DENSITY` is the switch for (1). Leave it on "recovery" until AdSense
   lifts the limit and the Policy center is clean for a full reporting cycle,
   then flip to "normal" and watch the invalid-traffic rate in the AdSense
   report before adding anything else back.
*/

/** Ad-density mode. "recovery" suppresses the lowest-value duplicate slots. */
export const AD_DENSITY: "recovery" | "normal" = "recovery";

/**
 * Value for the loader's `data-ad-frequency-hint`, or `null` for Google's default.
 *
 * ── What the attribute actually does (checked against Google's docs 2026-09-11,
 *    because the earlier comment in this file had the scale wrong) ─────────────
 * It sets the **minimum average reading time between Auto Ads placements**.
 * Google's default is **120s**, and the fastest rate it will accept is **30s**.
 * So the `30s` that sat on the loader until 2026-09-11 was not "a bit denser" —
 * it was the densest setting the attribute can express, four times the default.
 *
 * Larger values mean fewer ads. 240s is deliberately below default density while
 * the account is under an ad serving limit.
 *
 * ── What this does NOT control ───────────────────────────────────────────────
 * The hint is exactly that: a hint, and Google says it may be overridden
 * server-side. The decisive controls over Auto Ads live in the AdSense UI, not
 * here:
 *   • Ads → By site → the **ad load** slider (the dominant density control),
 *   • Ads → **Excluded areas**, which stops Auto Ads *requesting* an ad for a
 *     region of the page (this is the only correct way to keep ads out of the
 *     header/hero — see the CSS warning below),
 *   • the per-format switches for **Anchor** and **Vignette**, which no page
 *     attribute can reach.
 *
 * ── Do not "fix" placement with CSS ──────────────────────────────────────────
 * The widely-copied workaround is `.google-auto-placed { display: none }` inside
 * whatever container you want ad-free. Do not do it here. The ad is still
 * requested and still records an impression — it is merely invisible. That is an
 * unviewable impression, which is the *same* class of signal that caused the
 * invalid-traffic limit in the first place. Exclude the area in the AdSense UI so
 * the request is never made.
 */
export const AD_FREQUENCY_HINT: string | null =
  AD_DENSITY === "recovery" ? "240s" : null;

/**
 * Slots switched off while `AD_DENSITY === "recovery"`.
 *
 * `afterRelated` goes first: it sits immediately below the related-tools link
 * grid, with `contentEnd` immediately above it. Two ad units sandwiching a grid
 * of ~8 tappable internal links is the single worst accidental-click geometry
 * on the site, and it is also the lowest-earning of the four (end of session,
 * after the reader has already been offered an exit).
 */
const RECOVERY_SUPPRESSED_SLOTS: readonly AdSlotName[] = ["afterRelated"];

/** Whether a position should render at all right now. */
export function isSlotEnabled(slot: AdSlotName): boolean {
  if (!AD_SLOTS[slot]) return false;
  if (AD_DENSITY === "recovery" && RECOVERY_SUPPRESSED_SLOTS.includes(slot)) return false;
  return true;
}

/**
 * localStorage key for the per-device "never request ads on this browser" flag.
 *
 * Set by visiting any page with `?noads=1`, cleared with `?noads=0`. This is the
 * publisher's own-traffic opt-out: AdSense has no IP-exclusion feature any more,
 * so the only reliable way to keep the owner's own browsing out of the account
 * is to stop the ad request client-side. See `components/AdGuard.tsx`.
 */
export const ADS_OFF_STORAGE_KEY = "bnc_ads_off";
