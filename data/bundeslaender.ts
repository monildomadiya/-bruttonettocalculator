/**
 * Die 16 deutschen Bundesländer für die programmatischen
 * "Brutto-Netto-Rechner nach Bundesland"-Seiten.
 *
 * Steuerlich relevante Unterschiede zwischen den Ländern:
 *  - Kirchensteuersatz: 8 % in Bayern & Baden-Württemberg, 9 % in den
 *    übrigen 14 Ländern (§ 51a EStG i.V.m. Landeskirchensteuergesetzen).
 *  - Sachsen: Arbeitnehmer tragen einen um 0,5 % höheren Eigenanteil an
 *    der Pflegeversicherung (Ausgleich für den Feiertag Buß- und Bettag).
 *
 * Lohnsteuer, Soli und die Sozialversicherungssätze sind bundeseinheitlich.
 */
export interface Bundesland {
  slug: string;
  name: string;
  /** Präpositionalform, z. B. "in Bayern" */
  praep: string;
  kirchensteuerSatz: 0.08 | 0.09;
  hauptstadt: string;
  /** Suchrelevante Kurzform/Alias, z. B. "NRW" */
  alias?: string;
  sachsen?: boolean;
  /** 1–2 Sätze mit einzigartigem Kontext je Land (gegen Thin Content) */
  kontext: string;
}

export const BUNDESLAENDER: Bundesland[] = [
  {
    slug: "baden-wuerttemberg",
    name: "Baden-Württemberg",
    praep: "in Baden-Württemberg",
    kirchensteuerSatz: 0.08,
    hauptstadt: "Stuttgart",
    alias: "BW",
    kontext:
      "Baden-Württemberg zählt zu den wirtschaftsstärksten Bundesländern mit überdurchschnittlichen Gehältern in der Automobil- und Maschinenbauindustrie. Kirchensteuerpflichtige zahlen hier nur 8 % statt 9 %.",
  },
  {
    slug: "bayern",
    name: "Bayern",
    praep: "in Bayern",
    kirchensteuerSatz: 0.08,
    hauptstadt: "München",
    kontext:
      "Bayern ist das einzige weitere Bundesland neben Baden-Württemberg mit dem ermäßigten Kirchensteuersatz von 8 %. Vor allem im Großraum München liegen die Bruttogehälter deutlich über dem Bundesdurchschnitt.",
  },
  {
    slug: "berlin",
    name: "Berlin",
    praep: "in Berlin",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Berlin",
    kontext:
      "In der Bundeshauptstadt Berlin gilt wie in den meisten Ländern der Kirchensteuersatz von 9 %. Die Gehaltsspanne ist groß — von Verwaltung und Start-ups bis zur Kreativwirtschaft.",
  },
  {
    slug: "brandenburg",
    name: "Brandenburg",
    praep: "in Brandenburg",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Potsdam",
    kontext:
      "Brandenburg umschließt die Hauptstadtregion; viele Beschäftigte pendeln nach Berlin. Es gilt der Kirchensteuersatz von 9 %.",
  },
  {
    slug: "bremen",
    name: "Bremen",
    praep: "in Bremen",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Bremen",
    kontext:
      "Der Stadtstaat Bremen ist von Häfen, Logistik und Luft- und Raumfahrt geprägt. Für Kirchenmitglieder gilt der Kirchensteuersatz von 9 %.",
  },
  {
    slug: "hamburg",
    name: "Hamburg",
    praep: "in Hamburg",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Hamburg",
    kontext:
      "Hamburg gehört zu den Ländern mit den höchsten Durchschnittsgehältern, getragen von Handel, Medien und Hafenwirtschaft. Der Kirchensteuersatz beträgt 9 %.",
  },
  {
    slug: "hessen",
    name: "Hessen",
    praep: "in Hessen",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Wiesbaden",
    kontext:
      "Hessen mit dem Finanzplatz Frankfurt am Main weist hohe Durchschnittseinkommen im Banken- und Beratungssektor auf. Es gilt der Kirchensteuersatz von 9 %.",
  },
  {
    slug: "mecklenburg-vorpommern",
    name: "Mecklenburg-Vorpommern",
    praep: "in Mecklenburg-Vorpommern",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Schwerin",
    alias: "MV",
    kontext:
      "Mecklenburg-Vorpommern ist stark von Tourismus, Landwirtschaft und maritimer Wirtschaft geprägt. Für Kirchenmitglieder gilt der Satz von 9 %.",
  },
  {
    slug: "niedersachsen",
    name: "Niedersachsen",
    praep: "in Niedersachsen",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Hannover",
    kontext:
      "Niedersachsen ist das zweitgrößte Flächenland mit starker Automobil-, Agrar- und Energiewirtschaft. Der Kirchensteuersatz liegt bei 9 %.",
  },
  {
    slug: "nordrhein-westfalen",
    name: "Nordrhein-Westfalen",
    praep: "in Nordrhein-Westfalen",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Düsseldorf",
    alias: "NRW",
    kontext:
      "Nordrhein-Westfalen ist das bevölkerungsreichste Bundesland. Die Ballungsräume Rhein-Ruhr und Rheinland bieten ein breites Gehaltsgefüge; der Kirchensteuersatz beträgt 9 %.",
  },
  {
    slug: "rheinland-pfalz",
    name: "Rheinland-Pfalz",
    praep: "in Rheinland-Pfalz",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Mainz",
    alias: "RLP",
    kontext:
      "Rheinland-Pfalz ist geprägt von Chemieindustrie, Weinbau und Mittelstand. Für Kirchenmitglieder gilt der Kirchensteuersatz von 9 %.",
  },
  {
    slug: "saarland",
    name: "Saarland",
    praep: "im Saarland",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Saarbrücken",
    kontext:
      "Das Saarland ist traditionell von Stahl- und Automobilindustrie geprägt. Es gilt wie in den meisten Ländern der Kirchensteuersatz von 9 %.",
  },
  {
    slug: "sachsen",
    name: "Sachsen",
    praep: "in Sachsen",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Dresden",
    sachsen: true,
    kontext:
      "Sachsen ist der einzige Sonderfall bei der Pflegeversicherung: Arbeitnehmer tragen hier einen um 0,5 % höheren Eigenanteil, weil zum Ausgleich der Feiertag Buß- und Bettag erhalten blieb. Dadurch fällt das Netto minimal geringer aus als in anderen Ländern.",
  },
  {
    slug: "sachsen-anhalt",
    name: "Sachsen-Anhalt",
    praep: "in Sachsen-Anhalt",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Magdeburg",
    kontext:
      "Sachsen-Anhalt setzt auf Chemie, erneuerbare Energien und Logistik. Anders als das benachbarte Sachsen gibt es keinen Pflegeversicherungs-Sonderfall; es gilt der Kirchensteuersatz von 9 %.",
  },
  {
    slug: "schleswig-holstein",
    name: "Schleswig-Holstein",
    praep: "in Schleswig-Holstein",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Kiel",
    alias: "SH",
    kontext:
      "Schleswig-Holstein zwischen Nord- und Ostsee lebt von maritimer Wirtschaft, Tourismus und Windenergie. Der Kirchensteuersatz beträgt 9 %.",
  },
  {
    slug: "thueringen",
    name: "Thüringen",
    praep: "in Thüringen",
    kirchensteuerSatz: 0.09,
    hauptstadt: "Erfurt",
    kontext:
      "Thüringen verfügt über eine vielfältige Industrie aus Optik, Maschinenbau und Automotive. Für Kirchenmitglieder gilt der Satz von 9 %.",
  },
];

export function getBundeslandBySlug(slug: string): Bundesland | undefined {
  return BUNDESLAENDER.find((b) => b.slug === slug);
}
