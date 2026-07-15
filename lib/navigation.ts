import {
  Calculator, ArrowRightLeft, LayoutList, Calendar, Scale,
  Car, PiggyBank, Umbrella, Wallet2, Baby, Banknote, Gift, Clock3,
  Coins, Receipt, Landmark, HandCoins, GraduationCap, HeartHandshake, Timer, Globe,
  Building2, Snowflake, Users, TrendingUp, CalendarRange, HeartPulse, TrendingDown, Route,
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
      { href: "/gehaltserhoehung-rechner", label: "Gehaltserhöhung-Rechner", icon: TrendingUp, description: "Netto von der Erhöhung" },
      { href: "/jahresgehalt-rechner", label: "Jahresgehalt-Rechner", icon: CalendarRange, description: "Brutto & Netto pro Jahr" },
      { href: "/steuerklassenwechsel-rechner", label: "Steuerklassenwechsel", icon: Users, description: "3/5 oder 4/4 vergleichen" },
      { href: "/rechner/brutto-zu-netto", label: "Brutto zu Netto", icon: ArrowRightLeft, description: "Direkt umrechnen" },
      { href: "/rechner/netto-zu-brutto", label: "Netto zu Brutto", icon: ArrowRightLeft, description: "Für Gehaltsverhandlungen" },
      { href: "/steuerklassen", label: "Steuerklassen", icon: LayoutList, description: "Alle 6 Klassen im Vergleich" },
      { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar, description: "Reform-Eckwerte testen" },
    ],
  },
  {
    label: "Sozialleistungen",
    items: [
      { href: "/mindestlohn", label: "Mindestlohn Rechner", icon: Scale, description: "13,90 €/h ab 2026" },
      { href: "/minijob-rechner", label: "Minijob-Rechner", icon: Wallet2, description: "Verdienstgrenze 603 €" },
      { href: "/buergergeld-rechner", label: "Bürgergeld-Rechner", icon: HandCoins, description: "Regelsatz 563 € · SGB II" },
      { href: "/bafoeg-rechner", label: "BAföG-Rechner", icon: GraduationCap, description: "Anspruch für Studierende" },
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
      { href: "/witwenrente-rechner", label: "Witwenrente-Rechner", icon: HeartHandshake, description: "55 % / 25 % berechnen" },
      { href: "/abfindungsrechner", label: "Abfindungsrechner", icon: Banknote, description: "Fünftelregelung" },
      { href: "/weihnachtsgeld-rechner", label: "Weihnachtsgeld-Rechner", icon: Snowflake, description: "Netto vom Weihnachtsgeld" },
      { href: "/bonus-steuerrechner", label: "Bonus-Steuerrechner", icon: Gift, description: "Weihnachts- & Urlaubsgeld" },
      { href: "/stundenlohn-rechner", label: "Stundenlohn-Rechner", icon: Clock3, description: "Netto pro Stunde" },
      { href: "/teilzeitrechner", label: "Teilzeitrechner", icon: Timer, description: "Netto bei Teilzeit" },
      { href: "/werkstudent-rechner", label: "Werkstudent-Rechner", icon: GraduationCap, description: "Nur 9,3 % Rentenbeitrag" },
      { href: "/pendlerpauschale-rechner", label: "Pendlerpauschale-Rechner", icon: Route, description: "Entfernungspauschale" },
      { href: "/en/tax-calculator-germany", label: "Tax Calculator (EN)", icon: Globe, description: "German salary in English" },
    ],
  },
];

export const allCalculatorLinks: NavLink[] = calculatorGroups.flatMap((g) => g.items);
