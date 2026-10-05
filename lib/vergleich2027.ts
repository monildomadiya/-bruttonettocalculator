/**
 * Netto 2026 / 2027 / 2028 für Tabellen — eine dünne Hülle um `calculateNetto`,
 * damit jede Tabelle der Site die Jahre gleich auflöst und genau die Zahl zeigt,
 * die der Rechner für dieselben Eingaben liefert.
 *
 *   2026 → amtlicher Tarif und Rechengrößen 2026
 *   2027 → Steuerjahr 2027, Szenario "entwurf2027" (Art. 1 EStRefG 2027, BT-Drs. 21/8235)
 *   2028 → Steuerjahr 2027, Szenario "stufe2028"   (Art. 2 EStRefG 2027)
 *
 * Sozialabgaben 2027/2028 (`sv`):
 *   "beschlossen" → Rechengrößen 2026 fortgeschrieben (Voreinstellung des Rechners)
 *   "entwurf"     → Beitragsbemessungsgrenzen aus dem BMAS-Referentenentwurf 2027;
 *                   für 2028 gibt es noch keine Werte, die Tabellen nehmen dann
 *                   die Werte 2027 an und sagen das.
 */
import { calculateNetto, type CalculatorResult, type Steuerklasse, type Sv2027 } from "@/lib/taxCalculator";

export type VergleichsJahr = 2026 | 2027 | 2028;

export interface NettoOptionen {
  steuerklasse?: Steuerklasse;
  kirche?: boolean;
  kirchensteuerSatz?: number;
  kinderlosUeber23?: boolean;
  kvZusatzbeitrag?: number;
  sv?: Sv2027;
}

export function nettoFuerJahr(bruttoMonat: number, jahr: VergleichsJahr, o: NettoOptionen = {}): CalculatorResult {
  const sk = o.steuerklasse ?? 1;
  return calculateNetto({
    bruttoMonat,
    jahr: jahr === 2026 ? 2026 : 2027,
    szenario: jahr === 2028 ? "stufe2028" : "entwurf2027",
    sv2027: o.sv ?? "beschlossen",
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: o.kinderlosUeber23 ?? true,
    kirche: o.kirche ?? false,
    kirchensteuerSatz: o.kirchensteuerSatz,
    kvZusatzbeitrag: o.kvZusatzbeitrag,
  });
}

/** Ganzzahlige Monatsbeträge von `von` bis `bis` (inklusive) in `schritt`-Schritten. */
export function bruttoReihe(von: number, bis: number, schritt: number): number[] {
  const out: number[] = [];
  for (let b = von; b <= bis; b += schritt) out.push(b);
  return out;
}

/** 1.234,56 € */
export const eurDe = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

/** +1,23 € / −1,23 € / ±0,00 € */
export const eurDeSigned = (n: number) =>
  `${n >= 0.005 ? "+" : n <= -0.005 ? "−" : "±"}${eurDe(Math.abs(n) < 0.005 ? 0 : Math.abs(n))}`;
