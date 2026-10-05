/*
 * FAQs des Bonus-Steuerrechners — eigene Datei ohne "use client", weil sie
 * sowohl sichtbar (BonusSteuerrechner.tsx) als auch im FAQ-Schema (page.tsx)
 * stehen. Bewusst ohne „Weihnachtsgeld“ in den Fragen: dafür gibt es den
 * Weihnachtsgeld-Rechner (/weihnachtsgeld-rechner).
 */
export const BONUS_FAQS = [
  {
    q: "Wie werden Bonus und Urlaubsgeld versteuert?",
    a: "Boni, Urlaubsgeld und andere Einmalzahlungen zählen steuerlich als „sonstige Bezüge“. Sie werden dem Jahresgehalt hinzugerechnet und nach der Jahreslohnsteuertabelle versteuert — die Steuerlast entspricht der Differenz zwischen der Steuer auf (Jahresgehalt + Bonus) und der Steuer auf das Jahresgehalt allein.",
  },
  {
    q: "Fallen auf einen Bonus auch Sozialabgaben an?",
    a: "Ja, anders als bei einer Abfindung sind Bonus und Urlaubsgeld normal sozialversicherungspflichtig (Renten-, Kranken-, Pflege- und Arbeitslosenversicherung), sofern die jeweilige Beitragsbemessungsgrenze noch nicht erreicht ist.",
  },
  {
    q: "Warum wirkt sich ein Bonus manchmal stärker auf die Steuer aus als erwartet?",
    a: "Da der Bonus zusätzlich zum regulären Gehalt versteuert wird, greift er in einen höheren Bereich der Steuerprogression — der Grenzsteuersatz auf den Bonus liegt daher oft über dem Durchschnittssteuersatz des regulären Gehalts.",
  },
];
