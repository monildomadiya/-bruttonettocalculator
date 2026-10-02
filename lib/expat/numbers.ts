import { calculateNetto, GRUNDFREIBETRAG } from "@/lib/taxCalculator";
import { DESTATIS_JAHR_2025 } from "@/data/wage-stats";

/**
 * Engine-Zahlen für die Expat-Seiten (Rumänisch, Türkisch, …). Alle Sprachen
 * zeigen dieselben Werte — die Texte liegen in lib/expat/content-*.ts, die
 * Zahlen nur hier, damit keine Übersetzung eine eigene (veraltete) Zahl trägt.
 */

type Sk = 1 | 2 | 3 | 4 | 5 | 6;

export const netto = (bruttoMonat: number, steuerklasse: Sk = 1, jahr: 2026 | 2027 = 2026) =>
  calculateNetto({
    bruttoMonat,
    jahr,
    verheiratet: steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5,
    // Steuerklasse II setzt ein Kind voraus — dann kein Kinderlosenzuschlag.
    kinderlosUeber23: steuerklasse !== 2,
    kirche: false,
    steuerklasse,
  });

export const BEISPIELE = [2000, 2500, 3000, 3500, 4000, 5000, 6000].map((brutto) => ({
  brutto,
  sk1: netto(brutto, 1).nettoMonat,
  sk3: netto(brutto, 3).nettoMonat,
}));

export const KLASSEN_BRUTTO = [2500, 3500, 5000] as const;
export const KLASSEN_TABELLE = ([1, 2, 3, 4, 5, 6] as Sk[]).map((sk) => ({
  sk,
  netto: KLASSEN_BRUTTO.map((b) => netto(b, sk).nettoMonat),
}));

/** Gesetzlicher Mindestlohn (MiLoV): 13,90 € ab 1.1.2026, 14,60 € ab 1.1.2027. */
export const MINDESTLOHN = { 2026: 13.9, 2027: 14.6 } as const;
/** Minijob-Grenze: 10 Wochenstunden × Mindestlohn × 13 / 3. */
export const MINIJOB = { 2026: 603, 2027: 633 } as const;
const STUNDEN_MONAT_40 = (40 * 52) / 12;

export const mindestlohnMonat = (jahr: 2026 | 2027, wochenstunden = 40) =>
  Math.round(MINDESTLOHN[jahr] * ((wochenstunden * 52) / 12) * 100) / 100;

export const MINDESTLOHN_ZEILEN = ([2026, 2027] as const).map((jahr) => {
  const brutto = mindestlohnMonat(jahr);
  return {
    jahr,
    stunde: MINDESTLOHN[jahr],
    brutto,
    netto: netto(brutto, 1, jahr).nettoMonat,
    netto3: netto(brutto, 3, jahr).nettoMonat,
  };
});
export const MINDESTLOHN_STUNDEN_TABELLE = [20, 30, 35, 40].map((h) => {
  const brutto = mindestlohnMonat(2026, h);
  return { h, brutto, netto: netto(brutto, 1).nettoMonat };
});
export { STUNDEN_MONAT_40 };

export const GEHALT = {
  medianJahr: DESTATIS_JAHR_2025.medianJahr,
  durchschnittJahr: DESTATIS_JAHR_2025.durchschnittJahr,
  medianNetto: netto(DESTATIS_JAHR_2025.medianJahr / 12).nettoMonat,
  durchschnittNetto: netto(DESTATIS_JAHR_2025.durchschnittJahr / 12).nettoMonat,
};

export const GRUNDFREIBETRAG_2026 = GRUNDFREIBETRAG.amtlich2026;

/** Euro mit deutschem Tausenderpunkt — die Zielgruppe liest deutsche Lohnzettel. */
export const eur = (v: number, digits = 2) =>
  v.toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits }) + " €";
