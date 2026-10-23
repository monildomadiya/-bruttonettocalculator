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
 *   "beschlossen" → Rechengrößen 2026 fortgeschrieben (Voreinstellung hier)
 *   "entwurf"     → wie der PAP-2027-Entwurf: Beitragsbemessungsgrenzen 2027
 *                   (Kabinettsbeschluss) und Pflegezuschlag 0,9 % — die
 *                   Voreinstellung des Hauptrechners; für 2028 gibt es noch
 *                   keine Werte, die Tabellen nehmen dann die Werte 2027 an.
 */
import {
  calculateNetto,
  estFormel2026,
  estFuerTarif,
  grenzsteuersatz2026,
  grenzsteuersatzFuerTarif,
  soliBerechnen,
  TARIF_2027_ENTWURF,
  TARIF_2028_ENTWURF,
  type CalculatorResult,
  type Steuerklasse,
  type Sv2027,
} from "@/lib/taxCalculator";

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

/**
 * Einkommensteuer nach § 32a EStG für 2026 / 2027 / 2028 aus dem zu
 * versteuernden Einkommen — die Tariffunktionen der Engine, nichts dupliziert:
 *   2026 → estFormel2026 / grenzsteuersatz2026
 *   2027 → TARIF_2027_ENTWURF, 2028 → TARIF_2028_ENTWURF (estFuerTarif)
 * Splitting (§ 32a Abs. 5 EStG): 2 × ESt(zvE ÷ 2), Grenzsteuersatz bei zvE ÷ 2.
 * Soli mit Freigrenze (soliBerechnen, SolzG 2026 — der Entwurf ändert es nicht),
 * Kirchensteuer als Prozentsatz der ESt.
 */
export interface EStJahresWert {
  jahr: VergleichsJahr;
  est: number;
  soli: number;
  kirchensteuer: number;
  summe: number;
  durchschnittssteuersatzPct: number;
  grenzsteuersatzPct: number;
  /** summe minus summe 2026 (negativ = Entlastung). */
  differenzZu2026: number;
}

export function einkommensteuerVergleich(zvE: number, splitting: boolean, kirchensteuerSatz = 0): EStJahresWert[] {
  const x = Math.max(0, zvE);
  const tarife: { jahr: VergleichsJahr; est: (z: number) => number; grenz: (z: number) => number }[] = [
    { jahr: 2026, est: estFormel2026, grenz: grenzsteuersatz2026 },
    { jahr: 2027, est: (z) => estFuerTarif(TARIF_2027_ENTWURF, z), grenz: (z) => grenzsteuersatzFuerTarif(TARIF_2027_ENTWURF, z) },
    { jahr: 2028, est: (z) => estFuerTarif(TARIF_2028_ENTWURF, z), grenz: (z) => grenzsteuersatzFuerTarif(TARIF_2028_ENTWURF, z) },
  ];
  const werte = tarife.map((t) => {
    const est = splitting ? 2 * t.est(x / 2) : t.est(x);
    const soli = soliBerechnen(est, splitting);
    const kirchensteuer = est * kirchensteuerSatz;
    return {
      jahr: t.jahr,
      est,
      soli,
      kirchensteuer,
      summe: est + soli + kirchensteuer,
      durchschnittssteuersatzPct: x > 0 ? (est / x) * 100 : 0,
      grenzsteuersatzPct: t.grenz(splitting ? x / 2 : x) * 100,
      differenzZu2026: 0,
    };
  });
  for (const w of werte) w.differenzZu2026 = w.summe - werte[0].summe;
  return werte;
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
