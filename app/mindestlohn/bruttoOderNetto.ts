import { calculateNetto, type Steuerjahr } from "@/lib/taxCalculator";

/*
 * Antwort auf die Breakout-Suche „ist der mindestlohn brutto oder netto"
 * (Google Trends DE, 5.10.2026). Eigene Datei ohne "use client", weil sie
 * sowohl im sichtbaren FAQ (Client-Komponente) als auch im FAQ-Schema
 * (page.tsx, Server) steht.
 */
const STUNDEN_VZ = (40 * 52) / 12;
const nettoProStunde = (lohn: number, jahr: Steuerjahr) =>
  calculateNetto({ bruttoMonat: lohn * STUNDEN_VZ, jahr, steuerklasse: 1, verheiratet: false, kinderlosUeber23: true, kirche: false }).nettoMonat /
  STUNDEN_VZ;
const fmt2 = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const MINDESTLOHN_BRUTTO_ODER_NETTO = `Brutto. Der Mindestlohn von 13,90 € pro Stunde (ab 1.1.2027: 14,60 €) ist ein Bruttobetrag — der Arbeitgeber muss ihn vor Abzug von Lohnsteuer und Sozialversicherungsbeiträgen zahlen. Netto bleiben bei Vollzeit in Steuerklasse I rund ${fmt2(nettoProStunde(13.9, 2026))} € pro Stunde, 2027 rund ${fmt2(nettoProStunde(14.6, 2027))} €. Ausnahme Minijob: Bis zur Verdienstgrenze von 603 € im Monat (2027: 633 €) fallen weder Lohnsteuer noch Krankenversicherung an — abgezogen wird höchstens der Rentenbeitrag von 3,6 %, von dem man sich befreien lassen kann.`;
