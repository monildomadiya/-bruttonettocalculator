/**
 * Grundsicherungsgeld (bis 30.06.2026: Bürgergeld), SGB II — FAQ-Quelle für
 * den Rechner (Client) und das FAQ-Schema der Seite (Server).
 *
 * Geprüft am 25.10.2026 im Gesetzestext (gesetze-im-internet.de):
 *  - § 19 Abs. 1: "Erwerbsfähige Leistungsberechtigte erhalten
 *    Grundsicherungsgeld." 13. SGB-II-ÄndG, BGBl. 2026 I Nr. 107 (verkündet
 *    22.04.2026), Kern ab 1.7.2026.
 *  - § 11b Abs. 2, 3: Freibeträge auf Erwerbseinkommen unverändert (100 €,
 *    20 % bis 520 €, 30 % bis 1.000 €, 10 % bis 1.200/1.500 €).
 *  - § 12 Abs. 2: Vermögensfreibetrag je Person nach Alter 5.000 / 10.000 /
 *    12.500 / 20.000 € (bis zur Vollendung des 30. Lebensjahres / ab dem 31. / 41. / 51. Lebensjahr, d. h. ab dem 30. / 40. / 50. Geburtstag).
 *  - § 22 Abs. 1 Sätze 2–4: Karenzzeit Unterkunft ein Jahr, tatsächliche
 *    Kosten, aber nicht über dem 1,5-Fachen der Angemessenheitsgrenze.
 * Regelsatz 2027: Stand 25.10.2026 nicht festgelegt (Haushaltsbegleitgesetz
 * 2027 ändert die Fortschreibung; Prognosen u. a. IW Köln: erneut 563 €).
 */

export const GRUNDSICHERUNGSGELD = {
  umbenanntAb: "1. Juli 2026",
  bgbl: "BGBl. 2026 I Nr. 107",
  bgblUrl: "https://www.recht.bund.de/bgbl/1/2026/107/VO.html",
  regelsatz: { single: 563, partner: 506, adult18plus: 451, child14_17: 471, child6_13: 390, child0_5: 357 },
  vermoegen: [
    { label: "unter 30 Jahren", betrag: 5000 },
    { label: "30 bis 39 Jahre", betrag: 10000 },
    { label: "40 bis 49 Jahre", betrag: 12500 },
    { label: "ab 50 Jahren", betrag: 20000 },
  ],
} as const;

const eur = (n: number) => n.toLocaleString("de-DE") + " €";
const R = GRUNDSICHERUNGSGELD.regelsatz;
const vermoegenText = GRUNDSICHERUNGSGELD.vermoegen.map((v) => `${eur(v.betrag)} (${v.label})`).join(", ");

export const GRUNDSICHERUNGSGELD_FAQS = [
  {
    q: "Heißt das Bürgergeld jetzt Grundsicherungsgeld?",
    a: `Ja. Seit dem ${GRUNDSICHERUNGSGELD.umbenanntAb} heißt die Leistung nach dem SGB II Grundsicherungsgeld (13. Gesetz zur Änderung des SGB II, ${GRUNDSICHERUNGSGELD.bgbl}). Wer schon Bürgergeld bezog, muss deshalb keinen neuen Antrag stellen. Regelsätze und Freibeträge auf Erwerbseinkommen sind gleich geblieben; geändert haben sich vor allem die Regeln für Vermögen und Pflichtverletzungen.`,
  },
  {
    q: "Wie hoch ist der Regelsatz 2026?",
    a: `${eur(R.single)} im Monat für Alleinstehende, je ${eur(R.partner)} für Partner in einer Bedarfsgemeinschaft und für Kinder je nach Alter ${eur(R.child0_5)} (0–5 Jahre), ${eur(R.child6_13)} (6–13) bzw. ${eur(R.child14_17)} (14–17). Hinzu kommen die angemessenen Kosten für Unterkunft und Heizung. Die Beträge gelten unverändert seit 2024.`,
  },
  {
    q: "Steigt der Regelsatz 2027?",
    a: `Das ist noch nicht festgelegt (Stand 25. Oktober 2026). Der Entwurf des Haushaltsbegleitgesetzes 2027 ändert, wie die Regelsätze fortgeschrieben werden; mehrere Prognosen, darunter vom Institut der deutschen Wirtschaft, erwarten erneut ${eur(R.single)}, also die dritte Nullrunde in Folge. Sobald der Wert amtlich ist, rechnen wir ihn hier ein.`,
  },
  {
    q: "Wird mein Einkommen angerechnet?",
    a: "Ja, Erwerbseinkommen wird angerechnet, aber mit Freibeträgen (§ 11b SGB II): Die ersten 100 € bleiben frei, vom Teil bis 520 € 20 %, bis 1.000 € 30 % und darüber bis 1.200 € (mit minderjährigem Kind 1.500 €) 10 %. Nur der Rest mindert den Anspruch. Diese Freibeträge hat die Reform nicht geändert.",
  },
  {
    q: "Wie viel Vermögen darf ich haben?",
    a: `Für Anträge seit dem ${GRUNDSICHERUNGSGELD.umbenanntAb} gilt je Person ein Freibetrag nach Alter: ${vermoegenText} (§ 12 SGB II). Die frühere Karenzzeit mit 40.000 € Schonvermögen gibt es für neue Anträge nicht mehr. Ein angemessenes selbstgenutztes Eigenheim bleibt geschützt.`,
  },
  {
    q: "Welche Wohnkosten übernimmt das Jobcenter?",
    a: "Die tatsächlichen Kosten für Unterkunft und Heizung, soweit sie angemessen sind; die Grenzen legt jede Kommune nach Haushaltsgröße und Wohnort fest. Im ersten Jahr des Bezugs (Karenzzeit) werden die tatsächlichen Wohnkosten anerkannt, aber nicht über dem Eineinhalbfachen der Angemessenheitsgrenze (§ 22 Abs. 1 SGB II).",
  },
  {
    q: "Ist dieser Rechner verbindlich?",
    a: "Nein. Er liefert eine Orientierung auf Basis der Regelsätze 2026 und der Einkommensfreibeträge. Den tatsächlichen Anspruch stellt das Jobcenter fest; Mehrbedarfe (etwa für Alleinerziehende oder Schwangere), Vermögen und örtliche Wohnkostengrenzen können ihn verändern.",
  },
];
