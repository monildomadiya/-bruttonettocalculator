/**
 * Kindesunterhalt nach der Düsseldorfer Tabelle, Stand 1. Januar 2026.
 *
 * Quelle (wörtlich übernommen und geprüft, 04.10.2026): Oberlandesgericht
 * Düsseldorf, „Düsseldorfer Tabelle“ Stand 01.01.2026 (DT_2026.pdf) mit
 * Anmerkungen und „Anhang: Tabelle Zahlbeträge“.
 * https://www.olg-duesseldorf.nrw.de/infos/Duesseldorfer_Tabelle/Tabelle-2026/DT_2026.pdf
 *
 * - Bedarf je Einkommensgruppe und Altersstufe (0–5, 6–11, 12–17, ab 18).
 * - Zahlbetrag = Bedarf − halbes Kindergeld (minderjährig) bzw. volles
 *   Kindergeld (volljährig); Kindergeld 2026: 259 € (§ 1612b BGB).
 * - Bedarfskontrollbetrag (Anm. A III): Wird er unterschritten, KANN die
 *   nächstniedrigere Gruppe angesetzt werden — hier als Option.
 * - Notwendiger Selbstbehalt (Anm. A VII): 1.450 € erwerbstätig, 1.200 € nicht
 *   erwerbstätig.
 * - Mangelfall (Anm. C): Verteilungsmasse = Einkommen − Selbstbehalt, verteilt
 *   im Verhältnis der Einsatzbeträge (= Zahlbeträge).
 *
 * Bewusst NICHT abgebildet: pauschale 5 % berufsbedingte Aufwendungen — die
 * Leitlinien NRW 2026 (Nr. 10.2.1) gewähren sie „in der Regel nur bei fiktiven
 * Erwerbseinkünften“; konkrete Abzüge gibt der Nutzer selbst ein. Ebenso nicht:
 * Unterhalt volljähriger Kinder (beide Eltern haften anteilig), Wechselmodell,
 * Höher-/Herabstufung nach Zahl der Berechtigten.
 *
 * WARTUNG: Die Tabelle 2027 erscheint üblicherweise Anfang Dezember — dann
 * DT_2027 ergänzen und die Seite umstellen.
 */

export const DT_STAND = "1. Januar 2026";
export const DT_QUELLE = "https://www.olg-duesseldorf.nrw.de/infos/Duesseldorfer_Tabelle/Tabelle-2026/DT_2026.pdf";
export const KINDERGELD_2026 = 259;

export const SELBSTBEHALT = { erwerbstaetig: 1450, nichtErwerbstaetig: 1200, warmmiete: 520 } as const;
export const EIGENBEDARF_VOLLJAEHRIGE = 1750;
export const BEDARF_STUDENT_AUSWAERTS = 990;

export interface DtGruppe {
  nr: number;
  von: number;
  bis: number;
  /** Bedarf je Altersstufe: [0–5, 6–11, 12–17, ab 18]. */
  bedarf: [number, number, number, number];
  prozent: number;
  /** Bedarfskontrollbetrag; Gruppe 1 = Selbstbehalt (1.200 / 1.450). */
  bkb: number;
}

export const DT_2026: DtGruppe[] = [
  { nr: 1, von: 0, bis: 2100, bedarf: [486, 558, 653, 698], prozent: 100, bkb: 1450 },
  { nr: 2, von: 2101, bis: 2500, bedarf: [511, 586, 686, 733], prozent: 105, bkb: 1750 },
  { nr: 3, von: 2501, bis: 2900, bedarf: [535, 614, 719, 768], prozent: 110, bkb: 1850 },
  { nr: 4, von: 2901, bis: 3300, bedarf: [559, 642, 751, 803], prozent: 115, bkb: 1950 },
  { nr: 5, von: 3301, bis: 3700, bedarf: [584, 670, 784, 838], prozent: 120, bkb: 2050 },
  { nr: 6, von: 3701, bis: 4100, bedarf: [623, 715, 836, 894], prozent: 128, bkb: 2150 },
  { nr: 7, von: 4101, bis: 4500, bedarf: [661, 759, 889, 950], prozent: 136, bkb: 2250 },
  { nr: 8, von: 4501, bis: 4900, bedarf: [700, 804, 941, 1006], prozent: 144, bkb: 2350 },
  { nr: 9, von: 4901, bis: 5300, bedarf: [739, 849, 993, 1061], prozent: 152, bkb: 2450 },
  { nr: 10, von: 5301, bis: 5700, bedarf: [778, 893, 1045, 1117], prozent: 160, bkb: 2550 },
  { nr: 11, von: 5701, bis: 6400, bedarf: [817, 938, 1098, 1173], prozent: 168, bkb: 2850 },
  { nr: 12, von: 6401, bis: 7200, bedarf: [856, 983, 1150, 1229], prozent: 176, bkb: 3250 },
  { nr: 13, von: 7201, bis: 8200, bedarf: [895, 1027, 1202, 1285], prozent: 184, bkb: 3750 },
  { nr: 14, von: 8201, bis: 9700, bedarf: [934, 1072, 1254, 1341], prozent: 192, bkb: 4350 },
  { nr: 15, von: 9701, bis: 11200, bedarf: [972, 1116, 1306, 1396], prozent: 200, bkb: 5050 },
];

export const ALTERSSTUFEN = ["0–5 Jahre", "6–11 Jahre", "12–17 Jahre", "ab 18 Jahre"] as const;

export function altersstufe(alter: number): 0 | 1 | 2 | 3 {
  if (alter < 6) return 0;
  if (alter < 12) return 1;
  if (alter < 18) return 2;
  return 3;
}

/** Zahlbetrag nach Abzug des Kindergeldanteils (Anhang „Tabelle Zahlbeträge“). */
export function zahlbetrag(gruppe: DtGruppe, alter: number, kindergeld = KINDERGELD_2026): number {
  const stufe = altersstufe(alter);
  return gruppe.bedarf[stufe] - (stufe === 3 ? kindergeld : kindergeld / 2);
}

export function gruppeFuer(einkommen: number): DtGruppe {
  // 2.100,50 € liegt über „bis 2.100“ — deshalb ohne Rundung vergleichen.
  return DT_2026.find((g) => einkommen <= g.bis) ?? DT_2026[DT_2026.length - 1];
}

export interface KindErgebnis {
  alter: number;
  altersstufe: string;
  bedarf: number;
  kindergeldAnteil: number;
  zahlbetrag: number;
}

export interface UnterhaltErgebnis {
  einkommen: number;
  gruppeNachEinkommen: number;
  gruppe: number;
  herabgestuft: boolean;
  ueberTabelle: boolean;
  selbstbehalt: number;
  mangelfall: boolean;
  kinder: KindErgebnis[];
  summe: number;
  verbleibt: number;
}

export function berechneUnterhalt(opts: {
  einkommen: number;
  alter: number[];
  erwerbstaetig: boolean;
  bedarfskontrolle: boolean;
}): UnterhaltErgebnis {
  const einkommen = Math.max(0, opts.einkommen);
  const selbstbehalt = opts.erwerbstaetig ? SELBSTBEHALT.erwerbstaetig : SELBSTBEHALT.nichtErwerbstaetig;
  const start = gruppeFuer(einkommen);
  const summeIn = (g: DtGruppe) => opts.alter.reduce((s, a) => s + zahlbetrag(g, a), 0);

  let idx = start.nr - 1;
  if (opts.bedarfskontrolle) {
    while (idx > 0 && einkommen - summeIn(DT_2026[idx]) < DT_2026[idx].bkb) idx--;
  }
  // Anm. A I: zur Deckung des Mindestbedarfs ggf. bis in die unterste Gruppe herabstufen.
  while (idx > 0 && einkommen - summeIn(DT_2026[idx]) < selbstbehalt) idx--;
  const gruppe = DT_2026[idx];

  const voll = opts.alter.map((a) => {
    const stufe = altersstufe(a);
    const kg = stufe === 3 ? KINDERGELD_2026 : KINDERGELD_2026 / 2;
    return { alter: a, altersstufe: ALTERSSTUFEN[stufe], bedarf: gruppe.bedarf[stufe], kindergeldAnteil: kg, zahlbetrag: gruppe.bedarf[stufe] - kg };
  });
  const summeVoll = voll.reduce((s, k) => s + k.zahlbetrag, 0);
  const mangelfall = einkommen - summeVoll < selbstbehalt;

  // Anm. C: Verteilungsmasse im Verhältnis der Einsatzbeträge (Zahlbeträge).
  const kinder = mangelfall
    ? voll.map((k) => ({
        ...k,
        zahlbetrag: summeVoll > 0 ? Math.round(((k.zahlbetrag * Math.max(0, einkommen - selbstbehalt)) / summeVoll) * 100) / 100 : 0,
      }))
    : voll;
  const summe = kinder.reduce((s, k) => s + k.zahlbetrag, 0);

  return {
    einkommen,
    gruppeNachEinkommen: start.nr,
    gruppe: gruppe.nr,
    herabgestuft: gruppe.nr < start.nr,
    ueberTabelle: einkommen > DT_2026[DT_2026.length - 1].bis,
    selbstbehalt,
    mangelfall,
    kinder,
    summe,
    verbleibt: einkommen - summe,
  };
}
