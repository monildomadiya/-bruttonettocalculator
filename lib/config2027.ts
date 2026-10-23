/**
 * Zentrale Schalter und Statuszeilen für die Werte 2027/2028.
 *
 * Jede geplante Aktualisierung nach dem Start ist hier eine Ein-Zeilen-Änderung:
 *
 *   Wann                                   Änderung
 *   ─────────────────────────────────────  ──────────────────────────────────────
 *   nach jedem Verfahrensschritt           VERFAHRENSSCHRITT (→ LEGISLATION_STATUS) und
 *   (nächster: 2./3. Lesung im Bundestag)  lastUpdated der betroffenen Seiten in
 *                                          lib/pageDates.ts anheben
 *   bis 1.11.2026 (BMG-Bekanntgabe)        ZUSATZBEITRAG_DURCHSCHNITT_2027 in
 *                                          data/krankenkassen.ts setzen
 *   1.12.2026                              TABLE_TITLE_2027_FIRST = true
 *   BMF veröffentlicht den PAP 2027        Engine prüfen, dann LST_2027_OFFICIAL = true
 *   Bundesrat stimmt den SV-Rechengrößen   BBG_2027_STATUS anpassen
 *   2027 zu
 *   SV-Rechengrößen 2027 verkündet         BBG_2027_FINAL = true
 *
 * Die Zahlen selbst stehen weiter in der Engine (`lib/taxCalculator.ts`) —
 * hier stehen nur Status, Wortlaut und Schalter.
 */
import { ENTWURF, SV_RECHENGROESSEN_2027_ENTWURF } from "@/lib/taxCalculator";

/** Letzter Verfahrensschritt — nach der 2./3. Lesung hier anpassen. */
const VERFAHRENSSCHRITT = "Bundesrat-Stellungnahme am 16. Oktober, Anhörung im Finanzausschuss am 4. November 2026";

/**
 * Stand des Gesetzgebungsverfahrens zum Einkommensteuerreformgesetz 2027.
 * Wird auf jeder Seite gezeigt, die die Reform erwähnt.
 * Quelle: BT-Drucksache 21/8235 vom 28.09.2026, https://dserver.bundestag.de/btd/21/082/2108235.pdf
 */
export const LEGISLATION_STATUS = {
  drucksache: "BT-Drs. 21/8235",
  /** "2027 nach Regierungsentwurf (BT-Drs. 21/8235) · Bundesrat-Stellungnahme am 16. Oktober, Anhörung im Finanzausschuss am 4. November 2026" */
  short: `2027 nach Regierungsentwurf (BT-Drs. 21/8235) · ${VERFAHRENSSCHRITT}`,
  /** Nur der Verfahrensschritt, für Meta-Beschreibungen (dort ist Platz knapp). */
  schritt: VERFAHRENSSCHRITT,
  quelle: ENTWURF.quelle,
} as const;

/**
 * Beitragsbemessungsgrenzen 2027 endgültig? Solange `false`, steht unter jeder
 * BBG-Tabelle 2027 der Hinweis aus BBG_2027_STATUS. Quelle der Werte:
 * SV_RECHENGROESSEN_2027_ENTWURF (Referentenentwurf BMAS vom 21.09.2026,
 * Kabinettsbeschluss vom 07.10.2026 mit denselben Werten).
 */
export const BBG_2027_FINAL = false;

/**
 * Verfahrensstand der Sozialversicherungsrechengrößen-Verordnung 2027 — eine
 * Stelle für jeden Satz, der sagt, wie verbindlich die Grenzen 2027 sind.
 * Nach der Zustimmung des Bundesrats hier anpassen, nach der Verkündung
 * BBG_2027_FINAL = true setzen.
 * Quelle: BMAS-Pressemitteilung vom 07.10.2026.
 */
export const BBG_2027_STATUS = {
  /** Für Badges und Tabellenzellen. */
  kurz: "Kabinettsbeschluss 7.10.2026",
  /** Für Fließtext: „Die Grenzen sind …“ */
  satz: "von der Bundesregierung am 7. Oktober 2026 beschlossen; die Zustimmung des Bundesrats steht noch aus",
  /** Für Quellenangaben. */
  quelleName: "Bundeskabinett beschließt Sozialversicherungsrechengrößen 2027 (BMAS, 7.10.2026)",
  quelle: SV_RECHENGROESSEN_2027_ENTWURF.quelleKabinett,
  datum: SV_RECHENGROESSEN_2027_ENTWURF.kabinett,
} as const;

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
