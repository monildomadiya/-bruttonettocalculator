/**
 * TV-L Entgelttabelle, gültig ab 01.04.2026 (bis 28.02.2027).
 *
 * Quelle: Bayerisches Landesamt für Finanzen, Leitstelle Bezügeabrechnung,
 * „Entgelttabelle TV-L (mit Stundenentgelt)“, Stand 01.04.2026 (PDF).
 * Gegengeprüft mit oeffentlichen-dienst.de (alle Werte identisch). Die
 * Spaltenzuordnung von E 1 (beginnt mit Stufe 2) und E 15Ü (Stufen 1–5) wurde
 * aus den Koordinaten im PDF bestimmt.
 *
 * Tarifeinigung der Länder vom 14.02.2026 (TdL-Einigungspapier): +2,8 %,
 * mindestens 100 €, ab 01.04.2026; +2,0 % ab 01.03.2027; +1,0 % ab 01.01.2028.
 *
 * NICHT enthalten: E 13Ü (Sonderstufen 4a/4b), TV-L Pflege/S-Tabellen,
 * TV-H (Hessen).
 *
 * WARTUNG: Zum 01.03.2027 die neue amtliche Tabelle erheben (nicht selbst
 * hochrechnen — Rundung und Mindestbeträge legt die Tabelle fest).
 */

export const TVL_GUELTIG_AB = "1. April 2026";
export const TVL_GUELTIG_BIS = "28. Februar 2027";
export const TVL_STAND = "4. Oktober 2026";
export const TVL_QUELLE = {
  titel: "Bayerisches Landesamt für Finanzen: Entgelttabelle TV-L ab 01.04.2026",
  url: "https://www.lff.bayern.de/media/ljinedqr/2026_03_09_entgeltttv-l-plusstundenentgelt-01042026.pdf",
};
export const TVL_EINIGUNG_URL =
  "https://www.tdl-online.de/fileadmin/downloads/tarifrunden/Einigungspapier_2026_-_v._14.2.2026__02.55_Uhr__final.pdf";
export const TVL_NAECHSTE_STUFEN = [
  { ab: "1. März 2027", prozent: 2.0 },
  { ab: "1. Januar 2028", prozent: 1.0 },
] as const;

export interface TvlGruppe {
  slug: string;
  label: string;
  /** Entgeltgruppe für die Jahressonderzahlungs-Staffel (9a/9b → 9). */
  eg: number;
  /** Monatsentgelt je Stufe 1–6; null, wo es die Stufe nicht gibt. */
  stufen: (number | null)[];
}

export const TVL_2026: TvlGruppe[] = [
  { slug: "e15ue", label: "E 15Ü", eg: 15, stufen: [6857.14, 7587.33, 8280.33, 8734.83, 8846.64, null] },
  { slug: "e15", label: "E 15", eg: 15, stufen: [5658.38, 6067.30, 6283.38, 7050.89, 7632.07, 7854.52] },
  { slug: "e14", label: "E 14", eg: 14, stufen: [5143.59, 5515.90, 5821.41, 6283.38, 6991.23, 7194.48] },
  { slug: "e13", label: "E 13", eg: 13, stufen: [4759.37, 5106.09, 5366.89, 5873.56, 6573.97, 6764.69] },
  { slug: "e12", label: "E 12", eg: 12, stufen: [4310.90, 4599.41, 5210.41, 5746.90, 6439.85, 6626.54] },
  { slug: "e11", label: "E 11", eg: 11, stufen: [4178.35, 4444.86, 4748.43, 5210.41, 5881.02, 6050.95] },
  { slug: "e10", label: "E 10", eg: 10, stufen: [4038.42, 4299.95, 4599.41, 4904.89, 5486.13, 5644.20] },
  { slug: "e9b", label: "E 9b", eg: 9, stufen: [3620.10, 3870.81, 4035.07, 4488.99, 4875.10, 5014.87] },
  { slug: "e9a", label: "E 9a", eg: 9, stufen: [3620.10, 3870.81, 3925.58, 4035.07, 4488.99, 4615.76] },
  { slug: "e8", label: "E 8", eg: 8, stufen: [3419.52, 3659.02, 3795.52, 3925.58, 4069.31, 4158.27] },
  { slug: "e7", label: "E 7", eg: 7, stufen: [3235.83, 3469.72, 3645.69, 3781.85, 3891.36, 3987.16] },
  { slug: "e6", label: "E 6", eg: 6, stufen: [3186.57, 3418.08, 3547.20, 3679.20, 3768.15, 3863.96] },
  { slug: "e5", label: "E 5", eg: 5, stufen: [3073.97, 3301.87, 3430.99, 3553.66, 3652.34, 3720.25] },
  { slug: "e4", label: "E 4", eg: 4, stufen: [2949.24, 3179.22, 3340.61, 3430.99, 3521.39, 3579.47] },
  { slug: "e3", label: "E 3", eg: 3, stufen: [2915.57, 3140.47, 3205.03, 3308.32, 3392.25, 3463.27] },
  { slug: "e2ue", label: "E 2Ü", eg: 2, stufen: [2811.20, 3030.72, 3114.64, 3217.96, 3288.97, 3385.81] },
  { slug: "e2", label: "E 2", eg: 2, stufen: [2742.84, 2953.24, 3017.80, 3082.36, 3230.84, 3385.81] },
  { slug: "e1", label: "E 1", eg: 1, stufen: [null, 2534.49, 2565.06, 2601.78, 2638.51, 2730.30] },
];
