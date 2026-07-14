"use client";

import { useEffect, useRef, useState } from "react";
import { useAds, toClientId } from "./AdsProvider";

type Placement = "homepage" | "inArticle" | "content";

/**
 * A single manual AdSense display unit.
 *
 * Renders nothing until ads are enabled AND a matching Slot-ID has been
 * entered in the admin dashboard (/admin-secure/ads).
 *
 * On top of that, once the unit is pushed we watch AdSense's `data-ad-status`:
 * if the slot comes back **unfilled** (no ad to serve) or is blocked / never
 * renders, the whole unit — including the "Anzeige" label and its vertical
 * spacing — is removed from the layout. That way an empty ad box never leaves a
 * gap and the UI stays clean when there is no ad.
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
  const [status, setStatus] = useState<"idle" | "filled" | "unfilled">("idle");

  const placementSlot =
    placement === "homepage"
      ? ads?.slotHomepage
      : placement === "inArticle"
      ? ads?.slotInArticle
      : ads?.slotContent;
  // In-content placements upgrade to a native "in-article" (fluid) unit when a
  // native Slot-ID is configured — native ads typically earn a higher CPM and
  // blend into the content. Homepage stays a standard responsive banner.
  const native = (placement === "content" || placement === "inArticle") && !!ads?.slotNative;

  // Fall back to the single "default" responsive unit so one Slot-ID lights up
  // every placement site-wide — no need to create a separate unit per position.
  const slot = native ? (ads?.slotNative || "") : (placementSlot || ads?.slotDefault || "");
  const clientId = ads ? toClientId(ads.publisherId) : "";
  const active = !!ads && ads.enabled && !!clientId && !!slot;

  useEffect(() => {
    if (!active) return;
    const el = insRef.current;
    if (!el) return;

    // Push the unit to AdSense once.
    if (!pushed.current && !el.getAttribute("data-adsbygoogle-status")) {
      try {
        // @ts-expect-error adsbygoogle is injected by the AdSense loader script.
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        /* loader not ready yet — the push is queued by AdSense automatically */
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
  }, [active]);

  // Hide entirely when ads are off, not configured, or the slot came back empty.
  if (!active || status === "unfilled") return null;

  return (
    <div
      className={`w-full max-w-6xl mx-auto my-10 px-4 sm:px-5 ${className}`}
      aria-hidden="true"
    >
      {/* Label kept in the DOM (so the <ins> position never shifts and React
          never remounts a filled ad) but only visible once the slot fills. */}
      <div
        className={`text-[10px] font-mono uppercase tracking-widest text-black/25 text-center mb-1.5 ${
          status === "filled" ? "" : "hidden"
        }`}
      >
        Anzeige
      </div>
      {native ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-layout="in-article"
          data-ad-format="fluid"
        />
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
