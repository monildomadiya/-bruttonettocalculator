"use client";

import { useEffect, useRef, useState } from "react";
import { AD_CLIENT, AD_SLOTS, type AdSlotName } from "@/lib/adsConfig";

/**
 * A single manual AdSense display unit.
 *
 * This is a restore of the component deleted in 9fa993c ("switch to Auto Ads
 * only"), with one change: the slot ID and client ID now come from the static
 * `lib/adsConfig.ts` rather than from the `/api/settings/ads` fetch. That lets
 * the `<ins>` ship in the server-rendered HTML, so AdSense sees the slot on its
 * first DOM scan instead of after hydration + a DB round-trip.
 *
 * Why manual units are back: Auto Ads alone was under-filling badly. Measured
 * on production 2026-08-21, the homepage was 10.575 px tall (14.7 viewports)
 * and carried exactly one `<ins>` — which came back `unfilled`. Manual units
 * guarantee the inventory exists at the positions that actually earn.
 *
 * Renders nothing unless a slot ID is configured for this position, so an
 * unconfigured position is invisible rather than a permanently empty box.
 *
 * Once pushed, `data-ad-status` is watched: if the slot comes back **unfilled**
 * (or never renders), the whole unit — label and spacing included — is removed
 * so an empty ad never leaves a gap in the layout.
 */
export default function AdUnit({
  slot,
  format = "auto",
  className = "",
}: {
  slot: AdSlotName;
  /** "in-article" renders a native fluid unit, which blends into body copy. */
  format?: "auto" | "in-article";
  className?: string;
}) {
  const slotId = AD_SLOTS[slot];
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);
  const [status, setStatus] = useState<"idle" | "filled" | "unfilled">("idle");

  useEffect(() => {
    if (!slotId) return;
    const el = insRef.current;
    if (!el) return;

    // Push the unit to AdSense once. React 18 StrictMode runs effects twice in
    // dev, and AdSense stamps `data-adsbygoogle-status` on a slot it has already
    // claimed — checking it prevents the "already have ads in it" error.
    if (!pushed.current && !el.getAttribute("data-adsbygoogle-status")) {
      try {
        // @ts-expect-error adsbygoogle is injected by the AdSense loader script.
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        /* loader not ready yet — AdSense drains the queue once it loads */
      }
    }

    // AdSense sets data-ad-status="filled" | "unfilled" once it resolves the slot.
    const read = () => {
      const st = el.getAttribute("data-ad-status");
      if (st === "filled") setStatus("filled");
      else if (st === "unfilled") setStatus("unfilled");
    };
    read();

    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true, attributeFilter: ["data-ad-status"] });

    // Fallback: if nothing rendered after a few seconds (no fill, blocked, or the
    // loader never ran), treat the slot as empty and hide the unit.
    const timer = setTimeout(() => {
      const st = el.getAttribute("data-ad-status");
      if (st === "filled") setStatus("filled");
      else if (st === "unfilled" || el.offsetHeight === 0) setStatus("unfilled");
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [slotId]);

  if (!slotId || status === "unfilled") return null;

  return (
    <div className={`w-full max-w-6xl mx-auto my-10 px-4 sm:px-5 ${className}`} aria-hidden="true">
      {/* Label kept in the DOM (so the <ins> position never shifts and React
          never remounts a filled ad) but only visible once the slot fills. */}
      <div
        className={`text-[10px] font-mono uppercase tracking-widest text-black/25 text-center mb-1.5 ${
          status === "filled" ? "" : "hidden"
        }`}
      >
        Anzeige
      </div>
      {format === "in-article" ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slotId}
          data-ad-layout="in-article"
          data-ad-format="fluid"
        />
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
