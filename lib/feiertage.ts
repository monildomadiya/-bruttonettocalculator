/**
 * Gesetzliche Feiertage in Deutschland nach Bundesland, Brückentage und
 * Arbeitstage.
 *
 * Bundesweit: Neujahr, Karfreitag, Ostermontag, 1. Mai, Christi Himmelfahrt,
 * Pfingstmontag, Tag der Deutschen Einheit, 1. und 2. Weihnachtstag.
 * Landesrecht (Feiertagsgesetze der Länder, Stand Oktober 2026, für 2027 keine
 * Änderung beschlossen):
 * - Heilige Drei Könige (6.1.): BW, BY, ST
 * - Internationaler Frauentag (8.3.): BE, MV
 * - Ostersonntag, Pfingstsonntag: BB (fallen ohnehin auf Sonntag)
 * - Fronleichnam: BW, BY, HE, NW, RP, SL; in SN und TH nur in einzelnen Gemeinden
 * - Mariä Himmelfahrt (15.8.): SL; in BY nur in überwiegend katholischen Gemeinden
 * - Augsburger Friedensfest (8.8.): nur Stadt Augsburg
 * - Weltkindertag (20.9.): TH
 * - Reformationstag (31.10.): BB, HB, HH, MV, NI, SN, ST, SH, TH
 * - Allerheiligen (1.11.): BW, BY, NW, RP, SL
 * - Buß- und Bettag (Mittwoch vor dem 23.11.): SN
 *
 * Alle Daten als UTC-Tageszahl, damit Zeitzonen und Sommerzeit keine Rolle spielen.
 */

export type Land =
  | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV"
  | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH";

export const LAENDER: { code: Land; name: string }[] = [
  { code: "BW", name: "Baden-Württemberg" }, { code: "BY", name: "Bayern" }, { code: "BE", name: "Berlin" },
  { code: "BB", name: "Brandenburg" }, { code: "HB", name: "Bremen" }, { code: "HH", name: "Hamburg" },
  { code: "HE", name: "Hessen" }, { code: "MV", name: "Mecklenburg-Vorpommern" }, { code: "NI", name: "Niedersachsen" },
  { code: "NW", name: "Nordrhein-Westfalen" }, { code: "RP", name: "Rheinland-Pfalz" }, { code: "SL", name: "Saarland" },
  { code: "SN", name: "Sachsen" }, { code: "ST", name: "Sachsen-Anhalt" }, { code: "SH", name: "Schleswig-Holstein" },
  { code: "TH", name: "Thüringen" },
];

const TAG = 86400000;
/** Tageszahl (Tage seit 1.1.1970, UTC). */
export const tag = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / TAG;
export const datum = (t: number) => new Date(t * TAG);
/** 0 = Sonntag … 6 = Samstag */
export const wochentag = (t: number) => datum(t).getUTCDay();
export const WT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
export const WT_LANG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
export const fmt = (t: number, jahr = true) => {
  const d = datum(t);
  const s = `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.`;
  return jahr ? `${s}${d.getUTCFullYear()}` : s;
};

/** Ostersonntag nach der Gaußschen Osterformel (anonymer gregorianischer Algorithmus). */
export function ostersonntag(y: number): number {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31), tagImMonat = ((h + l - 7 * m + 114) % 31) + 1;
  return tag(y, monat, tagImMonat);
}

export interface Feiertag {
  t: number;
  name: string;
  /** Gilt nur in Teilen des Landes. */
  regional?: string;
}

type Regel = { name: string; t: (y: number) => number; laender: Land[] | "alle"; regional?: Partial<Record<Land, string>> };

const REGELN: Regel[] = [
  { name: "Neujahr", t: (y) => tag(y, 1, 1), laender: "alle" },
  { name: "Heilige Drei Könige", t: (y) => tag(y, 1, 6), laender: ["BW", "BY", "ST"] },
  { name: "Internationaler Frauentag", t: (y) => tag(y, 3, 8), laender: ["BE", "MV"] },
  { name: "Karfreitag", t: (y) => ostersonntag(y) - 2, laender: "alle" },
  { name: "Ostersonntag", t: (y) => ostersonntag(y), laender: ["BB"] },
  { name: "Ostermontag", t: (y) => ostersonntag(y) + 1, laender: "alle" },
  { name: "Tag der Arbeit", t: (y) => tag(y, 5, 1), laender: "alle" },
  { name: "Christi Himmelfahrt", t: (y) => ostersonntag(y) + 39, laender: "alle" },
  { name: "Pfingstsonntag", t: (y) => ostersonntag(y) + 49, laender: ["BB"] },
  { name: "Pfingstmontag", t: (y) => ostersonntag(y) + 50, laender: "alle" },
  {
    name: "Fronleichnam", t: (y) => ostersonntag(y) + 60, laender: ["BW", "BY", "HE", "NW", "RP", "SL", "SN", "TH"],
    regional: { SN: "nur in einzelnen Gemeinden der Oberlausitz", TH: "nur in Gemeinden des Eichsfelds und der Rhön" },
  },
  { name: "Augsburger Friedensfest", t: (y) => tag(y, 8, 8), laender: ["BY"], regional: { BY: "nur Stadt Augsburg" } },
  { name: "Mariä Himmelfahrt", t: (y) => tag(y, 8, 15), laender: ["SL", "BY"], regional: { BY: "nur in überwiegend katholischen Gemeinden" } },
  { name: "Weltkindertag", t: (y) => tag(y, 9, 20), laender: ["TH"] },
  { name: "Tag der Deutschen Einheit", t: (y) => tag(y, 10, 3), laender: "alle" },
  { name: "Reformationstag", t: (y) => tag(y, 10, 31), laender: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"] },
  { name: "Allerheiligen", t: (y) => tag(y, 11, 1), laender: ["BW", "BY", "NW", "RP", "SL"] },
  {
    // Mittwoch vor dem 23. November = letzter Mittwoch vor dem Totensonntag.
    name: "Buß- und Bettag", laender: ["SN"],
    t: (y) => { const t23 = tag(y, 11, 23); return t23 - (((wochentag(t23) - 3 + 7) % 7) || 7); },
  },
  { name: "1. Weihnachtstag", t: (y) => tag(y, 12, 25), laender: "alle" },
  { name: "2. Weihnachtstag", t: (y) => tag(y, 12, 26), laender: "alle" },
];

/** Feiertage eines Jahres; `regional` schließt Feiertage ein, die nur in Teilen des Landes gelten. */
export function feiertage(jahr: number, land: Land, regional = false): Feiertag[] {
  return REGELN.filter((r) => r.laender === "alle" || r.laender.includes(land))
    .map((r) => ({ t: r.t(jahr), name: r.name, regional: r.regional?.[land] }))
    .filter((f) => regional || !f.regional)
    .sort((a, b) => a.t - b.t);
}

export const istWochenende = (t: number) => wochentag(t) === 0 || wochentag(t) === 6;

/** Arbeitstage Montag bis Freitag ohne Feiertage. */
export function arbeitstage(jahr: number, land: Land, regional = false): number {
  const frei = new Set(feiertage(jahr, land, regional).map((f) => f.t));
  let n = 0;
  for (let t = tag(jahr, 1, 1); t <= tag(jahr, 12, 31); t++) if (!istWochenende(t) && !frei.has(t)) n++;
  return n;
}

export interface Block {
  /** Erster und letzter freier Tag am Stück. */
  von: number;
  bis: number;
  /** Zu nehmende Urlaubstage (Arbeitstage im Block). */
  urlaub: number[];
  freieTage: number;
  feiertage: string[];
}

/**
 * Alle sinnvollen Urlaubsblöcke eines Jahres: zusammenhängende Arbeitstage, die
 * man frei nimmt, verlängert um die angrenzenden Wochenenden und Feiertage.
 * Ein Block zählt nur, wenn alle Urlaubstage im Jahr liegen. Für jeden freien
 * Zeitraum bleibt die Variante mit den wenigsten Urlaubstagen.
 */
export function bloecke(jahr: number, land: Land, regional = false, maxUrlaub = 10): Block[] {
  const start = tag(jahr, 1, 1) - 14;
  const ende = tag(jahr, 12, 31) + 14;
  const ft = new Map<number, string>();
  for (const y of [jahr - 1, jahr, jahr + 1]) for (const f of feiertage(y, land, regional)) ft.set(f.t, f.name);
  const frei = (t: number) => istWochenende(t) || ft.has(t);
  const imJahr = (t: number) => t >= tag(jahr, 1, 1) && t <= tag(jahr, 12, 31);

  const best = new Map<string, Block>();
  for (let s = start; s <= ende; s++) {
    if (frei(s) || !imJahr(s)) continue;
    const urlaub: number[] = [];
    for (let e = s; e <= ende && e - s < 21; e++) {
      if (!frei(e)) {
        if (!imJahr(e)) break;
        urlaub.push(e);
        if (urlaub.length > maxUrlaub) break;
      } else continue;
      let von = s;
      while (frei(von - 1) && von - 1 >= start) von--;
      let bis = e;
      while (frei(bis + 1) && bis + 1 <= ende) bis++;
      const key = `${von}-${bis}`;
      const alt = best.get(key);
      if (!alt || alt.urlaub.length > urlaub.length) {
        const namen: string[] = [];
        for (let t = von; t <= bis; t++) if (ft.has(t) && !istWochenende(t)) namen.push(ft.get(t) as string);
        best.set(key, { von, bis, urlaub: [...urlaub], freieTage: bis - von + 1, feiertage: namen });
      }
    }
  }
  return [...best.values()];
}

export interface BrueckenOption extends Block {
  /** Erster Feiertag unter der Woche im Block — Gruppierungsschlüssel. */
  anlass: string;
}

/**
 * Die besten Brückentag-Angebote je Feiertag: Für jede Anzahl Urlaubstage die
 * Variante mit den meisten freien Tagen am Stück; gezeigt werden nur echte
 * Sprünge (mindestens zwei freie Tage mehr als die nächstkleinere gezeigte
 * Variante), mindestens 4 freie Tage und mindestens doppelt so viele freie
 * Tage wie Urlaubstage — höchstens vier Varianten je Feiertag.
 */
export function brueckentage(jahr: number, land: Land, regional = false, maxUrlaub = 9): BrueckenOption[] {
  const ft = new Map<number, string>();
  for (const f of feiertage(jahr, land, regional)) ft.set(f.t, f.name);
  const gruppen = new Map<number, Map<number, Block>>();
  for (const b of bloecke(jahr, land, regional, maxUrlaub)) {
    let anker = -1;
    for (let t = b.von; t <= b.bis; t++) if (ft.has(t) && !istWochenende(t)) { anker = t; break; }
    if (anker < 0) continue;
    const g = gruppen.get(anker) ?? new Map<number, Block>();
    const k = b.urlaub.length;
    const alt = g.get(k);
    if (!alt || b.freieTage > alt.freieTage || (b.freieTage === alt.freieTage && b.von < alt.von)) g.set(k, b);
    gruppen.set(anker, g);
  }
  const out: BrueckenOption[] = [];
  for (const [anker, g] of [...gruppen.entries()].sort((x, y) => x[0] - y[0])) {
    let letzte = 0;
    for (const k of [...g.keys()].sort((x, y) => x - y)) {
      const b = g.get(k) as Block;
      if (b.freieTage < 4 || b.freieTage / k < 2 || b.freieTage < letzte + 2) continue;
      if (out.filter((o) => o.anlass === ft.get(anker)).length >= 4) break;
      // Gleiche freie Zeit wie eine schon gezeigte Variante eines früheren Feiertags (z. B. Ostern) nicht doppelt zeigen.
      if (out.some((o) => o.von === b.von && o.bis === b.bis)) continue;
      out.push({ ...b, anlass: ft.get(anker) as string });
      letzte = b.freieTage;
    }
  }
  return out;
}

/**
 * Urlaubsplaner: wählt sich nicht berührende Blöcke so, dass mit höchstens
 * `budget` Urlaubstagen möglichst viele freie Tage in echten Auszeiten entstehen
 * (gewichtete Intervallauswahl mit Budget, dynamische Programmierung).
 * Kandidaten sind Brückentag-Blöcke (mit Feiertag unter der Woche, ab 4 freien
 * Tagen) und ganze Urlaubswochen ohne Feiertag (ab 9 freien Tagen). Sonst
 * „gewinnt“ das Aneinanderreihen verlängerter Wochenenden ohne Feiertag, denn
 * die Summe aller freien Tage im Jahr ist ohnehin fest.
 */
export function planen(jahr: number, land: Land, budget: number, regional = false): { bloecke: Block[]; urlaub: number; frei: number } {
  const kand = bloecke(jahr, land, regional, Math.min(budget, 10))
    .filter((b) => b.urlaub.length <= budget && (b.feiertage.length > 0 ? b.freieTage >= 4 : b.freieTage >= 9))
    .sort((a, b) => a.bis - b.bis);
  const n = kand.length;
  // p[i]: letzter Block j < i, der mindestens einen Tag Abstand zu Block i hat.
  const p = kand.map((b, i) => { let j = i - 1; while (j >= 0 && kand[j].bis >= b.von - 1) j--; return j; });
  const B = budget;
  const dp: Float64Array[] = Array.from({ length: n + 1 }, () => new Float64Array(B + 1));
  for (let i = 1; i <= n; i++) {
    const b = kand[i - 1];
    const u = b.urlaub.length;
    for (let k = 0; k <= B; k++) {
      let v = dp[i - 1][k];
      // Wert: freie Tage, mit einem Hauch Vorrang für weniger Urlaub bei Gleichstand.
      if (u <= k) v = Math.max(v, dp[p[i - 1] + 1][k - u] + b.freieTage - u * 1e-6);
      dp[i][k] = v;
    }
  }
  const gewaehlt: Block[] = [];
  let i = n, k = B;
  while (i > 0) {
    const b = kand[i - 1];
    const u = b.urlaub.length;
    if (u <= k && Math.abs(dp[i][k] - (dp[p[i - 1] + 1][k - u] + b.freieTage - u * 1e-6)) < 1e-9 && dp[i][k] !== dp[i - 1][k]) {
      gewaehlt.push(b);
      k -= u;
      i = p[i - 1] + 1;
    } else i--;
  }
  gewaehlt.reverse();
  return { bloecke: gewaehlt, urlaub: gewaehlt.reduce((s, b) => s + b.urlaub.length, 0), frei: gewaehlt.reduce((s, b) => s + b.freieTage, 0) };
}
