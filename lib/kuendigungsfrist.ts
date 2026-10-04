/**
 * Kündigungsfristen im Arbeitsverhältnis (Stand: geltendes Recht,
 * gesetze-im-internet.de, abgerufen 04.10.2026).
 *
 * - § 622 Abs. 1 BGB: Grundkündigungsfrist 4 Wochen zum 15. oder zum
 *   Monatsende — gilt für Arbeitnehmer immer (sofern nichts Längeres vereinbart).
 * - § 622 Abs. 2 BGB: Kündigung durch den Arbeitgeber nach Betriebszugehörigkeit
 *   2/5/8/10/12/15/20 Jahre → 1/2/3/4/5/6/7 Monate zum Monatsende.
 * - § 622 Abs. 3 BGB: Probezeit (höchstens 6 Monate): 2 Wochen, ohne Termin.
 * - Fristberechnung §§ 187 Abs. 1, 188 Abs. 2 und 3 BGB: Der Zugangstag zählt
 *   nicht; eine Wochenfrist endet am gleichen Wochentag, eine Monatsfrist am
 *   Tag gleicher Zahl (fehlt er, am Monatsletzten).
 * - § 623 BGB: Schriftform, elektronische Form ausgeschlossen.
 * - § 4 KSchG: Klage innerhalb von drei Wochen nach Zugang.
 */

export type Termin = "15oderMonatsende" | "monatsende" | "quartalsende" | "keiner";
export interface Frist {
  wochen?: number;
  monate?: number;
  termin: Termin;
}

const letzterDesMonats = (y: number, m: number) => new Date(y, m + 1, 0);

/** Datum + n Monate nach § 188 Abs. 2/3 BGB (Tag gleicher Zahl, sonst Monatsletzter). */
export function plusMonate(d: Date, n: number): Date {
  const ziel = letzterDesMonats(d.getFullYear(), d.getMonth() + n);
  return new Date(ziel.getFullYear(), ziel.getMonth(), Math.min(d.getDate(), ziel.getDate()));
}

/** Letzter Tag des Arbeitsverhältnisses bei Zugang an `zugang`. */
export function fristEnde(zugang: Date, frist: Frist): Date {
  const frueh = frist.monate
    ? plusMonate(zugang, frist.monate)
    : new Date(zugang.getFullYear(), zugang.getMonth(), zugang.getDate() + 7 * (frist.wochen ?? 0));
  const y = frueh.getFullYear();
  const m = frueh.getMonth();
  switch (frist.termin) {
    case "keiner":
      return frueh;
    case "monatsende":
      return letzterDesMonats(y, m);
    case "quartalsende":
      return letzterDesMonats(y, Math.floor(m / 3) * 3 + 2);
    case "15oderMonatsende":
      return frueh.getDate() <= 15 ? new Date(y, m, 15) : letzterDesMonats(y, m);
  }
}

/** Spätester Zugang, damit das Arbeitsverhältnis spätestens am `ende` endet. */
export function spaetesterZugang(ende: Date, frist: Frist): Date {
  let d = new Date(ende.getFullYear(), ende.getMonth(), ende.getDate());
  for (let i = 0; i < 800; i++) {
    if (fristEnde(d, frist) <= ende) return d;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  }
  return d;
}

/** Volle Jahre und Monate zwischen Beginn und Zugang. */
export function betriebszugehoerigkeit(beginn: Date, zugang: Date): { jahre: number; monate: number } {
  let monate = (zugang.getFullYear() - beginn.getFullYear()) * 12 + (zugang.getMonth() - beginn.getMonth());
  if (zugang.getDate() < beginn.getDate()) monate -= 1;
  monate = Math.max(0, monate);
  return { jahre: Math.floor(monate / 12), monate: monate % 12 };
}

export const STAFFEL_AG = [
  { jahre: 20, monate: 7 },
  { jahre: 15, monate: 6 },
  { jahre: 12, monate: 5 },
  { jahre: 10, monate: 4 },
  { jahre: 8, monate: 3 },
  { jahre: 5, monate: 2 },
  { jahre: 2, monate: 1 },
] as const;

export interface GesetzlicheFrist {
  frist: Frist;
  text: string;
  paragraph: string;
}

export function gesetzlicheFrist(opts: {
  arbeitgeberKuendigt: boolean;
  beginn: Date;
  zugang: Date;
  probezeit: boolean;
}): GesetzlicheFrist {
  // Probezeit höchstens sechs Monate — maßgeblich ist der Zugang innerhalb dieser Zeit.
  if (opts.probezeit && opts.zugang < plusMonate(opts.beginn, 6)) {
    return { frist: { wochen: 2, termin: "keiner" }, text: "2 Wochen (Probezeit)", paragraph: "§ 622 Abs. 3 BGB" };
  }
  if (opts.arbeitgeberKuendigt) {
    const { jahre } = betriebszugehoerigkeit(opts.beginn, opts.zugang);
    const stufe = STAFFEL_AG.find((s) => jahre >= s.jahre);
    if (stufe) {
      return {
        frist: { monate: stufe.monate, termin: "monatsende" },
        text: `${stufe.monate} ${stufe.monate === 1 ? "Monat" : "Monate"} zum Monatsende`,
        paragraph: "§ 622 Abs. 2 BGB",
      };
    }
  }
  return { frist: { wochen: 4, termin: "15oderMonatsende" }, text: "4 Wochen zum 15. oder zum Monatsende", paragraph: "§ 622 Abs. 1 BGB" };
}

export const formatDatumLang = (d: Date) =>
  d.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
