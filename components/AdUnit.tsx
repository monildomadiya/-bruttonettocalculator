"use client";

import { useEffect, useRef } from "react";
import { useAds, toClientId } from "./AdsProvider";

type Placement = "homepage" | "inArticle" | "content";

/**
 * A single manual AdSense display unit.
 *
 * Renders nothing until ads are enabled AND a matching Slot-ID has been
 * entered in the admin dashboard (/admin-secure/ads). This keeps placements
 * in code while the on/off switch, Publisher-ID and Slot-IDs stay 100%
 * manageable from the admin panel.
 */
export default function AdUnit({
  placement,
  className = "",
}: {
  placement: Placement;
  className?: string;
}) {
  const ads = useAds();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  const placementSlot =
    placement === "homepage"
      ? ads?.slotHomepage
      : placement === "inArticle"
      ? ads?.slotInArticle
      : ads?.slotContent;
  // Fall back to the single "default" responsive unit so one Slot-ID lights up
  // every placement site-wide — no need to create a separate unit per position.
  const slot = placementSlot || ads?.slotDefault || "";
  const clientId = ads ? toClientId(ads.publisherId) : "";
  const active = !!ads && ads.enabled && !!clientId && !!slot;

  useEffect(() => {
    if (!active || pushed.current) return;
    // Skip if this <ins> already has an ad loaded (e.g. React StrictMode remount).
    if (insRef.current?.getAttribute("data-adsbygoogle-status")) return;
    try {
      // @ts-expect-error adsbygoogle is injected by the AdSense loader script.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* loader not ready yet — the push is queued by AdSense automatically */
    }
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`w-full max-w-6xl mx-auto my-10 px-4 sm:px-5 ${className}`}
      aria-hidden="true"
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-black/25 text-center mb-1.5">
        Anzeige
      </div>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
