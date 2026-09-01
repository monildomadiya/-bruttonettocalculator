"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AD_CLIENT, AD_SLOTS, type AdSlotName } from "@/lib/adsConfig";

type AdFormat = "display" | "in-article";

/**
 * A single manual AdSense unit.
 *
 * The slot ID and client ID come from the static `lib/adsConfig.ts` rather than
 * from the `/api/settings/ads` fetch, so the `<ins>` ships in the
 * server-rendered HTML and AdSense sees the slot on its first DOM scan instead
 * of after hydration + a DB round-trip.
 *
 * Renders nothing unless a slot ID is configured for this position, so an
 * unconfigured position is invisible rather than a permanently empty box.
 *
 * Once pushed, `data-ad-status` is watched: if the slot comes back **unfilled**
 * (or never renders), the whole unit — label and spacing included — is removed
 * so an empty ad never leaves a gap in the layout.
 *
 * `pathname` is part of the `<ins>` key: on client-side navigation React then
 * discards the old element and mounts a fresh one, which gets its own
 * `push({})`. Without that, an `<ins>` AdSense has already claimed
 * (`data-adsbygoogle-status`) survives the route change and the new page shows
 * the *previous* page's ad — or nothing at all.
 */
export default function AdUnit({
  slot,
  format = "display",
  className = "",
}: {
  slot: AdSlotName;
  format?: AdFormat;
  className?: string;
}) {
  const slotId = AD_SLOTS[slot];
  const pathname = usePathname() || "/";
  const insRef = useRef<HTMLModElement | null>(null);
  const [status, setStatus] = useState<"idle" | "filled" | "unfilled">("idle");

  useEffect(() => {
    if (!slotId) return;
    const el = insRef.current;
    if (!el) return;

    // A fresh <ins> arrived (first mount or a route change remount) — reset the
    // per-element state before pushing it.
    setStatus("idle");

    /*
     * Push this unit to AdSense exactly once per <ins> element.
     *
     * `adsbygoogle.push({})` does not name an element: it means "claim the next
     * unclaimed <ins> in the DOM". Pushing more often than there are unclaimed
     * <ins> elements is therefore an error, and it produces two of them —
     * `All 'ins' elements ... already have ads in them`, and, once AdSense
     * reaches for Google's own zero-width auto-ads anchor <ins> in <body>,
     * `No slot size for availableWidth=0`.
     *
     * Over-pushing is easy to do here. `reactStrictMode` is on, so in
     * development React invokes this effect twice against the *same* element.
     * AdSense's own `data-adsbygoogle-status` marker cannot prevent that: it is
     * stamped asynchronously, when the loader drains the queue, which has not
     * happened yet on the second run. So the marker has to be ours and it has
     * to be set synchronously, before the push.
     *
     * It lives on the element rather than in a ref because it must be tied to
     * the element's identity: `<ins>` is keyed on the pathname, so a route
     * change mounts a genuinely new, unmarked element that should be pushed
     * again — while a StrictMode re-run sees the same marked one and skips.
     */
    if (!el.dataset.adPushed && !el.getAttribute("data-adsbygoogle-status")) {
      el.dataset.adPushed = "1";
      try {
        // @ts-expect-error adsbygoogle is injected by the AdSense loader script.
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* loader not ready yet — AdSense drains the queue once it loads */
      }
    }

    // AdSense stamps `data-ad-status` once it resolves the slot. The value set is
    // wider than the documented "filled" / "unfilled": production also returns
    // **"unfill-optimized"**, which AdSense uses when it deliberately declines a
    // slot rather than serve low-value inventory into it. Anything that is not
    // "filled" therefore counts as empty — matching only the exact string
    // "unfilled" left a resolved-but-empty unit holding ~250 px of blank layout.
    const read = () => {
      const st = el.getAttribute("data-ad-status");
      if (!st) return; // not resolved yet
      setStatus(st === "filled" ? "filled" : "unfilled");
    };
    read();

    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true, attributeFilter: ["data-ad-status"] });

    // Fallback for the case AdSense never reports a status at all — the loader
    // was blocked, or it never ran. Only then does zero height mean "empty".
    //
    // The window is deliberately long. An explicit `unfilled` hides the unit
    // immediately via the observer above, so this timer exists solely for the
    // silent case; firing it early would tear out a slot AdSense has already
    // claimed but not yet painted, which on a slow mobile connection is a
    // destroyed impression rather than a tidied gap.
    const timer = setTimeout(() => {
      const st = el.getAttribute("data-ad-status");
      if (st) setStatus(st === "filled" ? "filled" : "unfilled");
      else if (el.offsetHeight === 0) setStatus("unfilled");
    }, 12000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [slotId, pathname]);

  if (!slotId || status === "unfilled") return null;

  // Shared attributes. `key` is passed explicitly on each <ins> rather than
  // spread: React warns when a props object carrying `key` is spread into JSX.
  const insKey = `${slot}-${pathname}`;
  const common = {
    ref: insRef,
    className: "adsbygoogle",
    "data-ad-client": AD_CLIENT,
    "data-ad-slot": slotId,
  } as const;

  return (
    <div className={`w-full max-w-6xl mx-auto my-10 px-4 sm:px-5 ${className}`}>
      {/* Label kept in the DOM (so the <ins> position never shifts and React
          never remounts a filled ad) but only visible once the slot fills.
          AdSense requires ad blocks to be distinguishable from content; the
          wrapper is deliberately not aria-hidden so the label is announced. */}
      <div
        className={`text-[10px] font-mono uppercase tracking-widest text-black/25 text-center mb-1.5 ${
          status === "filled" ? "" : "hidden"
        }`}
      >
        Anzeige
      </div>
      {format === "in-article" ? (
        <ins
          key={insKey}
          {...common}
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
        />
      ) : (
        <ins
          key={insKey}
          {...common}
          style={{ display: "block" }}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
