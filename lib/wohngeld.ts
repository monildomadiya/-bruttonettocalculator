/**
 * Wohngeld (Mietzuschuss) nach dem Wohngeldgesetz — geltendes Recht 2025/2026
 * und der geplante Rechtsstand ab 1.1.2027.
 *
 * Geltendes Recht (seit 1.1.2025, Zweite Wohngeld-Fortschreibungsverordnung,
 * BGBl. 2024 I Nr. 314): Anlage 1 (Höchstbeträge), § 12 Abs. 6 (Heizkosten-
 * entlastung), § 12 Abs. 7 (Klimakomponente), § 19 + Anlage 2 (Formel und
 * Werte a, b, c), Anlage 3 (Mindestwerte und Rundung), § 21 Nr. 1 (unter 10 €
 * kein Anspruch). Wörtlich von gesetze-im-internet.de.
 *
 * 2027: Regierungsentwurf eines Gesetzes zur Vereinfachung und Fortentwicklung
 * des Wohngeldgesetzes, BR-Drs. 474/26 vom 14.08.2026 (Kabinett 06.07.2026):
 * - keine Fortschreibung zum 1.1.2027 (§ 43 Abs. 11 neu) — Höchstbeträge und
 *   Klimakomponente bleiben betragsgleich (Anlage 1 neu),
 * - dauerhafte Heizkostenkomponente halbiert (§ 12 Abs. 6 neu),
 * - Parameter „c“ erhöht (Anlage 2 neu), a und b unverändert,
 * - Mindestbetrag 15 statt 10 € (§ 21 Abs. 1 Nr. 1 neu),
 * - Werbungskosten nur noch in Höhe der Pauschbeträge des § 9a EStG (§ 14 neu),
 * - neue Mietenstufen-Zuordnung der Gemeinden (WoGV-Anlage, Art. 2).
 * Anlage 3 ändert der Entwurf nicht. Noch nicht beschlossen — der Bundesrat
 * hat am 25.09.2026 Änderungen verlangt.
 *
 * Einkommen: vereinfachte Ermittlung nach §§ 14–17 WoGG — Brutto minus
 * Werbungskosten-Pauschbetrag, minus je 10 % für Steuern, Kranken-/Pflege- und
 * Rentenversicherung (§ 16), minus Freibeträge (§ 17). Kindergeld zählt nicht
 * zum Einkommen. Geprüft gegen die amtlichen BMWSB-Rechenbeispiele 2025
 * (scripts/neue-rechner.test.mts).
 */
import { ARBEITNEHMER_PAUSCHBETRAG } from "@/lib/taxCalculator";

export type WgRecht = "2026" | "2027";

export const WOHNGELD_QUELLEN = {
  entwurf: "BR-Drucksache 474/26",
  entwurfUrl: "https://www.bundesrat.de/SharedDocs/drucksachen/2026/0401-0500/474-26.pdf?__blob=publicationFile",
  woggUrl: "https://www.gesetze-im-internet.de/wogg/",
  wogvUrl: "https://www.gesetze-im-internet.de/wogv/anlage.html",
} as const;

/** Anlage 1 WoGG: Höchstbeträge für 1–5 Personen × Mietenstufe I–VII, dazu Mehrbetrag je weitere Person. 2026 = 2027. */
const HOECHSTBETRAG: number[][] = [
  [361, 408, 456, 511, 562, 615, 677],
  [437, 493, 551, 619, 680, 745, 820],
  [521, 587, 657, 737, 809, 887, 975],
  [608, 686, 766, 858, 946, 1035, 1139],
  [694, 782, 875, 982, 1080, 1183, 1302],
];
const HOECHSTBETRAG_MEHR = [82, 94, 106, 119, 129, 149, 163];

/** Klimakomponente (§ 12 Abs. 7 bzw. ab 2027 Anlage 1), betragsgleich. */
const KLIMA = [19.2, 24.8, 29.6, 34.4, 39.2];
const KLIMA_MEHR = 4.8;

/** Gesamtbetrag zur Entlastung bei den Heizkosten (CO₂-Betrag + dauerhafte Heizkostenkomponente). */
const HEIZ: Record<WgRecht, { basis: number[]; mehr: number }> = {
  "2026": { basis: [110.4, 142.6, 170.2, 197.8, 225.4], mehr: 27.6 },
  "2027": { basis: [62.4, 80.6, 96.2, 111.8, 127.4], mehr: 15.6 },
};

/** Anlage 2: a, b (beide Rechtsstände gleich) und c je Haushaltsgröße 1–12. */
const A = [4.0e-2, 3.0e-2, 2.0e-2, 1.0e-2, 0, -1.0e-2, -2.0e-2, -3.0e-2, -4.0e-2, -6.0e-2, -9.0e-2, -1.2e-1];
const B = [4.797e-4, 3.571e-4, 2.917e-4, 2.163e-4, 1.907e-4, 1.722e-4, 1.592e-4, 1.583e-4, 1.376e-4, 1.249e-4, 1.141e-4, 1.107e-4];
const C: Record<WgRecht, number[]> = {
  "2026": [4.08e-5, 3.04e-5, 2.45e-5, 1.76e-5, 1.72e-5, 1.66e-5, 1.65e-5, 1.65e-5, 1.66e-5, 1.66e-5, 1.96e-5, 2.21e-5],
  "2027": [6.446e-5, 4.803e-5, 3.871e-5, 2.781e-5, 2.718e-5, 2.623e-5, 2.607e-5, 2.607e-5, 2.623e-5, 2.623e-5, 3.097e-5, 3.492e-5],
};

/** Anlage 3 Nr. 1: Mindestwerte für M und Y. */
const MIN_M = [54, 67, 79, 92, 103, 103, 115, 128, 140, 152, 187, 298];
const MIN_Y = [396, 679, 906, 1132, 1358, 1585, 1811, 2037, 2264, 2490, 2717, 2943];

export const MINDESTBETRAG: Record<WgRecht, number> = { "2026": 10, "2027": 15 };

/** § 17 WoGG. */
export const FREIBETRAG = { schwerbehindert: 1800, alleinerziehend: 1320 } as const;
/** Werbungskosten-Pauschbetrag für Renten, § 9a Satz 1 Nr. 3 EStG. */
export const RENTEN_PAUSCHBETRAG = 102;

function proPerson(basis: number[], mehr: number, n: number): number {
  return n <= basis.length ? basis[n - 1] : basis[basis.length - 1] + mehr * (n - basis.length);
}

export function hoechstbetrag(personen: number, mietenstufe: number): number {
  const s = Math.min(7, Math.max(1, mietenstufe)) - 1;
  return personen <= 5 ? HOECHSTBETRAG[personen - 1][s] : HOECHSTBETRAG[4][s] + HOECHSTBETRAG_MEHR[s] * (personen - 5);
}
export const klimakomponente = (personen: number) => proPerson(KLIMA, KLIMA_MEHR, personen);
export const heizkostenentlastung = (personen: number, recht: WgRecht) => proPerson(HEIZ[recht].basis, HEIZ[recht].mehr, personen);

/**
 * Eine Einkommensquelle eines Haushaltsmitglieds.
 * - `arbeitnehmer`: sozialversicherungspflichtig; Abzug Arbeitnehmer-Pauschbetrag,
 *   dann 20 % (KV/PV + RV) bzw. 30 % mit Steuern vom Einkommen (§ 16).
 * - `minijob`: pauschal versteuert, ohne Werbungskosten und ohne Abzug (BMWSB-Beispiel 6).
 * - `rente`: Werbungskosten-Pauschbetrag 102 €, dann 10 % (KV/PV) bzw. 20 % mit Steuern.
 * - `ohneAbzug`: ALG I, Unterhalt, Unterhaltsvorschuss — voll anzurechnen.
 */
export type EinkommensArt = "arbeitnehmer" | "minijob" | "rente" | "ohneAbzug";
export interface Einkommensquelle {
  art: EinkommensArt;
  bruttoMonat: number;
  steuern: boolean;
}

export interface WohngeldEinkommen {
  quellen: Einkommensquelle[];
  /** § 17 Nr. 3: allein mit Kind unter 18 (1.320 € im Jahr). */
  alleinerziehend: boolean;
  /** § 17 Nr. 1: Haushaltsmitglieder mit GdB 100 (2027: oder mindestens Pflegegrad 3). */
  schwerbehindert: number;
}

/** Jahreseinkommen einer Quelle nach §§ 14–16 WoGG (vereinfacht). */
export function jahreseinkommen(q: Einkommensquelle, recht: WgRecht): number {
  const brutto = Math.max(0, q.bruttoMonat) * 12;
  const pausch = recht === "2027" ? ARBEITNEHMER_PAUSCHBETRAG.reform : ARBEITNEHMER_PAUSCHBETRAG.amtlich2026;
  switch (q.art) {
    case "arbeitnehmer":
      return Math.max(0, brutto - pausch) * (q.steuern ? 0.7 : 0.8);
    case "rente":
      return Math.max(0, brutto - RENTEN_PAUSCHBETRAG) * (q.steuern ? 0.8 : 0.9);
    default:
      return brutto;
  }
}

/** Monatliches Gesamteinkommen „Y“ nach § 13 WoGG. */
export function gesamteinkommen(e: WohngeldEinkommen, recht: WgRecht): number {
  const summe = e.quellen.reduce((s, q) => s + jahreseinkommen(q, recht), 0);
  const freibetraege = (e.alleinerziehend ? FREIBETRAG.alleinerziehend : 0) + FREIBETRAG.schwerbehindert * Math.max(0, e.schwerbehindert);
  return Math.max(0, summe - freibetraege) / 12;
}

export interface WohngeldErgebnis {
  recht: WgRecht;
  /** Höchstbetrag + Klimakomponente. */
  obergrenze: number;
  /** Berücksichtigte Miete M (inkl. Heizkostenentlastung, vor Mindestwert). */
  mieteBeruecksichtigt: number;
  heizkosten: number;
  /** Monatliches Gesamteinkommen Y (vor Mindestwert). */
  einkommen: number;
  /** Ungerundet, kann negativ sein. */
  roh: number;
  /** Ausgezahltes Wohngeld (0, wenn unter Mindestbetrag). */
  wohngeld: number;
  unterMindestbetrag: boolean;
}

export function wohngeldRechnen(opts: {
  recht: WgRecht;
  personen: number;
  mietenstufe: number;
  /** Bruttokaltmiete: Kaltmiete + kalte Nebenkosten, ohne Heizung und Warmwasser. */
  bruttokaltmiete: number;
  einkommen: WohngeldEinkommen;
}): WohngeldErgebnis {
  const { recht } = opts;
  const n = Math.max(1, Math.round(opts.personen));
  const k = Math.min(12, n) - 1;
  const obergrenze = hoechstbetrag(n, opts.mietenstufe) + klimakomponente(n);
  const heizkosten = heizkostenentlastung(n, recht);
  const mieteBeruecksichtigt = Math.min(Math.max(0, opts.bruttokaltmiete), obergrenze) + heizkosten;
  const einkommen = gesamteinkommen(opts.einkommen, recht);

  // Anlage 3: Mindestwerte, Formel, kaufmännische Rundung auf volle Euro.
  const M = Math.max(mieteBeruecksichtigt, MIN_M[k]);
  const Y = Math.max(einkommen, MIN_Y[k]);
  const z1 = A[k] + B[k] * M + C[recht][k] * Y;
  const roh = 1.15 * (M - z1 * Y);
  let wohngeld = Math.max(0, Math.round(roh));
  if (n > 12) wohngeld += 65 * (n - 12);
  wohngeld = Math.min(wohngeld, Math.round(mieteBeruecksichtigt));
  const unterMindestbetrag = wohngeld > 0 && wohngeld < MINDESTBETRAG[recht];
  return {
    recht,
    obergrenze,
    mieteBeruecksichtigt,
    heizkosten,
    einkommen,
    roh,
    wohngeld: unterMindestbetrag ? 0 : wohngeld,
    unterMindestbetrag,
  };
}

/**
 * Höchstes monatliches Gesamteinkommen Y, bei dem noch Wohngeld (≥ Mindestbetrag)
 * gezahlt wird — Miete in Höhe der Obergrenze. Monoton fallend in Y → Bisektion.
 */
export function einkommensgrenze(recht: WgRecht, personen: number, mietenstufe: number): number {
  const n = Math.min(12, personen) - 1;
  const M = hoechstbetrag(personen, mietenstufe) + klimakomponente(personen) + heizkostenentlastung(personen, recht);
  const w = (Y: number) => Math.round(1.15 * (M - (A[n] + B[n] * M + C[recht][n] * Y) * Y));
  let lo = MIN_Y[n];
  let hi = 20000;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (w(mid) >= MINDESTBETRAG[recht]) lo = mid;
    else hi = mid;
  }
  return lo;
}
