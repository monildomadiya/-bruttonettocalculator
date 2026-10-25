/**
 * Elterngeld-FAQ — eine Quelle für die sichtbaren Fragen (ElterngeldRechner,
 * "use client") und das FAQ-Schema der Seite (Server). Aus einer
 * "use client"-Datei könnte die Seite die Werte nicht lesen.
 *
 * Reform 2027: Stand 30.09.2026 nur ein Referentenentwurf des BMFSFJ (Juli
 * 2026, Ressortabstimmung); die Ministerin hat am 30.09. angekündigt, die
 * Kürzung erneut zu prüfen. Jede Aussage dazu ist deshalb als "geplant" bzw.
 * "nicht beschlossen" formuliert — bei jedem Verfahrensschritt hier und im
 * Abschnitt auf der Seite (page.tsx) nachziehen.
 */

export const ELTERNGELD_REFORM_STAND = "30. September 2026";

export const ELTERNGELD_FAQS = [
  {
    q: "Wie hoch ist das Elterngeld 2026?",
    a: "Das Basiselterngeld beträgt 65–100 % des durchschnittlichen Nettoeinkommens der letzten 12 Monate vor der Geburt — je niedriger das Einkommen, desto höher der Prozentsatz. Mindestens 300 € und höchstens 1.800 € im Monat.",
  },
  // Google Trends DE (30 Tage bis 6.10.2026): „wie lange gibt es elterngeld“
  // +180 %, „elterngeld bei zwillingen“ +80 %, „elterngeld maximal“ +50 %.
  {
    q: "Wie lange gibt es Elterngeld?",
    a: "Basiselterngeld gibt es für einen Elternteil höchstens 12 Monate, zusammen 14 Monate, wenn beide Eltern Elterngeld nehmen und dafür ihr Einkommen wegfällt (zwei Partnermonate); Alleinerziehende können die 14 Monate allein nehmen. Basiselterngeld wird nur bis zum Ende des 14. Lebensmonats gezahlt. Ein Basismonat lässt sich in zwei Monate ElterngeldPlus tauschen, so verlängert sich der Bezug auf bis zu 28 Monate, dazu kommen bis zu vier Bonusmonate beim Partnerschaftsbonus. Gleichzeitig Basiselterngeld beziehen dürfen Eltern nur einen Monat lang in den ersten zwölf Lebensmonaten.",
  },
  {
    q: "Wie viel Elterngeld gibt es maximal — auch bei Zwillingen?",
    a: "Höchstens 1.800 € Basiselterngeld im Monat (ElterngeldPlus: 900 €), erreicht ab rund 2.770 € Nettoeinkommen vor der Geburt. Darüber hinaus erhöhen nur Zuschläge den Betrag: der Geschwisterbonus von 10 %, mindestens 75 €, wenn ältere kleine Geschwister im Haushalt leben, und bei Zwillingen oder Mehrlingen ein Mehrlingszuschlag von 300 € je weiterem Kind (ElterngeldPlus: 150 €). Bei Zwillingen sind so bis zu 2.100 € Basiselterngeld möglich; einen doppelten Elterngeldanspruch gibt es nicht.",
  },
  {
    q: "Wird das Elterngeld 2027 gekürzt?",
    a: "Beschlossen ist nichts. Ein Referentenentwurf des Bundesfamilienministeriums vom Juli 2026 sieht für Kinder, die ab dem 1. November 2027 geboren werden, höchstens 12 statt 14 Monate Basiselterngeld vor — je drei Monate für jeden Elternteil reserviert, sechs frei verteilbar —, dafür einen Mindestbetrag von 330 statt 300 € und einen Höchstbetrag von 1.900 statt 1.800 €. Ende September 2026 hat Familienministerin Prien angekündigt, die Kürzung noch einmal zu prüfen; auch ein Festhalten an 14 Monaten ist möglich. Für Kinder, die vor dem 1. November 2027 geboren werden, soll in jedem Fall das heutige Recht gelten.",
  },
  {
    q: "Wie wird der Elterngeld-Prozentsatz berechnet?",
    a: "Bei einem Nettoeinkommen zwischen 1.000 € und 1.200 € gilt die Standardrate von 67 %. Darunter steigt der Satz um 0,1 Prozentpunkt je 2 € niedrigerem Einkommen (bis max. 100 %), darüber sinkt er um 0,1 Prozentpunkt je 2 € höherem Einkommen (bis min. 65 %).",
  },
  {
    q: "Gibt es eine Einkommensgrenze für Elterngeld?",
    a: "Ja. Für Kinder, die ab dem 1. April 2025 geboren werden, besteht kein Anspruch, wenn das zu versteuernde Einkommen der Eltern im Kalenderjahr vor der Geburt mehr als 175.000 € beträgt; bei Alleinerziehenden zählt nur das eigene Einkommen. Für Geburten vom 1. April 2024 bis zum 31. März 2025 lag die Grenze bei 200.000 €. Der Reformentwurf für 2027 sieht keine Änderung der Grenze vor.",
  },
  {
    q: "Was ist der Unterschied zwischen Basiselterngeld und ElterngeldPlus?",
    a: "Beim ElterngeldPlus erhalten Sie monatlich nur die Hälfte des Basiselterngeldbetrags, dafür aber über die doppelte Anzahl an Monaten — das lohnt sich besonders, wenn Sie während des Bezugs bereits in Teilzeit arbeiten.",
  },
  // Google Trends DE (30 Tage bis 25.10.2026): „elterngeld plus zuverdienst“
  // +300 %, „elterngeld bonusmonate“ +50 %. Geprüft im BEEG-Text: § 1 Abs. 6
  // (32 Wochenstunden), § 2 Abs. 3 (Unterschiedsbetrag, Deckel 2.770 €),
  // § 4a Abs. 2 (Plus höchstens halbes Basiselterngeld ohne Einkommen),
  // § 4b (Partnerschaftsbonus, 24–32 Wochenstunden, höchstens vier Monate).
  {
    q: "Wie viel darf ich beim ElterngeldPlus dazuverdienen?",
    a: "Sie dürfen bis zu 32 Wochenstunden im Durchschnitt des Monats arbeiten. Eine feste Verdienstgrenze gibt es nicht, aber der Zuverdienst wird angerechnet: Elterngeld gibt es dann auf den Unterschied zwischen dem Nettoeinkommen vor und nach der Geburt, wobei das Einkommen vor der Geburt höchstens mit 2.770 € zählt. ElterngeldPlus beträgt dabei höchstens die Hälfte des Basiselterngelds, das Ihnen ohne Zuverdienst zustünde. Wer in Teilzeit arbeitet, bekommt mit ElterngeldPlus deshalb oft fast denselben Monatsbetrag wie mit Basiselterngeld, aber doppelt so lange.",
  },
  {
    q: "Was sind die Bonusmonate beim Partnerschaftsbonus?",
    a: "Arbeiten beide Eltern gleichzeitig zwischen 24 und 32 Wochenstunden im Monatsdurchschnitt, bekommt jeder Elternteil für jeden dieser Monate einen zusätzlichen Monat ElterngeldPlus, höchstens vier. Alleinerziehende können den Partnerschaftsbonus allein nutzen, wenn sie in diesem Umfang arbeiten. Die Bonusmonate kommen zu den regulären Elterngeldmonaten hinzu.",
  },
];
