/**
 * TVöD-VKA Entgelttabelle, gültig 01.05.2026 – 31.03.2027.
 *
 * Zweite Stufe des zweistufigen Tarifabschlusses: +2,8 % tabellenwirksam zum
 * 1. Mai 2026, nachdem zum 1. April 2025 bereits +3,0 % (mindestens 110 €)
 * gewirkt hatten. Gilt für Beschäftigte bei Kommunen und kommunalen
 * Arbeitgebern (VKA).
 *
 * DATENSTAND: 21. August 2026. Die Tabelle wurde gegen zwei unabhängige
 * Quellen gegengeprüft (oeffentlichen-dienst.de und tarifrechner-info.de);
 * beide stimmen in allen geprüften Werten überein, ebenso die Eckwerte
 * E 1 Stufe 1 = 2.534,55 € und E 15Ü Stufe 5 = 9.197,81 €.
 *
 * WARTUNG: Bei jeder Tarifrunde neu erheben und ENTGELTTABELLE_STAND sowie
 * GUELTIG_BIS mitziehen — die Seiten weisen den Datenstand sichtbar aus.
 *
 * NICHT enthalten: die eigenständigen Tabellen für den Sozial- und
 * Erziehungsdienst (SuE, S-Gruppen), für die Pflege (P-Gruppen) und der
 * TVöD Bund. Die haben eigene Beträge und dürfen nicht aus dieser Tabelle
 * abgeleitet werden.
 */

export const ENTGELTTABELLE_STAND = "21. August 2026";
export const ENTGELTTABELLE_STAND_ISO = "2026-08-21";
export const GUELTIG_AB = "1. Mai 2026";
export const GUELTIG_BIS = "31. März 2027";
export const TARIFERHOEHUNG_PROZENT = 2.8;

export interface TvoedGruppe {
  /** URL-tauglicher Schlüssel, z. B. "e9b". */
  slug: string;
  /** Anzeigename, z. B. "E 9b". */
  label: string;
  /**
   * Monatliches Tabellenentgelt je Stufe (Index 0 = Stufe 1) in Euro.
   * `null`, wo die Gruppe die Stufe nicht kennt — E 1 hat keine Stufe 6,
   * E 15Ü beginnt erst bei Stufe 2 und endet mit Stufe 5.
   */
  stufen: (number | null)[];
  /** Kurze, strukturelle Einordnung — keine verbindliche Eingruppierung. */
  typisch: string;
}

export const TVOED_VKA_2026: TvoedGruppe[] = [
  { slug: "e15ue", label: "E 15Ü", stufen: [null, 7901.07, 8612.70, 9087.16, 9197.81, null], typisch: "Herausgehobene Leitungsfunktionen oberhalb der E 15." },
  { slug: "e15",   label: "E 15",  stufen: [5827.86, 6208.96, 6634.05, 7214.39, 7811.37, 8204.11], typisch: "Abteilungsleitungen und Tätigkeiten mit besonders herausgehobener Verantwortung." },
  { slug: "e14",   label: "E 14",  stufen: [5298.27, 5643.35, 6094.01, 6594.12, 7151.57, 7551.78], typisch: "Tätigkeiten mit abgeschlossenem wissenschaftlichem Hochschulstudium und besonderer Verantwortung." },
  { slug: "e13",   label: "E 13",  stufen: [4901.11, 5279.32, 5709.87, 6177.31, 6727.38, 7025.87], typisch: "Einstieg für Beschäftigte mit abgeschlossenem wissenschaftlichem Hochschulstudium (Master, Diplom)." },
  { slug: "e12",   label: "E 12",  stufen: [4415.70, 4850.91, 5359.50, 5923.82, 6586.00, 6900.18], typisch: "Besonders verantwortungsvolle Tätigkeiten, meist mit Hochschulabschluss." },
  { slug: "e11",   label: "E 11",  stufen: [4269.64, 4669.92, 5046.03, 5454.10, 6012.56, 6326.77], typisch: "Tätigkeiten, die in der Regel ein Fachhochschulstudium voraussetzen." },
  { slug: "e10",   label: "E 10",  stufen: [4124.53, 4438.16, 4794.69, 5181.37, 5611.95, 5753.35], typisch: "Tätigkeiten mit Fachhochschulabschluss oder gleichwertigen Fähigkeiten." },
  { slug: "e9c",   label: "E 9c",  stufen: [4010.72, 4290.50, 4594.76, 4922.61, 5275.05, 5527.70], typisch: "Gehobene Sachbearbeitung mit erhöhten Anforderungen." },
  { slug: "e9b",   label: "E 9b",  stufen: [3779.84, 4039.01, 4203.56, 4690.55, 4979.11, 5313.37], typisch: "Sachbearbeitung mit gründlichen, umfassenden Fachkenntnissen." },
  { slug: "e9a",   label: "E 9a",  stufen: [3658.61, 3877.94, 4097.67, 4586.77, 4697.43, 4979.97], typisch: "Tätigkeiten, die mehrjährige Berufserfahrung voraussetzen." },
  { slug: "e8",    label: "E 8",   stufen: [3486.40, 3697.29, 3843.36, 3992.40, 4153.50, 4230.97], typisch: "Selbstständige Leistungen auf Grundlage einer abgeschlossenen Ausbildung." },
  { slug: "e7",    label: "E 7",   stufen: [3294.98, 3537.94, 3682.69, 3828.76, 3969.05, 4045.24], typisch: "Fachtätigkeiten mit abgeschlossener Berufsausbildung und Zusatzanforderungen." },
  { slug: "e6",    label: "E 6",   stufen: [3240.30, 3440.25, 3580.46, 3719.22, 3855.50, 3926.20], typisch: "Tätigkeiten mit abgeschlossener Berufsausbildung." },
  { slug: "e5",    label: "E 5",   stufen: [3124.08, 3318.04, 3449.05, 3587.78, 3716.70, 3783.33], typisch: "Tätigkeiten mit abgeschlossener Ausbildung von mindestens drei Jahren." },
  { slug: "e4",    label: "E 4",   stufen: [2994.17, 3190.45, 3355.14, 3457.66, 3560.17, 3620.20], typisch: "Tätigkeiten mit eingehender Einarbeitung oder kurzer Ausbildung." },
  { slug: "e3",    label: "E 3",   stufen: [2953.13, 3164.20, 3215.57, 3332.99, 3421.10, 3501.81], typisch: "Tätigkeiten mit einer fachlichen Anlernphase." },
  { slug: "e2ue",  label: "E 2Ü",  stufen: [2787.52, 3028.30, 3116.51, 3234.12, 3314.92, 3433.49], typisch: "Übergangsgruppe zwischen E 2 und E 3." },
  { slug: "e2",    label: "E 2",   stufen: [2767.54, 2975.32, 3027.12, 3101.04, 3263.52, 3433.49], typisch: "Einfache Tätigkeiten mit fachbezogener Einarbeitung." },
  { slug: "e1",    label: "E 1",   stufen: [2534.55, 2568.83, 2611.69, 2651.64, 2754.50, null], typisch: "Einfachste Tätigkeiten ohne Ausbildungserfordernis." },
];

export function findTvoedGruppe(slug: string): TvoedGruppe | undefined {
  return TVOED_VKA_2026.find((g) => g.slug === slug);
}

/** Niedrigstes und höchstes Tabellenentgelt der gesamten Tabelle. */
export function spanne(): { min: number; max: number } {
  const werte = TVOED_VKA_2026.flatMap((g) => g.stufen).filter((v): v is number => v !== null);
  return { min: Math.min(...werte), max: Math.max(...werte) };
}

/** Die Stufen, die eine Gruppe tatsächlich kennt — als [Stufennummer, Betrag]. */
export function belegteStufen(gruppe: TvoedGruppe): Array<[number, number]> {
  return gruppe.stufen
    .map((betrag, i) => [i + 1, betrag] as [number, number | null])
    .filter((entry): entry is [number, number] => entry[1] !== null);
}
