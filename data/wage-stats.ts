export interface WageStats {
  averageGrossMonthly: number;
  medianGrossMonthly: number;
  minWageHourly2026: number;
  minWageMonthlyFulltime: number;
  kvPvBbgMonthly2026: number;
  rvAlvBbgMonthly2026: number;
  source: string;
  year: number;
}

/**
 * KORREKTUR (03.08.2026): 4.323 € ist laut Destatis der *Median*-Bruttomonats-
 * verdienst, nicht der Durchschnitt — der Wert stand hier zuvor fälschlich als
 * `averageGrossMonthly`. Der amtliche Durchschnitt (arithmetisches Mittel) für
 * Vollzeitbeschäftigte lag im April 2025 bei 4.784 € brutto ohne
 * Sonderzahlungen (Destatis, Verdiensterhebung, Zeile "Landwirtschaft,
 * Produzierendes Gewerbe und Dienstleistungsbereich": 39,1 Std./Woche,
 * 28,19 €/Std., 4.784 €/Monat). Gegenprobe zum Median: 4.323 € × 12 =
 * 51.876 € zzgl. Sonderzahlungen ≈ 54.066 € — exakt der von Destatis
 * gemeldete mittlere Bruttojahresverdienst 2025 (siehe DESTATIS_JAHR_2025).
 */
export const WAGE_STATS_2026: WageStats = {
  averageGrossMonthly: 4784,
  medianGrossMonthly: 4323,
  minWageHourly2026: 13.90,
  minWageMonthlyFulltime: 2409, // ca. 173.33 Stunden * 13,90 €
  kvPvBbgMonthly2026: 5812.50, // 69.750 € / 12
  rvAlvBbgMonthly2026: 8450.00, // 101.400 € / 12
  source: "Statistisches Bundesamt (Destatis) & Bundesagentur für Arbeit, Erhebung der Verdienststruktur und SV-Rechengrößen 2026",
  year: 2026,
};

/**
 * Amtliche Verdienstverteilung für Vollzeitbeschäftigte, Berichtsjahr 2025 —
 * veröffentlicht vom Statistischen Bundesamt am 22. April 2026
 * (Pressemitteilung Nr. 113/2026, "Mittlerer Bruttojahresverdienst lag 2025
 * bei 54 066 Euro").
 *
 * WICHTIG zur Bezugsbasis: Die Jahreswerte hier verstehen sich INKLUSIVE
 * steuerpflichtiger Sonderzahlungen (Urlaubs-/Weihnachtsgeld). Der
 * Monatsdurchschnitt in WAGE_STATS_2026 stammt dagegen aus der
 * Verdiensterhebung April 2025 OHNE Sonderzahlungen. Beide Basen nicht
 * vermischen — sonst entstehen scheinbare Widersprüche.
 *
 * Es ist die jeweils aktuellste amtliche Erhebung: Verdienstdaten erscheinen
 * mit rund einem Jahr Verzug, für 2026 liegen noch keine Werte vor.
 */
export const DESTATIS_JAHR_2025 = {
  berichtsjahr: 2025,
  veroeffentlicht: "22. April 2026",
  quelle: "Statistisches Bundesamt (Destatis), Pressemitteilung Nr. 113 vom 22. April 2026",
  quelleUrl: "https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/04/PD26_113_621.html",
  /** Median-Bruttojahresverdienst Vollzeit, inkl. Sonderzahlungen. */
  medianJahr: 54066,
  /** Arithmetisches Mittel Bruttojahresverdienst Vollzeit, inkl. Sonderzahlungen. */
  durchschnittJahr: 64441,
  /** Ab diesem Jahresbrutto gehört man zum obersten Zehntel. */
  top10Ab: 100719,
  /** Ab diesem Jahresbrutto gehört man zum obersten Prozent. */
  top1Ab: 219110,
  /** Bis zu diesem Jahresbrutto gehört man zum untersten Zehntel. */
  unten10Bis: 33828,
  medianWest: 55435,
  /** Ostdeutsche Bundesländer ohne Berlin. */
  medianOst: 46013,
  /** Durchschnittlicher Bruttostundenverdienst Vollzeit, April 2025. */
  stundenverdienst: 28.19,
  /** Bezahlte Wochenarbeitszeit Vollzeit, April 2025. */
  wochenstunden: 39.1,
} as const;

/** Median-Bruttojahresverdienst je Wirtschaftszweig 2025 (Destatis, inkl. Sonderzahlungen). */
export const BRANCHEN_MEDIAN_2025: { branche: string; median: number }[] = [
  { branche: "Energieversorgung", median: 77522 },
  { branche: "Finanz- und Versicherungsdienstleistungen", median: 76594 },
  { branche: "Land- und Forstwirtschaft, Fischerei", median: 35689 },
  { branche: "Gastgewerbe", median: 35545 },
];

/**
 * Ordnet ein Bruttojahresgehalt in die amtliche Verteilung ein und schätzt den
 * Perzentilrang. Zwischen den von Destatis veröffentlichten Stützstellen
 * (10 %, 50 %, 90 %, 99 %) wird linear interpoliert — die Angabe ist damit
 * bewusst eine Näherung und wird auf der Seite auch so ausgewiesen.
 */
export function getSalaryPercentile(bruttoJahr: number): {
  percentile: number;
  label: string;
  besserAls: number;
} {
  const d = DESTATIS_JAHR_2025;
  const stuetzstellen: [number, number][] = [
    [0, 0],
    [d.unten10Bis, 10],
    [d.medianJahr, 50],
    [d.top10Ab, 90],
    [d.top1Ab, 99],
  ];

  let percentile = 99.5;
  for (let i = 0; i < stuetzstellen.length - 1; i++) {
    const [x0, p0] = stuetzstellen[i];
    const [x1, p1] = stuetzstellen[i + 1];
    if (bruttoJahr <= x1) {
      percentile = p0 + ((bruttoJahr - x0) / (x1 - x0)) * (p1 - p0);
      break;
    }
  }
  percentile = Math.max(0, Math.min(99.9, percentile));

  let label: string;
  if (bruttoJahr >= d.top1Ab) label = "Oberstes 1 % aller Vollzeitbeschäftigten";
  else if (bruttoJahr >= d.top10Ab) label = "Oberstes 10 % aller Vollzeitbeschäftigten";
  else if (bruttoJahr >= d.durchschnittJahr) label = "Über dem Durchschnittsgehalt";
  else if (bruttoJahr >= d.medianJahr) label = "Über dem Mediangehalt";
  else if (bruttoJahr >= d.unten10Bis) label = "Unter dem Mediangehalt";
  else label = "Unterstes 10 % aller Vollzeitbeschäftigten";

  return { percentile, label, besserAls: Math.round(percentile) };
}

/**
 * Returns a unique German contextual explanation for a given monthly gross salary.
 */
export function getWagePercentileContext(grossMonthly: number): {
  headline: string;
  summary: string;
  detail: string;
  badgeText: string;
} {
  const s = WAGE_STATS_2026;
  const formatted = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(grossMonthly);

  if (grossMonthly < s.minWageMonthlyFulltime) {
    return {
      headline: `${formatted} Brutto im Vergleich zum Mindestlohn`,
      summary: `Ein Monatsgehalt von ${formatted} liegt unter dem rechnerischen Vollzeit-Mindestlohnniveau von ca. 2.409 € (bei 13,90 €/Std. und 40-Stunden-Woche). Oft handelt es sich hierbei um Teilzeitstellen, Einstiegspositionen oder Midijobs.`,
      detail: `In diesem Lohnbereich fallen die Steuerabzüge dank des amtlichen Grundfreibetrags (12.348 € im Jahr 2026 für Ledige) extrem gering aus oder entfallen komplett. Liegt das Monatsgehalt im Midijob-Übergangsbereich (603,01–2.000 €), werden die Arbeitnehmer-Sozialbeiträge zusätzlich von einer reduzierten Bemessungsgrundlage berechnet — dadurch bleibt netto mehr übrig.`,
      badgeText: "Teilzeit / Einstiegssegment",
    };
  } else if (grossMonthly < s.medianGrossMonthly) {
    return {
      headline: `${formatted} Brutto im deutschen Lohnvergleich`,
      summary: `Mit einem Bruttomonatsgehalt von ${formatted} liegen Sie unter dem deutschen Mediangehalt von ${s.medianGrossMonthly.toLocaleString("de-DE")} € (Destatis). 50 % aller Vollzeitbeschäftigten in Deutschland verdienen mehr, 50 % weniger als den Median.`,
      detail: `Für Arbeitnehmer in dieser Einkommensklasse ist die Wahl der optimalen Steuerklasse besonders relevant. In Steuerklasse I bleibt durch den Grundfreibetrag und die Sozialversicherungspauschalen ein solider Anteil des Bruttogehaltes als Netto erhalten.`,
      badgeText: "Unterhalb Mediangehalt",
    };
  } else if (grossMonthly < s.averageGrossMonthly) {
    return {
      headline: `${formatted} Brutto: Solides Mittelfeld in Deutschland`,
      summary: `Ein Bruttogehalt von ${formatted} liegt über dem bundesweiten Mediangehalt (${s.medianGrossMonthly.toLocaleString("de-DE")} €), jedoch etwas unter dem statistischen Durchschnittsgehalt von ${s.averageGrossMonthly.toLocaleString("de-DE")} € (Destatis).`,
      detail: `Sie befinden sich im klassischen Mittelstand der deutschen Gehaltsstruktur. Die Steuerprogression nach § 32a EStG verläuft hier mit einem sanften Anstieg, während die Sozialabgaben voll auf das gesamte Bruttogehalt anfallen, da Sie noch unter den Beitragsbemessungsgrenzen liegen.`,
      badgeText: "Über Mediangehalt",
    };
  } else if (grossMonthly < s.kvPvBbgMonthly2026) {
    return {
      headline: `${formatted} Brutto: Über dem deutschen Durchschnitt`,
      summary: `Mit ${formatted} im Monat übertreffen Sie das deutsche Durchschnittsgehalt vollzeitbeschäftigter Arbeitnehmer (${s.averageGrossMonthly.toLocaleString("de-DE")} € lt. Statistischem Bundesamt) spürbar.`,
      detail: `In diesem Einkommensbereich nähert sich Ihr Gehalt der Beitragsbemessungsgrenze der gesetzlichen Kranken- und Pflegeversicherung (5.812,50 € monatlich im Jahr 2026). Ihr Grenzsteuersatz liegt im Bereich der zweiten Progressionszone, weshalb Gehaltssteigerungen einer höheren relativen Besteuerung unterliegen.`,
      badgeText: "Über Durchschnittsgehalt",
    };
  } else if (grossMonthly < s.rvAlvBbgMonthly2026) {
    return {
      headline: `${formatted} Brutto: Überschreitung der KV-Beitragsbemessungsgrenze`,
      summary: `Ein Bruttomonatsgehalt von ${formatted} gehört zu den gehobenen Einkommen in Deutschland. Sie überschreiten damit die Beitragsbemessungsgrenze der Kranken- und Pflegeversicherung 2026 (5.812,50 €).`,
      detail: `Besonderheit für Ihr Nettogehalt: Für jeden Euro, der über 5.812,50 € hinausgeht, steigen Ihre Beiträge zur gesetzlichen Kranken- und Pflegeversicherung nicht mehr weiter an! Ihre Abgabenbelastung bei der Sozialversicherung wird dadurch relativ zum Brutto entlastet, während bei der Lohnsteuer der Spitzensteuersatz von 42 % (ab 69.879 € zvE) greift.`,
      badgeText: "Gehobenes Einkommen / BBG KV überschritten",
    };
  } else {
    return {
      headline: `${formatted} Brutto: Top-Einkommenskategorie`,
      summary: `Mit ${formatted} monatlich zählen Sie zu den obersten Gehaltsgruppen in Deutschland. Ihr Gehalt übersteigt auch die Beitragsbemessungsgrenze der Renten- und Arbeitslosenversicherung (8.450 €/Monat im Jahr 2026).`,
      detail: `Sämtliche Sozialversicherungsbeiträge (Kranken-, Pflege-, Renten- und Arbeitslosenversicherung) sind bei diesem Gehalt gedeckelt — sie steigen auch bei weiteren Gehaltsunterschieden nicht mehr an in Euro absolut. Für die Einkommensteuer gilt der Spitzensteuersatz von 42 % (bzw. ab 277.826 € zvE im Jahr die Reichensteuer von 45 %).`,
      badgeText: "Top-Verdiener / Alle BBG überschritten",
    };
  }
}

/**
 * Whitelisted, indexable exact-salary amounts.
 *
 * 1.500–10.000 € in steps of 100, plus the validated Midijob amount 1.200 €
 * (only enabled once the 2026 Übergangsbereich logic in the engine passes its
 * checkpoints — see scripts/midijob.test.mts). New amounts are added here
 * deliberately, never auto-generated for every possible value.
 */
const APPROVED_MIDIJOB_AMOUNTS = [1200, 1300];

export function getCommonGrossSalaryAmounts(): number[] {
  const amounts: number[] = [...APPROVED_MIDIJOB_AMOUNTS];
  for (let amount = 1500; amount <= 10000; amount += 100) {
    amounts.push(amount);
  }
  return amounts.sort((a, b) => a - b);
}

/**
 * Whitelisted, indexable annual-salary amounts for the Jahresgehalt pages
 * ("70000 brutto in netto"-type queries). 25.000–100.000 € in 1.000-€ steps —
 * the range where real salary negotiations and job listings live.
 */
export function getCommonAnnualSalaryAmounts(): number[] {
  const amounts: number[] = [];
  for (let amount = 25000; amount <= 100000; amount += 1000) {
    amounts.push(amount);
  }
  return amounts;
}
