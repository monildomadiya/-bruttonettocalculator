/**
 * Kassenindividuelle KV-Zusatzbeiträge 2026 (§ 242 SGB V).
 *
 * Der allgemeine Beitragssatz von 14,6 % ist für alle gesetzlichen Kassen
 * gleich (§ 241 SGB V). Unterschiede zwischen den Kassen entstehen
 * ausschließlich über den Zusatzbeitrag, den jede Kasse selbst festlegt.
 * Beide Sätze werden seit 2019 paritätisch getragen — für den Arbeitnehmer
 * zählt also die Hälfte.
 *
 * Der amtliche *durchschnittliche* Zusatzbeitrag 2026 liegt bei 2,9 %
 * (Bekanntmachung des BMG nach § 242a SGB V). Er ist nur ein Rechenwert für
 * die Prognose der Kassenfinanzen — er ist NICHT der Satz, den eine konkrete
 * Kasse erhebt. Genau das ist der Grund, warum viele Brutto-Netto-Rechner
 * (auch dieser, bis zu diesem Datenstand) beim eigenen Gehaltszettel
 * danebenliegen.
 *
 * DATENSTAND: 3. August 2026. Quellen: öffentliche Satzungsangaben der Kassen,
 * gegengeprüft über zwei unabhängige Vergleichsübersichten
 * (gesetzlichekrankenkassen.de, krankenkasseninfo.de).
 *
 * WARTUNG: Zusatzbeiträge können unterjährig geändert werden (die Kasse muss
 * dann ein Sonderkündigungsrecht einräumen). Diese Tabelle daher mindestens
 * quartalsweise gegen die Kassensatzungen prüfen und ZUSATZBEITRAG_STAND
 * mitziehen — die Seite weist den Datenstand sichtbar aus.
 */

export const ZUSATZBEITRAG_STAND = "3. August 2026";
export const ZUSATZBEITRAG_STAND_ISO = "2026-08-03";

/** Amtlicher durchschnittlicher Zusatzbeitrag 2026 (§ 242a SGB V). */
export const DURCHSCHNITT_ZUSATZBEITRAG_2026 = 2.9;

/** Allgemeiner Beitragssatz der GKV (§ 241 SGB V) — für alle Kassen identisch. */
export const ALLGEMEINER_BEITRAGSSATZ = 14.6;

export interface Krankenkasse {
  /** URL-/Query-tauglicher Schlüssel. */
  slug: string;
  name: string;
  /** Zusatzbeitrag 2026 in Prozent (z. B. 2.69). */
  zusatzbeitrag: number;
  /** Bundesweit wählbar oder nur in bestimmten Regionen geöffnet. */
  bundesweit: boolean;
  /** Kurzhinweis zur Region/Besonderheit, wenn nicht bundesweit. */
  region?: string;
}

/**
 * Auswahl der bekanntesten Kassen sowie der günstigsten und teuersten Kasse
 * am Markt. Kein Anspruch auf Vollständigkeit — es gibt rund 95 gesetzliche
 * Krankenkassen; die Spanne 2026 reicht von 2,18 % bis 4,39 %.
 */
export const KRANKENKASSEN_2026: Krankenkasse[] = [
  { slug: "bkk-firmus", name: "BKK firmus", zusatzbeitrag: 2.18, bundesweit: true },
  { slug: "aok-rheinland-pfalz-saarland", name: "AOK Rheinland-Pfalz/Saarland", zusatzbeitrag: 2.47, bundesweit: false, region: "Rheinland-Pfalz, Saarland" },
  { slug: "hkk", name: "hkk Krankenkasse", zusatzbeitrag: 2.59, bundesweit: true },
  { slug: "audi-bkk", name: "Audi BKK", zusatzbeitrag: 2.6, bundesweit: true },
  { slug: "tk", name: "Techniker Krankenkasse (TK)", zusatzbeitrag: 2.69, bundesweit: true },
  { slug: "aok-bayern", name: "AOK Bayern", zusatzbeitrag: 2.69, bundesweit: false, region: "Bayern" },
  { slug: "hek", name: "HEK — Hanseatische Krankenkasse", zusatzbeitrag: 2.89, bundesweit: true },
  { slug: "aok-hessen", name: "AOK Hessen", zusatzbeitrag: 2.98, bundesweit: false, region: "Hessen" },
  { slug: "aok-niedersachsen", name: "AOK Niedersachsen", zusatzbeitrag: 2.98, bundesweit: false, region: "Niedersachsen" },
  { slug: "aok-baden-wuerttemberg", name: "AOK Baden-Württemberg", zusatzbeitrag: 2.99, bundesweit: false, region: "Baden-Württemberg" },
  { slug: "aok-nordwest", name: "AOK NordWest", zusatzbeitrag: 2.99, bundesweit: false, region: "Westfalen-Lippe, Schleswig-Holstein" },
  { slug: "aok-plus", name: "AOK PLUS", zusatzbeitrag: 3.1, bundesweit: false, region: "Sachsen, Thüringen" },
  { slug: "dak", name: "DAK-Gesundheit", zusatzbeitrag: 3.2, bundesweit: true },
  { slug: "barmer", name: "BARMER", zusatzbeitrag: 3.29, bundesweit: true },
  { slug: "aok-nordost", name: "AOK Nordost", zusatzbeitrag: 3.5, bundesweit: false, region: "Berlin, Brandenburg, Mecklenburg-Vorpommern" },
  { slug: "big-direkt", name: "BIG direkt gesund", zusatzbeitrag: 3.69, bundesweit: true },
  { slug: "kkh", name: "KKH Kaufmännische Krankenkasse", zusatzbeitrag: 3.78, bundesweit: true },
  { slug: "knappschaft", name: "KNAPPSCHAFT", zusatzbeitrag: 4.3, bundesweit: true },
  { slug: "bkk24", name: "BKK24", zusatzbeitrag: 4.39, bundesweit: true },
];

export const GUENSTIGSTE_KASSE = KRANKENKASSEN_2026[0];
export const TEUERSTE_KASSE = KRANKENKASSEN_2026[KRANKENKASSEN_2026.length - 1];

/** Gesamtbeitragssatz (AG + AN) einer Kasse in Prozent. */
export function gesamtbeitragssatz(zusatzbeitrag: number): number {
  return ALLGEMEINER_BEITRAGSSATZ + zusatzbeitrag;
}

/** Arbeitnehmeranteil am KV-Beitrag in Prozent (paritätische Teilung). */
export function arbeitnehmeranteilProzent(zusatzbeitrag: number): number {
  return gesamtbeitragssatz(zusatzbeitrag) / 2;
}

export function findKrankenkasse(slug: string): Krankenkasse | undefined {
  return KRANKENKASSEN_2026.find((k) => k.slug === slug);
}
