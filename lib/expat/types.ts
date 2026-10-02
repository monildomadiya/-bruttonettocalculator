/**
 * Inhalte der Expat-Seiten: Gehalt in Deutschland, erklärt in der Sprache der
 * großen Zuwanderergruppen. Jede Sprache liefert drei Seiten (Rechner,
 * Steuerklassen, Mindestlohn) über dieselben Komponenten in
 * components/expat/. Eine neue Sprache = neue content-xx.ts + drei
 * winzige page.tsx + Eintrag in LANGUAGE_CLUSTER (lib/expat/cluster.ts).
 */

export type ExpatLang = "ro" | "tr" | "uk";

export interface Faq {
  q: string;
  a: string;
}

export interface SeitenText {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  /** Kurzname für Breadcrumb und Querverweise. */
  nav: string;
  h1: string;
  h1Akzent: string;
  badge: string;
  intro: string;
}

export interface ExpatContent {
  lang: ExpatLang;
  ogLocale: string;
  start: string;
  hinweisDeutsch: string;
  linkDeutsch: string;
  weitere: string;
  quellenLabel: string;
  calc: SeitenText & {
    beispieleTitel: string;
    beispieleIntro: string;
    spalteBrutto: string;
    spalteSk1: string;
    spalteSk3: string;
    abzuegeTitel: string;
    abzuege: string[];
    gehaltTitel: string;
    gehaltText: string;
    faqs: Faq[];
  };
  klassen: SeitenText & {
    tabelleTitel: string;
    tabelleIntro: string;
    spalteKlasse: string;
    klassen: { titel: string; text: string }[];
    wechselTitel: string;
    wechselText: string;
    faqs: Faq[];
  };
  mindestlohn: SeitenText & {
    tabelleTitel: string;
    tabelleIntro: string;
    spalteJahr: string;
    spalteStunde: string;
    spalteBruttoMonat: string;
    spalteNettoSk1: string;
    spalteNettoSk3: string;
    stundenTitel: string;
    spalteStundenWoche: string;
    minijobTitel: string;
    minijobText: string;
    faqs: Faq[];
  };
  faqTitel: string;
  quellen: string;
}
