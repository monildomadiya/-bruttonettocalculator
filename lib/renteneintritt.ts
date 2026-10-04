/**
 * Renteneintrittsalter und Rentenbeginn nach dem SGB VI (Stand: geltendes Recht,
 * gesetze-im-internet.de, abgerufen 04.10.2026).
 *
 * - Regelaltersrente: § 35 (67 ab Jahrgang 1964), Übergang § 235 Abs. 2.
 * - Langjährig Versicherte (35 Jahre): § 36 (67, vorzeitig ab 63), Übergang § 236.
 * - Besonders langjährig Versicherte (45 Jahre): § 38 (65), Übergang § 236b.
 * - Schwerbehinderte Menschen (35 Jahre, GdB ≥ 50): § 37 (65, vorzeitig ab 62),
 *   Übergang § 236a.
 * - Abschlag: § 77 Abs. 2 Nr. 2a — 0,3 % je Monat der vorzeitigen
 *   Inanspruchnahme; Zuschlag 0,5 % je Monat nach der Regelaltersgrenze (Nr. 2b).
 * - Rentenbeginn: § 99 Abs. 1 — ab dem Kalendermonat, zu dessen Beginn die
 *   Voraussetzungen erfüllt sind. Ein Lebensjahr ist mit Ablauf des Tages vor
 *   dem Geburtstag vollendet (§ 187 Abs. 2, § 188 Abs. 2 BGB): Wer am 1. eines
 *   Monats geboren ist, bekommt die Rente deshalb schon ab diesem Monat.
 *
 * Unterstützt Jahrgänge ab 1953. Für ältere Jahrgänge enthält § 236a für 1952
 * eine Staffel nach Geburtsmonaten, die hier nicht abgebildet ist — wer 1952
 * oder früher geboren ist, hat die Regelaltersgrenze ohnehin erreicht.
 * Sonderfälle (Altersteilzeit vor 2007, Anpassungsgeld Bergbau) sind nicht
 * abgebildet.
 */

export const RENTE_MIN_JAHRGANG = 1953;

/** Monate, um die die Altersgrenzen für den Jahrgang angehoben werden (§§ 235, 236a). */
function anhebungMonate(jahrgang: number): number {
  if (jahrgang < 1947) return 0;
  if (jahrgang <= 1957) return jahrgang - 1946; // 1947: 1 … 1957: 11
  if (jahrgang <= 1963) return 12 + 2 * (jahrgang - 1958); // 1958: 12 … 1963: 22
  return 24;
}

/** Anhebung der Altersgrenze 63 für besonders langjährig Versicherte (§ 236b Abs. 2). */
function anhebungBesondersLangjaehrig(jahrgang: number): number {
  if (jahrgang < 1953) return 0;
  return Math.min(24, 2 * (jahrgang - 1952)); // 1953: 2 … 1963: 22, ab 1964: 24
}

export interface Alter {
  jahre: number;
  monate: number;
}

const alterAus = (basisJahre: number, plusMonate: number): Alter => ({
  jahre: basisJahre + Math.floor(plusMonate / 12),
  monate: plusMonate % 12,
});

export function regelaltersgrenze(jahrgang: number): Alter {
  return alterAus(65, anhebungMonate(jahrgang));
}

/** Erster Tag des Monats, ab dem die Rente gezahlt wird, wenn ein Alter erreicht sein muss. */
export function rentenbeginn(geburt: Date, alter: Alter): Date {
  const y = geburt.getFullYear() + alter.jahre;
  const m = geburt.getMonth() + alter.monate; // 0-basiert, darf > 11 sein
  const zielMonatErsterTag = new Date(y, m, 1);
  const tageImZielmonat = new Date(zielMonatErsterTag.getFullYear(), zielMonatErsterTag.getMonth() + 1, 0).getDate();
  const tag = geburt.getDate();
  if (tag > tageImZielmonat) {
    // § 188 Abs. 3 BGB: fehlt der Tag im Zielmonat, endet die Frist mit dessen
    // letztem Tag — die Rente beginnt am Ersten des Folgemonats.
    return new Date(zielMonatErsterTag.getFullYear(), zielMonatErsterTag.getMonth() + 1, 1);
  }
  // Vollendet mit Ablauf des Vortags des "Jahrestags": Geburtstag am 1. →
  // Vortag liegt im Vormonat → Beginn am 1. des Zielmonats; sonst Folgemonat.
  if (tag === 1) return zielMonatErsterTag;
  return new Date(zielMonatErsterTag.getFullYear(), zielMonatErsterTag.getMonth() + 1, 1);
}

const monateZwischen = (a: Date, b: Date) => (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());

export interface Rentenart {
  key: "regel" | "langjaehrig" | "besondersLangjaehrig" | "schwerbehindert";
  name: string;
  voraussetzung: string;
  paragraph: string;
  /** Abschlagsfreie Altersgrenze und Rentenbeginn. */
  alterAbschlagsfrei: Alter;
  beginnAbschlagsfrei: Date;
  /** Frühestmöglicher Beginn (mit Abschlag); null, wenn es keinen vorzeitigen Bezug gibt. */
  alterFruehestens: Alter | null;
  beginnFruehestens: Date | null;
  abschlagMonate: number;
  abschlagPct: number;
}

export function rentenarten(geburt: Date): Rentenart[] {
  const jg = geburt.getFullYear();
  const ab1964 = jg >= 1964;
  const anh = anhebungMonate(jg);

  const rag = regelaltersgrenze(jg);
  const ragBeginn = rentenbeginn(geburt, rag);

  const mk = (
    key: Rentenart["key"],
    name: string,
    voraussetzung: string,
    paragraph: string,
    abschlagsfrei: Alter,
    fruehestens: Alter | null,
  ): Rentenart => {
    const beginnAbschlagsfrei = rentenbeginn(geburt, abschlagsfrei);
    const beginnFruehestens = fruehestens ? rentenbeginn(geburt, fruehestens) : null;
    const abschlagMonate = beginnFruehestens ? Math.max(0, monateZwischen(beginnFruehestens, beginnAbschlagsfrei)) : 0;
    return {
      key, name, voraussetzung, paragraph,
      alterAbschlagsfrei: abschlagsfrei, beginnAbschlagsfrei,
      alterFruehestens: fruehestens, beginnFruehestens,
      abschlagMonate, abschlagPct: Math.round(abschlagMonate * 0.3 * 10) / 10,
    };
  };

  return [
    {
      ...mk("regel", "Regelaltersrente", "mindestens 5 Jahre Versicherungszeit", ab1964 ? "§ 35 SGB VI" : "§ 235 SGB VI", rag, null),
      beginnAbschlagsfrei: ragBeginn,
    },
    mk("langjaehrig", "Rente für langjährig Versicherte", "35 Jahre Wartezeit", ab1964 ? "§ 36 SGB VI" : "§ 236 SGB VI", rag, { jahre: 63, monate: 0 }),
    mk(
      "besondersLangjaehrig",
      "Rente für besonders langjährig Versicherte",
      "45 Jahre Wartezeit",
      ab1964 ? "§ 38 SGB VI" : "§ 236b SGB VI",
      alterAus(63, anhebungBesondersLangjaehrig(jg)),
      null,
    ),
    mk(
      "schwerbehindert",
      "Rente für schwerbehinderte Menschen",
      "35 Jahre Wartezeit und GdB ab 50",
      ab1964 ? "§ 37 SGB VI" : "§ 236a SGB VI",
      alterAus(63, anh),
      alterAus(60, anh),
    ),
  ];
}

/** Zuschlag bei späterem Rentenbeginn nach der Regelaltersgrenze (§ 77 Abs. 2 Nr. 2b). */
export const ZUSCHLAG_PRO_MONAT_PCT = 0.5;
export const ABSCHLAG_PRO_MONAT_PCT = 0.3;

export const formatAlter = (a: Alter) =>
  a.monate === 0 ? `${a.jahre} Jahre` : `${a.jahre} Jahre und ${a.monate} ${a.monate === 1 ? "Monat" : "Monate"}`;

/** Für „mit … Jahren und … Monaten“. */
export const formatAlterDativ = (a: Alter) =>
  a.monate === 0 ? `${a.jahre} Jahren` : `${a.jahre} Jahren und ${a.monate} ${a.monate === 1 ? "Monat" : "Monaten"}`;

export const formatDatum = (d: Date) =>
  d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

export const formatMonatJahr = (d: Date) => d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
