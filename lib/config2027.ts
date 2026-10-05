/**
 * Zentrale Schalter und Statuszeilen für die Werte 2027/2028.
 *
 * Jede geplante Aktualisierung nach dem Start ist hier eine Ein-Zeilen-Änderung:
 *
 *   Wann                                   Änderung
 *   ─────────────────────────────────────  ──────────────────────────────────────
 *   nach der 1. Lesung (8.10.2026)         VERFAHRENSSCHRITT (→ LEGISLATION_STATUS) und
 *                                          lastUpdated der betroffenen Seiten in
 *                                          lib/pageDates.ts anheben
 *   bis 1.11.2026 (BMG-Bekanntgabe)        ZUSATZBEITRAG_DURCHSCHNITT_2027 in
 *                                          data/krankenkassen.ts setzen
 *   1.12.2026                              TABLE_TITLE_2027_FIRST = true
 *   BMF veröffentlicht den PAP 2027        Engine prüfen, dann LST_2027_OFFICIAL = true
 *   SV-Rechengrößen 2027 verkündet         BBG_2027_FINAL = true
 *
 * Die Zahlen selbst stehen weiter in der Engine (`lib/taxCalculator.ts`) —
 * hier stehen nur Status, Wortlaut und Schalter.
 */
import { ENTWURF } from "@/lib/taxCalculator";

/** Letzter bzw. nächster Verfahrensschritt — nach der 1. Lesung hier anpassen. */
const VERFAHRENSSCHRITT = "1. Lesung im Bundestag: 8. Oktober 2026";

/**
 * Stand des Gesetzgebungsverfahrens zum Einkommensteuerreformgesetz 2027.
 * Wird auf jeder Seite gezeigt, die die Reform erwähnt.
 * Quelle: BT-Drucksache 21/8235 vom 28.09.2026, https://dserver.bundestag.de/btd/21/082/2108235.pdf
 */
export const LEGISLATION_STATUS = {
  drucksache: "BT-Drs. 21/8235",
  /** "2027 nach Regierungsentwurf (BT-Drs. 21/8235) · 1. Lesung im Bundestag: 8. Oktober 2026" */
  short: `2027 nach Regierungsentwurf (BT-Drs. 21/8235) · ${VERFAHRENSSCHRITT}`,
  /** Nur der Verfahrensschritt, für Meta-Beschreibungen (dort ist Platz knapp). */
  schritt: VERFAHRENSSCHRITT,
  quelle: ENTWURF.quelle,
} as const;

/**
 * Beitragsbemessungsgrenzen 2027 endgültig? Solange `false`, steht unter jeder
 * BBG-Tabelle 2027 der Entwurfshinweis. Quelle der Werte:
 * SV_RECHENGROESSEN_2027_ENTWURF (Referentenentwurf BMAS vom 21.09.2026).
 */
export const BBG_2027_FINAL = false;

/**
 * Hat das BMF den amtlichen Programmablaufplan 2027 veröffentlicht? Solange
 * `false`, ist die Lohnsteuertabelle 2027 als „vorläufig“ gekennzeichnet
 * (Titel, H1, Hinweis).
 */
export const LST_2027_OFFICIAL = false;

/**
 * Brutto-Netto-Tabelle: 2027 zuerst im Titel (ab Dezember 2026, wenn die
 * Suchen nach 2027 die nach 2026 überholen).
 */
export const TABLE_TITLE_2027_FIRST = false;

/**
 * Gesetzlicher Mindestlohn je Stunde.
 * 2026: 13,90 €, 2027: 14,60 € — Beschluss der Mindestlohnkommission vom
 * 27.06.2025, per Verordnung der Bundesregierung verbindlich gemacht.
 * https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html
 */
export const MINDESTLOHN = { 2026: 13.9, 2027: 14.6 } as const;

/**
 * Minijob-Grenze (Geringfügigkeitsgrenze), § 8 Abs. 1a SGB IV:
 * Mindestlohn × 130 ÷ 3, auf volle Euro aufgerundet → 603 € (2026), 633 € (2027).
 */
export const MINIJOB_GRENZE = {
  2026: Math.ceil((MINDESTLOHN[2026] * 130) / 3),
  2027: Math.ceil((MINDESTLOHN[2027] * 130) / 3),
} as const;
