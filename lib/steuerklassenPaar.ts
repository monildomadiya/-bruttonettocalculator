/**
 * Steuerklassenwahl für Ehepaare: III/V, V/III, IV/IV und IV/IV mit Faktor.
 *
 * Faktorverfahren nach § 39f EStG:
 *   X = Summe der Jahreslohnsteuer beider Partner in Klasse IV
 *   Y = voraussichtliche Einkommensteuer nach dem Splittingverfahren
 *   F = Y ÷ X, auf drei Nachkommastellen abgeschnitten (nicht gerundet);
 *       nur wenn F < 1, sonst bleibt es bei IV/IV.
 *   Lohnsteuer je Partner = Lohnsteuer Klasse IV × F.
 * Soli und Kirchensteuer werden auf die so geminderte Lohnsteuer jedes Partners
 * berechnet (Lohnsteuerabzug, Einzel-Freigrenze).
 *
 * Jahresausgleich: Die Einkommensteuer des Paares (Splitting) ist in allen
 * Kombinationen gleich. Die Differenz zur einbehaltenen Lohnsteuer kommt mit der
 * Steuererklärung als Erstattung oder Nachzahlung.
 *
 * Lohnersatz-Beispiel Arbeitslosengeld I (§ 153 SGB III): Bemessungsentgelt bis
 * zur BBG minus 20 % Sozialversicherungspauschale minus Lohnsteuer und Soli nach
 * der Steuerklasse, davon 60 % (67 % mit Kind) — dieselbe Methode wie
 * app/arbeitslosengeld-rechner.
 *
 * zvE wie in `calculateNetto` (vereinfacht). Steuerjahr 2026.
 */
import {
  BBG_2026,
  calculateNetto,
  estFormel2026,
  soliBerechnen,
  type CalculatorResult,
  type Steuerklasse,
} from "@/lib/taxCalculator";

export interface PaarInput {
  bruttoA: number;
  bruttoB: number;
  kirche: boolean;
  kirchensteuerSatz?: number;
  kinderlosUeber23: boolean;
}

export interface PartnerErgebnis {
  steuerklasse: Steuerklasse;
  nettoMonat: number;
  /** Lohnsteuer + Soli + KiSt pro Jahr, wie einbehalten. */
  steuerJahr: number;
}

export interface Kombination {
  key: "III/V" | "V/III" | "IV/IV" | "IV/IV-Faktor";
  label: string;
  a: PartnerErgebnis;
  b: PartnerErgebnis;
  nettoMonat: number;
  steuerEinbehaltenJahr: number;
  /** + = Erstattung, − = Nachzahlung (gegenüber der Splitting-Steuer). */
  ausgleichJahr: number;
}

export interface PaarErgebnis {
  kombinationen: Kombination[];
  faktor: number | null;
  /** Einkommensteuer + Soli + KiSt des Paares nach Splitting (Jahr). */
  splittingSteuerJahr: number;
}

const truncate3 = (n: number) => Math.floor(n * 1000) / 1000;

function netto(brutto: number, sk: Steuerklasse, i: PaarInput): CalculatorResult {
  return calculateNetto({
    bruttoMonat: Math.max(0, brutto),
    jahr: 2026,
    steuerklasse: sk,
    verheiratet: true,
    kinderlosUeber23: i.kinderlosUeber23,
    kirche: i.kirche,
    kirchensteuerSatz: i.kirchensteuerSatz,
  });
}

export function vergleichePaar(i: PaarInput): PaarErgebnis {
  const ks = i.kirchensteuerSatz ?? 0.09;
  const a4 = netto(i.bruttoA, 4, i);
  const b4 = netto(i.bruttoB, 4, i);

  // Splitting-Steuer des Paares (Veranlagung).
  const zvE = a4.steuer.zvE + b4.steuer.zvE;
  const estSplit = 2 * estFormel2026(zvE / 2);
  const splittingSteuerJahr = estSplit + soliBerechnen(estSplit, true) + (i.kirche ? estSplit * ks : 0);

  const partner = (r: CalculatorResult, sk: Steuerklasse): PartnerErgebnis => ({
    steuerklasse: sk,
    nettoMonat: r.nettoMonat,
    steuerJahr: r.steuer.summeJahr,
  });
  const kombi = (key: Kombination["key"], label: string, a: PartnerErgebnis, b: PartnerErgebnis): Kombination => {
    const steuerEinbehaltenJahr = a.steuerJahr + b.steuerJahr;
    return {
      key,
      label,
      a,
      b,
      nettoMonat: a.nettoMonat + b.nettoMonat,
      steuerEinbehaltenJahr,
      ausgleichJahr: steuerEinbehaltenJahr - splittingSteuerJahr,
    };
  };

  // Faktorverfahren
  const x = a4.steuer.einkommensteuerJahr + b4.steuer.einkommensteuerJahr;
  const fRoh = x > 0 ? truncate3(estSplit / x) : 1;
  const faktor = fRoh < 1 ? fRoh : null;
  const mitFaktor = (r: CalculatorResult): PartnerErgebnis => {
    if (faktor === null) return partner(r, 4);
    const lst = r.steuer.einkommensteuerJahr * faktor;
    const steuer = lst + soliBerechnen(lst, false) + (i.kirche ? lst * ks : 0);
    return { steuerklasse: 4, nettoMonat: (r.bruttoJahr - r.sv.summeJahr - steuer) / 12, steuerJahr: steuer };
  };

  return {
    kombinationen: [
      kombi("III/V", "A in III, B in V", partner(netto(i.bruttoA, 3, i), 3), partner(netto(i.bruttoB, 5, i), 5)),
      kombi("V/III", "A in V, B in III", partner(netto(i.bruttoA, 5, i), 5), partner(netto(i.bruttoB, 3, i), 3)),
      kombi("IV/IV", "beide in IV", partner(a4, 4), partner(b4, 4)),
      kombi("IV/IV-Faktor", faktor !== null ? `IV/IV mit Faktor ${faktor.toLocaleString("de-DE", { minimumFractionDigits: 3 })}` : "IV/IV mit Faktor (hier = IV/IV)", mitFaktor(a4), mitFaktor(b4)),
    ],
    faktor,
    splittingSteuerJahr,
  };
}

/** Arbeitslosengeld I pro Monat nach § 153 SGB III (pauschaliert, ohne KiSt). */
export function arbeitslosengeldMonat(brutto: number, sk: Steuerklasse, mitKind = false): number {
  const bemessung = Math.min(Math.max(0, brutto), BBG_2026.rvAlvJahr / 12);
  const r = calculateNetto({
    bruttoMonat: bemessung,
    jahr: 2026,
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: false,
    kirche: false,
  });
  const leistungsentgelt = bemessung * 0.8 - (r.steuer.einkommensteuerJahr + r.steuer.soliJahr) / 12;
  return Math.max(0, leistungsentgelt) * (mitKind ? 0.67 : 0.6);
}
