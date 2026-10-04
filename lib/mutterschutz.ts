/**
 * Mutterschutzfristen und Mutterschaftsgeld (Stand: geltendes Recht,
 * gesetze-im-internet.de, abgerufen 04.10.2026).
 *
 * - § 3 Abs. 1 MuSchG: Schutzfrist 6 Wochen vor dem voraussichtlichen
 *   Entbindungstag (ärztliches Zeugnis).
 * - § 3 Abs. 2 MuSchG: 8 Wochen nach der Entbindung; 12 Wochen bei Früh- und
 *   Mehrlingsgeburten sowie (auf Antrag) bei ärztlich festgestellter
 *   Behinderung des Kindes vor Ablauf von 8 Wochen. Bei vorzeitiger Entbindung
 *   verlängert sich die Frist danach um die verkürzten Tage.
 * - § 3 Abs. 5 MuSchG: Fehlgeburt ab der 13./17./20. SSW → 2/6/8 Wochen.
 * - § 19 MuSchG / § 24i SGB V: Mutterschaftsgeld der Krankenkasse = kalender-
 *   tägliches Netto der letzten drei abgerechneten Kalendermonate, höchstens
 *   13 € je Kalendertag, für die Schutzfristen und den Entbindungstag. Ohne
 *   eigene gesetzliche Mitgliedschaft (privat, familienversichert): Bundesamt
 *   für Soziale Sicherung, insgesamt höchstens 210 €.
 * - § 20 MuSchG: Arbeitgeberzuschuss = kalendertägliches Netto − 13 €.
 */

export const MUTTERSCHAFTSGELD_MAX_TAG = 13;
export const MUTTERSCHAFTSGELD_BAS_MAX = 210;

const tag = 24 * 60 * 60 * 1000;
/** Kalendertage addieren (lokal, DST-sicher über Datumskomponenten). */
export const plusTage = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const tageZwischen = (a: Date, b: Date) =>
  Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / tag);

export interface Schutzfristen {
  beginn: Date;
  entbindung: Date;
  ende: Date;
  tageVor: number;
  tageNach: number;
  /** Schutzfrist vor + Entbindungstag + Schutzfrist nach = Tage mit Mutterschaftsgeld. */
  tageGesamt: number;
}

export function schutzfristen(entbindung: Date, zwoelfWochen: boolean): Schutzfristen {
  const beginn = plusTage(entbindung, -42);
  const wochenNach = zwoelfWochen ? 12 : 8;
  const ende = plusTage(entbindung, wochenNach * 7);
  const tageVor = tageZwischen(beginn, entbindung);
  const tageNach = wochenNach * 7;
  return { beginn, entbindung, ende, tageVor, tageNach, tageGesamt: tageVor + 1 + tageNach };
}

/** Schutzfrist nach einer Fehlgeburt (§ 3 Abs. 5 MuSchG); null vor der 13. SSW. */
export function schutzfristFehlgeburt(ssw: number): number | null {
  if (ssw >= 20) return 8;
  if (ssw >= 17) return 6;
  if (ssw >= 13) return 2;
  return null;
}

/** Kalendertage der drei vollen Kalendermonate vor dem Monat, in dem die Schutzfrist beginnt. */
export function tageBemessung(beginn: Date): number {
  const ersterDesMonats = new Date(beginn.getFullYear(), beginn.getMonth(), 1);
  return tageZwischen(new Date(beginn.getFullYear(), beginn.getMonth() - 3, 1), ersterDesMonats);
}

export interface Mutterschaftsgeld {
  netto3Monate: number;
  tageBemessung: number;
  nettoKalendertag: number;
  krankenkasse: number;
  arbeitgeber: number;
  gesamt: number;
  /** Netto, das ohne Mutterschutz in denselben Tagen verdient worden wäre. */
  tage: number;
}

export function mutterschaftsgeld(opts: {
  nettoMonat: number;
  fristen: Schutzfristen;
  gesetzlichVersichert: boolean;
}): Mutterschaftsgeld {
  const netto3Monate = Math.max(0, opts.nettoMonat) * 3;
  const tb = tageBemessung(opts.fristen.beginn);
  const nettoKalendertag = netto3Monate / tb;
  const tage = opts.fristen.tageGesamt;
  const kkTag = Math.min(MUTTERSCHAFTSGELD_MAX_TAG, nettoKalendertag);
  const krankenkasse = opts.gesetzlichVersichert ? kkTag * tage : Math.min(MUTTERSCHAFTSGELD_BAS_MAX, kkTag * tage);
  const arbeitgeber = Math.max(0, nettoKalendertag - MUTTERSCHAFTSGELD_MAX_TAG) * tage;
  return { netto3Monate, tageBemessung: tb, nettoKalendertag, krankenkasse, arbeitgeber, gesamt: krankenkasse + arbeitgeber, tage };
}
