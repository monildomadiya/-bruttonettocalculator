/**
 * TVöD SuE (Sozial- und Erziehungsdienst, VKA, Anlage C), gültig ab 01.05.2026.
 *
 * +2,8 % zum 1. Mai 2026 aus derselben Tarifeinigung wie die allgemeine
 * TVöD-VKA-Tabelle (data/tvoed.ts). Gilt mindestens bis 31.03.2027 und bis zu
 * einem Neuabschluss weiter.
 *
 * DATENSTAND: 1. Oktober 2026. Alle 96 Werte stimmen in drei unabhängigen
 * Quellen überein: oeffentlichen-dienst.de und tarifrechner-info.de auf den
 * Cent, kommunalforum.de (auf Euro gerundet). Gegenprobe +2,8 %: S 2 Stufe 1
 * 2.829,14 € (2025) × 1,028 = 2.908,36 €.
 *
 * Bewusst nur die 16 regulären S-Gruppen. Sondergruppen aus Überleitungen
 * (S 10, S 11Z, S 12Z) stehen in einer der Quellen, aber nicht in den beiden
 * anderen — sie sind nicht aufgenommen.
 *
 * "typisch" ist eine grobe Orientierung, keine verbindliche Eingruppierung.
 */

export const SUE_STAND = "1. Oktober 2026";
export const SUE_STAND_ISO = "2026-10-01";
export const SUE_GUELTIG_AB = "1. Mai 2026";

export interface SueGruppe {
  slug: string;
  label: string;
  /** Monatliches Tabellenentgelt Stufe 1–6 in Euro. */
  stufen: number[];
  typisch?: string;
}

export const TVOED_SUE_2026: SueGruppe[] = [
  { slug: "s2", label: "S 2", stufen: [2908.36, 3030.97, 3121.67, 3220.16, 3330.92, 3441.69] },
  { slug: "s3", label: "S 3", stufen: [3119.87, 3320.05, 3506.28, 3677.28, 3755.52, 3848.98], typisch: "Kinderpflegerinnen und Kinderpfleger." },
  { slug: "s4", label: "S 4", stufen: [3291.46, 3504.21, 3698.06, 3829.61, 3956.37, 4156.33], typisch: "Kinderpflege mit schwierigen fachlichen Tätigkeiten." },
  { slug: "s7", label: "S 7", stufen: [3426.93, 3649.60, 3871.14, 4098.95, 4270.11, 4528.02] },
  { slug: "s8a", label: "S 8a", stufen: [3509.44, 3738.13, 3976.82, 4207.08, 4432.16, 4668.84], typisch: "Erzieherinnen und Erzieher — die häufigste SuE-Gruppe." },
  { slug: "s8b", label: "S 8b", stufen: [3578.87, 3812.64, 4091.94, 4503.48, 4892.59, 5190.90], typisch: "Erziehung mit besonders schwierigen fachlichen Tätigkeiten." },
  { slug: "s9", label: "S 9", stufen: [3648.68, 3887.42, 4166.69, 4580.02, 4970.99, 5272.60] },
  { slug: "s11a", label: "S 11a", stufen: [3846.25, 4106.12, 4291.48, 4766.33, 5138.69, 5362.12] },
  { slug: "s11b", label: "S 11b", stufen: [3915.12, 4181.19, 4368.13, 4844.78, 5217.14, 5440.57], typisch: "Sozialarbeit und Sozialpädagogik mit staatlicher Anerkennung." },
  { slug: "s12", label: "S 12", stufen: [3967.57, 4237.49, 4590.75, 4903.53, 5290.81, 5454.65], typisch: "Sozialarbeit und Sozialpädagogik mit schwierigen Tätigkeiten." },
  { slug: "s13", label: "S 13", stufen: [3978.03, 4248.70, 4617.39, 4915.26, 5287.64, 5473.83] },
  { slug: "s14", label: "S 14", stufen: [4073.39, 4351.17, 4682.24, 5019.00, 5391.41, 5652.06] },
  { slug: "s15", label: "S 15", stufen: [4112.68, 4393.93, 4691.87, 5034.44, 5585.57, 5823.86] },
  { slug: "s16", label: "S 16", stufen: [4263.29, 4557.82, 4885.49, 5287.64, 5734.48, 6002.61] },
  { slug: "s17", label: "S 17", stufen: [4352.39, 4654.62, 5138.69, 5436.63, 6032.40, 6382.42] },
  { slug: "s18", label: "S 18", stufen: [4720.52, 4840.79, 5436.63, 5883.46, 6553.73, 6963.31] },
];
