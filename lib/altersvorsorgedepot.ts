/**
 * Altersvorsorgedepot ab 2027 — Zulagen, Günstigerprüfung und Ansparrechnung.
 *
 * Rechtsgrundlage: Gesetz zur Reform der steuerlich geförderten privaten
 * Altersvorsorge (Altersvorsorgereformgesetz) vom 26.05.2026,
 * BGBl. 2026 I Nr. 156 (verkündet 29.05.2026). Artikel 2 (EStG) tritt am
 * 01.01.2027 in Kraft. Wörtlich aus dem Gesetzestext:
 *
 * - § 84 EStG: Grundzulage 50 % der Beiträge bis 360 € und 25 % der Beiträge
 *   von 360,01 € bis 1.800 € → höchstens 180 € + 360 € = 540 €.
 *   Unter 25 zu Beginn des Beitragsjahres: einmalig +200 € (Berufseinsteiger-
 *   bonus). Mittelbar berechtigte Ehegatten: höchstens 175 €.
 * - § 85 EStG: Kinderzulage 100 % der Beiträge, höchstens 300 € je Kind, für
 *   jedes Kind, für das Kindergeld festgesetzt wird.
 * - § 86 EStG: Zulagen nur bei einem Mindesteigenbeitrag von 120 € im Jahr.
 * - § 10a Abs. 1 EStG: Sonderausgabenabzug bis 1.800 € zuzüglich der Zulage;
 *   das Finanzamt prüft, ob der Abzug günstiger ist als die Zulage.
 * - AltZertG (Artikel 6): Einzahlungen höchstens 6.840 € im Jahr.
 * - Standarddepot: Effektivkosten höchstens 1,0 % (BMF-FAQ, Stand 05.05.2026).
 * - Auszahlung frühestens ab 65, spätestens ab 70; Auszahlungsplan mindestens
 *   bis 85; bis zu 30 % Teilkapital (BMF-FAQ).
 *
 * Die Günstigerprüfung rechnet vereinfacht mit dem zvE-Modell der Engine
 * (Brutto − Sozialabgaben − Pauschbeträge) und dem Tarif 2027 laut
 * Regierungsentwurf (BT-Drs. 21/8235) — Beitragsjahr ist frühestens 2027.
 */
import { resolveSteuerkontext, soliBerechnen } from "@/lib/taxCalculator";

export const AVD = {
  gesetz: "Altersvorsorgereformgesetz vom 26.05.2026",
  bgbl: "BGBl. 2026 I Nr. 156",
  bgblUrl: "https://www.recht.bund.de/bgbl/1/2026/156/VO.html",
  bmfFaqUrl: "https://www.bundesfinanzministerium.de/Content/DE/FAQ/reform-der-privaten-altersvorsorge.html",
  start: "1. Januar 2027",
  stufe1Grenze: 360,
  stufe1Satz: 0.5,
  stufe2Grenze: 1800,
  stufe2Satz: 0.25,
  grundzulageMax: 540,
  kinderzulageMax: 300,
  berufseinsteigerbonus: 200,
  berufseinsteigerUnterAlter: 25,
  mindesteigenbeitrag: 120,
  sonderausgabenMax: 1800,
  einzahlungMax: 6840,
  mittelbarMax: 175,
  effektivkostenMaxStandard: 0.01,
  auszahlungFruehestens: 65,
  auszahlungSpaetestens: 70,
  auszahlplanBis: 85,
  teilkapitalMaxPct: 30,
} as const;

/** Grundzulage nach § 84 Satz 1 EStG für einen Jahresbeitrag (ohne Bonus). */
export function grundzulage(beitragJahr: number): number {
  const b = Math.max(0, beitragJahr);
  if (b < AVD.mindesteigenbeitrag) return 0;
  const stufe1 = Math.min(b, AVD.stufe1Grenze) * AVD.stufe1Satz;
  const stufe2 = Math.max(0, Math.min(b, AVD.stufe2Grenze) - AVD.stufe1Grenze) * AVD.stufe2Satz;
  return stufe1 + stufe2;
}

/** Kinderzulage nach § 85 EStG: je Kind 100 % des Beitrags, höchstens 300 €. */
export function kinderzulage(beitragJahr: number, kinder: number): number {
  const b = Math.max(0, beitragJahr);
  if (b < AVD.mindesteigenbeitrag) return 0;
  const proKind = Math.min(Math.min(b, AVD.stufe2Grenze), AVD.kinderzulageMax);
  return proKind * Math.max(0, Math.floor(kinder));
}

export interface Zulagen {
  grund: number;
  kinder: number;
  bonus: number;
  summe: number;
}

export function zulagen(beitragJahr: number, kinder: number, berufseinsteiger: boolean): Zulagen {
  const grund = grundzulage(beitragJahr);
  const kind = kinderzulage(beitragJahr, kinder);
  const bonus = berufseinsteiger && beitragJahr >= AVD.mindesteigenbeitrag ? AVD.berufseinsteigerbonus : 0;
  return { grund, kinder: kind, bonus, summe: grund + kind + bonus };
}

/** Einkommensteuer + Soli (+ Kirchensteuer) auf ein zvE, Tarif 2027 laut Entwurf. */
function steuer2027(zvE: number, splitting: boolean, kirche: boolean): number {
  const ctx = resolveSteuerkontext(2027, "entwurf2027");
  const z = Math.max(0, zvE);
  const est = splitting ? 2 * ctx.est(z / 2) : ctx.est(z);
  const soli = soliBerechnen(est, splitting, ctx.soliFaktor);
  return est + soli + (kirche ? est * 0.09 : 0);
}

export interface Guenstigerpruefung {
  /** Als Sonderausgabe abziehbar: Beitrag (max. 1.800 €) + Zulage. */
  abzug: number;
  /** Steuerersparnis durch den Abzug (ESt + Soli + ggf. Kirchensteuer). */
  steuerersparnis: number;
  /** Was über die Zulage hinaus per Steuerbescheid erstattet wird. */
  zusaetzlicheErstattung: number;
  /** Staatliche Förderung insgesamt = max(Zulage, Steuerersparnis). */
  foerderungGesamt: number;
}

export function guenstigerpruefung(opts: {
  zvE: number;
  beitragJahr: number;
  zulage: number;
  splitting: boolean;
  kirche: boolean;
}): Guenstigerpruefung {
  const abzug = Math.min(Math.max(0, opts.beitragJahr), AVD.sonderausgabenMax) + opts.zulage;
  const steuerersparnis =
    steuer2027(opts.zvE, opts.splitting, opts.kirche) -
    steuer2027(opts.zvE - abzug, opts.splitting, opts.kirche);
  const zusaetzlicheErstattung = Math.max(0, steuerersparnis - opts.zulage);
  return { abzug, steuerersparnis, zusaetzlicheErstattung, foerderungGesamt: opts.zulage + zusaetzlicheErstattung };
}

export interface AnsparInput {
  beitragMonat: number;
  alter: number;
  auszahlungAb: number;
  kinder: number;
  /** Wie viele der Ansparjahre noch Kindergeld fließt (Kinderzulage). */
  kinderJahre: number;
  renditePct: number;
  kostenPct: number;
}

export interface AnsparResult {
  jahre: number;
  eigenbeitraege: number;
  zulagenSumme: number;
  ertraege: number;
  endkapital: number;
  monatlicheAuszahlung: number;
  auszahlungsMonate: number;
  /** Zulagen im ersten Jahr (inkl. Bonus, falls unter 25). */
  zulagenErstesJahr: Zulagen;
}

/**
 * Ansparphase mit monatlicher Einzahlung und jährlicher Zulagen-Gutschrift,
 * danach Auszahlungsplan bis 85 mit derselben Nettorendite.
 * Rendite und Kosten sind Annahmen der Nutzerin bzw. des Nutzers — keine Prognose.
 */
export function ansparen(input: AnsparInput): AnsparResult {
  const beitragMonat = Math.min(Math.max(0, input.beitragMonat), AVD.einzahlungMax / 12);
  const beitragJahr = beitragMonat * 12;
  const auszahlungAb = Math.min(AVD.auszahlungSpaetestens, Math.max(AVD.auszahlungFruehestens, Math.round(input.auszahlungAb)));
  const jahre = Math.max(0, auszahlungAb - Math.round(input.alter));
  const nettoRendite = (1 + input.renditePct / 100) * (1 - input.kostenPct / 100) - 1;
  const iMonat = Math.pow(1 + nettoRendite, 1 / 12) - 1;

  let kapital = 0;
  let eigen = 0;
  let zulagenSumme = 0;
  const zulagenErstesJahr = zulagen(beitragJahr, input.kinder, input.alter < AVD.berufseinsteigerUnterAlter);
  for (let j = 0; j < jahre; j++) {
    for (let m = 0; m < 12; m++) {
      kapital = kapital * (1 + iMonat) + beitragMonat;
      eigen += beitragMonat;
    }
    const z = zulagen(beitragJahr, j < input.kinderJahre ? input.kinder : 0, j === 0 && input.alter < AVD.berufseinsteigerUnterAlter);
    kapital += z.summe;
    zulagenSumme += z.summe;
  }

  const auszahlungsMonate = (AVD.auszahlplanBis - auszahlungAb) * 12;
  const monatlicheAuszahlung =
    auszahlungsMonate <= 0
      ? 0
      : iMonat === 0
      ? kapital / auszahlungsMonate
      : (kapital * iMonat) / (1 - Math.pow(1 + iMonat, -auszahlungsMonate));

  return {
    jahre,
    eigenbeitraege: eigen,
    zulagenSumme,
    ertraege: kapital - eigen - zulagenSumme,
    endkapital: kapital,
    monatlicheAuszahlung,
    auszahlungsMonate,
    zulagenErstesJahr,
  };
}
