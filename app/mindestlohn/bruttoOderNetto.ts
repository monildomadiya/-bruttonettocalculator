import { type Steuerjahr } from "@/lib/taxCalculator";
import { MINDESTLOHN, MINIJOB_GRENZE } from "@/lib/config2027";
import { mindestlohnNetto, monatsBrutto } from "./mindestlohnWerte";

/*
 * Antwort auf die Breakout-Suche „ist der mindestlohn brutto oder netto"
 * (Google Trends DE, 5.10.2026). Eigene Datei ohne "use client", weil sie
 * sowohl im sichtbaren FAQ (Client-Komponente) als auch im FAQ-Schema
 * (page.tsx, Server) steht.
 */
const STUNDEN_VZ = (40 * 13) / 3;
const nettoProStunde = (lohn: number, jahr: Steuerjahr) => mindestlohnNetto(monatsBrutto(lohn, 40), jahr, 1).netto / STUNDEN_VZ;
const fmt2 = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const MINDESTLOHN_BRUTTO_ODER_NETTO = `Brutto. Der Mindestlohn von ${fmt2(MINDESTLOHN[2026])} € pro Stunde (ab 1.1.2027: ${fmt2(MINDESTLOHN[2027])} €) ist ein Bruttobetrag — der Arbeitgeber muss ihn vor Abzug von Lohnsteuer und Sozialversicherungsbeiträgen zahlen. Netto bleiben bei Vollzeit in Steuerklasse I rund ${fmt2(nettoProStunde(MINDESTLOHN[2026], 2026))} € pro Stunde, 2027 rund ${fmt2(nettoProStunde(MINDESTLOHN[2027], 2027))} €. Ausnahme Minijob: Bis zur Verdienstgrenze von ${MINIJOB_GRENZE[2026]} € im Monat (2027: ${MINIJOB_GRENZE[2027]} €) fallen weder Lohnsteuer noch Krankenversicherung an — abgezogen wird höchstens der Rentenbeitrag von 3,6 %, von dem man sich befreien lassen kann.`;
