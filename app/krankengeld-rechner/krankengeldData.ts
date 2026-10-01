/**
 * Krankengeld-FAQ — eine Quelle für die sichtbaren Fragen (KrankengeldRechner,
 * "use client") und das FAQ-Schema (page.tsx).
 *
 * 2027-Aussagen beruhen auf dem Gesetzestext: GKV-Beitragssatzstabilisierungs-
 * gesetz vom 24.07.2026, BGBl. 2026 I Nr. 228. Inkrafttreten nach Art. 8:
 * § 47 Abs. 2a, § 50, § 51 SGB V n. F. zum 1.1.2027 (Abs. 2); Teilarbeits-
 * unfähigkeit/Teilkrankengeld (§§ 44 Abs. 1a, 44c, 47 Abs. 1a) erst zum
 * 1.1.2028 (Abs. 3). Höhe und Bezugsdauer bleiben laut BMG unverändert.
 */

export const KRANKENGELD_FAQS = [
  {
    q: "Wie hoch ist das Krankengeld?",
    a: "Das Krankengeld beträgt 70 % des Bruttoarbeitsentgelts, höchstens 90 % des Nettoarbeitsentgelts. Berücksichtigt wird das Brutto nur bis zur Beitragsbemessungsgrenze der Krankenversicherung — 2026 sind es deshalb höchstens 135,63 € am Tag. Davon gehen noch die Arbeitnehmeranteile zur Renten-, Arbeitslosen- und Pflegeversicherung ab (rund 12,4 %, kinderlos 13 %).",
  },
  {
    q: "Wird das Krankengeld 2027 gekürzt?",
    a: "Nicht generell: Höhe und Bezugsdauer bleiben. Ab dem 1. Januar 2027 gilt aber eine neue Regel, wenn das Arbeitsverhältnis während der Krankschreibung endet — dann gibt es ab dem Folgetag nur noch 60 % des Nettoarbeitsentgelts, mit Kind 67 % (§ 47 Abs. 2a SGB V). Grundlage ist das GKV-Beitragssatzstabilisierungsgesetz vom Juli 2026.",
  },
  {
    q: "Was ändert sich beim Krankengeld ab 2027?",
    a: "Zum 1. Januar 2027: erstens die niedrigere Berechnung nach dem Ende einer Beschäftigung (60 % bzw. 67 % des Nettos). Zweitens schließt künftig auch eine Teilrente wegen Alters von mehr als zwei Dritteln der Vollrente das Krankengeld aus (§ 50 SGB V). Drittens kann die Krankenkasse eine Frist von vier Wochen für den Antrag auf Reha-Leistungen setzen (§ 51 SGB V). Die Teilarbeitsunfähigkeit mit Teilkrankengeld (25, 50 oder 75 %) kommt erst zum 1. Januar 2028.",
  },
  {
    q: "Ab wann zahlt die Krankenkasse Krankengeld?",
    a: "In den ersten sechs Wochen einer Arbeitsunfähigkeit zahlt der Arbeitgeber die Entgeltfortzahlung (100 % des Arbeitsentgelts). Erst danach übernimmt die Krankenkasse das Krankengeld.",
  },
  {
    q: "Wie lange wird Krankengeld gezahlt?",
    a: "Bei derselben Erkrankung maximal 78 Wochen innerhalb von drei Jahren — abzüglich der sechs Wochen Entgeltfortzahlung also längstens 72 Wochen. Daran ändert sich auch 2027 nichts.",
  },
  {
    q: "Muss man Krankengeld versteuern?",
    a: "Krankengeld ist steuerfrei, unterliegt aber dem Progressionsvorbehalt: Es erhöht den Steuersatz auf Ihr übriges Einkommen und kann bei der Steuererklärung zu einer Nachzahlung führen.",
  },
];
