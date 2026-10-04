/**
 * Jahressonderzahlung im öffentlichen Dienst 2026 (§ 20 TVöD / § 20 TV-L).
 *
 * Quellen (Stand 04.10.2026, jeweils im Originaltext geprüft):
 * - TVöD Bund und VKA: Einigungspapier der Tarifverhandlungen vom 06.04.2025
 *   (dbb, PDF), Teil B Nr. 3 (Bund) und Teil C Nr. 3 (VKA): „ab dem
 *   Kalenderjahr 2026“, erstmals mit dem Novemberentgelt 2026.
 * - TV-L: Niedersächsisches Landesamt für Bezüge und Versorgung (NLBV),
 *   Bemessungssätze „ab 2022“. Die Tarifeinigung der Länder vom 14.02.2026
 *   (TdL-Einigungspapier) ändert § 20 TV-L nicht.
 *
 * WARTUNG: Nach der TVöD-Tarifrunde 2027 (Mai 2027) und der nächsten
 * TV-L-Runde prüfen, ob sich die Sätze ändern.
 */

export const JSZ_STAND = "4. Oktober 2026";

export interface JszStaffel {
  /** Höchste Entgeltgruppe, für die der Satz gilt (9 steht für 9a–9c). */
  bisEg: number;
  prozent: number;
  label: string;
}

export interface JszTarif {
  key: "vka" | "vka-kb" | "bund" | "tvl";
  name: string;
  kurz: string;
  staffel: JszStaffel[];
  quelle: { titel: string; url: string };
}

const EINIGUNG_TVOED_2025 = {
  titel: "Einigungspapier TVöD vom 06.04.2025 (dbb)",
  url: "https://www.dbb.de/fileadmin/user_upload/globale_elemente/pdfs/2025/Einkommensrunde/Entgelttabellen_Bund_Kommunen/250406_Einigungspapier_TVOeD_2025.pdf",
};

export const JSZ_TARIFE: JszTarif[] = [
  {
    key: "vka",
    name: "TVöD VKA (Kommunen)",
    kurz: "TVöD VKA",
    staffel: [{ bisEg: 15, prozent: 85, label: "alle Entgeltgruppen (auch S- und P-Tabelle)" }],
    quelle: EINIGUNG_TVOED_2025,
  },
  {
    key: "vka-kb",
    name: "TVöD VKA Krankenhäuser und Pflege (BT-K, BT-B)",
    kurz: "TVöD BT-K/BT-B",
    staffel: [
      { bisEg: 8, prozent: 90, label: "Entgeltgruppen 1 bis 8" },
      { bisEg: 15, prozent: 85, label: "Entgeltgruppen 9a bis 15" },
    ],
    quelle: EINIGUNG_TVOED_2025,
  },
  {
    key: "bund",
    name: "TVöD Bund",
    kurz: "TVöD Bund",
    staffel: [
      { bisEg: 8, prozent: 95, label: "Entgeltgruppen 1 bis 8" },
      { bisEg: 12, prozent: 90, label: "Entgeltgruppen 9a bis 12" },
      { bisEg: 15, prozent: 75, label: "Entgeltgruppen 13 bis 15" },
    ],
    quelle: EINIGUNG_TVOED_2025,
  },
  {
    key: "tvl",
    name: "TV-L (Länder)",
    kurz: "TV-L",
    staffel: [
      { bisEg: 4, prozent: 87.43, label: "Entgeltgruppen 1 bis 4" },
      { bisEg: 8, prozent: 88.14, label: "Entgeltgruppen 5 bis 8" },
      { bisEg: 11, prozent: 74.35, label: "Entgeltgruppen 9a bis 11" },
      { bisEg: 13, prozent: 46.47, label: "Entgeltgruppen 12 und 13" },
      { bisEg: 15, prozent: 32.53, label: "Entgeltgruppen 14 und 15" },
    ],
    quelle: {
      titel: "NLBV Niedersachsen: Jahressonderzahlung (Bemessungssätze ab 2022)",
      url: "https://www.nlbv.niedersachsen.de/bezuege_versorgung/entgelt/jahressonderzahlung/jahressonderzahlung-68468.html",
    },
  },
];

export function jszProzent(tarif: JszTarif["key"], eg: number): number {
  const t = JSZ_TARIFE.find((x) => x.key === tarif)!;
  return (t.staffel.find((s) => eg <= s.bisEg) ?? t.staffel[t.staffel.length - 1]).prozent;
}

/** Entgeltgruppen-Auswahl: 9 steht für 9a/9b/9c (alle Tarife staffeln dort gleich). */
export const JSZ_ENTGELTGRUPPEN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const;
export const egLabel = (eg: number) => (eg === 9 ? "E 9a–9c" : `E ${eg}`);
