/**
 * Dienstrad-Leasing über Gehaltsumwandlung („Jobrad“) — Netto-Belastung,
 * geldwerter Vorteil und Vergleich mit dem Kauf.
 *
 * Geldwerter Vorteil (gleich lautende Erlasse der obersten Finanzbehörden der
 * Länder vom 9. Januar 2020, BStBl I S. 174):
 * - Fahrrad/Pedelec bis 25 km/h, erstmals überlassen nach dem 31.12.2018 und
 *   vor dem 1.1.2031: monatlich 1 % eines auf volle 100 € ABGERUNDETEN VIERTELS
 *   der UVP (Rdnr. 2) — erst vierteln, dann abrunden. Deckt auch den Arbeitsweg ab.
 * - Die 50-€-Sachbezugsfreigrenze gilt nicht (Rdnr. 3).
 * - S-Pedelec (über 25 km/h) ist Kraftfahrzeug (Rdnr. 6): § 6 Abs. 1 Nr. 4
 *   Satz 2 Nr. 3 EStG — Listenpreis geviertelt, 1 % privat plus 0,03 % je
 *   Entfernungskilometer für den Arbeitsweg.
 * - Zahlt der Arbeitgeber das Rad zusätzlich zum ohnehin geschuldeten Lohn,
 *   ist der Vorteil steuerfrei (§ 3 Nr. 37 EStG); bei Gehaltsumwandlung nicht.
 *
 * Netto: Die Umwandlung senkt das steuer- und beitragspflichtige Brutto, der
 * geldwerte Vorteil erhöht es wieder, wird aber nicht ausgezahlt. Gerechnet mit
 * `calculateNetto` (2026), damit Progression, BBG und Midijob stimmen.
 */
import { BBG_2026, calculateNetto, type Steuerklasse } from "@/lib/taxCalculator";
import { AKTUELLER_RENTENWERT_2026 } from "@/lib/renteNetto";

/** Vorläufiges Durchschnittsentgelt 2026 (Anlage 1 SGB VI, Sozialversicherungs-Rechengrößenverordnung 2026). */
export const DURCHSCHNITTSENTGELT_2026 = 51944;

export const DIENSTRAD_QUELLE = {
  erlass: "Gleich lautende Erlasse der obersten Finanzbehörden der Länder vom 9. Januar 2020",
  url: "https://www.ihk-muenchen.de/ihk/documents/Recht-Steuern/Steuerrecht/Finanzverwaltung/20200109-Gleich-lautende-Erlasse-steuerliche-Behandlung-Ueberlassung-Elektro-Fahrraeder.pdf",
  bis: "31.12.2030",
} as const;

export type RadTyp = "fahrrad" | "spedelec";

/** Monatlicher geldwerter Vorteil. */
export function geldwerterVorteil(uvp: number, typ: RadTyp = "fahrrad", kmArbeitsweg = 0): number {
  const basis = Math.floor(Math.max(0, uvp) / 4 / 100) * 100;
  const privat = basis * 0.01;
  return typ === "spedelec" ? privat + basis * 0.0003 * Math.max(0, Math.round(kmArbeitsweg)) : privat;
}

export interface DienstradInput {
  bruttoMonat: number;
  steuerklasse: Steuerklasse;
  kinderlosUeber23: boolean;
  kirche: boolean;
  uvp: number;
  /** Monatliche Leasingrate laut Angebot (inkl. Versicherung, falls enthalten). */
  rate: number;
  /** Monatlicher Arbeitgeberzuschuss zur Rate. Deckt er die ganze Rate, ist das Rad steuerfrei. */
  zuschuss: number;
  typ: RadTyp;
  kmArbeitsweg: number;
  laufzeitMonate: number;
  /** Übernahmepreis am Ende der Laufzeit (optional). */
  uebernahme: number;
  /** Rabatt beim Direktkauf in Prozent der UVP. */
  kaufRabattPct: number;
}

export interface DienstradErgebnis {
  steuerfrei: boolean;
  umwandlung: number;
  vorteil: number;
  nettoOhne: number;
  nettoMit: number;
  /** Tatsächliche Netto-Belastung pro Monat. */
  belastung: number;
  /** Ersparnis gegenüber der Rate in Prozent. */
  ersparnisPct: number;
  kostenLeasing: number;
  kostenKauf: number;
  vorteilGesamt: number;
  /** Geringere Monatsrente durch die Umwandlung über die ganze Laufzeit (Rentenwert 2026). */
  renteWeniger: number;
}

export function dienstradRechnen(i: DienstradInput): DienstradErgebnis {
  const sk = i.steuerklasse;
  const netto = (brutto: number) =>
    calculateNetto({
      bruttoMonat: Math.max(0, brutto), jahr: 2026, steuerklasse: sk,
      verheiratet: sk === 3 || sk === 4 || sk === 5, kinderlosUeber23: i.kinderlosUeber23, kirche: i.kirche,
    }).nettoMonat;

  const rate = Math.max(0, i.rate);
  const steuerfrei = i.zuschuss >= rate;
  const umwandlung = steuerfrei ? 0 : rate - Math.max(0, i.zuschuss);
  const vorteil = steuerfrei ? 0 : geldwerterVorteil(i.uvp, i.typ, i.kmArbeitsweg);

  const nettoOhne = netto(i.bruttoMonat);
  // Der geldwerte Vorteil wird versteuert und verbeitragt, aber nicht ausgezahlt.
  const nettoMit = netto(i.bruttoMonat - umwandlung + vorteil) - vorteil;
  const belastung = nettoOhne - nettoMit;
  const laufzeit = Math.max(1, Math.round(i.laufzeitMonate));
  const kostenLeasing = belastung * laufzeit + Math.max(0, i.uebernahme);
  const kostenKauf = Math.max(0, i.uvp) * (1 - Math.max(0, i.kaufRabattPct) / 100);
  // Rentenversicherung nur bis zur Beitragsbemessungsgrenze.
  const bbg = BBG_2026.rvAlvJahr / 12;
  const rvMinderung = Math.max(0, Math.min(i.bruttoMonat, bbg) - Math.min(i.bruttoMonat - umwandlung + vorteil, bbg)) * laufzeit;
  return {
    steuerfrei,
    umwandlung,
    vorteil,
    nettoOhne,
    nettoMit,
    belastung,
    ersparnisPct: rate > 0 ? ((rate - belastung) / rate) * 100 : 0,
    kostenLeasing,
    kostenKauf,
    vorteilGesamt: kostenKauf - kostenLeasing,
    renteWeniger: (rvMinderung / DURCHSCHNITTSENTGELT_2026) * AKTUELLER_RENTENWERT_2026,
  };
}
