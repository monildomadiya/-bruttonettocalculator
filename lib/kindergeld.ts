/**
 * Kindergeld 2026–2028 und Günstigerprüfung Kindergeld ↔ Kinderfreibetrag.
 *
 * Werte:
 * - 2026 amtlich: Kindergeld 259 € (§ 66 Abs. 1 EStG), Kinderfreibetrag
 *   3.414 € je Elternteil, Betreuungsfreibetrag (BEA) 1.464 € je Elternteil
 *   (§ 32 Abs. 6 Satz 1 EStG).
 * - 2027/2028: Regierungsentwurf EStRefG 2027 (BT-Drs. 21/8235) — Kindergeld
 *   267 € bzw. 272 €, Kinderfreibetrag 3.564 € bzw. 3.654 € je Elternteil,
 *   BEA unverändert. Die Konstanten kommen aus der Engine (`KINDERGELD`,
 *   `KINDERFREIBETRAG`), damit es nur EINE Quelle gibt.
 *
 * Günstigerprüfung (§ 31 EStG): Das Finanzamt prüft für jedes Kind einzeln,
 * ob die Steuerersparnis durch die Freibeträge höher ist als das Kindergeld
 * für das Jahr. Wenn ja, werden die Freibeträge abgezogen und das Kindergeld
 * der Steuer hinzugerechnet — es bleibt also die Differenz als Erstattung.
 * Verglichen wird nur die Einkommensteuer; Soli und Kirchensteuer werden
 * unabhängig davon immer mit Freibeträgen berechnet (§ 3 Abs. 2 SolZG,
 * § 51a Abs. 2 EStG).
 *
 * Das zvE kommt aus dem vereinfachten Modell der Engine (Brutto −
 * Sozialabgaben − Arbeitnehmer- und Sonderausgaben-Pauschbetrag).
 */
import {
  BETREUUNGSFREIBETRAG,
  KINDERFREIBETRAG,
  KINDERGELD,
  calculateNetto,
  resolveSteuerkontext,
} from "@/lib/taxCalculator";

export type KgJahr = 2026 | 2027 | 2028;
export const KG_JAHRE: KgJahr[] = [2026, 2027, 2028];

/** Entlastungsbetrag für Alleinerziehende, § 24b Abs. 2 EStG (vom Entwurf nicht geändert). */
export const ENTLASTUNGSBETRAG = { erstesKind: 4260, jedesWeitere: 240 } as const;

export const KG_WERTE: Record<KgJahr, { kindergeld: number; kfbJeElternteil: number; status: "amtlich" | "entwurf" }> = {
  2026: { kindergeld: KINDERGELD.amtlich2026, kfbJeElternteil: KINDERFREIBETRAG.amtlich2026, status: "amtlich" },
  2027: { kindergeld: KINDERGELD.entwurf2027, kfbJeElternteil: KINDERFREIBETRAG.entwurf2027, status: "entwurf" },
  2028: { kindergeld: KINDERGELD.stufe2028, kfbJeElternteil: KINDERFREIBETRAG.stufe2028, status: "entwurf" },
};

/** Ältere, amtliche Werte — nur für die Verlaufstabelle. */
export const KG_VERLAUF = [
  { jahr: 2025, kindergeld: 255, kfbJeElternteil: 3336, status: "amtlich" as const },
  ...KG_JAHRE.map((jahr) => ({ jahr, ...KG_WERTE[jahr] })),
];

/** Beide Freibeträge eines Elternteils (Kinderfreibetrag + BEA). */
export function freibetragJeElternteil(jahr: KgJahr): number {
  return KG_WERTE[jahr].kfbJeElternteil + BETREUUNGSFREIBETRAG;
}

/**
 * - `verheiratet`: Zusammenveranlagung, Splitting, voller Freibetrag, volles Kindergeld.
 * - `alleinerziehend`: Grundtarif + Entlastungsbetrag, Freibeträge des anderen
 *   Elternteils übertragen (§ 32 Abs. 6 Satz 6 ff.), volles Kindergeld.
 * - `getrennt`: Grundtarif, halber Freibetrag, angerechnet wird das halbe Kindergeld
 *   (§ 31 Satz 4 EStG) — Sicht eines Elternteils.
 */
export type Veranlagung = "verheiratet" | "alleinerziehend" | "getrennt";

function kontext(jahr: KgJahr) {
  return jahr === 2026
    ? resolveSteuerkontext(2026)
    : resolveSteuerkontext(2027, jahr === 2028 ? "stufe2028" : "entwurf2027");
}

/** Vereinfachtes zvE eines Arbeitnehmers aus dem Jahresbrutto, im Tarifjahr `jahr`. */
export function zvEAusBrutto(bruttoJahr: number, jahr: KgJahr): number {
  if (bruttoJahr <= 0) return 0;
  return calculateNetto({
    bruttoMonat: bruttoJahr / 12,
    jahr: jahr === 2026 ? 2026 : 2027,
    szenario: jahr === 2028 ? "stufe2028" : "entwurf2027",
    verheiratet: false,
    kinderlosUeber23: false,
    kirche: false,
  }).steuer.zvE;
}

export interface KindErgebnis {
  nr: number;
  /** ESt-Ersparnis durch die Freibeträge dieses Kindes. */
  ersparnis: number;
  /** Angerechnetes Kindergeld im Jahr. */
  kindergeldJahr: number;
  freibetragGuenstiger: boolean;
  /** Was über das Kindergeld hinaus per Steuerbescheid zurückkommt. */
  mehr: number;
}

export interface KindergeldErgebnis {
  jahr: KgJahr;
  zvE: number;
  kinder: KindErgebnis[];
  /** Kindergeld, das die Familienkasse tatsächlich auszahlt (Haushalt). */
  kindergeldAuszahlungJahr: number;
  mehrGesamt: number;
  /** Angerechnetes Kindergeld + Mehr aus der Steuererklärung (bei `getrennt`: Anteil dieses Elternteils). */
  foerderungGesamt: number;
  freibetragJeKind: number;
}

export function kindergeldRechnen(opts: {
  jahr: KgJahr;
  veranlagung: Veranlagung;
  /** Jahresbrutto Elternteil 1 (bzw. des Elternteils bei `getrennt`/`alleinerziehend`). */
  brutto1: number;
  /** Jahresbrutto Elternteil 2 — nur bei `verheiratet`. */
  brutto2?: number;
  kinder: number;
}): KindergeldErgebnis {
  const { jahr, veranlagung } = opts;
  const kinder = Math.max(0, Math.min(10, Math.round(opts.kinder)));
  const est = kontext(jahr).est;
  const splitting = veranlagung === "verheiratet";
  const steuer = (zvE: number) => (splitting ? 2 * est(Math.max(0, zvE) / 2) : est(Math.max(0, zvE)));

  let zvE = zvEAusBrutto(opts.brutto1, jahr) + (splitting ? zvEAusBrutto(opts.brutto2 ?? 0, jahr) : 0);
  if (veranlagung === "alleinerziehend" && kinder > 0) {
    zvE = Math.max(0, zvE - ENTLASTUNGSBETRAG.erstesKind - ENTLASTUNGSBETRAG.jedesWeitere * (kinder - 1));
  }

  const halb = veranlagung === "getrennt";
  const freibetragJeKind = freibetragJeElternteil(jahr) * (halb ? 1 : 2);
  const kgJahr = KG_WERTE[jahr].kindergeld * 12;
  const kgAngerechnet = halb ? kgJahr / 2 : kgJahr;

  // Kind für Kind, wie im Bescheid: die Freibeträge eines Kindes, bei dem sie
  // günstiger waren, mindern das zvE für die Prüfung der weiteren Kinder.
  let z = zvE;
  const ergebnisse: KindErgebnis[] = [];
  for (let i = 1; i <= kinder; i++) {
    const ersparnis = steuer(z) - steuer(z - freibetragJeKind);
    const freibetragGuenstiger = ersparnis > kgAngerechnet;
    if (freibetragGuenstiger) z -= freibetragJeKind;
    ergebnisse.push({ nr: i, ersparnis, kindergeldJahr: kgAngerechnet, freibetragGuenstiger, mehr: Math.max(0, ersparnis - kgAngerechnet) });
  }

  const mehrGesamt = ergebnisse.reduce((s, k) => s + k.mehr, 0);
  const kindergeldAuszahlungJahr = kgJahr * kinder;
  return {
    jahr,
    zvE,
    kinder: ergebnisse,
    kindergeldAuszahlungJahr,
    mehrGesamt,
    foerderungGesamt: ergebnisse.reduce((s, k) => s + k.kindergeldJahr, 0) + mehrGesamt,
    freibetragJeKind,
  };
}

/**
 * Kleinstes Jahresbrutto (auf 100 € genau), ab dem beim ERSTEN Kind der
 * Freibetrag günstiger ist. Bei `verheiratet` verdient ein Partner allein.
 * Die Ersparnis steigt mit dem Einkommen monoton — Bisektion genügt.
 */
export function schwelleFreibetrag(jahr: KgJahr, veranlagung: Veranlagung): number {
  const lohnt = (b: number) => kindergeldRechnen({ jahr, veranlagung, brutto1: b, kinder: 1 }).kinder[0].freibetragGuenstiger;
  let lo = 10000;
  let hi = 400000;
  if (!lohnt(hi)) return Infinity;
  while (hi - lo > 100) {
    const mid = Math.round((lo + hi) / 2 / 100) * 100;
    if (mid === lo || mid === hi) break;
    if (lohnt(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
}
