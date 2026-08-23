/**
 * Erbschaft- und Schenkungsteuer (ErbStG).
 *
 * Beide Steuern teilen sich Tarif und Steuerklassen — sie unterscheiden sich
 * im Wesentlichen bei den Freibeträgen (der Versorgungsfreibetrag nach § 17
 * ErbStG gibt es nur beim Erwerb von Todes wegen) und darin, dass Schenkungen
 * alle zehn Jahre neu begünstigt sind (§ 14 ErbStG).
 *
 * Die Werte sind seit dem Erbschaftsteuerreformgesetz unverändert; die
 * Steuersätze der Klassen II und III wurden 2010 zuletzt angepasst.
 */

export type ErbSteuerklasse = 1 | 2 | 3;

export interface Verwandtschaft {
  key: string;
  label: string;
  steuerklasse: ErbSteuerklasse;
  /** Persönlicher Freibetrag nach § 16 ErbStG. */
  freibetrag: number;
  /** Versorgungsfreibetrag nach § 17 ErbStG — nur bei Erwerb von Todes wegen. */
  versorgungsfreibetrag?: number;
  hinweis?: string;
}

/**
 * Verwandtschaftsgrade mit den Freibeträgen nach § 16 ErbStG.
 * Eltern und Großeltern stehen beim Erwerb von Todes wegen in Klasse I,
 * bei einer Schenkung dagegen in Klasse II (§ 15 Abs. 1 ErbStG).
 */
export const VERWANDTSCHAFT: Verwandtschaft[] = [
  {
    key: "ehegatte",
    label: "Ehepartner / eingetragener Lebenspartner",
    steuerklasse: 1,
    freibetrag: 500000,
    versorgungsfreibetrag: 256000,
  },
  {
    key: "kind",
    label: "Kind / Stiefkind / Adoptivkind",
    steuerklasse: 1,
    freibetrag: 400000,
    versorgungsfreibetrag: 52000,
    hinweis: "Versorgungsfreibetrag nur bis zum 27. Lebensjahr, nach Alter gestaffelt.",
  },
  {
    key: "enkel_elternverstorben",
    label: "Enkel, dessen Eltern verstorben sind",
    steuerklasse: 1,
    freibetrag: 400000,
  },
  {
    key: "enkel",
    label: "Enkel",
    steuerklasse: 1,
    freibetrag: 200000,
  },
  {
    key: "urenkel",
    label: "Urenkel / weitere Abkömmlinge",
    steuerklasse: 1,
    freibetrag: 100000,
  },
  {
    key: "eltern_erbfall",
    label: "Eltern / Großeltern (im Erbfall)",
    steuerklasse: 1,
    freibetrag: 100000,
    hinweis: "Bei einer Schenkung gilt stattdessen Steuerklasse II mit 20.000 € Freibetrag.",
  },
  {
    key: "geschwister",
    label: "Geschwister / Nichte / Neffe",
    steuerklasse: 2,
    freibetrag: 20000,
  },
  {
    key: "schwieger_stief",
    label: "Schwiegerkind / Schwiegereltern / Stiefeltern",
    steuerklasse: 2,
    freibetrag: 20000,
  },
  {
    key: "geschiedener",
    label: "Geschiedener Ehepartner",
    steuerklasse: 2,
    freibetrag: 20000,
  },
  {
    key: "sonstige",
    label: "Nicht verwandt (Freunde, Partner ohne Trauschein)",
    steuerklasse: 3,
    freibetrag: 20000,
  },
];

/**
 * Steuersätze nach § 19 Abs. 1 ErbStG. Der Satz gilt jeweils für den
 * gesamten steuerpflichtigen Erwerb, nicht stufenweise — deshalb der
 * Härteausgleich nach § 19 Abs. 3 ErbStG an den Stufengrenzen.
 */
export const TARIF: { bis: number; saetze: Record<ErbSteuerklasse, number> }[] = [
  { bis: 75000, saetze: { 1: 0.07, 2: 0.15, 3: 0.3 } },
  { bis: 300000, saetze: { 1: 0.11, 2: 0.2, 3: 0.3 } },
  { bis: 600000, saetze: { 1: 0.15, 2: 0.25, 3: 0.3 } },
  { bis: 6000000, saetze: { 1: 0.19, 2: 0.3, 3: 0.3 } },
  { bis: 13000000, saetze: { 1: 0.23, 2: 0.35, 3: 0.5 } },
  { bis: 26000000, saetze: { 1: 0.27, 2: 0.4, 3: 0.5 } },
  { bis: Infinity, saetze: { 1: 0.3, 2: 0.43, 3: 0.5 } },
];

/** Beerdigungskostenpauschale nach § 10 Abs. 5 Nr. 3 ErbStG. */
export const ERBFALLKOSTENPAUSCHALE = 15000;

export function steuersatzFuer(erwerb: number, klasse: ErbSteuerklasse): number {
  return (TARIF.find((s) => erwerb <= s.bis) ?? TARIF[TARIF.length - 1]).saetze[klasse];
}

export interface ErbschaftInput {
  /** Wert des Nachlasses bzw. der Schenkung. */
  vermoegen: number;
  verwandtschaft: Verwandtschaft;
  /** Erwerb von Todes wegen (true) oder Schenkung (false). */
  vonTodesWegen: boolean;
  /** Nachlassverbindlichkeiten, Schulden, Bestattungskosten. */
  abzuege?: number;
}

export interface ErbschaftResult {
  vermoegen: number;
  freibetrag: number;
  versorgungsfreibetrag: number;
  abzuege: number;
  steuerpflichtigerErwerb: number;
  steuersatz: number;
  steuer: number;
  haerteausgleichAngewendet: boolean;
  netto: number;
  effektiverSatz: number;
}

/**
 * Härteausgleich nach § 19 Abs. 3 ErbStG.
 *
 * Weil der Steuersatz auf den gesamten Erwerb angewendet wird, würde ein Euro
 * über einer Stufengrenze die Steuer sprunghaft erhöhen. Der Härteausgleich
 * begrenzt den Mehrbetrag: Vom Betrag, der die Grenze übersteigt, dürfen
 * höchstens 50 % (Stufen bis 6 Mio. €) bzw. 75 % zusätzlich erhoben werden.
 */
function mitHaerteausgleich(
  erwerb: number,
  klasse: ErbSteuerklasse
): { steuer: number; angewendet: boolean } {
  const satz = steuersatzFuer(erwerb, klasse);
  const voll = erwerb * satz;

  const stufenIndex = TARIF.findIndex((s) => erwerb <= s.bis);
  if (stufenIndex <= 0) return { steuer: voll, angewendet: false };

  const grenze = TARIF[stufenIndex - 1].bis;
  const vorherigerSatz = TARIF[stufenIndex - 1].saetze[klasse];
  const steuerAnGrenze = grenze * vorherigerSatz;

  // 50 % bis zur 6-Mio-Stufe, darüber 75 % des übersteigenden Betrags.
  const quote = grenze <= 6000000 ? 0.5 : 0.75;
  const gedeckelt = steuerAnGrenze + (erwerb - grenze) * quote;

  return gedeckelt < voll
    ? { steuer: gedeckelt, angewendet: true }
    : { steuer: voll, angewendet: false };
}

export function berechneErbschaftsteuer(input: ErbschaftInput): ErbschaftResult {
  const vermoegen = Math.max(0, input.vermoegen);
  const abzuege = Math.max(0, input.abzuege ?? 0);
  const { verwandtschaft, vonTodesWegen } = input;

  const freibetrag = verwandtschaft.freibetrag;
  // Der Versorgungsfreibetrag steht nur beim Erwerb von Todes wegen zu (§ 17 ErbStG).
  const versorgungsfreibetrag = vonTodesWegen ? verwandtschaft.versorgungsfreibetrag ?? 0 : 0;

  const nachAbzuegen = Math.max(0, vermoegen - abzuege);
  // § 10 Abs. 1 ErbStG: der steuerpflichtige Erwerb wird auf volle 100 € abgerundet.
  const steuerpflichtigerErwerb =
    Math.floor(Math.max(0, nachAbzuegen - freibetrag - versorgungsfreibetrag) / 100) * 100;

  const klasse = verwandtschaft.steuerklasse;
  const { steuer, angewendet } =
    steuerpflichtigerErwerb > 0
      ? mitHaerteausgleich(steuerpflichtigerErwerb, klasse)
      : { steuer: 0, angewendet: false };

  return {
    vermoegen,
    freibetrag,
    versorgungsfreibetrag,
    abzuege,
    steuerpflichtigerErwerb,
    steuersatz: steuerpflichtigerErwerb > 0 ? steuersatzFuer(steuerpflichtigerErwerb, klasse) : 0,
    steuer,
    haerteausgleichAngewendet: angewendet,
    netto: nachAbzuegen - steuer,
    effektiverSatz: vermoegen > 0 ? (steuer / vermoegen) * 100 : 0,
  };
}
