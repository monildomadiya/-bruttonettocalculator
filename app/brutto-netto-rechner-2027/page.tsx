import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Sparkles, AlertCircle, SlidersHorizontal, Calculator as CalculatorIcon, LineChart, BookOpen, HelpCircle } from "lucide-react";
import Calculator from "@/components/Calculator";
import Reform2027Status, { REFORM_STAND } from "@/components/Reform2027Status";
import TableOfContents from "@/components/TableOfContents";
import Section from "@/components/ui/Section";
import EntlastungsKurve from "@/components/charts/EntlastungsKurve";
import TarifKurve from "@/components/charts/TarifKurve";
import {
  GRUNDFREIBETRAG,
  ARBEITNEHMER_PAUSCHBETRAG,
  KINDERGELD,
  KINDERFREIBETRAG,
  ENTWURF,
  calculateNetto,
} from "@/lib/taxCalculator";
import { pageImageUrl } from "@/lib/pageImage";

const eur = (n: number) => n.toLocaleString("de-DE");
const signed = (n: number) =>
  Math.abs(n) < 0.005 ? "0,00" : `${n > 0 ? "+" : "−"}${Math.abs(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Engine-Vergleich 2026 → 2027 je Gehalt, getrennt nach Steuer- und Sozialabgaben-Effekt. */
const VERGLEICH_ZEILEN = [2000, 3000, 4000, 5000, 6000, 7000, 8000].map((brutto) => {
  const effekt = (sk: 1 | 3) => {
    const basis = { bruttoMonat: brutto, steuerklasse: sk, verheiratet: sk === 3, kinderlosUeber23: true, kirche: false };
    const a = calculateNetto({ ...basis, jahr: 2026 });
    const b = calculateNetto({ ...basis, jahr: 2027, sv2027: "entwurf" });
    return {
      steuer: a.steuer.summeMonat - b.steuer.summeMonat,
      sv: a.sv.summeMonat - b.sv.summeMonat,
      netto: b.nettoMonat - a.nettoMonat,
    };
  };
  return { brutto, sk1: effekt(1), sk3: effekt(3) };
});

// Suchintention dieser Seite: die REFORM-Frage („Steuerreform 2027 Rechner“,
// „wie viel mehr Netto 2027“). Die Kopfsuche „brutto netto rechner 2027“ gehört
// der Startseite — sie stand dort am 23.–29.9.2026 auf Pos. 1,9. Als Titel, H1
// und Startseiten-Chip hier ebenfalls exakt „Brutto Netto Rechner 2027“ lauteten,
// wählte Google ab Oktober diese Seite statt der Startseite (4.10.: #3 statt #1–2,
// Startseite auf #13). Deshalb hier keinen Exact-Match-Titel und keine
// Exact-Match-Ankertexte auf diese URL — siehe auch app/page.tsx.
//
// Die Beschreibung nennt den aktuellen Verfahrensschritt: Das Thema ist
// query-deserves-freshness, ein veralteter Stand im Snippet kostet Rankings
// (Absturz im September 2026). Bei jedem Verfahrensschritt mit REFORM_STAND
// in components/Reform2027Status.tsx zusammen aktualisieren.
const PAGE_TITLE = "Steuerreform 2027 Rechner: Wie viel mehr Netto bleibt?";
const PAGE_DESCRIPTION =
  "Steuerreform 2027: So viel mehr Netto bringt der Gesetzentwurf (Drs. 21/8235) — Rechner und Tabelle nach Gehalt, 2027 und 2028. 1. Lesung am 8.10.2026.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    PAGE_DESCRIPTION,
  keywords: [
    "steuerreform 2027 rechner",
    "steuerreform rechner 2027",
    "steuerreform 2027",
    "brutto netto rechner 2027 steuerreform",
    "steuerentlastung 2027 rechner",
    "einkommensteuer 2027 rechner",
    "steuerreform 2027 netto",
    "steuer rechner 2027",
    "grundfreibetrag 2027",
    "grundfreibetrag 12900",
    "kindergeld 2027",
    "kindergeld 272 euro",
    "einkommensteuer reform 2027",
    "wie viel mehr netto 2027",
    "mehr netto vom brutto 2027",
    "kinderfreibetrag 2027",
    "arbeitnehmerpauschbetrag 2027",
    "mindestlohn 2027",
    "steuerreform 2027 stand",
    "estrefg 2027",
    "referentenentwurf steuerreform 2027",
    "einkommensteuerreformgesetz 2027",
    "grundfreibetrag 12564",
    "spitzensteuersatz 47 prozent",
    "reichensteuer 250000",
    "steuerreform 2028",
    "grundfreibetrag 2028",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/brutto-netto-rechner-2027" },
  openGraph: {
    images: [pageImageUrl("/brutto-netto-rechner-2027")],
    title: PAGE_TITLE,
    description:
      PAGE_DESCRIPTION,
    url: "https://bruttonettocalculator.com/brutto-netto-rechner-2027",
    locale: "de_DE",
    type: "website",
  },
};

const faqs = [
  {
    q: "Was bringt die Steuerreform 2027 netto?",
    a: `Nach dem Regierungsentwurf, den das Kabinett am 2. September 2026 beschlossen hat, sind es weniger, als die Debatte vermuten lässt: In Steuerklasse I bleiben bei 3.000 € brutto rund 8 € mehr Netto pro Monat, bei 5.000 € gut 10 € — das Maximum von etwa 19 € pro Monat wird bei knapp 8.100 € brutto erreicht. Kernstück sind der höhere Grundfreibetrag und der Arbeitnehmer-Pauschbetrag von ${eur(ARBEITNEHMER_PAUSCHBETRAG.amtlich2026)} € auf ${eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} €. Ab rund 23.000 € brutto im Monat kehrt sich der Effekt um, weil der Entwurf oben einen neuen Steuersatz von 47 % einführt.`,
  },
  {
    q: "Wie hoch ist der Grundfreibetrag 2027?",
    a: `Der Regierungsentwurf eines Einkommensteuerreformgesetzes 2027 sieht ${eur(GRUNDFREIBETRAG.entwurf2027)} € vor (§ 32a Absatz 1 Nummer 1 EStG), gegenüber ${eur(GRUNDFREIBETRAG.amtlich2026)} € im Jahr 2026. Ab dem Veranlagungszeitraum 2028 sollen es ${eur(GRUNDFREIBETRAG.stufe2028)} € sein. Beide Werte hat das Bundeskabinett am 2. September 2026 unverändert aus dem Referentenentwurf übernommen — sie sind aber noch nicht verkündet und können sich im parlamentarischen Verfahren ändern.`,
  },
  {
    q: "Warum rechnet dieser Rechner in Szenarien statt mit festen Werten?",
    a: "Weil auch ein Kabinettsbeschluss noch kein Gesetz ist. Die Zahlen für 2027 und 2028 stehen seit dem 2.09.2026 wörtlich im Regierungsentwurf — dieser Rechner verwendet sie deshalb direkt und schätzt nichts mehr. Bis zur Verkündung im Bundesgesetzblatt können sie sich im Bundestag oder im Bundesrat aber noch ändern. Deshalb steht „Ohne Reform“ als Untergrenze daneben: Sie sehen damit, wie viel im laufenden Verfahren überhaupt auf dem Spiel steht.",
  },
  {
    q: "Wie viel mehr Netto habe ich durch die Steuerreform 2027?",
    a: "Das hängt stark von Ihrem Bruttogehalt, Ihrer Steuerklasse und Ihrer Familiensituation ab. Familien mit Kindern profitieren zusätzlich vom höheren Kindergeld (267 € pro Kind ab 2027, 272 € ab 2028) und Kinderfreibetrag. Wichtig: Die steuerliche Entlastung kann teilweise durch steigende Sozialversicherungsbeiträge gemindert werden — die SV-Rechengrößen 2027 stehen noch aus. Geben Sie Ihr Bruttogehalt oben ein und vergleichen Sie die Szenarien.",
  },
  {
    q: "Sind die Sozialabgaben 2027 schon berücksichtigt?",
    a: "Wahlweise. Für die Rechengrößen 2027 liegt seit dem 21. September 2026 ein Referentenentwurf des BMAS vor (Beitragsbemessungsgrenze Renten- und Arbeitslosenversicherung 8.850 € im Monat, Kranken- und Pflegeversicherung 6.375 € im Monat), beschlossen ist die Verordnung aber noch nicht. Im Rechner wählen Sie deshalb unter „Sozialabgaben 2027“: „Stand 2026“ rechnet mit den amtlichen Grenzen 2026 weiter (Voreinstellung), „Entwurf 2027“ mit den Entwurfsgrenzen. Die Beitragssätze bleiben in beiden Fällen auf dem Stand 2026, weil für 2027 noch keiner beschlossen ist. Der Unterschied zeigt sich erst ab 5.812,50 € brutto im Monat. Sobald die Verordnung in Kraft ist, wird der Rechner umgestellt.",
  },
  {
    q: "Welche 2027-Werte stehen bereits fest?",
    a: "Der gesetzliche Mindestlohn: Die zweistufige Erhöhung auf 14,60 € brutto pro Stunde zum 1. Januar 2027 ist per Verordnung bereits beschlossen und damit geltendes Recht. Die Steuerreform ist weiter — seit dem 2.09.2026 liegt ein vom Kabinett beschlossener Regierungsentwurf mit konkreten Tarifwerten vor —, aber noch nicht verkündet und damit noch nicht bindend.",
  },
  {
    q: "Wie funktioniert der Steuerreform-Rechner 2027?",
    a: "Bruttogehalt eingeben, Steuerklasse wählen — der Rechner steht bereits auf dem Steuerjahr 2027. Mit „Entwurf 2027“, „Stufe 2028“ und „Ohne Reform“ vergleichen Sie, was die Reform bei Ihrem Gehalt ändert. Den umgekehrten Weg rechnet der Netto-zu-Brutto-Rechner, ebenfalls für 2027.",
  },
  {
    q: "Wer verliert durch die Steuerreform 2027?",
    a: "Sehr hohe Einkommen. Der Entwurf senkt die Grenze für die Reichensteuer von 45 % von 277.826 € auf 250.000 € zu versteuerndes Einkommen und führt darüber ab 280.000 € einen neuen Satz von 47 % ein. In Steuerklasse I kippt der Effekt bei rund 23.000 € Bruttogehalt im Monat ins Minus. Unabhängig vom Gehalt trifft die Gegenfinanzierung außerdem zwei Gruppen: Der Steuerabzug für Handwerkerleistungen sinkt von 20 % auf 15 % und der Höchstbetrag von 1.200 € auf 900 €, und die Minijob-Pauschsteuer steigt von 2 % auf 5 %.",
  },
  {
    q: "Was ist das EStRefG 2027?",
    a: "Das Einkommensteuerreformgesetz 2027 ist das Gesetzesvorhaben, mit dem die Bundesregierung den Einkommensteuertarif reformieren will. Das Bundesfinanzministerium hat den Referentenentwurf am 18. August 2026 vorgelegt; das Bundeskabinett hat den Regierungsentwurf am 2. September 2026 beschlossen. Seit dem 28. September 2026 liegt er dem Bundestag als Drucksache 21/8235 vor; die erste Lesung ist für den 8. Oktober 2026 angesetzt. Artikel 1 fasst § 32a Absatz 1 EStG für den Veranlagungszeitraum 2027 neu, Artikel 2 für 2028. Enthalten sind außerdem ein höherer Arbeitnehmer-Pauschbetrag, höheres Kindergeld, höhere Kinderfreibeträge sowie Gegenfinanzierungsmaßnahmen.",
  },
  {
    q: "Gilt dieser Rechner auch für Österreich?",
    a: "Nein. Dieser Brutto Netto Rechner bildet ausschließlich das deutsche Lohnsteuer- und Sozialversicherungsrecht ab (§ 32a EStG, SGB IV/V). Für Österreich gelten ein anderer Einkommensteuertarif, andere Beitragssätze sowie zusätzlich AK-Umlage und Sonderzahlungsbesteuerung — die Ergebnisse wären dort nicht übertragbar.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: PAGE_TITLE,
  url: "https://bruttonettocalculator.com/brutto-netto-rechner-2027",
  inLanguage: "de-DE",
  dateModified: REFORM_STAND,
  description:
    PAGE_DESCRIPTION,
  about: { "@type": "Thing", name: "Einkommensteuerreform 2027 (Deutschland)" },
  citation: {
    "@type": "Legislation",
    name: "Regierungsentwurf eines Einkommensteuerreformgesetzes 2027 (EStRefG 2027)",
    legislationJurisdiction: "Deutschland",
    legislationDate: ENTWURF.stand,
    url: ENTWURF.quelle,
  },
  spatialCoverage: { "@type": "Country", name: "Deutschland" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Steuerreform-Rechner 2027", item: "https://bruttonettocalculator.com/brutto-netto-rechner-2027" },
  ],
};

export default function Rechner2027Page() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-6 sm:pt-20 pb-16 min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Mobil muss der Rechner im ersten Bildschirm beginnen: Über dem Rechner
          steht deshalb nur ein kurzer Lead, die ausführliche Einordnung folgt
          direkt unter dem Rechner (gleicher Text, nur tiefer). */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full">
            <Sparkles size={14} /> Im Bundestag · Drucksache 21/8235
          </span>
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-black/60 font-bold bg-black/[0.05] border border-black/10 px-4 py-1.5 rounded-full">
            <span aria-hidden="true">🇩🇪</span> Gilt für Deutschland
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#16181D] mb-3 sm:mb-4 tracking-tight">
          Steuerreform <span className="text-gradient-accent">2027</span> Rechner — so viel mehr
          Netto bringt der Entwurf
        </h1>
        <p className="text-base sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed">
          Rechnet mit dem Gesetzentwurf im Bundestag (Drucksache 21/8235): Grundfreibetrag{" "}
          {eur(GRUNDFREIBETRAG.entwurf2027)} €, Arbeitnehmer-Pauschbetrag{" "}
          {eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} €. Brutto eingeben und „Entwurf 2027“, „Stufe 2028“ und
          „Ohne Reform“ direkt vergleichen.
        </p>
      </div>

      <TableOfContents
        className="mb-4 sm:mb-8"
        items={[
          { id: "entlastung", label: "Mehr Netto nach Gehalt" },
          { id: "tarif", label: "Was sich am Tarif ändert" },
          { id: "reform-status-heading", label: "Stand der Reform" },
          { id: "bereits-fest", label: "Was 2027 schon feststeht" },
          { id: "aenderungen", label: "Die Änderungen im Überblick" },
          { id: "faq", label: "Häufige Fragen" },
        ]}
      />

      <div className="w-full max-w-6xl mx-auto mb-10 sm:mb-14">
        <Calculator
          initialJahr={2027}
          standDisplay={new Date(REFORM_STAND).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
        />
      </div>

      <Section eyebrow="So wird gerechnet" eyebrowIcon={CalculatorIcon} title="Worauf dieser Rechner 2027 basiert" prose>
        <p>
          Am 2. September 2026 hat das Bundeskabinett den{" "}
          <strong className="text-[#16181D] font-semibold">Regierungsentwurf eines Einkommensteuerreformgesetzes 2027</strong>{" "}
          beschlossen. Er fasst § 32a EStG für 2027 und 2028 komplett neu — dieser{" "}
          <strong className="text-[#16181D] font-semibold">Steuerreform-Rechner</strong> rechnet
          mit genau diesen Zahlen statt mit Schätzungen: Grundfreibetrag{" "}
          {eur(GRUNDFREIBETRAG.entwurf2027)} €, Arbeitnehmer-Pauschbetrag{" "}
          {eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} € und oben ein neuer Spitzensatz von 47 %.
          Seit dem 28. September 2026 liegt der Entwurf dem Bundestag als Drucksache 21/8235 vor, die
          erste Lesung ist für den 8. Oktober 2026 angesetzt. Verkündet ist das Gesetz noch nicht —
          Bundestag und Bundesrat müssen noch zustimmen, deshalb steht „Ohne Reform“ weiter als
          Untergrenze daneben. Ihr reguläres Netto für 2026 und 2027 ohne Szenarien rechnet der{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">
            Brutto Netto Rechner 2026/2027
          </Link>{" "}
          auf der Startseite.
        </p>
        <div className="flex items-start gap-3 sm:gap-4 bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 sm:p-6">
        <SlidersHorizontal size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#16181D] font-bold">So lesen Sie die Szenarien:</strong>{" "}
          „Entwurf 2027“ rechnet mit Artikel 1 des Regierungsentwurfs — Grundfreibetrag{" "}
          {eur(GRUNDFREIBETRAG.entwurf2027)} €, wirksam ab dem 1.1.2027. „Stufe 2028“ ist die
          zweite Stufe desselben Entwurfs (Artikel 2, Grundfreibetrag{" "}
          {eur(GRUNDFREIBETRAG.stufe2028)} €). „Ohne Reform“ bleibt Ihre Untergrenze für den Fall,
          dass das Verfahren scheitert — auch ein Kabinettsbeschluss ist noch kein Gesetz. Der Abstand
          zwischen „Ohne Reform“ und „Entwurf 2027“ ist genau das, was im laufenden Verfahren auf
          dem Spiel steht; der Status dazu steht direkt darunter.
        </p>
        </div>
      </Section>

      {/*
        Zwei Diagramme statt einer weiteren Zahlenkolonne: Die erste Kurve
        beantwortet die eigentliche Suchfrage („wie viel mehr Netto bei meinem
        Gehalt?“) über den gesamten Gehaltsbereich auf einmal, die zweite zeigt
        die Tarifänderung, aus der sie folgt. Beide werden serverseitig aus der
        Rechen-Engine erzeugt.
      */}
      <Section
        eyebrow="Grafik"
        eyebrowIcon={LineChart}
        title="Was der Entwurf für Ihr Netto bedeutet"
        intro="Beide Kurven rechnet die Engine dieses Rechners aus dem Gesetzentwurf — über den gesamten Gehaltsbereich statt nur für einen Beispielwert."
      >
        <div id="entlastung">
          <EntlastungsKurve />
        </div>
        <div id="tarif">
          <TarifKurve />
        </div>
      </Section>

      {/*
        Tabelle 2.000–8.000 € für Steuerklasse I und III: Steuerentlastung und
        Mehrkosten der Sozialabgaben (BBG-Entwurf) getrennt, damit sichtbar wird,
        woher das Plus kommt und wo es kippt. Alles aus der Engine.
      */}
      <Section
        id="tabelle"
        eyebrow="Tabelle"
        eyebrowIcon={LineChart}
        title="Netto 2026 vs. 2027 nach Gehalt: Steuerklasse I und III"
        intro="Pro Monat, kinderlos, ohne Kirchensteuer. Steuer: Regierungsentwurf zur Steuerreform 2027. Sozialabgaben: Beitragsbemessungsgrenzen aus dem BMAS-Entwurf, Beitragssätze wie 2026."
      >
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[640px]">
            <thead>
              <tr className="bg-[#F1F3F5] text-[11px] font-mono uppercase tracking-wider text-black/70">
                <th rowSpan={2} className="py-2.5 px-3 align-bottom">Brutto</th>
                <th colSpan={3} className="py-2.5 px-3 text-center border-l border-black/10">Steuerklasse I</th>
                <th colSpan={3} className="py-2.5 px-3 text-center border-l border-black/10">Steuerklasse III</th>
              </tr>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-[11px] font-mono uppercase tracking-wider text-black/70">
                {["Steuer", "Sozialabg.", "Netto"].map((h) => (
                  <th key={`1${h}`} className={`py-2 px-3 text-right ${h === "Steuer" ? "border-l border-black/10" : ""}`}>{h}</th>
                ))}
                {["Steuer", "Sozialabg.", "Netto"].map((h) => (
                  <th key={`3${h}`} className={`py-2 px-3 text-right ${h === "Steuer" ? "border-l border-black/10" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {VERGLEICH_ZEILEN.map((z) => (
                <tr key={z.brutto}>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#16181D] whitespace-nowrap">{eur(z.brutto)} €</td>
                  {[z.sk1, z.sk3].map((w, i) => (
                    <Fragment key={i}>
                      <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap border-l border-black/10 text-emerald-700">{signed(w.steuer)}</td>
                      <td className={`py-2.5 px-3 text-right font-mono whitespace-nowrap ${w.sv < -0.005 ? "text-[#E60A1C]" : "text-black/50"}`}>{signed(w.sv)}</td>
                      <td className={`py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap ${w.netto >= 0 ? "text-emerald-700" : "text-[#E60A1C]"}`}>{signed(w.netto)}</td>
                    </Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/55 mt-3 leading-relaxed">
          Veränderung 2027 gegenüber 2026 in Euro pro Monat. „Steuer“ = weniger Lohnsteuer und Soli durch die Reform, „Sozialabg.“ = mehr
          Beiträge durch die höheren Beitragsbemessungsgrenzen, „Netto“ = Summe. Status: Regierungsentwurf (BT-Drs. 21/8235) und
          BMAS-Referentenentwurf; beide noch nicht beschlossen. Wir aktualisieren die Tabelle, sobald das Gesetz verabschiedet ist.
        </p>
      </Section>

      <Reform2027Status />

      <Section prose>
      <p>
        Zum zweiten Baustein des Jahres 2027 — den Sozialabgaben — liegt seit dem 21. September 2026
        ebenfalls ein Entwurf vor:{" "}
        <Link href="/beitragsbemessungsgrenze-2027" className="text-[#E60A1C] font-semibold hover:underline">
          die Beitragsbemessungsgrenzen 2027
        </Link>{" "}
        sollen auf 6.375 € (Kranken- und Pflegeversicherung) und 8.850 € im Monat (Rente und
        Arbeitslosenversicherung) steigen. Beschlossen ist auch diese Verordnung nicht — im Rechner oben
        können Sie unter „Sozialabgaben 2027“ trotzdem schon mit den Entwurfsgrenzen rechnen
        (Voreinstellung bleibt der Stand 2026). Was zusätzlich höhere Beitragssätze kosten würden, zeigt der{" "}
        <Link href="/sozialabgaben-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">
          Sozialabgaben-Rechner 2027
        </Link>
        .
      </p>
      </Section>

      {/* Steuerreform 2027 content section — targets "steuerreform 2027 rechner" cluster */}
      <Section id="aenderungen" variant="muted" eyebrow="Überblick" eyebrowIcon={BookOpen} title="Steuerreform 2027: Das ändert sich beim Netto" prose>
          <p>
            Die <strong className="text-[#16181D] font-semibold">Steuerreform 2027</strong> soll die
            sogenannte kalte Progression ausgleichen — also die schleichende Mehrbelastung, wenn
            Gehaltssteigerungen nur die Inflation ausgleichen, aber dennoch in einen höheren
            Steuersatz führen. Mit dem <strong className="text-[#16181D] font-semibold">Steuerreform 2027 Rechner</strong>{" "}
            auf dieser Seite berechnen Sie den Effekt für Ihr persönliches Gehalt.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Grundfreibetrag {eur(GRUNDFREIBETRAG.entwurf2027)} €</strong> ab 2027 und {eur(GRUNDFREIBETRAG.stufe2028)} € ab 2028 (2026: {eur(GRUNDFREIBETRAG.amtlich2026)} €): Ein größerer Teil des Einkommens bleibt steuerfrei — das Netto-Plus, das alle Steuerklassen erreicht.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Arbeitnehmer-Pauschbetrag steigt auf {eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} €</strong> (von {eur(ARBEITNEHMER_PAUSCHBETRAG.amtlich2026)} €): Wirkt wie eine Erhöhung des Freibetrags und senkt das zu versteuernde Einkommen direkt.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Kindergeld {eur(KINDERGELD.entwurf2027)} € ab 2027</strong> und {eur(KINDERGELD.stufe2028)} € ab 2028, Kinderfreibetrag je Elternteil {eur(KINDERFREIBETRAG.entwurf2027)} € beziehungsweise {eur(KINDERFREIBETRAG.stufe2028)} €: Zusätzliche Entlastung für Familien — ob Kindergeld oder Freibetrag für Sie mehr bringt, zeigt der <Link href="/kindergeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Kindergeld-Rechner 2027</Link>.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Abgeflachte zweite Progressionszone:</strong> Der Spitzensteuersatz von 42 % greift erst ab 70.601 € statt ab 69.879 € zu versteuerndem Einkommen — davon profitieren vor allem mittlere Einkommen.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Gegenfinanzierung im selben Entwurf:</strong> Die Reichensteuer von 45 % greift künftig ab 250.000 € statt ab 277.826 €, darüber kommt ein neuer Satz von 47 % ab 280.000 €. Der Abzug für Handwerkerleistungen sinkt von 20 auf 15 % und höchstens 900 €, die Minijob-Pauschsteuer steigt von 2 auf 5 %. Für sehr hohe Einkommen ist die Reform deshalb unter dem Strich eine Mehrbelastung.</span>
            </li>
          </ul>
          <p>
            Wie viel mehr Netto vom Brutto Sie 2027 konkret haben, hängt von Ihrem Gehalt und Ihrer
            Steuerklasse ab. Schalten Sie im Rechner auf das Steuerjahr 2027 und vergleichen Sie die Szenarien mit dem
            geltenden Recht 2026; den umgekehrten Weg rechnet der{" "}
            <Link href="/rechner/netto-zu-brutto?jahr=2027" className="text-[#E60A1C] font-semibold hover:underline">
              Netto-zu-Brutto-Rechner
            </Link>{" "}
            ebenfalls für 2027. Den aktuellen Vergleichswert
            für dieses Jahr finden Sie im{" "}
            <Link href="/brutto-netto-rechner-2026" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto Netto Rechner 2026
            </Link>
            ; den bereits beschlossenen Stundenlohn ab 2027 im{" "}
            <Link href="/mindestlohn" className="text-[#E60A1C] font-semibold hover:underline">
              Mindestlohn-Rechner
            </Link>
            .
          </p>
          <p className="text-xs text-black/50">
            Hinweis: Die genannten Werte stammen aus dem Gesetzentwurf der Bundesregierung
            (BT-Drucksache 21/8235 vom 28.09.2026). Verbindlich werden sie erst mit der Verkündung —
            im parlamentarischen Verfahren können sie sich noch ändern. Die volle Entlastung wirkt
            ab 2028.
          </p>
      </Section>

      {/* SEO Q&A section for 2027 long-tail queries */}
      <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zur Steuerreform 2027">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">{faq.q}</h3>
              <p className="text-black/70 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
