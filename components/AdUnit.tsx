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
  const pushed = useRef(false);
  const [status, setStatus] = useState<"idle" | "filled" | "unfilled">("idle");

  useEffect(() => {
    if (!slotId) return;
    const el = insRef.current;
    if (!el) return;

    // A fresh <ins> arrived (first mount or a route change remount) — reset the
    // per-element state before pushing it.
    pushed.current = false;
    setStatus("idle");

    // Push the unit to AdSense once. React 18 StrictMode runs effects twice in
    // dev, and AdSense stamps `data-adsbygoogle-status` on a slot it has already
    // claimed — checking it prevents the "already have ads in it" error.
    if (!el.getAttribute("data-adsbygoogle-status")) {
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
      if (st === "filled") setStatus("filled");
      else if (st === "unfilled") setStatus("unfilled");
      else if (!st && el.offsetHeight === 0) setStatus("unfilled");
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
