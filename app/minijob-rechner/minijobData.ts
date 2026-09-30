/**
 * Minijob-Werte und FAQ — bewusst ein eigenes, einfaches Modul: Die Seite
 * (Server Component) baut daraus das FAQ-Schema, der Rechner ("use client")
 * zeigt dieselben Fragen an. Aus einer "use client"-Datei könnte die Seite die
 * Werte nicht lesen, nur eine Client-Referenz.
 */

export type MinijobJahr = 2026 | 2027;

/**
 * Geringfügigkeitsgrenze = Mindestlohn × 130 ÷ 3, auf volle Euro aufgerundet
 * (§ 8 Abs. 1a SGB IV). Beide Mindestlöhne sind per Verordnung beschlossen,
 * die Grenzen stehen damit fest.
 */
export const MINIJOB_WERTE: Record<MinijobJahr, { grenze: number; mindestlohn: number; pauschsteuerPct: number }> = {
  2026: { grenze: 603, mindestlohn: 13.9, pauschsteuerPct: 2 },
  // Pauschsteuer 5 %: Regierungsentwurf EStRefG 2027 (BT-Drs. 21/8235, Art. 1
  // Nr. 7, § 40a Abs. 2 EStG) — geplant, noch nicht verkündet.
  2027: { grenze: 633, mindestlohn: 14.6, pauschsteuerPct: 5 },
};

/** RV-Eigenanteil: 18,6 % Gesamtbeitrag − 15 % Arbeitgeber-Pauschale (gewerblich). */
export const RV_EIGENANTEIL_SATZ = 0.036;

export const MINIJOB_FAQS = [
  {
    q: "Wie hoch ist die Minijob-Grenze 2027?",
    a: "Zum 1. Januar 2027 steigt die Minijob-Grenze auf 633 € im Monat (7.596 € im Jahr). Das folgt direkt aus dem bereits verordneten Mindestlohn von 14,60 €: 14,60 € × 130 Stunden ÷ 3 = 632,67 €, aufgerundet auf volle Euro 633 € (§ 8 Abs. 1a SGB IV). Anders als die Steuerreform 2027 hängt dieser Wert an keinem laufenden Gesetzgebungsverfahren — er steht fest.",
  },
  {
    q: "Wie hoch ist die Minijob-Grenze 2026?",
    a: "Die Minijob-Grenze liegt seit dem 1. Januar 2026 bei 603 € monatlich (7.236 € im Jahr). Sie ist seit 2024 dynamisch an den gesetzlichen Mindestlohn gekoppelt: Grenze = Mindestlohn × 130 Stunden ÷ 3. Zum 1. Januar 2027 steigt sie auf 633 €.",
  },
  {
    q: "Was ändert sich beim Minijob 2027?",
    a: "Drei Dinge. Erstens steigt die Verdienstgrenze von 603 € auf 633 € und der Mindestlohn von 13,90 € auf 14,60 € — die mögliche Stundenzahl bleibt deshalb bei rund 43 Stunden im Monat. Zweitens beginnt der Midijob-Übergangsbereich entsprechend erst bei 633,01 €: Wer 2026 mit 620 € noch im Midijob war, ist 2027 Minijobber. Drittens soll die Lohnsteuer-Pauschale des Arbeitgebers von 2 % auf 5 % steigen. Das steht im Regierungsentwurf des Einkommensteuerreformgesetzes 2027 (BT-Drucksache 21/8235), ist aber noch nicht beschlossen — und ändert am Netto des Minijobbers nichts, solange der Arbeitgeber die Pauschsteuer nicht abwälzt.",
  },
  {
    q: "Wie viele Stunden darf ich im Minijob 2026 und 2027 arbeiten?",
    a: "Mit Mindestlohn rechnerisch fast gleich viele: 2026 sind es 603 € ÷ 13,90 € = rund 43,4 Stunden im Monat, 2027 sind es 633 € ÷ 14,60 € = rund 43,4 Stunden. Das entspricht etwa 10 Stunden pro Woche. Wer mehr als den Mindestlohn verdient, darf entsprechend weniger Stunden arbeiten.",
  },
  {
    q: "Zahlt ein Minijobber Lohnsteuer?",
    a: "Nein, in der Regel nicht. Der Arbeitgeber zahlt eine Pauschsteuer von 2 % (inkl. Soli und Kirchensteuer), die er in der Regel nicht auf den Arbeitnehmer abwälzt. Für den Minijobber bleibt der Verdienst dadurch lohnsteuerfrei. Ab 2027 soll diese Pauschsteuer auf 5 % steigen: Sie ist Teil der Gegenfinanzierung im Regierungsentwurf des Einkommensteuerreformgesetzes 2027 (BT-Drucksache 21/8235) und trifft den Arbeitgeber, nicht den Minijobber — verkündet ist das Gesetz allerdings noch nicht.",
  },
  {
    q: "Muss ich als Minijobber Rentenversicherungsbeiträge zahlen?",
    a: "Seit 2013 sind Minijobber grundsätzlich rentenversicherungspflichtig und zahlen einen Eigenanteil von 3,6 % ihres Verdienstes. Sie können sich davon auf Antrag befreien lassen — verzichten dann aber auch auf den vollen Rentenanspruch und Vorteile wie Riester-Förderung.",
  },
];
