/**
 * Lohnpfändung nach § 850c ZPO, Auszahlung für Monate.
 *
 * Werte: Pfändungsfreigrenzenbekanntmachung 2026 vom 19.03.2026, BGBl. 2026 I
 * Nr. 80 (ausgegeben 26.03.2026), gültig 01.07.2026 bis 30.06.2027. Die
 * Freigrenzen werden jedes Jahr zum 1. Juli angepasst (§ 850c Abs. 4 ZPO).
 *
 * Rechenweg (§ 850c Abs. 3 und 5 ZPO): Nettolohn auf volle 10 € abrunden.
 * Vom Teil über dem Freibetrag sind 3/10 unpfändbar, je weitere 2/10 für die
 * erste und 1/10 für die zweite bis fünfte unterhaltsberechtigte Person.
 * Der Teil über GRENZE_VOLL_PFAENDBAR ist voll pfändbar. Damit stimmt jede
 * Zeile mit der amtlichen Tabelle überein (scripts/pfaendung.test.mts).
 */

export const PFAENDUNG = {
  gueltigAb: "1. Juli 2026",
  gueltigBis: "30. Juni 2027",
  gueltigAbIso: "2026-07-01",
  /** § 850c Abs. 1 Nr. 1 */
  grundfreibetrag: 1587.4,
  /** § 850c Abs. 2 Satz 1 Nr. 1 — erste unterhaltsberechtigte Person */
  erstePerson: 597.42,
  /** § 850c Abs. 2 Satz 2 Nr. 1 — zweite bis fünfte Person, je */
  weiterePerson: 332.83,
  /** § 850c Abs. 3 Satz 3 Nr. 1 — darüber voll pfändbar */
  grenzeVollPfaendbar: 4866.3,
  vorjahrGrundfreibetrag: 1555.0,
  quelle: "https://www.recht.bund.de/bgbl/1/2026/80/VO.html",
} as const;

/** Unterhaltspflichten, gedeckelt auf 5 (mehr erhöhen den Freibetrag nicht). */
const personen = (n: number) => Math.max(0, Math.min(5, Math.floor(n)));

/** Monatlicher Freibetrag bei n unterhaltsberechtigten Personen. */
export function pfaendungsfreibetrag(unterhaltspflichten: number): number {
  const n = personen(unterhaltspflichten);
  const betrag = PFAENDUNG.grundfreibetrag + (n >= 1 ? PFAENDUNG.erstePerson : 0) + Math.max(0, n - 1) * PFAENDUNG.weiterePerson;
  return Math.round(betrag * 100) / 100;
}

/** Pfändbarer Anteil des Mehrbetrags: 7/10, 5/10, 4/10, 3/10, 2/10, 1/10. */
function pfaendbareQuote(unterhaltspflichten: number): number {
  const n = personen(unterhaltspflichten);
  return n === 0 ? 0.7 : (5 - (n - 1)) / 10;
}

/** Pfändbarer Betrag pro Monat für einen Nettolohn (amtliche Tabellenlogik). */
export function pfaendbarerBetrag(nettoMonat: number, unterhaltspflichten: number): number {
  const ueberGrenze = Math.max(0, nettoMonat - PFAENDUNG.grenzeVollPfaendbar);
  const gerundet = Math.floor(Math.min(nettoMonat, PFAENDUNG.grenzeVollPfaendbar) / 10) * 10;
  const mehrbetrag = Math.max(0, gerundet - pfaendungsfreibetrag(unterhaltspflichten));
  // Die letzte Tabellenzeile reicht bis genau 4.866,30 €; abgerundet zählt sie als 4.860 €.
  const tabelle = Math.round(mehrbetrag * pfaendbareQuote(unterhaltspflichten) * 100) / 100;
  return Math.round((tabelle + ueberGrenze) * 100) / 100;
}

/**
 * Unpfändbarer Teil des Weihnachtsgelds (§ 850a Nr. 4 ZPO): die Hälfte des auf
 * volle 10 € aufgerundeten Grundfreibetrags.
 */
export const WEIHNACHTSGELD_UNPFAENDBAR = Math.ceil(PFAENDUNG.grundfreibetrag / 10) * 10 / 2;
