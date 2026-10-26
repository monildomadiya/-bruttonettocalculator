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

/*
 * Indexable exact-salary amounts — PRUNED 2026-10-26.
 *
 * Until then the whitelist was the full grid (1.500–10.000 € in 100-€ steps,
 * 25.000–100.000 € in 1.000-€ steps): ~270 near-identical pages, most of them
 * with 0 clicks in 90 days. Kept now: amounts with ≥ 1 click OR ≥ 300
 * impressions in GSC (90 days to 24.10.2026), plus amounts added for a trend
 * after 2026-09-30 (too new to judge: 1.000 €, 3.750 €).
 *
 * Every other amount still renders on demand (the calculator deep-links to any
 * gross value), but as `noindex` and outside the sitemap — see
 * `isIndexableAmountSlug` in app/rechner/[betrag]/page.tsx. Add an amount back
 * only with search evidence.
 */
const INDEXABLE_BRUTTO = [
  1000, 1200, 1300, 2100, 2400, 2600, 2800, 3000, 3200, 3300, 3500, 3600, 3750,
  3800, 4000, 4100, 4400, 5000, 5200, 6500, 6800, 6900, 8600,
];
const INDEXABLE_STEUERKLASSE_1 = [
  1000, 1200, 1300, 1500, 1600, 1800, 1900, 2100, 2300, 2400, 2500, 2600, 2700,
  2800, 2900, 3000, 3200, 3300, 3400, 3500, 3600, 3700, 3750, 3800, 3900, 4000,
  4100, 4200, 4300, 4500, 4600, 4700, 4800, 5000, 5100, 5200, 5600, 5700, 5800,
  6900, 7500, 7900, 8000, 8600, 9000, 9800,
];
const INDEXABLE_JAHRESGEHALT = [
  25000, 29000, 31000, 32000, 33000, 34000, 35000, 36000, 37000, 38000, 39000,
  40000, 41000, 42000, 43000, 44000, 45000, 48000, 50000, 51000, 52000, 55000,
  56000, 58000, 59000, 60000, 64000, 65000, 68000, 74000, 75000, 78000, 80000,
  81000, 93000, 95000, 96000, 98000, 100000,
];

/** Monthly gross amounts with an indexable all-Steuerklassen page (sorted). */
export function getCommonGrossSalaryAmounts(): number[] {
  return [...INDEXABLE_BRUTTO];
}

/** Monthly gross amounts with an indexable "…-steuerklasse-1" page (sorted). */
export function getSteuerklasse1Amounts(): number[] {
  return [...INDEXABLE_STEUERKLASSE_1];
}

/**
 * Indexable detail page for a monthly gross amount — the all-Steuerklassen page,
 * else the Steuerklasse-1 page, else none. Static tables link through this so
 * they never point at a noindex amount.
 */
export function grossAmountHref(amount: number): string | null {
  if (INDEXABLE_BRUTTO.includes(amount)) return `/rechner/${amount}-euro-brutto-netto`;
  if (INDEXABLE_STEUERKLASSE_1.includes(amount)) return `/rechner/${amount}-euro-brutto-netto-steuerklasse-1`;
  return null;
}

/** Annual gross amounts with an indexable Jahresgehalt page (sorted). */
export function getCommonAnnualSalaryAmounts(): number[] {
  return [...INDEXABLE_JAHRESGEHALT];
}

/**
 * Whitelisted, indexable net amounts for the "<amount> netto in brutto" pages
 * (/rechner/<amount>-euro-netto-in-brutto). Curated, not a range: each value
 * appears as its own "<amount> netto in brutto" query in the Google Ads Keyword
 * Planner export of 2026-10-03 (DE). Indexation is the site's bottleneck, so a
 * net amount is only added when there is evidence someone searches for it.
 */
export function getNettoInBruttoAmounts(): number[] {
  // 1.800 €: "1800 netto in brutto steuerklasse 1" +120 % (Google Trends DE, 6.10.2026).
  return [
    1200, 1250, 1300, 1400, 1500, 1600, 1800, 2000, 2100, 2500, 2650, 2700, 2800,
    3000, 3300, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4300, 4600, 4700,
    5000, 5400, 6000,
  ];
}

/**
 * Indexable Steuerklasse-III/IV focus pages (/rechner/<amount>-euro-brutto-netto-steuerklasse-<N>).
 * The route renders every class for every amount, but only Steuerklasse 1 is
 * listed in the sitemap by default (index-bloat guard). A III/IV variant is
 * added here only with direct search evidence — Google Trends DE, Thema
 * „steuerklasse“, 30 Tage bis 6.10.2026: "3400 brutto in netto steuerklasse 3"
 * Breakout, "4000 brutto in netto steuerklasse 4" +70 %, "… steuerklasse 3" +40 %.
 */
export function getSteuerklasseVariantPages(): { amount: number; steuerklasse: 3 | 4 }[] {
  return [
    { amount: 3400, steuerklasse: 3 },
    { amount: 4000, steuerklasse: 3 },
    { amount: 4000, steuerklasse: 4 },
  ];
}
