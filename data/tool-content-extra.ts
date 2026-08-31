import { estFormel2026, BBG_2026 } from "@/lib/taxCalculator";
import { eur, eur2, pct, netto, LADDER } from "@/data/tool-content-shared";
import type { ToolContentConfig } from "@/components/ToolContent";

/**
 * Long-form content for the remaining calculator pages — second batch.
 *
 * Same contract and rationale as `data/tool-content.ts` (see the header there);
 * split off only because one file holding every config would be unreadable. The
 * registry in `tool-content.ts` merges both.
 *
 * Every figure quoted below is traceable either to a constant in
 * `lib/taxCalculator.ts` or to the FAQ already rendered on the same page, so the
 * new copy cannot contradict what the page already tells the visitor.
 */

/* ── local math ──────────────────────────────────────────────────────── */

/** Annual income tax for a given taxable income, single assessment (2026). */
const est = (zvE: number) => estFormel2026(Math.max(0, zvE));

/**
 * Marginal rate at a given taxable income, measured rather than derived: the
 * tax on the next 100 € of income. Avoids re-implementing the zone arithmetic
 * of § 32a EStG a second time, where it could drift from the engine.
 */
const grenzsatz = (zvE: number) => (est(zvE + 100) - est(zvE)) / 100;

/** Tax on a one-off payment stacked on top of a salary ("sonstige Bezüge"). */
const steuerAufEinmalzahlung = (zvEJahr: number, betrag: number) =>
  est(zvEJahr + betrag) - est(zvEJahr);

/**
 * Fünftelregelung, § 34 Abs. 1 EStG: a fifth of the severance is added to the
 * regular taxable income, and the resulting extra tax is multiplied by five.
 */
const fuenftelSteuer = (zvEJahr: number, abfindung: number) =>
  5 * (est(zvEJahr + abfindung / 5) - est(zvEJahr));

/**
 * Elterngeld replacement rate. 67 % applies between 1.000 € and 1.200 € net;
 * below that it rises by 0,1 percentage points per 2 € of lower income (capped
 * at 100 %), above it falls by the same step (floored at 65 %).
 */
function elterngeldSatz(nettoMonat: number): number {
  if (nettoMonat < 1000) return Math.min(100, 67 + ((1000 - nettoMonat) / 2) * 0.1);
  if (nettoMonat > 1200) return Math.max(65, 67 - ((nettoMonat - 1200) / 2) * 0.1);
  return 67;
}

/* ── /gehaltsrechner ─────────────────────────────────────────────────── */

const gehaltsrechner: ToolContentConfig = {
  heading: "Gehaltsrechner 2026: Vom Bruttogehalt zum Nettogehalt",
  answer:
    "Ein Gehaltsrechner ermittelt aus dem Bruttogehalt das Nettogehalt, das nach allen Abzügen auf dem Konto landet. Abgezogen werden Lohnsteuer nach § 32a EStG, Solidaritätszuschlag, gegebenenfalls Kirchensteuer sowie die Arbeitnehmeranteile zur Renten-, Kranken-, Pflege- und Arbeitslosenversicherung — zusammen 21,15 % bis zu den Beitragsbemessungsgrenzen.",
  facts: [
    { label: "Sozialabgaben Arbeitnehmer", value: "21,15 %" },
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "Krankenversicherung (AN-Anteil)", value: "8,75 %" },
    { label: "Rentenversicherung (AN-Anteil)", value: "9,3 %" },
    { label: "Pflegeversicherung kinderlos ab 23", value: "2,4 %" },
    { label: "Arbeitslosenversicherung (AN-Anteil)", value: "1,3 %" },
  ],
  steps: [
    {
      title: "Sozialabgaben abziehen",
      text: "Vom Bruttogehalt gehen zuerst die vier Arbeitnehmerbeiträge ab — aber nur bis zu den Beitragsbemessungsgrenzen von 5.812,50 € beziehungsweise 8.450 € im Monat.",
    },
    {
      title: "Zu versteuerndes Einkommen bilden",
      text: "Vom Bruttolohn werden Arbeitnehmer-Pauschbetrag, Vorsorgepauschale und die Freibeträge der jeweiligen [Steuerklasse](/steuerklassen) abgezogen.",
    },
    {
      title: "Lohnsteuer berechnen",
      text: "Auf das verbleibende Einkommen wird der progressive Tarif nach § 32a EStG angewandt, in Steuerklasse 3 im Splittingverfahren.",
    },
    {
      title: "Zuschläge und Zusatzbeitrag berücksichtigen",
      text: "Solidaritätszuschlag oberhalb der Freigrenze, gegebenenfalls Kirchensteuer, und der kassenindividuelle Zusatzbeitrag — voreingestellt ist der amtliche Durchschnitt von 2,9 %.",
    },
  ],
  table: {
    caption: "Brutto und Netto im Monat (Steuerklasse 1, 2026)",
    head: ["Brutto / Monat", "Sozialabgaben", "Steuern", "Netto / Monat"],
    rows: LADDER.map((b) => {
      const r = netto(b);
      return [eur(b), "−" + eur(r.sv.summeMonat), "−" + eur(r.steuer.summeMonat), eur(r.nettoMonat)];
    }),
    note: "Steuerklasse 1, kinderlos über 23 Jahre, ohne Kirchensteuer, durchschnittlicher Zusatzbeitrag 2,9 %. Bei 3.000 € brutto bleiben demnach rund 2.065 € netto.",
  },
  sections: [
    {
      h3: "Warum zwei Menschen mit gleichem Brutto unterschiedlich viel netto haben",
      body: [
        "Das Bruttogehalt allein bestimmt das Netto nicht. Den größten Unterschied macht die **Steuerklasse**: Zwischen Klasse 3 und Klasse 5 liegen bei identischem Brutto mehrere Hundert Euro im Monat. Welche Klasse infrage kommt, klärt der [Steuerklassen-Finder](/welche-steuerklasse-bin-ich); die Wirkung einer Kombination zeigt der [Steuerklassenwechsel-Rechner](/steuerklassenwechsel-rechner).",
        "Danach folgen der **Kinderlosenzuschlag** in der Pflegeversicherung (0,6 Prozentpunkte allein zulasten des Arbeitnehmers ab 23 Jahren ohne Kind), die **Kirchensteuer** mit 8 % in Bayern und Baden-Württemberg und 9 % sonst, und der **kassenindividuelle Zusatzbeitrag**, der sich je nach Krankenkasse um mehrere Zehntelprozentpunkte unterscheidet — nachrechnen lässt sich das im [Rechner mit Krankenkassenauswahl](/brutto-netto-rechner-krankenkasse).",
      ],
    },
    {
      h3: "Was der Gehaltsrechner nicht sieht",
      body: [
        "Einmalzahlungen werden als sonstige Bezüge anders besteuert als laufender Lohn — dafür gibt es den [Bonus-Steuerrechner](/bonus-steuerrechner), den [Weihnachtsgeld-Rechner](/weihnachtsgeld-rechner) und den [Urlaubsgeld-Rechner](/urlaubsgeld-rechner). Ein Dienstwagen erhöht als geldwerter Vorteil das steuerpflichtige Brutto: [Firmenwagenrechner](/firmenwagenrechner).",
        "Umgekehrt senken [Entgeltumwandlung in die betriebliche Altersvorsorge](/bav-rechner) und eingetragene Lohnsteuerfreibeträge das steuerpflichtige Einkommen. Und weil der Arbeitgeber nur pauschal mit dem Arbeitnehmer-Pauschbetrag von 1.230 € rechnet, holt die Steuererklärung oft Geld zurück — die Größenordnung schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner).",
      ],
    },
    {
      h3: "Gehalt einordnen und verhandeln",
      body: [
        "Ob das eigene Gehalt marktüblich ist, zeigt der Vergleich im [Durchschnittsgehalt Deutschland](/durchschnittsgehalt-deutschland). Für die Verhandlung selbst ist die umgekehrte Rechnung nützlicher: Welches Brutto ergibt ein gewünschtes Netto? Das löst der [Netto-zu-Brutto-Rechner](/rechner/netto-zu-brutto) iterativ auf.",
        "Wie viel von einer Erhöhung tatsächlich ankommt, beantwortet der [Gehaltserhöhung-Rechner](/gehaltserhoehung-rechner) — durch die Steuerprogression sind es meist deutlich weniger als die Hälfte. Was die Stelle den Arbeitgeber kostet, zeigt der [Arbeitgeber-Rechner](/arbeitgeber-brutto-netto-rechner).",
      ],
    },
  ],
  source: "§ 32a EStG · § 39b EStG · SGB IV/V/VI/XI",
};

/* ── /einkommensteuer-rechner ────────────────────────────────────────── */

const ZVE_LADDER = [15000, 25000, 40000, 60000, 80000, 120000];

const einkommensteuer: ToolContentConfig = {
  heading: "Einkommensteuer 2026 berechnen: Tarif, Grenz- und Durchschnittssatz",
  answer:
    "Die Einkommensteuer wird auf das zu versteuernde Einkommen nach dem Tarif des § 32a EStG erhoben. Bis zum Grundfreibetrag von 12.348 € fällt 2026 keine Steuer an. Darüber steigt der Satz progressiv von 14 % Eingangssteuersatz auf 42 % ab 69.878 € und 45 % ab 277.825 € zu versteuerndem Einkommen.",
  facts: [
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "Eingangssteuersatz", value: "14 %" },
    { label: "42 % ab zvE", value: "69.878 €" },
    { label: "45 % ab zvE", value: "277.825 €" },
    { label: "Solidaritätszuschlag", value: "5,5 % über der Freigrenze" },
    { label: "Soli-Freigrenze Einzel / Splitting", value: "20.350 € / 40.700 €" },
  ],
  steps: [
    {
      title: "Einkünfte zusammenrechnen",
      text: "Alle sieben Einkunftsarten werden summiert — bei Arbeitnehmern in aller Regel nur die Einkünfte aus nichtselbständiger Arbeit.",
    },
    {
      title: "Werbungskosten und Sonderausgaben abziehen",
      text: "Mindestens der Arbeitnehmer-Pauschbetrag von 1.230 €, dazu Vorsorgeaufwendungen und außergewöhnliche Belastungen. Das Ergebnis ist das zu versteuernde Einkommen.",
    },
    {
      title: "Tarif anwenden",
      text: "Grundtarif bei Einzelveranlagung; beim Splittingtarif für zusammen veranlagte Ehepaare wird das zvE halbiert, besteuert und die Steuer verdoppelt.",
    },
    {
      title: "Zuschläge aufschlagen",
      text: "Solidaritätszuschlag erst oberhalb der Freigrenze, dann gleitend in der Milderungszone; Kirchensteuer bei Mitgliedschaft.",
    },
  ],
  table: {
    caption: "Einkommensteuer 2026 nach zu versteuerndem Einkommen (Grundtarif)",
    head: ["zvE / Jahr", "Einkommensteuer", "Durchschnittssatz", "Grenzsteuersatz"],
    rows: ZVE_LADDER.map((z) => {
      const t = est(z);
      return [eur(z), eur(t), pct((t / z) * 100, 1), pct(grenzsatz(z) * 100, 1)];
    }),
    note: "Grundtarif nach § 32a EStG, ohne Solidaritätszuschlag und Kirchensteuer. Der Grenzsteuersatz ist hier als Steuer auf die nächsten 100 € Einkommen gemessen.",
  },
  sections: [
    {
      h3: "Grenzsteuersatz und Durchschnittssteuersatz nicht verwechseln",
      body: [
        "Der **Durchschnittssteuersatz** ist die gesamte Steuer im Verhältnis zum gesamten Einkommen — in der Tabelle oben die dritte Spalte. Der **Grenzsteuersatz** gibt an, wie der jeweils nächste verdiente Euro besteuert wird, und liegt immer darüber. Wer 40.000 € zu versteuerndes Einkommen hat, zahlt im Durchschnitt spürbar weniger als die 42 %, die in der Diskussion oft genannt werden.",
        "Praktisch relevant wird der Grenzsteuersatz überall dort, wo etwas **zusätzlich** hinzukommt: bei einer [Gehaltserhöhung](/gehaltserhoehung-rechner), einem [Bonus](/bonus-steuerrechner) oder Nebeneinkünften. Und umgekehrt bei allem, was abgezogen wird: Eine Werbungskostenposition spart genau den Grenzsteuersatz, nicht den Durchschnittssatz — deshalb wirken [Pendlerpauschale](/pendlerpauschale-rechner) und Co. bei höherem Einkommen stärker.",
      ],
    },
    {
      h3: "Der Solidaritätszuschlag betrifft nur noch wenige",
      body: [
        "Seit 2021 zahlen rund 90 % der Steuerpflichtigen keinen Soli mehr. Er setzt 2026 erst ab einer Jahres-Einkommensteuer von 20.350 € bei Einzelveranlagung beziehungsweise 40.700 € beim Splitting ein und steigt in einer Milderungszone gleitend auf die vollen 5,5 % — bei Überschreiten der Freigrenze werden zunächst nur 20 % des übersteigenden Betrags herangezogen.",
        "Der Effekt: Direkt oberhalb der Grenze ist der Soli klein und wächst dann überproportional. Wie sich das im Monatsnetto niederschlägt, zeigt der [Lohnsteuerrechner](/lohnsteuerrechner).",
      ],
    },
    {
      h3: "Von der Einkommensteuer zur Erstattung",
      body: [
        "Die Lohnsteuer ist nur eine Vorauszahlung auf die Einkommensteuer, berechnet aus einer Hochrechnung des laufenden Monatslohns. Weicht das tatsächliche Jahreseinkommen davon ab — durch Jobwechsel, [Teilzeit](/teilzeitrechner), Sonderzahlungen oder Lohnersatzleistungen —, entsteht eine Differenz, die erst die Steuererklärung ausgleicht.",
        "Was dabei herauskommen kann, schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner); die Freibeträge, die das zu versteuernde Einkommen senken, listet [Steuerfreibetrag 2026](/steuerfreibetrag-2026). Achtung bei Lohnersatzleistungen wie [Kranken-](/krankengeld-rechner), [Arbeitslosen-](/arbeitslosengeld-rechner) oder [Kurzarbeitergeld](/kurzarbeitergeld-rechner): Sie sind steuerfrei, erhöhen über den Progressionsvorbehalt aber den Satz auf das übrige Einkommen.",
      ],
    },
  ],
  source: "§ 32a EStG · § 32b EStG · § 3 SolZG",
};

/* ── /steuerrueckerstattung-rechner ──────────────────────────────────── */

const ZUSATZ_WK = 1500;

const steuerrueckerstattung: ToolContentConfig = {
  heading: "Steuerrückerstattung 2026: Wie viel kommt zurück?",
  answer:
    "Arbeitnehmer, die eine Steuererklärung abgeben, erhalten laut Statistischem Bundesamt im Durchschnitt rund 1.100 € zurück. Die Erstattung entsteht, weil der Arbeitgeber nur mit dem Arbeitnehmer-Pauschbetrag von 1.230 € rechnet. Wer höhere Werbungskosten nachweist, senkt sein zu versteuerndes Einkommen und bekommt die zu viel gezahlte Steuer erstattet.",
  facts: [
    { label: "Durchschnittliche Erstattung", value: "rund 1.100 €" },
    { label: "Arbeitnehmer-Pauschbetrag", value: "1.230 €" },
    { label: "Homeoffice-Pauschale", value: "6 € / Tag, max. 1.260 €" },
    { label: "Entfernungspauschale", value: "0,38 € / km" },
    { label: "Handwerkerleistungen", value: "20 % direkt von der Steuer" },
    { label: "Freiwillige Erklärung rückwirkend", value: "bis zu 4 Jahre" },
  ],
  steps: [
    {
      title: "Absetzbare Kosten sammeln",
      text: "Werbungskosten wie Arbeitsweg, Arbeitsmittel, Fortbildungen und Bewerbungskosten; dazu Sonderausgaben wie Spenden, Riester-Beiträge und Kirchensteuer.",
    },
    {
      title: "Gegen den Pauschbetrag rechnen",
      text: "Nur was die 1.230 € Arbeitnehmer-Pauschbetrag übersteigt, wirkt sich zusätzlich aus — darunter ist die Pauschale bereits berücksichtigt.",
    },
    {
      title: "Steuerersparnis ermitteln",
      text: "Der übersteigende Betrag senkt das zu versteuernde Einkommen. Die Ersparnis entspricht dem persönlichen Grenzsteuersatz auf diesen Betrag.",
    },
    {
      title: "Direkt abzugsfähige Posten addieren",
      text: "Handwerker- und Haushaltsdienstleistungen mindern die Steuerschuld zu 20 % unmittelbar — sie wirken also deutlich stärker als eine Werbungskostenposition gleicher Höhe.",
    },
  ],
  table: {
    caption: "Erstattung durch 1.500 € zusätzliche Werbungskosten (2026)",
    head: ["Brutto / Monat", "zvE / Jahr", "Grenzsteuersatz", "Erstattung"],
    rows: [2500, 3500, 4500, 6000].map((b) => {
      const r = netto(b);
      const z = r.steuer.zvE;
      const erstattung = est(z) - est(z - ZUSATZ_WK);
      return [eur(b), eur(z), pct(grenzsatz(z) * 100, 1), eur(erstattung)];
    }),
    note: "Vereinfachte Schätzung: Differenz der Jahres-Einkommensteuer mit und ohne 1.500 € zusätzliche Werbungskosten, Steuerklasse 1, ohne Soli und Kirchensteuer. Die verbindliche Höhe steht im Steuerbescheid.",
  },
  sections: [
    {
      h3: "Warum höhere Einkommen mehr zurückbekommen",
      body: [
        "Werbungskosten senken nicht die Steuer, sondern das zu versteuernde Einkommen. Was sie wert sind, hängt deshalb am **Grenzsteuersatz**: Dieselben 1.500 € bringen bei 2.500 € Monatsbrutto eine deutlich kleinere Erstattung als bei 6.000 €, wie die Tabelle zeigt. Der Grenzsteuersatz lässt sich am [Einkommensteuer-Rechner](/einkommensteuer-rechner) ablesen.",
        "Eine Ausnahme sind Handwerker- und Haushaltsdienstleistungen: Sie werden zu 20 % direkt von der Steuerschuld abgezogen, wirken also unabhängig vom Einkommen gleich stark.",
      ],
    },
    {
      h3: "Die Posten, die am häufigsten übersehen werden",
      body: [
        "Der **Arbeitsweg** ist bei den meisten der größte Einzelposten — seit 2026 mit 0,38 € je Entfernungskilometer ab dem ersten Kilometer, nachzurechnen im [Pendlerpauschale-Rechner](/pendlerpauschale-rechner). Ab rund 15 Kilometern und 220 Arbeitstagen ist der Pauschbetrag allein damit überschritten.",
        "Dazu kommen Homeoffice-Tage mit 6 € (höchstens 1.260 € im Jahr), Arbeitsmittel, Fachliteratur, Fortbildungen, Bewerbungskosten, doppelte Haushaltsführung und Umzüge aus beruflichem Anlass. Auf der Sonderausgabenseite lohnt der Blick auf [Riester-Beiträge](/riester-rechner) und die [betriebliche Altersvorsorge](/bav-rechner); die vollständige Übersicht der Freibeträge steht unter [Steuerfreibetrag 2026](/steuerfreibetrag-2026).",
      ],
    },
    {
      h3: "Fristen — und warum sich die freiwillige Erklärung fast immer lohnt",
      body: [
        "Bei Pflichtveranlagung endet die Frist für das Steuerjahr 2025 am 31. Juli 2026; mit Steuerberater oder Lohnsteuerhilfeverein verlängert sie sich bis Ende Februar 2027. Eine **freiwillige** Erklärung kann bis zu vier Jahre rückwirkend abgegeben werden — Erstattungen aus zurückliegenden Jahren sind also noch erreichbar.",
        "Zur Pflichtveranlagung führen unter anderem die Steuerklassenkombination 3/5, mehrere Arbeitsverhältnisse mit [Steuerklasse 6](/steuerklassen), eingetragene Lohnsteuerfreibeträge und Lohnersatzleistungen über 410 € im Jahr — Letzteres betrifft alle, die [Krankengeld](/krankengeld-rechner), [Arbeitslosengeld](/arbeitslosengeld-rechner), [Kurzarbeitergeld](/kurzarbeitergeld-rechner) oder [Elterngeld](/elterngeld-rechner) bezogen haben.",
      ],
    },
  ],
  source: "§ 9 EStG · § 9a EStG · § 35a EStG · § 46 EStG",
};

/* ── /bav-rechner ────────────────────────────────────────────────────── */

const BAV_BEITRAG = 200;

const bav: ToolContentConfig = {
  heading: "Betriebliche Altersvorsorge 2026: Was die Entgeltumwandlung netto kostet",
  answer:
    "Bei der Entgeltumwandlung wird ein Teil des Bruttogehalts in einen Beitrag zur betrieblichen Altersvorsorge umgewandelt. Weil dieser Teil steuer- und sozialabgabenfrei bleibt, sinkt das Nettogehalt deutlich weniger als der eingezahlte Betrag. 2026 sind bis 676 € im Monat steuerfrei und bis 338 € zusätzlich sozialabgabenfrei.",
  facts: [
    { label: "Steuerfrei bis (8 % BBG-RV)", value: "676 € / Monat" },
    { label: "Sozialabgabenfrei bis (4 % BBG-RV)", value: "338 € / Monat" },
    { label: "BBG Rentenversicherung 2026", value: "101.400 € / Jahr" },
    { label: "Pflicht-Arbeitgeberzuschuss", value: "15 %" },
    { label: "Ersparte Sozialabgaben (AN)", value: "21,15 %" },
    { label: "Rechtsgrundlage", value: "§ 3 Nr. 63 EStG" },
  ],
  steps: [
    {
      title: "Umwandlungsbetrag festlegen",
      text: "Im voll geförderten Bereich bis 338 € im Monat entfallen sowohl Steuern als auch Sozialabgaben. Zwischen 338 € und 676 € bleibt nur noch die Steuerfreiheit.",
    },
    {
      title: "Steuerpflichtiges Brutto reduzieren",
      text: "Der umgewandelte Betrag wird vom Bruttogehalt abgezogen, bevor Lohnsteuer und Sozialabgaben berechnet werden.",
    },
    {
      title: "Nettoaufwand ermitteln",
      text: "Die Differenz der beiden Nettogehälter — mit und ohne Umwandlung — ist der tatsächliche Aufwand aus eigener Tasche.",
    },
    {
      title: "Arbeitgeberzuschuss addieren",
      text: "Für Umwandlungen seit 2022 muss der Arbeitgeber 15 % zuschießen, soweit er selbst Sozialabgaben spart — auf 100 € Beitrag also mindestens 15 € obendrauf.",
    },
  ],
  table: {
    caption: "200 € monatlich umwandeln — Nettoaufwand 2026 (Steuerklasse 1)",
    head: ["Brutto / Monat", "Netto ohne bAV", "Netto mit bAV", "Nettoaufwand", "Förderquote"],
    rows: [2500, 3500, 4500, 6000].map((b) => {
      const ohne = netto(b).nettoMonat;
      const mit = netto(b - BAV_BEITRAG).nettoMonat;
      const aufwand = ohne - mit;
      return [
        eur(b),
        eur(ohne),
        eur(mit),
        eur(aufwand),
        pct((1 - aufwand / BAV_BEITRAG) * 100, 0),
      ];
    }),
    note: "Die Förderquote ist der Anteil des Beitrags, den Steuer- und Abgabenersparnis übernehmen. Der gesetzliche Arbeitgeberzuschuss von 15 % kommt zusätzlich hinzu und ist hier noch nicht eingerechnet.",
  },
  sections: [
    {
      h3: "Warum 200 € Beitrag keine 200 € Netto kosten",
      body: [
        "Der umgewandelte Betrag wird aus dem **Bruttogehalt** entnommen, also bevor Steuern und Sozialabgaben greifen. Wer 200 € umwandelt, verliert netto typischerweise nur rund die Hälfte davon — den Rest tragen ersparte Lohnsteuer (zum persönlichen Grenzsteuersatz) und ersparte Sozialabgaben (21,15 % bis zur Beitragsbemessungsgrenze).",
        "Mit steigendem Einkommen wächst die Steuerersparnis, weil der [Grenzsteuersatz](/einkommensteuer-rechner) steigt. Oberhalb der [Beitragsbemessungsgrenzen](/beitragsbemessungsgrenze-2026) fällt allerdings die Sozialabgabenersparnis weg, weil dort ohnehin keine Beiträge mehr anfallen — die Förderquote sinkt dann wieder etwas.",
      ],
    },
    {
      h3: "Die Kehrseite: niedrigeres beitragspflichtiges Brutto",
      body: [
        "Weil das sozialversicherungspflichtige Entgelt sinkt, fallen auch die erworbenen Entgeltpunkte und damit die spätere gesetzliche Rente etwas niedriger aus — die Größenordnung zeigt der [Rentenpunkte-Rechner](/rentenpunkte-rechner). Aus demselben Grund sinken die Bemessungsgrundlagen für [Arbeitslosengeld](/arbeitslosengeld-rechner), [Krankengeld](/krankengeld-rechner) und [Elterngeld](/elterngeld-rechner).",
        "In der Auszahlungsphase sind bAV-Renten voll steuerpflichtig und in der gesetzlichen Krankenversicherung der Rentner beitragspflichtig — die Förderung ist also eine Verschiebung, keine Befreiung. Für die meisten überwiegt die hohe Förderquote in der Ansparphase dennoch deutlich.",
      ],
    },
    {
      h3: "bAV, Riester oder freiwillig anlegen?",
      body: [
        "Die bAV punktet vor allem über den Pflichtzuschuss des Arbeitgebers und die Sozialabgabenfreiheit. [Riester](/riester-rechner) ist dagegen dort stark, wo Zulagen den Eigenbeitrag dominieren — also bei Familien mit Kindern und bei niedrigen Einkommen.",
        "Wer stattdessen Vermögen aufbauen will, sollte die Besteuerung von Kapitalerträgen kennen: [Abgeltungssteuer](/abgeltungssteuer-rechner) mit 26,375 % inklusive Soli. Und wer über Immobilien nachdenkt, findet die Belastungsrechnung im [Immobilienkredit-Rechner](/immobilienkredit-rechner).",
      ],
    },
  ],
  source: "§ 3 Nr. 63 EStG · § 1a BetrAVG · § 1 Abs. 1 Nr. 9 SvEV",
};

/* ── /riester-rechner ────────────────────────────────────────────────── */

const riester: ToolContentConfig = {
  heading: "Riester-Rente 2026: Zulagen, Mindesteigenbeitrag und Steuervorteil",
  answer:
    "Die Riester-Grundzulage beträgt 175 € im Jahr, je Kind kommen 300 € hinzu (185 € für vor 2008 geborene Kinder). Für die volle Förderung müssen insgesamt 4 % des rentenversicherungspflichtigen Vorjahresbruttos in den Vertrag fließen, höchstens 2.100 € — abzüglich der Zulagen, mindestens aber der Sockelbetrag von 60 €.",
  facts: [
    { label: "Grundzulage", value: "175 € / Jahr" },
    { label: "Kinderzulage (ab 2008 geboren)", value: "300 € / Jahr" },
    { label: "Kinderzulage (vor 2008 geboren)", value: "185 € / Jahr" },
    { label: "Berufseinsteiger-Bonus unter 25", value: "einmalig 200 €" },
    { label: "Gesamtbeitrag für volle Förderung", value: "4 % des Vorjahresbruttos" },
    { label: "Höchstbetrag / Sockelbetrag", value: "2.100 € / 60 €" },
  ],
  steps: [
    {
      title: "Vorjahresbrutto heranziehen",
      text: "Maßgeblich ist das rentenversicherungspflichtige Bruttoeinkommen des Vorjahres, nicht das laufende.",
    },
    {
      title: "Gesamtbeitrag bestimmen",
      text: "4 % davon, höchstens 2.100 € im Jahr. Dieser Betrag muss inklusive der staatlichen Zulagen auf dem Vertrag eingehen.",
    },
    {
      title: "Zulagen abziehen",
      text: "Grundzulage 175 € plus Kinderzulagen. Was übrig bleibt, ist der Mindest-Eigenbeitrag — mindestens jedoch 60 € im Jahr.",
    },
    {
      title: "Günstigerprüfung abwarten",
      text: "Das Finanzamt prüft automatisch, ob der Sonderausgabenabzug bis 2.100 € mehr bringt als die Zulagen, und wendet die günstigere Variante an.",
    },
  ],
  table: {
    caption: "Mindest-Eigenbeitrag 2026 nach Einkommen und Kinderzahl",
    head: ["Vorjahresbrutto", "4 % gesamt", "ohne Kind", "1 Kind (ab 2008)", "2 Kinder"],
    rows: [20000, 30000, 40000, 52500].map((b) => {
      const gesamt = Math.min(2100, b * 0.04);
      const eigen = (zulagen: number) => eur(Math.max(60, gesamt - zulagen));
      return [eur(b), eur(gesamt), eigen(175), eigen(175 + 300), eigen(175 + 600)];
    }),
    note: "Eigenbeitrag pro Jahr, gerundet. Der Sockelbetrag von 60 € greift, sobald die Zulagen den erforderlichen Gesamtbeitrag übersteigen — bei mehreren Kindern und mittlerem Einkommen ist das der Regelfall.",
  },
  sections: [
    {
      h3: "Für wen sich Riester rechnet — und für wen weniger",
      body: [
        "Die Förderquote hängt fast vollständig an den Zulagen im Verhältnis zum Eigenbeitrag. **Familien mit Kindern** fahren deshalb am besten: Bei zwei nach 2008 geborenen Kindern decken allein die Zulagen 775 € im Jahr, sodass der Eigenbeitrag in vielen Fällen auf den Sockelbetrag von 60 € fällt — die Tabelle oben zeigt das deutlich.",
        "**Gutverdiener ohne Kinder** profitieren dagegen weniger über die Zulagen als über den Sonderausgabenabzug bis 2.100 €, dessen Wert am [Grenzsteuersatz](/einkommensteuer-rechner) hängt. Wer bereits eine [betriebliche Altersvorsorge](/bav-rechner) mit Arbeitgeberzuschuss nutzt, sollte beide Wege gegeneinander rechnen.",
      ],
    },
    {
      h3: "Der häufigste Fehler: zu wenig einzahlen",
      body: [
        "Wird weniger als der Mindest-Eigenbeitrag eingezahlt, kürzt die Zulagenstelle die staatlichen Zulagen **anteilig** — wer also nur die Hälfte einzahlt, verliert die Hälfte der Zulagen. Weil sich der Mindestbeitrag am Vorjahresbrutto bemisst, muss er nach jeder Gehaltsänderung neu geprüft werden; genau daran scheitern viele Verträge stillschweigend.",
        "Ebenfalls oft vergessen: Der Dauerzulagenantrag muss gestellt sein, und Kinderzulagen laufen mit dem Kindergeldanspruch aus. Wie sich das Bruttoeinkommen entwickelt, auf das sich die 4 % beziehen, lässt sich mit dem [Gehaltsrechner](/gehaltsrechner) und dem [Jahresgehalt-Rechner](/jahresgehalt-rechner) nachhalten.",
      ],
    },
    {
      h3: "In der Auszahlungsphase",
      body: [
        "Riester-Renten sind in der Auszahlungsphase **voll steuerpflichtig** — die Förderung verschiebt die Besteuerung, sie hebt sie nicht auf. Der Steuersatz im Ruhestand liegt allerdings meist unter dem im Erwerbsleben, weshalb die Rechnung für die meisten dennoch aufgeht.",
        "Die spätere gesetzliche Rente als Vergleichsgröße liefert der [Rentenpunkte-Rechner](/rentenpunkte-rechner); die Gesamtübersicht steht im [Rentenrechner](/rentenrechner). Wer die Grundsicherung im Alter im Blick hat, sollte die Anrechnungsregeln im [Grundsicherung-Rechner](/grundsicherung-rechner) prüfen — Riester-Renten bleiben dort bis zu einem Freibetrag anrechnungsfrei.",
      ],
    },
  ],
  source: "§ 10a EStG · §§ 79 ff. EStG (Altersvorsorgezulage)",
};

/* ── /rentenpunkte-rechner ───────────────────────────────────────────── */

const RENTENWERT = 42.52;
const DURCHSCHNITTSENTGELT = 51944;

const rentenpunkte: ToolContentConfig = {
  heading: "Rentenpunkte 2026: Was ein Entgeltpunkt wert ist",
  answer:
    "Ein Entgeltpunkt ist seit dem 1. Juli 2026 bundeseinheitlich 42,52 € monatliche Bruttorente wert, nach einer Rentenanpassung von 4,24 %. Einen vollen Entgeltpunkt erhält, wer in einem Kalenderjahr genau das Durchschnittsentgelt aller Versicherten verdient — 2026 vorläufig 51.944 € brutto im Jahr.",
  facts: [
    { label: "Aktueller Rentenwert (ab 1.7.2026)", value: "42,52 € / Punkt" },
    { label: "Rentenanpassung 2026", value: "+4,24 %" },
    { label: "Durchschnittsentgelt 2026 (vorläufig)", value: "51.944 € / Jahr" },
    { label: "Beitragssatz Rentenversicherung", value: "18,6 % (AN 9,3 %)" },
    { label: "Beitragsbemessungsgrenze RV", value: "101.400 € / Jahr" },
    { label: "Maximale Punkte pro Jahr", value: "rund 1,95" },
  ],
  steps: [
    {
      title: "Entgeltpunkte je Jahr bestimmen",
      text: "Das eigene rentenversicherungspflichtige Bruttojahresentgelt geteilt durch das Durchschnittsentgelt von 51.944 € ergibt die Punkte für dieses Jahr.",
    },
    {
      title: "Über alle Beitragsjahre summieren",
      text: "Die Jahrespunkte werden addiert. Kindererziehungs-, Ausbildungs- und Anrechnungszeiten kommen hinzu.",
    },
    {
      title: "Mit dem Rentenwert multiplizieren",
      text: "Summe der Entgeltpunkte × 42,52 € ergibt die monatliche Bruttorente, jeweils multipliziert mit Zugangs- und Rentenartfaktor (bei der regulären Altersrente beide 1,0).",
    },
    {
      title: "Abzüge einplanen",
      text: "Von der Bruttorente gehen noch Beiträge zur Kranken- und Pflegeversicherung ab, bei entsprechender Höhe zusätzlich Steuern.",
    },
  ],
  table: {
    caption: "Entgeltpunkte und Rentenanspruch nach Bruttojahresgehalt (2026)",
    head: ["Brutto / Jahr", "Punkte / Jahr", "Rente je Beitragsjahr", "nach 40 Jahren"],
    rows: [30000, 40000, 51944, 70000, 101400].map((b) => {
      const punkte = Math.min(b, 101400) / DURCHSCHNITTSENTGELT;
      return [
        eur(b),
        punkte.toFixed(2).replace(".", ","),
        eur2(punkte * RENTENWERT),
        eur(punkte * RENTENWERT * 40),
      ];
    }),
    note: "Bruttorente vor Kranken- und Pflegeversicherungsbeiträgen und vor Steuern. Die Rechnung unterstellt über alle 40 Jahre dasselbe relative Einkommen; oberhalb der Beitragsbemessungsgrenze von 101.400 € entstehen keine weiteren Punkte.",
  },
  sections: [
    {
      h3: "Warum die Punktzahl relativ ist, nicht absolut",
      body: [
        "Ein Entgeltpunkt misst nicht, wie viel jemand verdient hat, sondern **wie viel im Verhältnis zum Durchschnitt aller Versicherten**. Wer genau das Durchschnittsentgelt verdient, bekommt exakt einen Punkt; wer das Doppelte verdient, zwei — begrenzt allerdings durch die Beitragsbemessungsgrenze von 101.400 €, oberhalb derer keine Beiträge und damit keine Punkte mehr entstehen. Das Maximum liegt so bei rund 1,95 Punkten im Jahr.",
        "Diese Relativität hat einen angenehmen Nebeneffekt: Steigen die Löhne allgemein, steigt auch das Durchschnittsentgelt — die eigenen bereits erworbenen Punkte behalten ihren relativen Wert und werden über die jährliche Rentenanpassung, 2026 um 4,24 %, mit angehoben.",
      ],
    },
    {
      h3: "Was die Punktzahl außerdem erhöht — und was sie senkt",
      body: [
        "Neben Beitragszeiten zählen **Kindererziehungszeiten** (bis zu drei Jahre je Kind, ab Geburten 1992), Zeiten der Pflege von Angehörigen, Ausbildungszeiten und Zeiten des Bezugs von Lohnersatzleistungen. Ein früherer Rentenbeginn senkt dagegen über den Zugangsfaktor die Rente um 0,3 % je vorgezogenem Monat.",
        "Senkend wirkt auch alles, was das beitragspflichtige Brutto reduziert — vor allem die [Entgeltumwandlung in die bAV](/bav-rechner). Bei einem [Minijob](/minijob-rechner) entstehen nur dann volle Punkte, wenn auf die Befreiung von der Rentenversicherungspflicht verzichtet wird; im [Midijob](/midijob-rechner) dagegen werden die Punkte trotz reduzierter Beiträge aus dem vollen Entgelt ermittelt.",
      ],
    },
    {
      h3: "Von der Bruttorente zur Auszahlung",
      body: [
        "Die Punkterechnung liefert eine **Bruttorente**. Davon gehen Beiträge zur Kranken- und Pflegeversicherung der Rentner ab, und oberhalb des Grundfreibetrags fällt Einkommensteuer an — der steuerpflichtige Anteil richtet sich nach dem Jahr des Rentenbeginns.",
        "Die vollständige Prognose inklusive Beitragsberechnung liefert der [Rentenrechner](/rentenrechner). Hinterbliebenenansprüche leiten sich von derselben Rente ab: 55 % beziehungsweise 25 % — nachzurechnen im [Witwenrente-Rechner](/witwenrente-rechner). Reicht die Rente nicht, greift die [Grundsicherung im Alter](/grundsicherung-rechner).",
      ],
    },
  ],
  source: "§ 63 SGB VI · § 68 SGB VI · § 77 SGB VI",
};

/* ── /elterngeld-rechner ─────────────────────────────────────────────── */

const elterngeld: ToolContentConfig = {
  heading: "Elterngeld 2026: Höhe, Prozentsatz und ElterngeldPlus",
  answer:
    "Das Basiselterngeld ersetzt 65 bis 100 % des durchschnittlichen Nettoeinkommens der zwölf Monate vor der Geburt — mindestens 300 € und höchstens 1.800 € im Monat. Zwischen 1.000 € und 1.200 € Nettoeinkommen gilt die Standardrate von 67 %; darunter steigt sie, darüber sinkt sie schrittweise.",
  facts: [
    { label: "Ersatzrate", value: "65 – 100 %" },
    { label: "Standardrate (1.000 – 1.200 € netto)", value: "67 %" },
    { label: "Mindestbetrag", value: "300 € / Monat" },
    { label: "Höchstbetrag", value: "1.800 € / Monat" },
    { label: "Bemessungszeitraum", value: "12 Monate vor der Geburt" },
    { label: "Einkommensgrenze (zvE beider Eltern)", value: "175.000 €" },
  ],
  steps: [
    {
      title: "Bemessungsnetto ermitteln",
      text: "Durchschnittliches Nettoeinkommen der zwölf Kalendermonate vor dem Geburtsmonat, bei Mutterschaftsgeldbezug entsprechend verschoben.",
    },
    {
      title: "Prozentsatz bestimmen",
      text: "67 % zwischen 1.000 € und 1.200 €. Unterhalb steigt der Satz um 0,1 Prozentpunkte je 2 € geringerem Einkommen bis maximal 100 %, oberhalb sinkt er im selben Schritt bis minimal 65 %.",
    },
    {
      title: "Grenzen anwenden",
      text: "Das Ergebnis wird auf mindestens 300 € angehoben und auf höchstens 1.800 € gedeckelt.",
    },
    {
      title: "Bezugsvariante wählen",
      text: "Basiselterngeld für bis zu 14 Monate zwischen beiden Elternteilen, oder ElterngeldPlus mit halbem Betrag über die doppelte Dauer.",
    },
  ],
  table: {
    caption: "Basiselterngeld nach Nettoeinkommen vor der Geburt (2026)",
    head: ["Netto vorher", "Ersatzrate", "Basiselterngeld", "ElterngeldPlus"],
    rows: [900, 1100, 1500, 2000, 2800].map((n) => {
      const satz = elterngeldSatz(n);
      const roh = (n * satz) / 100;
      const eg = Math.min(1800, Math.max(300, roh));
      return [eur(n), pct(satz, 1), eur(eg), eur(eg / 2)];
    }),
    note: "ElterngeldPlus entspricht dem halben Basisbetrag, wird dafür aber doppelt so lange gezahlt. Der Höchstbetrag von 1.800 € ist ab rund 2.770 € Bemessungsnetto erreicht.",
  },
  sections: [
    {
      h3: "Die Steuerklasse entscheidet früher, als die meisten denken",
      body: [
        "Elterngeld bemisst sich am **Nettoeinkommen** der zwölf Monate vor der Geburt. Damit wirkt die [Steuerklasse](/steuerklassen) unmittelbar auf die Leistungshöhe: Wer in Klasse 5 abgerechnet wird, hat ein niedrigeres Netto und bekommt entsprechend weniger Elterngeld — bei gleichem Bruttogehalt.",
        "Ein Wechsel in die günstigere Klasse muss deshalb **früh** erfolgen, weil der komplette Zwölfmonatszeitraum vor der Geburt zählt. Die Varianten vergleicht der [Steuerklassenwechsel-Rechner](/steuerklassenwechsel-rechner). Die Finanzverwaltung akzeptiert den Wechsel, solange er nicht ausschließlich unmittelbar vor Leistungsbeginn erfolgt.",
      ],
    },
    {
      h3: "Basiselterngeld, ElterngeldPlus und Partnerschaftsbonus",
      body: [
        "**Basiselterngeld** gibt es für maximal 14 Monate, wenn sich beide Elternteile beteiligen (12 Monate plus 2 Partnermonate). **ElterngeldPlus** halbiert den Monatsbetrag und verdoppelt die Bezugsdauer — was sich vor allem lohnt, wenn während des Bezugs bereits in Teilzeit gearbeitet wird, weil der Zuverdienst dann nicht den vollen Betrag aufzehrt.",
        "Wie sich eine Teilzeitstelle auf Brutto und Netto auswirkt, zeigt der [Teilzeitrechner](/teilzeitrechner); den Weg von der Stundenzahl zum Monatsbrutto rechnet der [Stundenlohn-Rechner](/stundenlohn-rechner).",
      ],
    },
    {
      h3: "Progressionsvorbehalt und Einkommensgrenze",
      body: [
        "Elterngeld ist **steuerfrei**, unterliegt aber dem Progressionsvorbehalt: Es erhöht den Steuersatz auf das übrige Jahreseinkommen. Wer im Bezugsjahr noch anderes Einkommen hatte, muss deshalb häufig mit einer Nachzahlung rechnen — und ist ab 410 € Lohnersatzleistungen zur Steuererklärung verpflichtet. Die Größenordnung liefert der [Einkommensteuer-Rechner](/einkommensteuer-rechner).",
        "Seit 2024 entfällt der Anspruch vollständig, wenn das zu versteuernde Einkommen beider Elternteile im letzten abgeschlossenen Kalenderjahr vor der Geburt 175.000 € übersteigt. Dieselbe Logik des Progressionsvorbehalts gilt für [Krankengeld](/krankengeld-rechner), [Arbeitslosengeld](/arbeitslosengeld-rechner) und [Kurzarbeitergeld](/kurzarbeitergeld-rechner).",
      ],
    },
  ],
  source: "§§ 2, 4 BEEG · § 32b EStG",
};

/* ── /abfindungsrechner ──────────────────────────────────────────────── */

const abfindung: ToolContentConfig = {
  heading: "Abfindung versteuern 2026: Fünftelregelung im Detail",
  answer:
    "Abfindungen werden nach der Fünftelregelung des § 34 Abs. 1 EStG besteuert: Ein Fünftel wird rechnerisch zum übrigen zu versteuernden Einkommen addiert, die daraus entstehende Mehrsteuer wird mit fünf multipliziert. Sozialversicherungsbeiträge fallen auf Abfindungen nicht an — weder Renten-, Kranken-, Pflege- noch Arbeitslosenversicherung.",
  facts: [
    { label: "Besteuerung", value: "Fünftelregelung § 34 EStG" },
    { label: "Sozialversicherung", value: "beitragsfrei" },
    { label: "Solidaritätszuschlag", value: "5,5 % über der Freigrenze" },
    { label: "Kirchensteuer", value: "8 % / 9 %, oft Teilerlass" },
    { label: "Anwendung durch das Finanzamt", value: "automatisch, wenn günstiger" },
    { label: "Faustregel Höhe", value: "0,5 Monatsgehälter je Beschäftigungsjahr" },
  ],
  steps: [
    {
      title: "Übriges Jahreseinkommen bestimmen",
      text: "Das zu versteuernde Einkommen ohne die Abfindung — je niedriger es ist, desto stärker wirkt die Fünftelregelung.",
    },
    {
      title: "Ein Fünftel hinzurechnen",
      text: "Auf das zu versteuernde Einkommen plus ein Fünftel der Abfindung wird die Einkommensteuer berechnet.",
    },
    {
      title: "Differenz mit fünf multiplizieren",
      text: "Die Mehrsteuer gegenüber der Steuer ohne Abfindung wird verfünffacht. Das ist die Steuer auf die gesamte Abfindung.",
    },
    {
      title: "Mit der Regelbesteuerung vergleichen",
      text: "Das Finanzamt wendet die Fünftelregelung nur an, wenn sie günstiger ist als die normale Versteuerung.",
    },
  ],
  table: {
    caption: "50.000 € Abfindung: Fünftelregelung gegenüber Regelbesteuerung (2026)",
    head: ["übriges zvE", "Steuer regulär", "Steuer nach § 34", "Ersparnis"],
    rows: [0, 15000, 30000, 50000, 80000].map((z) => {
      const regulaer = est(z + 50000) - est(z);
      const gefuenftelt = fuenftelSteuer(z, 50000);
      return [
        z === 0 ? "0 € (ganzjährig ohne Lohn)" : eur(z),
        eur(regulaer),
        eur(gefuenftelt),
        eur(Math.max(0, regulaer - gefuenftelt)),
      ];
    }),
    note: "Nur Einkommensteuer im Grundtarif, ohne Solidaritätszuschlag und Kirchensteuer. Gut sichtbar: Die Entlastung ist am größten, wenn das übrige Jahreseinkommen niedrig ist, und läuft im Spitzensteuersatzbereich gegen null.",
  },
  sections: [
    {
      h3: "Wann die Fünftelregelung wirklich etwas bringt",
      body: [
        "Die Regelung mildert die **Progression**, nicht die Steuer als solche. Ihr Effekt ist deshalb am größten, wenn die Abfindung im Verhältnis zum übrigen Jahreseinkommen hoch ist — etwa bei einem Ausscheiden zu Jahresbeginn oder bei anschließender Arbeitslosigkeit. Liegt das übrige Einkommen bereits im Bereich des Spitzensteuersatzes, ist der Vorteil praktisch aufgezehrt, wie die letzte Tabellenzeile zeigt.",
        "Wichtig für die Planung: Seit 2025 wenden Arbeitgeber die Fünftelregelung nicht mehr direkt im Lohnsteuerabzug an. Sie wird erst über die **Steuererklärung** berücksichtigt — im Auszahlungsmonat wird also zunächst mehr einbehalten und das Geld kommt später zurück. Die Erstattung schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner).",
      ],
    },
    {
      h3: "Die Steuerlast auf die Abfindung aktiv senken",
      body: [
        "Der wirksamste Hebel ist der **Zeitpunkt**: Wird die Abfindung in ein Jahr mit niedrigem sonstigem Einkommen verschoben, sinkt die Steuer erheblich. Ein Aufhebungsvertrag mit Auszahlung im Januar des Folgejahres ist deshalb ein üblicher und zulässiger Gestaltungsweg.",
        "Zweiter Hebel: Ein Teil der Abfindung kann als Sonderausgabe in eine Basis- oder Rürup-Rente eingezahlt werden. Auch [Riester-Beiträge](/riester-rechner) und eine [betriebliche Altersvorsorge](/bav-rechner) mindern das zu versteuernde Einkommen. Bei der Kirchensteuer gewähren viele Landeskirchen auf Antrag einen Teilerlass von rund 50 % auf außerordentliche Einkünfte.",
      ],
    },
    {
      h3: "Abfindung, Arbeitslosengeld und Sperrzeit",
      body: [
        "Weil Abfindungen sozialversicherungsfrei sind, mindern sie das [Arbeitslosengeld](/arbeitslosengeld-rechner) grundsätzlich nicht. Wird jedoch die ordentliche Kündigungsfrist nicht eingehalten, kann der Anspruch nach § 158 SGB III ruhen; ein Aufhebungsvertrag ohne wichtigen Grund kann zusätzlich eine Sperrzeit von bis zu zwölf Wochen auslösen.",
        "Für die Zeit danach lohnt der Blick auf das Nettoniveau der neuen Stelle mit dem [Brutto-Netto-Rechner](/) und — falls die Rente näher rückt — auf den [Rentenpunkte-Rechner](/rentenpunkte-rechner), da beitragsfreie Abfindungen keine Entgeltpunkte erzeugen.",
      ],
    },
  ],
  source: "§ 34 Abs. 1 EStG · § 24 Nr. 1 EStG · § 158 SGB III",
};

/* ── /bonus-steuerrechner ────────────────────────────────────────────── */

const BONUS = 3000;

const bonus: ToolContentConfig = {
  heading: "Bonus und Sonderzahlungen 2026: Was netto übrig bleibt",
  answer:
    "Bonus, Weihnachts- und Urlaubsgeld gelten steuerlich als sonstige Bezüge. Sie werden dem Jahresarbeitslohn hinzugerechnet und nach der Jahreslohnsteuertabelle versteuert — die Steuer entspricht der Differenz zwischen der Steuer auf Jahresgehalt plus Bonus und der Steuer auf das Jahresgehalt allein. Sozialabgaben fallen zusätzlich an, soweit die Beitragsbemessungsgrenzen noch nicht ausgeschöpft sind.",
  facts: [
    { label: "Steuerliche Einordnung", value: "sonstige Bezüge" },
    { label: "Sozialabgaben", value: "ja, bis zur BBG" },
    { label: "BBG Kranken-/Pflegeversicherung", value: "69.750 € / Jahr" },
    { label: "BBG Renten-/Arbeitslosenvers.", value: "101.400 € / Jahr" },
    { label: "Maßgeblicher Steuersatz", value: "Grenzsteuersatz" },
    { label: "Ausgleich zu viel gezahlter Steuer", value: "über die Steuererklärung" },
  ],
  steps: [
    {
      title: "Jahresarbeitslohn hochrechnen",
      text: "Der laufende Monatslohn wird auf das Jahr hochgerechnet — das ist die Basis, auf die der Bonus aufgesetzt wird.",
    },
    {
      title: "Steuer mit und ohne Bonus vergleichen",
      text: "Die Jahressteuer auf Jahreslohn plus Bonus abzüglich der Jahressteuer auf den Jahreslohn allein ergibt die Steuer auf den Bonus.",
    },
    {
      title: "Sozialabgaben prüfen",
      text: "Beiträge fallen nur an, soweit die Jahres-Beitragsbemessungsgrenze noch nicht erreicht ist. Wer bereits darüber liegt, erhält den Bonus beitragsfrei.",
    },
    {
      title: "Jahresausgleich abwarten",
      text: "Weil der Abzug im Auszahlungsmonat auf einer Hochrechnung beruht, gleicht der Lohnsteuerjahresausgleich oder die Steuererklärung Abweichungen aus.",
    },
  ],
  table: {
    caption: "3.000 € Bonus: Steuer und Netto nach Gehaltshöhe (Steuerklasse 1, 2026)",
    head: ["Brutto / Monat", "Steuer auf den Bonus", "Grenzsteuersatz", "netto vom Bonus"],
    rows: [2500, 3500, 4500, 6000, 8000].map((b) => {
      const r = netto(b);
      const z = r.steuer.zvE;
      const steuer = steuerAufEinmalzahlung(z, BONUS);
      // Social security applies only up to the annual ceilings.
      const restKvPv = Math.max(0, BBG_2026.kvPvJahr - b * 12);
      const restRvAlv = Math.max(0, BBG_2026.rvAlvJahr - b * 12);
      const sv =
        Math.min(BONUS, restKvPv) * (BBG_2026.anSatzKv + BBG_2026.anSatzPv) +
        Math.min(BONUS, restRvAlv) * (BBG_2026.anSatzRv + BBG_2026.anSatzAlv);
      return [
        eur(b),
        "−" + eur(steuer),
        pct(grenzsatz(z) * 100, 1),
        eur(BONUS - steuer - sv),
      ];
    }),
    note: "Einkommensteuer im Grundtarif ohne Soli und Kirchensteuer, Sozialabgaben nur auf den Teil des Bonus, der noch unter der jeweiligen Beitragsbemessungsgrenze liegt. Bei 8.000 € Monatsbrutto ist die KV/PV-Grenze bereits ausgeschöpft.",
  },
  sections: [
    {
      h3: "Warum vom Bonus gefühlt die Hälfte verschwindet",
      body: [
        "Der Bonus wird **oben auf** das reguläre Gehalt gesetzt und damit vollständig mit dem [Grenzsteuersatz](/einkommensteuer-rechner) belastet — nicht mit dem deutlich niedrigeren Durchschnittssteuersatz, den man vom Monatsgehalt gewohnt ist. Dazu kommen bis zu 21,15 % Sozialabgaben. Dass am Ende rund die Hälfte ankommt, ist deshalb der Normalfall und kein Abrechnungsfehler.",
        "Ein Trost steckt in der Tabelle: Bei sehr hohen Gehältern steigt der Nettoanteil wieder, weil die [Beitragsbemessungsgrenzen](/beitragsbemessungsgrenze-2026) bereits ausgeschöpft sind und auf den Bonus keine Sozialabgaben mehr entfallen.",
      ],
    },
    {
      h3: "Wenn im Auszahlungsmonat zu viel abgezogen wurde",
      body: [
        "Der Lohnsteuerabzug auf sonstige Bezüge beruht auf einer **Hochrechnung** des voraussichtlichen Jahresarbeitslohns. Fällt das tatsächliche Jahreseinkommen niedriger aus — etwa nach einem Jobwechsel, unbezahltem Urlaub oder einem Wechsel in [Teilzeit](/teilzeitrechner) —, war der Abzug zu hoch und die Differenz kommt über die Steuererklärung zurück. Die Größenordnung schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner).",
        "Für die einzelnen Zahlungsarten gibt es eigene Rechner: [Weihnachtsgeld](/weihnachtsgeld-rechner), [Urlaubsgeld](/urlaubsgeld-rechner) und ausgezahlte [Überstunden](/ueberstunden-rechner). Anders liegt der Fall bei einer [Abfindung](/abfindungsrechner) — die ist sozialversicherungsfrei und wird nach der Fünftelregelung besteuert.",
      ],
    },
    {
      h3: "Alternativen zur reinen Bonuszahlung",
      body: [
        "Ein Teil des Bonus lässt sich steuerlich günstiger gestalten. Eine [Entgeltumwandlung in die betriebliche Altersvorsorge](/bav-rechner) ist bis 676 € monatlich steuerfrei und bis 338 € sozialabgabenfrei; auch ein [Firmenwagen](/firmenwagenrechner) nach der 1-%-Regelung verändert das Verhältnis von Aufwand zu Nutzen.",
        "Wer den Bonus anlegen will, sollte die Besteuerung der Erträge kennen — [Abgeltungssteuer](/abgeltungssteuer-rechner) mit 26,375 % inklusive Solidaritätszuschlag, bei Kirchensteuerpflicht etwas mehr.",
      ],
    },
  ],
  source: "§ 39b Abs. 3 EStG · § 23a SGB IV",
};

/* ── /witwenrente-rechner ────────────────────────────────────────────── */

const witwenrente: ToolContentConfig = {
  heading: "Witwenrente 2026: 55 % oder 25 % — und was angerechnet wird",
  answer:
    "Die große Witwenrente beträgt nach neuem Recht 55 % der Rente, die der verstorbene Ehepartner bezogen hat oder bezogen hätte. Die kleine Witwenrente beträgt 25 % und wird längstens 24 Monate gezahlt. In den ersten drei Monaten nach dem Tod — dem Sterbevierteljahr — wird die volle Rente des Verstorbenen weitergezahlt.",
  facts: [
    { label: "Große Witwenrente", value: "55 %" },
    { label: "Kleine Witwenrente", value: "25 %, max. 24 Monate" },
    { label: "Sterbevierteljahr", value: "3 Monate volle Rente" },
    { label: "Große Rente ab Alter", value: "47 Jahre" },
    { label: "Mindestehedauer (Regelfall)", value: "1 Jahr" },
    { label: "Aktueller Rentenwert", value: "42,52 € / Entgeltpunkt" },
  ],
  steps: [
    {
      title: "Rente des Verstorbenen bestimmen",
      text: "Maßgeblich ist die bezogene oder die fiktiv erreichte Rente — bei noch Erwerbstätigen wird sie aus den erworbenen Entgeltpunkten hochgerechnet.",
    },
    {
      title: "Anspruchsart klären",
      text: "Die große Witwenrente steht Hinterbliebenen ab 47 Jahren zu sowie denen, die ein Kind erziehen oder erwerbsgemindert sind. Sonst gilt die kleine Witwenrente.",
    },
    {
      title: "Prozentsatz anwenden",
      text: "55 % bei der großen, 25 % bei der kleinen Witwenrente — nach dem Sterbevierteljahr, in dem noch die volle Rente gezahlt wird.",
    },
    {
      title: "Eigenes Einkommen anrechnen",
      text: "Übersteigt das eigene rentenrechtliche Nettoeinkommen den Freibetrag, werden 40 % des übersteigenden Betrags von der Witwenrente abgezogen.",
    },
  ],
  table: {
    caption: "Witwenrente nach Höhe der Rente des Verstorbenen (2026)",
    head: ["Rente des Verstorbenen", "Sterbevierteljahr", "große Witwenrente 55 %", "kleine 25 %"],
    rows: [1000, 1400, 1800, 2200].map((r) => [eur(r), eur(r), eur(r * 0.55), eur(r * 0.25)]),
    note: "Bruttowerte vor Anrechnung eigenen Einkommens und vor Beiträgen zur Kranken- und Pflegeversicherung. Der genaue Anspruch hängt zusätzlich von Rentenabschlägen, Rentenartfaktor und Geburtsjahr ab.",
  },
  sections: [
    {
      h3: "Die Einkommensanrechnung ist der entscheidende Punkt",
      body: [
        "Anders als bei der eigenen Altersrente wird auf die Witwenrente **eigenes Einkommen angerechnet**. Übersteigt das rentenrechtliche Nettoeinkommen den Freibetrag, werden 40 % des übersteigenden Teils abgezogen. Angerechnet werden Erwerbseinkommen, eigene Renten und Versorgungsbezüge — im Sterbevierteljahr allerdings noch nicht.",
        "Wer neben der Witwenrente arbeitet, sollte deshalb das eigene Nettoeinkommen kennen: Das rechnet der [Brutto-Netto-Rechner](/) aus. Ein [Minijob](/minijob-rechner) bleibt in vielen Fällen unterhalb der Anrechnungsschwelle und ist damit oft die wirtschaftlich sinnvollere Zuverdienstform.",
      ],
    },
    {
      h3: "Altes und neues Recht — es kommt auf das Datum an",
      body: [
        "Die Prozentsätze 55 % und 25 % gelten nach **neuem Recht**, also für Ehen, die ab 2002 geschlossen wurden, beziehungsweise wenn der Todesfall ab 2002 eingetreten ist und beide Partner jünger als Jahrgang 1962 sind. Nach altem Recht liegt die große Witwenrente bei 60 %, und es gilt eine andere Altersgrenze.",
        "Die Altersgrenze für die große Witwenrente steigt schrittweise auf 47 Jahre. Wer sie nicht erreicht und weder ein Kind erzieht noch erwerbsgemindert ist, erhält die kleine Witwenrente — befristet auf 24 Monate.",
      ],
    },
    {
      h3: "Was sonst noch zusammenkommt",
      body: [
        "Für Kinder besteht zusätzlich Anspruch auf **Waisenrente**. Die Rentenhöhe des Verstorbenen selbst lässt sich aus seinen Entgeltpunkten nachvollziehen — dafür ist der [Rentenpunkte-Rechner](/rentenpunkte-rechner) da, die Gesamtprognose liefert der [Rentenrechner](/rentenrechner).",
        "Auch die Witwenrente ist steuerpflichtig, soweit sie zusammen mit anderen Einkünften den Grundfreibetrag von 12.348 € übersteigt: [Einkommensteuer-Rechner](/einkommensteuer-rechner). Reicht das Einkommen insgesamt nicht aus, kommt die [Grundsicherung im Alter](/grundsicherung-rechner) in Betracht; für Erbschaften gilt der [Erbschaftssteuer-Rechner](/erbschaftssteuer-rechner) mit dem Ehegattenfreibetrag.",
      ],
    },
  ],
  source: "§ 46 SGB VI · § 97 SGB VI · § 255 SGB VI",
};

/* ── exports ─────────────────────────────────────────────────────────── */

export const TOOL_CONTENT_EXTRA: Record<string, ToolContentConfig> = {
  "/gehaltsrechner": gehaltsrechner,
  "/einkommensteuer-rechner": einkommensteuer,
  "/steuerrueckerstattung-rechner": steuerrueckerstattung,
  "/bav-rechner": bav,
  "/riester-rechner": riester,
  "/rentenpunkte-rechner": rentenpunkte,
  "/elterngeld-rechner": elterngeld,
  "/abfindungsrechner": abfindung,
  "/bonus-steuerrechner": bonus,
  "/witwenrente-rechner": witwenrente,
};
