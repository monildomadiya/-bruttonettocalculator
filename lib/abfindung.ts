/**
 * Abfindung (Entlassungsentschädigung) — Steuer bei Auszahlung, Steuer nach der
 * Fünftelregelung in der Veranlagung und die daraus folgende Erstattung.
 *
 * Rechtslage seit 2025 (Wachstumschancengesetz): Der Arbeitgeber darf die
 * Fünftelregelung im Lohnsteuerabzug nicht mehr anwenden (§ 39b Abs. 3 Satz 9
 * EStG a. F. gestrichen). Er behält die Lohnsteuer wie für jeden sonstigen Bezug
 * ein: Jahreslohnsteuer mit minus ohne Abfindung. Die ermäßigte Besteuerung nach
 * § 34 Abs. 1 EStG gibt es nur noch über die Einkommensteuererklärung.
 *
 * Sozialversicherung: Abfindungen für den Verlust des Arbeitsplatzes sind kein
 * Arbeitsentgelt und damit beitragsfrei.
 *
 * Vereinfachungen (auf der Seite offengelegt):
 *  - zvE wie in `calculateNetto` (Brutto − AN-Sozialabgaben − Pauschbeträge).
 *  - Veranlagung: Klasse III mit Splittingtarif (Partner ohne Einkünfte), alle
 *    anderen Klassen mit dem Grundtarif und nur dem Lohn aus diesem Job. Bei
 *    Klasse IV/V hängt die echte Steuer an der Zusammenveranlagung mit dem Partner.
 *  - Steuerjahr 2026.
 */
import {
  calculateNetto,
  estFormel2026,
  soliBerechnen,
  steuerNachKlasse,
  type Steuerklasse,
} from "@/lib/taxCalculator";

export interface AbfindungInput {
  abfindung: number;
  /** Bruttoarbeitslohn im Auszahlungsjahr ohne Abfindung. */
  jahresbrutto: number;
  steuerklasse: Steuerklasse;
  kirche: boolean;
  kirchensteuerSatz?: number;
  kinderlosUeber23?: boolean;
}

export interface SteuerTeil {
  lohnsteuer: number;
  soli: number;
  kirchensteuer: number;
  summe: number;
}

export interface AbfindungResult {
  /** (a) Einbehalt durch den Arbeitgeber bei Auszahlung. */
  auszahlung: SteuerTeil;
  /** (b) Voraussichtliche Steuer auf die Abfindung nach der Veranlagung (mit Fünftelregelung, falls günstiger). */
  veranlagung: SteuerTeil;
  /** (c) Voraussichtliche Erstattung = (a) − (b). */
  erstattung: number;
  nettoBeiAuszahlung: number;
  nettoNachErklaerung: number;
  /** Ist die Fünftelregelung günstiger als die normale Besteuerung? */
  fuenftelGuenstiger: boolean;
  /** Ersparnis der Fünftelregelung gegenüber normaler Veranlagung. */
  fuenftelVorteil: number;
  /** Klasse IV, V oder VI: Ergebnis hängt an Partner bzw. weiteren Einkünften. */
  unsicher: boolean;
}

const leer = (): SteuerTeil => ({ lohnsteuer: 0, soli: 0, kirchensteuer: 0, summe: 0 });

/** Tarifliche ESt der Veranlagung (vereinfacht, s. o.). */
function estVeranlagung(zvE: number, sk: Steuerklasse): number {
  const z = Math.max(0, zvE);
  if (sk === 3) return 2 * estFormel2026(z / 2);
  if (sk === 2) return estFormel2026(Math.max(0, z - 4260));
  return estFormel2026(z);
}

export function berechneAbfindung(input: AbfindungInput): AbfindungResult {
  const a = Math.max(0, input.abfindung);
  const sk = input.steuerklasse;
  const ks = input.kirchensteuerSatz ?? 0.09;
  const laufend = calculateNetto({
    bruttoMonat: Math.max(0, input.jahresbrutto) / 12,
    jahr: 2026,
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: input.kinderlosUeber23 ?? true,
    kirche: input.kirche,
    kirchensteuerSatz: ks,
  });
  const zvE = laufend.steuer.zvE;

  // (a) Lohnsteuerabzug: sonstiger Bezug, keine Sozialabgaben, keine Fünftelregelung.
  const gemeinsam = { steuerklasse: sk, jahr: 2026 as const, kirche: input.kirche, kirchensteuerSatz: ks };
  const ohne = steuerNachKlasse({ ...gemeinsam, zvE, bruttoJahr: laufend.bruttoJahr, svSummeJahr: laufend.sv.summeJahr });
  const mit = steuerNachKlasse({ ...gemeinsam, zvE: zvE + a, bruttoJahr: laufend.bruttoJahr + a, svSummeJahr: laufend.sv.summeJahr });
  const auszahlung: SteuerTeil = {
    lohnsteuer: mit.estJahr - ohne.estJahr,
    soli: mit.soliJahr - ohne.soliJahr,
    kirchensteuer: mit.kirchensteuerJahr - ohne.kirchensteuerJahr,
    summe: mit.summeJahr - ohne.summeJahr,
  };

  // (b) Veranlagung: § 34 Abs. 1 EStG — ESt(zvE) + 5 × [ESt(zvE + A/5) − ESt(zvE)],
  // sofern günstiger als die normale Besteuerung (Finanzamt prüft das von sich aus).
  const splitting = sk === 3;
  const estBasis = estVeranlagung(zvE, sk);
  const estFuenftel = estBasis + 5 * (estVeranlagung(zvE + a / 5, sk) - estBasis);
  const estNormal = estVeranlagung(zvE + a, sk);
  const fuenftelGuenstiger = estFuenftel < estNormal - 0.005;
  const estGesamt = Math.min(estFuenftel, estNormal);
  const teil = (est: number) => ({
    est,
    soli: soliBerechnen(est, splitting),
    kist: input.kirche ? est * ks : 0,
  });
  const vorher = teil(estBasis);
  const nachher = teil(estGesamt);
  const veranlagung: SteuerTeil = a > 0
    ? {
        lohnsteuer: nachher.est - vorher.est,
        soli: nachher.soli - vorher.soli,
        kirchensteuer: nachher.kist - vorher.kist,
        summe: nachher.est + nachher.soli + nachher.kist - (vorher.est + vorher.soli + vorher.kist),
      }
    : leer();

  const normalTeil = teil(estNormal);
  const fuenftelVorteil = Math.max(
    0,
    normalTeil.est + normalTeil.soli + normalTeil.kist - (nachher.est + nachher.soli + nachher.kist),
  );

  return {
    auszahlung,
    veranlagung,
    erstattung: auszahlung.summe - veranlagung.summe,
    nettoBeiAuszahlung: a - auszahlung.summe,
    nettoNachErklaerung: a - veranlagung.summe,
    fuenftelGuenstiger,
    fuenftelVorteil,
    unsicher: sk === 4 || sk === 5 || sk === 6,
  };
}
