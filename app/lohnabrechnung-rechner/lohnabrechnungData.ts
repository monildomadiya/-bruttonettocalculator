/**
 * Lohnabrechnung-Rechner — FAQ und Positionsliste. Eine Quelle für Anzeige
 * (auch im "use client"-Rechner) und FAQ-Schema.
 */

export const LOHNABRECHNUNG_FAQS = [
  {
    q: "Wie lese ich meine Lohnabrechnung?",
    a: "Von oben nach unten: Zuerst stehen die Bezüge (Gehalt, Zulagen, Sachbezüge) und daraus das Gesamtbrutto. Darunter folgen Steuerbrutto und SV-Brutto als Bemessungsgrundlagen, dann die gesetzlichen Abzüge — Lohnsteuer, Solidaritätszuschlag, Kirchensteuer sowie die Arbeitnehmeranteile zur Kranken-, Pflege-, Renten- und Arbeitslosenversicherung. Übrig bleibt das Nettoentgelt; nach weiteren Abzügen wie vermögenswirksamen Leistungen folgt der Auszahlungsbetrag.",
  },
  {
    q: "Was ist der Unterschied zwischen Gesamtbrutto, Steuerbrutto und SV-Brutto?",
    a: "Das Gesamtbrutto umfasst alle Bezüge des Monats. Das Steuerbrutto ist der Teil, auf den Lohnsteuer anfällt — steuerfreie Bezüge wie bestimmte Zuschläge fehlen darin. Das SV-Brutto ist die Grundlage der Sozialversicherungsbeiträge; es ist durch die Beitragsbemessungsgrenzen gedeckelt und im Midijob-Übergangsbereich reduziert. Bei einem einfachen Gehalt ohne Besonderheiten sind alle drei gleich.",
  },
  {
    q: "Was bedeutet der Beitragsgruppenschlüssel 1111?",
    a: "Die vier Ziffern stehen für Kranken-, Renten-, Arbeitslosen- und Pflegeversicherung. 1111 heißt: in allen vier Zweigen pflichtversichert zum vollen bzw. allgemeinen Beitrag — der Normalfall für Angestellte. Minijobber haben zum Beispiel einen anderen Schlüssel, weil der Arbeitgeber Pauschalbeiträge zahlt.",
  },
  {
    q: "Muss der Arbeitgeber jeden Monat eine Lohnabrechnung ausstellen?",
    a: "Nach § 108 Gewerbeordnung erhalten Beschäftigte bei Zahlung des Arbeitsentgelts eine Abrechnung in Textform. Die Pflicht entfällt, wenn sich die Angaben gegenüber der letzten Abrechnung nicht geändert haben. In der Praxis erstellen die meisten Arbeitgeber trotzdem jeden Monat eine Abrechnung.",
  },
  {
    q: "Warum weicht meine echte Lohnabrechnung leicht vom Rechner ab?",
    a: "Arbeitgeber berechnen die Lohnsteuer nach dem amtlichen Programmablaufplan, inklusive Vorsorgepauschale und Rundungsregeln; dieser Rechner nutzt eine vereinfachte Berechnung nach § 32a EStG. Dazu kommen individuelle Werte wie Freibeträge, Faktorverfahren, Kinderfreibeträge, Zuschläge oder Sachbezüge. Abweichungen von einigen Euro sind deshalb normal.",
  },
];

/** Positionen einer typischen Lohnabrechnung — für den Erklärabschnitt. */
export const POSITIONEN: [string, string][] = [
  ["Steuer-ID, Steuerklasse, Kinderfreibeträge", "Die Lohnsteuermerkmale (ELStAM), die das Finanzamt dem Arbeitgeber übermittelt. Stimmen sie nicht, stimmt die Lohnsteuer nicht."],
  ["Personengruppenschlüssel 101", "Sozialversicherungspflichtig Beschäftigte ohne besondere Merkmale — der Normalfall."],
  ["Beitragsgruppenschlüssel 1111", "Pflichtversichert in Kranken-, Renten-, Arbeitslosen- und Pflegeversicherung."],
  ["SV-Tage", "Beitragspflichtige Tage im Monat; ein voller Monat zählt 30 Tage."],
  ["Gesamtbrutto", "Alle Bezüge des Monats: Gehalt, Zulagen, Zuschläge, geldwerte Vorteile."],
  ["Steuerbrutto / SV-Brutto", "Bemessungsgrundlagen für Lohnsteuer und Sozialbeiträge — ohne steuer- bzw. beitragsfreie Bezüge, SV-Brutto bis zur Beitragsbemessungsgrenze."],
  ["Gesetzliche Abzüge", "Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und die Arbeitnehmeranteile zu KV, PV, RV und ALV."],
  ["Nettoentgelt / Auszahlungsbetrag", "Netto nach gesetzlichen Abzügen; nach Nettoabzügen (z. B. vermögenswirksame Leistungen, Dienstwagen) der Betrag auf dem Konto."],
];
