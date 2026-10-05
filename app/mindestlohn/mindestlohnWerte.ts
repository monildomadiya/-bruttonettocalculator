import { calculateNetto, type Steuerjahr, type Steuerklasse } from "@/lib/taxCalculator";
import { MINDESTLOHN, MINIJOB_GRENZE } from "@/lib/config2027";
import { RV_EIGENANTEIL_SATZ } from "@/app/minijob-rechner/minijobData";

/*
 * Gemeinsame Rechenwege der Mindestlohn-Seite — ohne "use client", damit Rechner
 * (Client) und Tabelle (Server) dieselben Zahlen zeigen.
 */

/** Monatsbrutto = Stundenlohn × Wochenstunden × 13 ÷ 3 (52 Wochen ÷ 12 Monate). */
export function monatsBrutto(stundenlohn: number, wochenstunden: number): number {
  return (stundenlohn * wochenstunden * 13) / 3;
}

/**
 * Netto beim Mindestlohn. Bis zur Minijob-Grenze (2026: 603 €, 2027: 633 €)
 * zahlt der Arbeitgeber Pauschalabgaben und -steuer; der Minijobber trägt nur
 * den Rentenversicherungs-Eigenanteil von 3,6 % (ohne Befreiung) — in jeder
 * Steuerklasse gleich. Darüber rechnet die Engine (Midijob bis 2.000 € inklusive).
 */
export function mindestlohnNetto(bruttoMonat: number, jahr: Steuerjahr, sk: Steuerklasse): { netto: number; minijob: boolean } {
  if (bruttoMonat <= MINIJOB_GRENZE[jahr]) {
    return { netto: bruttoMonat * (1 - RV_EIGENANTEIL_SATZ), minijob: true };
  }
  const netto = calculateNetto({
    bruttoMonat,
    jahr,
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: true,
    kirche: false,
  }).nettoMonat;
  return { netto, minijob: false };
}

/** Zeilen der Tabelle „Mindestlohn 2027 netto: Tabelle nach Wochenstunden“. */
export const TABELLEN_STUNDEN = [10, 15, 20, 25, 30, 35, 38, 40];
export const ALLE_KLASSEN: Steuerklasse[] = [1, 2, 3, 4, 5, 6];

export function mindestlohnTabelle2027() {
  return TABELLEN_STUNDEN.map((stunden) => {
    const brutto27 = monatsBrutto(MINDESTLOHN[2027], stunden);
    const brutto26 = monatsBrutto(MINDESTLOHN[2026], stunden);
    const netto = ALLE_KLASSEN.map((sk) => mindestlohnNetto(brutto27, 2027, sk));
    const sk1Vorjahr = mindestlohnNetto(brutto26, 2026, 1).netto;
    return { stunden, brutto27, netto, plusSk1: netto[0].netto - sk1Vorjahr, minijob: netto[0].minijob };
  });
}
