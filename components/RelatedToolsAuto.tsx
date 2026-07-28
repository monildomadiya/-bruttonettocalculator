"use client";

import { usePathname } from "next/navigation";
import RelatedCalculators from "./RelatedCalculators";
import { getRelatedCalculators } from "@/lib/navigation";

/**
 * Drops a topically-relevant "Ähnliche Rechner" internal-linking block at the
 * bottom of every content page automatically — no per-page wiring needed.
 *
 * Rendered once in the root layout (above the footer). The links are computed
 * from the current path and are present in the server-rendered HTML (usePathname
 * resolves during SSR), so they are fully crawlable and lift internal-link
 * equity, pages-per-session, and ad impressions per visit.
 *
 * Skipped where it doesn't belong: the homepage (already has the full hub),
 * legal/thin pages, the admin area, and the handful of pages that already ship
 * their own hand-curated related block.
 */

// Pages that already render their own <RelatedCalculators> with curated links.
const HAS_OWN_BLOCK = new Set([
  "/arbeitgeber-brutto-netto-rechner",
  "/arbeitslosengeld-rechner",
  "/firmenwagenrechner",
  "/mindestlohn",
  "/private-krankenversicherung-vs-gesetzlich",
  "/stundenlohn-rechner",
  "/weihnachtsgeld-rechner",
]);

// Pages where a related-tools block adds no value.
const EXCLUDED = new Set([
  "/",
  "/datenschutz",
  "/impressum",
  "/kontakt",
  "/ueber-uns",
]);

export default function RelatedToolsAuto() {
  const pathname = usePathname() || "/";

  if (
    pathname.startsWith("/admin") ||
    EXCLUDED.has(pathname) ||
    HAS_OWN_BLOCK.has(pathname)
  ) {
    return null;
  }

  const links = getRelatedCalculators(pathname, 6);
  if (!links.length) return null;

  return (
    <RelatedCalculators
      title="Ähnliche Rechner & Tools"
      links={links}
      className="border-t border-black/[0.08] pt-10 mt-4"
    />
  );
}
