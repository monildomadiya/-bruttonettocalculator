/**
 * Sprache und Embed-Erkennung aus dem Pfad.
 *
 * Lag bis 11/2026 in `components/SupportButton.tsx`, weil der Spenden-Knopf
 * der erste Aufrufer war. Mit dem Entfernen des Knopfes bleibt der
 * Stories-Tray als Aufrufer — daher hier als Bibliothek, damit keine
 * Komponente aus einer anderen Komponente importieren muss.
 */

export type Lang = "de" | "en" | "pl" | "ro" | "tr" | "uk";

/**
 * Locale from the route. Segment-safe on purpose: a plain
 * `startsWith("/en")` also matches /einkommensteuer-rechner,
 * /elterngeld-rechner and /erbschaftssteuer-rechner — three real German
 * pages that would have flipped to English copy.
 */
export function langFromPath(pathname?: string | null): Lang {
  if (!pathname) return "de";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  if (pathname === "/ro" || pathname.startsWith("/ro/")) return "ro";
  if (pathname === "/tr" || pathname.startsWith("/tr/")) return "tr";
  if (pathname === "/uk" || pathname.startsWith("/uk/")) return "uk";
  return "de";
}

/**
 * Die einbettbare Variante rendert in fremden Seiten. Was dort nichts zu
 * suchen hat (eigene Navigation, Stories-Tray), prüft diese Funktion — damit
 * Header und Mobile-Menü bei der Regel nicht auseinanderlaufen.
 */
export function isEmbedRoute(pathname?: string | null): boolean {
  return pathname?.startsWith("/embed") ?? false;
}
