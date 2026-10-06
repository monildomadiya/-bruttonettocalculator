/**
 * Auszahlungstermine Kindergeld (und Kinderzuschlag) nach der letzten Ziffer
 * der Kindergeldnummer — abgeschrieben von der Familienkasse, nicht berechnet.
 *
 * Quelle: https://www.arbeitsagentur.de/familie-und-kinder/auszahlungstermine
 * (abgerufen 6.10.2026). Google Trends DE, 30 Tage: „kindergeld auszahlung
 * oktober 2026“ Breakout, „kindergeld oktober 2026“ +750 %.
 *
 * Pflege: Die Familienkasse listet die Termine 2027 bisher nur für die
 * Endziffern 0–6. Sobald alle zehn Endziffern veröffentlicht sind (spätestens
 * Dezember 2026), hier `AUSZAHLUNG_2027` ergänzen und die Seite auf 2027 umstellen.
 */
export const KG_AUSZAHLUNG_QUELLE = "https://www.arbeitsagentur.de/familie-und-kinder/auszahlungstermine";
export const KG_AUSZAHLUNG_STAND = "6. Oktober 2026";

export const KG_AUSZAHLUNG_MONATE = ["Oktober", "November", "Dezember"] as const;

/** Tag des Monats je Endziffer 0–9, Reihenfolge wie KG_AUSZAHLUNG_MONATE (2026). */
export const KG_AUSZAHLUNG_2026: { endziffer: number; tage: [number, number, number] }[] = [
  { endziffer: 0, tage: [5, 4, 3] },
  { endziffer: 1, tage: [6, 5, 4] },
  { endziffer: 2, tage: [8, 6, 7] },
  { endziffer: 3, tage: [9, 10, 8] },
  { endziffer: 4, tage: [12, 11, 9] },
  { endziffer: 5, tage: [13, 12, 10] },
  { endziffer: 6, tage: [15, 13, 11] },
  { endziffer: 7, tage: [16, 16, 14] },
  { endziffer: 8, tage: [19, 17, 15] },
  { endziffer: 9, tage: [20, 20, 16] },
];
