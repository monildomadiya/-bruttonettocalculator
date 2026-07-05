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

export const WAGE_STATS_2026: WageStats = {
  averageGrossMonthly: 4323,
  medianGrossMonthly: 3650,
  minWageHourly2026: 12.82,
  minWageMonthlyFulltime: 2222, // ca. 173.33 Stunden * 12.82 €
  kvPvBbgMonthly2026: 5812.50, // 69.750 € / 12
  rvAlvBbgMonthly2026: 8450.00, // 101.400 € / 12
  source: "Statistisches Bundesamt (Destatis) & Bundesagentur für Arbeit, Erhebung der Verdienststruktur und SV-Rechengrößen 2026",
  year: 2026,
};

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
      summary: `Ein Monatsgehalt von ${formatted} liegt unter dem rechnerischen Vollzeit-Mindestlohnniveau von ca. 2.222 € (bei 12,82 €/Std. und 40-Stunden-Woche). Oft handelt es sich hierbei um Teilzeitstellen, Einstiegspositionen oder Midijobs.`,
      detail: `In diesem Lohnbereich fallen die Steuerabzüge dank des amtlichen Grundfreibetrags (12.348 € im Jahr 2026 für Ledige) extrem gering aus oder entfallen komplett. Die Sozialversicherungsbeiträge werden proportional nach dem regulären AN-Satz berechnet.`,
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
 * Generates array of gross salary amounts from 1500 to 10000 in steps of 100.
 */
export function getCommonGrossSalaryAmounts(): number[] {
  const amounts: number[] = [];
  for (let amount = 1500; amount <= 10000; amount += 100) {
    amounts.push(amount);
  }
  return amounts;
}
