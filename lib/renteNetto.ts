/**
 * Nettorente — Bruttorente → Nettorente für gesetzlich Versicherte in der
 * Krankenversicherung der Rentner (KVdR), Steuerjahr 2026 und 2027.
 *
 * Rechenweg (identisch mit scripts/article-figures.mts, Abschnitt 7, aus dem
 * die Tabelle im Ratgeber "rente-netto-berechnen" stammt):
 *   1. KV: halber allgemeiner Beitragssatz (7,3 %) + halber Zusatzbeitrag —
 *      die andere Hälfte trägt die Rentenversicherung.
 *   2. PV: voller Beitragssatz 3,6 %, Kinderlose zusätzlich 0,6 % — Rentner
 *      tragen die Pflegeversicherung allein.
 *   3. Steuerpflichtiger Teil = Jahresrente × Besteuerungsanteil (nach Jahr des
 *      Rentenbeginns, § 22 Nr. 1 Satz 3 Buchst. a Doppelbuchst. aa EStG).
 *   4. zvE = steuerpflichtiger Teil − Werbungskosten-Pauschbetrag 102 € −
 *      KV/PV-Beiträge (Vorsorgeaufwendungen) − Sonderausgaben-Pauschbetrag 36 €.
 *   5. Einkommensteuer nach Tarif des Steuerjahrs (2026 amtlich, 2027 nach dem
 *      Gesetzentwurf BT-Drs. 21/8235), Soli, optional Kirchensteuer.
 *
 * Vereinfachungen (auf der Seite offengelegt):
 *   • Einzelveranlagung, keine weiteren Einkünfte.
 *   • Der Besteuerungsanteil wird auf die aktuelle Rente angewandt. Das ist im
 *     ersten vollen Rentenjahr exakt; danach bleibt der steuerfreie Teil als
 *     fester Euro-Betrag eingefroren, spätere Rentenerhöhungen sind voll
 *     steuerpflichtig — für langjährige Rentner liegt die Steuer also etwas höher.
 *   • 2027: Kranken- und Pflegeversicherung mit den Sätzen 2026 — der
 *     durchschnittliche Zusatzbeitrag 2027 wird erst im Herbst 2026 festgelegt.
 */
import { resolveSteuerkontext, soliBerechnen, type Steuerjahr } from "@/lib/taxCalculator";

/** Beitragssätze der Rentner 2026 (auch Platzhalter für 2027, s. o.). */
export const RENTNER_SV_2026 = {
  kvAllgemein: 0.146,
  zusatzbeitragDurchschnitt: 0.029,
  pv: 0.036,
  pvZuschlagKinderlos: 0.006,
} as const;

/** § 9a Satz 1 Nr. 3 EStG — Werbungskosten-Pauschbetrag für Renten. */
export const WK_PAUSCHBETRAG_RENTE = 102;
/** § 10c EStG — Sonderausgaben-Pauschbetrag (Einzelveranlagung). */
export const SONDERAUSGABEN_PAUSCHBETRAG = 36;

/** Aktueller Rentenwert seit 1.7.2026 (Rentenanpassung +4,24 %, vorher 40,79 €). */
export const AKTUELLER_RENTENWERT_2026 = 42.52;

/**
 * Besteuerungsanteil nach Jahr des Rentenbeginns, in Prozent.
 * Bis 2005: 50 %; 2006–2020: +2 Pp. je Jahrgang; 2021–2022: +1 Pp.; ab 2023
 * nach dem Wachstumschancengesetz nur noch +0,5 Pp. je Jahrgang
 * (2026: 84 %, 2027: 84,5 %, 2028: 85 % … 100 % erst 2058).
 */
export function besteuerungsanteilProzent(rentenbeginn: number): number {
  const y = Math.floor(rentenbeginn);
  if (y <= 2005) return 50;
  if (y <= 2020) return 50 + 2 * (y - 2005);
  if (y <= 2022) return 80 + (y - 2020);
  return Math.min(100, 82 + 0.5 * (y - 2022));
}

export interface RentenNettoInput {
  bruttoRenteMonat: number;
  /** Jahr des Rentenbeginns — bestimmt den Besteuerungsanteil. */
  rentenbeginn: number;
  /** Steuerjahr: 2026 amtlich, 2027 nach Gesetzentwurf. */
  jahr: Steuerjahr;
  kinderlos: boolean;
  /** Kassenindividueller Zusatzbeitrag als Anteil (0.029 = 2,9 %). */
  zusatzbeitrag?: number;
  /** Kirchensteuersatz als Anteil (0, 0.08 oder 0.09). */
  kirchensteuer?: number;
}

export interface RentenNettoResult {
  bruttoRenteMonat: number;
  kvMonat: number;
  pvMonat: number;
  besteuerungsanteilProzent: number;
  zvEJahr: number;
  einkommensteuerJahr: number;
  soliJahr: number;
  kirchensteuerJahr: number;
  steuerMonat: number;
  nettoRenteMonat: number;
  nettoQuote: number;
  steuerIstEntwurf: boolean;
}

export function calculateRentenNetto(input: RentenNettoInput): RentenNettoResult {
  const brutto = Math.max(0, input.bruttoRenteMonat);
  const zb = input.zusatzbeitrag ?? RENTNER_SV_2026.zusatzbeitragDurchschnitt;
  const kvMonat = brutto * (RENTNER_SV_2026.kvAllgemein / 2 + zb / 2);
  const pvMonat = brutto * (RENTNER_SV_2026.pv + (input.kinderlos ? RENTNER_SV_2026.pvZuschlagKinderlos : 0));

  const anteil = besteuerungsanteilProzent(input.rentenbeginn);
  const steuerpflichtigJahr = brutto * 12 * (anteil / 100);
  const zvEJahr = Math.max(
    0,
    steuerpflichtigJahr - WK_PAUSCHBETRAG_RENTE - (kvMonat + pvMonat) * 12 - SONDERAUSGABEN_PAUSCHBETRAG
  );

  const ctx = resolveSteuerkontext(input.jahr);
  const einkommensteuerJahr = ctx.est(zvEJahr);
  const soliJahr = soliBerechnen(einkommensteuerJahr, false, ctx.soliFaktor);
  const kirchensteuerJahr = einkommensteuerJahr * (input.kirchensteuer ?? 0);
  const steuerMonat = (einkommensteuerJahr + soliJahr + kirchensteuerJahr) / 12;

  const nettoRenteMonat = brutto - kvMonat - pvMonat - steuerMonat;
  return {
    bruttoRenteMonat: brutto,
    kvMonat,
    pvMonat,
    besteuerungsanteilProzent: anteil,
    zvEJahr,
    einkommensteuerJahr,
    soliJahr,
    kirchensteuerJahr,
    steuerMonat,
    nettoRenteMonat,
    nettoQuote: brutto > 0 ? nettoRenteMonat / brutto : 0,
    steuerIstEntwurf: ctx.istEntwurf,
  };
}

/** Kleinste Bruttorente (5-€-Schritte), ab der Einkommensteuer anfällt. */
export function steuerpflichtAbRente(rentenbeginn: number, jahr: Steuerjahr, kinderlos = false): number {
  for (let b = 800; b <= 4000; b += 5) {
    if (calculateRentenNetto({ bruttoRenteMonat: b, rentenbeginn, jahr, kinderlos }).einkommensteuerJahr > 0) return b;
  }
  return 4000;
}
