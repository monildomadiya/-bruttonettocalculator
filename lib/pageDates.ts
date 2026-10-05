/**
 * Ein Datum pro Seite.
 *
 * `PAGE_LAST_UPDATED` hält für jede Seite, deren Inhalt seit dem letzten
 * Engine-Stand redaktionell geändert wurde, ein eigenes, von Hand gesetztes
 * Datum (ISO). Dasselbe Datum speist
 *   - die sichtbare Zeile „Aktualisiert am …“ bzw. die Byline,
 *   - `dateModified` im JSON-LD der Seite,
 *   - `<lastmod>` dieser URL in der Sitemap (app/sitemap.ts).
 *
 * Seiten ohne Eintrag fallen auf `siteConfig.lastUpdatedISO` zurück — das
 * ebenfalls von Hand gesetzte Datum des letzten Engine-Stands.
 *
 * Regeln: Nie `new Date()` für ein angezeigtes „aktualisiert“-Datum. Ein Datum
 * nur dann auf heute setzen, wenn die Seite inhaltlich tatsächlich geändert
 * wurde.
 */
import { siteConfig } from "@/lib/authors";

export const PAGE_LAST_UPDATED: Record<string, string> = {
  "/": "2026-10-05",
  "/brutto-netto-rechner-2027": "2026-10-05",
  "/weihnachtsgeld-rechner": "2026-10-05",
  "/bonus-steuerrechner": "2026-10-05",
  "/brutto-netto-rechner-krankenkasse": "2026-10-05",
  "/sozialabgaben-rechner-2027": "2026-10-05",
  "/abfindungsrechner": "2026-10-05",
  "/firmenwagenrechner": "2026-10-05",
  "/steuerklassenwechsel-rechner": "2026-10-05",
  "/beitragsbemessungsgrenze-2027": "2026-10-05",
  "/zusatzbeitrag-2027": "2026-10-05",
  "/rente-brutto-netto-rechner": "2026-10-05",
  "/minijob-rechner": "2026-10-05",
};

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/** "2026-10-05" → "5. Oktober 2026" — ohne Date/Intl (keine Zeitzonen, kein Hydration-Mismatch). */
export function formatDatumDe(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${MONATE[m - 1]} ${y}`;
}

export interface PageStand {
  iso: string;
  display: string;
}

/** Stand einer Seite: eigener Eintrag oder der allgemeine Engine-Stand. */
export function pageStand(path: string): PageStand {
  const iso = PAGE_LAST_UPDATED[path] ?? siteConfig.lastUpdatedISO;
  return { iso, display: formatDatumDe(iso) };
}
