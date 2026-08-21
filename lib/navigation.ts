import {
  Calculator, ArrowRightLeft, LayoutList, Calendar, Scale,
  Car, PiggyBank, Umbrella, Wallet2, Baby, Banknote, Gift, Clock3,
  Coins, Receipt, Landmark, HandCoins, GraduationCap, HeartHandshake, Timer, Globe,
  Building2, Snowflake, Users, TrendingUp, CalendarRange, HeartPulse, TrendingDown, Route, Gauge, Receipt as ReceiptIcon, Home,
  HelpCircle, BarChart3,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: typeof Calculator;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavLink[];
}

/** Grouped calculator/tool links, shared between the desktop mega-menu and the mobile menu. */
export const calculatorGroups: NavGroup[] = [
  {
    label: "Gehalt & Steuer",
    items: [
      { href: "/", label: "Brutto Netto Rechner", icon: Calculator, description: "Der Hauptrechner für 2026/2027" },
      { href: "/gehaltsrechner", label: "Gehaltsrechner", icon: Coins, description: "Brutto Netto Gehalt 2026" },
      { href: "/arbeitgeber-brutto-netto-rechner", label: "Arbeitgeber-Rechner", icon: Building2, description: "Arbeitgeberkosten & -anteil" },
      { href: "/lohnsteuerrechner", label: "Lohnsteuerrechner", icon: Receipt, description: "Lohnsteuer & Nettolohn" },
      { href: "/einkommensteuer-rechner", label: "Einkommensteuer-Rechner", icon: Landmark, description: "Jahressteuer § 32a EStG" },
      { href: "/steuerrueckerstattung-rechner", label: "Steuerrückerstattung-Rechner", icon: ReceiptIcon, description: "Wie viel Steuer bekomme ich zurück?" },
      { href: "/gehaltserhoehung-rechner", label: "Gehaltserhöhung-Rechner", icon: TrendingUp, description: "Netto von der Erhöhung" },
      { href: "/jahresgehalt-rechner", label: "Jahresgehalt-Rechner", icon: CalendarRange, description: "Brutto & Netto pro Jahr" },
      { href: "/steuerklassenwechsel-rechner", label: "Steuerklassenwechsel", icon: Users, description: "3/5 oder 4/4 vergleichen" },
      { href: "/rechner/brutto-zu-netto", label: "Brutto zu Netto", icon: ArrowRightLeft, description: "Direkt umrechnen" },
      { href: "/rechner/netto-zu-brutto", label: "Netto zu Brutto", icon: ArrowRightLeft, description: "Für Gehaltsverhandlungen" },
      { href: "/steuerklassen", label: "Steuerklassen", icon: LayoutList, description: "Alle 6 Klassen im Vergleich" },
      { href: "/welche-steuerklasse-bin-ich", label: "Welche Steuerklasse bin ich?", icon: HelpCircle, description: "Interaktiver Steuerklassen-Finder" },
      { href: "/brutto-netto-rechner-beamte", label: "Beamten-Rechner", icon: Landmark, description: "Netto für Beamte — ohne Sozialabgaben" },
      { href: "/steuerfreibetrag-2026", label: "Steuerfreibetrag 2026", icon: Scale, description: "Grundfreibetrag & alle Freibeträge" },
      { href: "/beitragsbemessungsgrenze-2026", label: "Beitragsbemessungsgrenze 2026", icon: Scale, description: "69.750 € & 101.400 € · alle Grenzwerte" },
      { href: "/brutto-netto-rechner-krankenkasse", label: "Rechner mit Krankenkasse", icon: HeartPulse, description: "AOK, TK & Co. · Zusatzbeitrag 2026" },
      { href: "/durchschnittsgehalt-deutschland", label: "Durchschnittsgehalt Deutschland", icon: BarChart3, description: "Wo steht Ihr Gehalt im Vergleich?" },
      { href: "/brutto-netto-rechner-2026", label: "Rechner 2026", icon: Calendar, description: "Amtliche Werte 2026" },
      { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar, description: "Reform-Eckwerte testen" },
      { href: "/brutto-netto-rechner-vergleich", label: "Rechner im Vergleich", icon: Scale, description: "Welcher Rechner kann was?" },
    ],
  },
  {
    label: "Sozialleistungen",
    items: [
      { href: "/mindestlohn", label: "Mindestlohn Rechner", icon: Scale, description: "13,90 €/h ab 2026" },
      { href: "/minijob-rechner", label: "Minijob-Rechner", icon: Wallet2, description: "Verdienstgrenze 603 €" },
      { href: "/midijob-rechner", label: "Midijob-Rechner", icon: Gauge, description: "Übergangsbereich 603–2.000 €" },
      { href: "/buergergeld-rechner", label: "Bürgergeld-Rechner", icon: HandCoins, description: "Regelsatz 563 € · SGB II" },
      { href: "/bafoeg-rechner", label: "BAföG-Rechner", icon: GraduationCap, description: "Anspruch für Studierende" },
      { href: "/bafoeg-rueckzahlung-rechner", label: "BAföG-Rückzahlung", icon: GraduationCap, description: "Raten & Dauer · max. 10.010 €" },
      { href: "/grundsicherung-rechner", label: "Grundsicherung-Rechner", icon: HandCoins, description: "Im Alter · Regelbedarf 563 €" },
      { href: "/schonvermoegen-rechner", label: "Schonvermögen-Rechner", icon: PiggyBank, description: "Bürgergeld Vermögensfreibetrag" },
      { href: "/elterngeld-rechner", label: "Elterngeld-Rechner", icon: Baby, description: "Basiselterngeld & Plus" },
      { href: "/arbeitslosengeld-rechner", label: "Arbeitslosengeld-Rechner", icon: Umbrella, description: "ALG I Orientierung" },
      { href: "/kurzarbeitergeld-rechner", label: "Kurzarbeitergeld-Rechner", icon: TrendingDown, description: "KUG 60 % / 67 %" },
      { href: "/krankengeld-rechner", label: "Krankengeld-Rechner", icon: HeartPulse, description: "70 % vom Brutto" },
      { href: "/pfaendungstabelle", label: "Pfändungstabelle", icon: Scale, description: "Freigrenzen 2026" },
    ],
  },
  {
    label: "Sonderfälle",
    items: [
      { href: "/firmenwagenrechner", label: "Firmenwagenrechner", icon: Car, description: "1%-Regelung & Dienstwagen" },
      { href: "/rentenrechner", label: "Rentenrechner", icon: PiggyBank, description: "Rentenbeitrag & Prognose" },
      { href: "/rentenpunkte-rechner", label: "Rentenpunkte-Rechner", icon: TrendingUp, description: "Entgeltpunkte & Rente · 42,52 €" },
      { href: "/riester-rechner", label: "Riester-Rechner", icon: Landmark, description: "Zulagen & Eigenbeitrag" },
      { href: "/bav-rechner", label: "bAV-Rechner", icon: PiggyBank, description: "Entgeltumwandlung netto berechnen" },
      { href: "/immobilienkredit-rechner", label: "Immobilienkredit-Rechner", icon: Home, description: "Wie viel Haus kann ich mir leisten?" },
      { href: "/private-krankenversicherung-vs-gesetzlich", label: "PKV vs GKV", icon: HeartPulse, description: "Ab welchem Brutto lohnt sich die PKV?" },
      { href: "/witwenrente-rechner", label: "Witwenrente-Rechner", icon: HeartHandshake, description: "55 % / 25 % berechnen" },
      { href: "/abfindungsrechner", label: "Abfindungsrechner", icon: Banknote, description: "Fünftelregelung" },
      { href: "/weihnachtsgeld-rechner", label: "Weihnachtsgeld-Rechner", icon: Snowflake, description: "Netto vom Weihnachtsgeld" },
      { href: "/bonus-steuerrechner", label: "Bonus-Steuerrechner", icon: Gift, description: "Weihnachts- & Urlaubsgeld" },
      { href: "/mehrwertsteuer-rechner", label: "MwSt-Rechner", icon: Receipt, description: "19 % / 7 % auf- & herausrechnen" },
      { href: "/stundenlohn-rechner", label: "Stundenlohn-Rechner", icon: Clock3, description: "Netto pro Stunde" },
      { href: "/teilzeitrechner", label: "Teilzeitrechner", icon: Timer, description: "Netto bei Teilzeit" },
      { href: "/werkstudent-rechner", label: "Werkstudent-Rechner", icon: GraduationCap, description: "Nur 9,3 % Rentenbeitrag" },
      { href: "/pendlerpauschale-rechner", label: "Pendlerpauschale-Rechner", icon: Route, description: "Entfernungspauschale" },
      { href: "/en/tax-calculator-germany", label: "Tax Calculator (EN)", icon: Globe, description: "German salary in English" },
    ],
  },
];

export const allCalculatorLinks: NavLink[] = calculatorGroups.flatMap((g) => g.items);

/**
 * High-value "hub" pages every visitor is likely to want next. Used to fill up
 * a related-tools block once the topically-closest siblings are exhausted, so
 * we always funnel toward the main money pages.
 */
const EVERGREEN_HREFS = ["/", "/gehaltsrechner", "/steuerklassen", "/brutto-netto-rechner-2026"];

/**
 * Returns topically-related tools for a given page, for the "Ähnliche Rechner"
 * internal-linking block. Prioritises siblings from the same category (most
 * relevant), then fills with evergreen hub pages, then anything else — always
 * excluding the current page and de-duplicating. Pages that aren't in the nav
 * (e.g. amount pages) still get a sensible evergreen-led set.
 */
export function getRelatedCalculators(
  currentHref: string,
  count = 6
): { href: string; label: string; desc?: string }[] {
  const group = calculatorGroups.find((g) => g.items.some((i) => i.href === currentHref));
  const picked: NavLink[] = [];
  const add = (link?: NavLink) => {
    if (!link) return;
    if (link.href === currentHref) return;
    if (picked.some((p) => p.href === link.href)) return;
    picked.push(link);
  };

  // 1) siblings from the same category — the most relevant next steps
  group?.items.forEach(add);
  // 2) evergreen hubs to funnel toward the main pages
  EVERGREEN_HREFS.forEach((href) => add(allCalculatorLinks.find((l) => l.href === href)));
  // 3) fall back to filling from everything else
  allCalculatorLinks.forEach(add);

  return picked.slice(0, count).map((i) => ({ href: i.href, label: i.label, desc: i.description }));
}
