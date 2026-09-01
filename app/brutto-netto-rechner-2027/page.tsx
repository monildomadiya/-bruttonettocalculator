import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, AlertCircle, SlidersHorizontal } from "lucide-react";
import Calculator from "@/components/Calculator";
import Reform2027Status, { REFORM_STAND } from "@/components/Reform2027Status";
import EntlastungsKurve from "@/components/charts/EntlastungsKurve";
import TarifKurve from "@/components/charts/TarifKurve";
import {
  GRUNDFREIBETRAG,
  ARBEITNEHMER_PAUSCHBETRAG,
  KINDERGELD,
  KINDERFREIBETRAG,
  ENTWURF,
} from "@/lib/taxCalculator";

const eur = (n: number) => n.toLocaleString("de-DE");

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2027 – Steuerreform nach BMF-Entwurf",
  description:
    "Brutto Netto Rechner 2027 mit den Zahlen des BMF-Referentenentwurfs vom 18.08.2026: Grundfreibetrag 12.564 €, neuer Spitzensatz 47 %. Mit Status des Gesetzgebungsverfahrens.",
  keywords: [
    "steuerreform 2027 rechner",
    "steuerreform rechner 2027",
    "steuerreform 2027",
    "brutto netto rechner 2027 steuerreform",
    "brutto netto rechner 2027",
    "brutto netto 2027",
    "brutto-netto-rechner 2027",
    "netto brutto rechner 2027",
    "lohnrechner 2027",
    "netto 2027",
    "brutto netto rechner für 2027",
    "gehaltsrechner 2027",
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
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Brutto Netto Rechner 2027 – Steuerreform nach BMF-Entwurf",
    description:
      "Brutto Netto Rechner 2027 mit den Zahlen des BMF-Referentenentwurfs vom 18.08.2026: Grundfreibetrag 12.564 €, neuer Spitzensatz 47 %. Mit Status des Gesetzgebungsverfahrens.",
    url: "https://bruttonettocalculator.com/brutto-netto-rechner-2027",
    locale: "de_DE",
    type: "website",
  },
};

const faqs = [
  {
    q: "Was bringt die Steuerreform 2027 netto?",
    a: `Nach dem Referentenentwurf vom 18. August 2026 sind es weniger, als die Debatte vermuten lässt: In Steuerklasse I bleiben bei 3.000 € brutto rund 8 € mehr Netto pro Monat, bei 5.000 € gut 10 € — das Maximum von etwa 19 € pro Monat wird bei knapp 8.100 € brutto erreicht. Kernstück sind der höhere Grundfreibetrag und der Arbeitnehmer-Pauschbetrag von ${eur(ARBEITNEHMER_PAUSCHBETRAG.amtlich2026)} € auf ${eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} €. Ab rund 23.000 € brutto im Monat kehrt sich der Effekt um, weil der Entwurf oben einen neuen Steuersatz von 47 % einführt.`,
  },
  {
    q: "Wie hoch ist der Grundfreibetrag 2027?",
    a: `Der Referentenentwurf eines Einkommensteuerreformgesetzes 2027 sieht ${eur(GRUNDFREIBETRAG.entwurf2027)} € vor (§ 32a Absatz 1 Nummer 1 EStG), gegenüber ${eur(GRUNDFREIBETRAG.amtlich2026)} € im Jahr 2026. Ab dem Veranlagungszeitraum 2028 sollen es ${eur(GRUNDFREIBETRAG.stufe2028)} € sein. Beide Werte stehen wörtlich im Entwurf vom 18.08.2026 — sie sind aber noch nicht verkündet und können sich im weiteren Verfahren ändern.`,
  },
  {
    q: "Warum rechnet dieser Rechner in Szenarien statt mit festen Werten?",
    a: "Weil ein Referentenentwurf noch kein Gesetz ist. Die Zahlen für 2027 und 2028 stehen seit dem 18.08.2026 wörtlich im Entwurf — dieser Rechner verwendet sie deshalb direkt und schätzt nichts mehr. Bis zur Verkündung im Bundesgesetzblatt können sie sich im Kabinett, im Bundestag oder im Bundesrat aber noch ändern. Deshalb steht „Ohne Reform“ als Untergrenze daneben: Sie sehen damit, wie viel im laufenden Verfahren überhaupt auf dem Spiel steht.",
  },
  {
    q: "Wie viel mehr Netto habe ich durch die Steuerreform 2027?",
    a: "Das hängt stark von Ihrem Bruttogehalt, Ihrer Steuerklasse und Ihrer Familiensituation ab. Familien mit Kindern profitieren zusätzlich vom höheren Kindergeld (267 € pro Kind ab 2027, 272 € ab 2028) und Kinderfreibetrag. Wichtig: Die steuerliche Entlastung kann teilweise durch steigende Sozialversicherungsbeiträge gemindert werden — die SV-Rechengrößen 2027 stehen noch aus. Geben Sie Ihr Bruttogehalt oben ein und vergleichen Sie die Szenarien.",
  },
  {
    q: "Sind die Sozialabgaben 2027 schon berücksichtigt?",
    a: "Nein — und das ist bewusst so. Die Beitragsbemessungsgrenzen und der durchschnittliche Zusatzbeitrag für 2027 werden erst im Herbst 2026 per Verordnung festgelegt. Alle 2027-Szenarien rechnen daher mit den amtlichen SV-Werten 2026; nur der Steuerteil variiert. Sobald die Verordnung vorliegt, wird der Rechner aktualisiert.",
  },
  {
    q: "Welche 2027-Werte stehen bereits fest?",
    a: "Der gesetzliche Mindestlohn: Die zweistufige Erhöhung auf 14,60 € brutto pro Stunde zum 1. Januar 2027 ist per Verordnung bereits beschlossen und damit geltendes Recht. Die Steuerreform ist weiter — seit dem 18.08.2026 liegt ein ausformulierter Referentenentwurf mit konkreten Tarifwerten vor —, aber noch nicht verkündet und damit noch nicht bindend.",
  },
  {
    q: "Wie funktioniert der Netto Brutto Rechner 2027?",
    a: "Sie können sowohl die normale Brutto-zu-Netto-Rechnung als auch die umgekehrte Netto-zu-Brutto-Kalkulation nutzen. Schalten Sie auf das Steuerjahr 2027 und wählen Sie ein Reformszenario, um Ihre finanzielle Planung frühzeitig auf die geplante Tarifreform abzustimmen.",
  },
  {
    q: "Wer verliert durch die Steuerreform 2027?",
    a: "Sehr hohe Einkommen. Der Entwurf senkt die Grenze für die Reichensteuer von 45 % von 277.826 € auf 250.000 € zu versteuerndes Einkommen und führt darüber ab 280.000 € einen neuen Satz von 47 % ein. In Steuerklasse I kippt der Effekt bei rund 23.000 € Bruttogehalt im Monat ins Minus. Unabhängig vom Gehalt trifft die Gegenfinanzierung außerdem zwei Gruppen: Der Steuerabzug für Handwerkerleistungen sinkt von 20 % auf 15 % und der Höchstbetrag von 1.200 € auf 900 €, und die Minijob-Pauschsteuer steigt von 2 % auf 5 %.",
  },
  {
    q: "Was ist das EStRefG 2027?",
    a: "Das Einkommensteuerreformgesetz 2027 ist das Gesetzesvorhaben, mit dem die Bundesregierung den Einkommensteuertarif reformieren will. Das Bundesfinanzministerium hat den Referentenentwurf am 18. August 2026 vorgelegt. Artikel 1 fasst § 32a Absatz 1 EStG für den Veranlagungszeitraum 2027 neu, Artikel 2 für 2028. Enthalten sind außerdem ein höherer Arbeitnehmer-Pauschbetrag, höheres Kindergeld, höhere Kinderfreibeträge sowie Gegenfinanzierungsmaßnahmen.",
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
  name: "Brutto Netto Rechner 2027 – Steuerreform nach BMF-Entwurf",
  url: "https://bruttonettocalculator.com/brutto-netto-rechner-2027",
  inLanguage: "de-DE",
  dateModified: REFORM_STAND,
  description:
    "Brutto Netto Rechner 2027 mit den Zahlen des BMF-Referentenentwurfs vom 18.08.2026: Grundfreibetrag 12.564 €, neuer Spitzensatz 47 %. Mit Status des Gesetzgebungsverfahrens.",
  about: { "@type": "Thing", name: "Einkommensteuerreform 2027 (Deutschland)" },
  citation: {
    "@type": "Legislation",
    name: "Referentenentwurf eines Einkommensteuerreformgesetzes 2027 (EStRefG 2027)",
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
    { "@type": "ListItem", position: 2, name: "Brutto Netto Rechner 2027", item: "https://bruttonettocalculator.com/brutto-netto-rechner-2027" },
  ],
};

export default function Rechner2027Page() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-16 min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mb-14">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full">
            <Sparkles size={14} /> Referentenentwurf vom 18.08.2026
          </span>
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-black/60 font-bold bg-black/[0.05] border border-black/10 px-4 py-1.5 rounded-full">
            <span aria-hidden="true">🇩🇪</span> Gilt für Deutschland
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Brutto Netto Rechner <span className="text-gradient-accent">2027</span> — so viel mehr
          Netto bringt der Entwurf
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Seit dem 18. August 2026 liegt der{" "}
          <strong className="text-[#16181D] font-semibold">Referentenentwurf eines Einkommensteuerreformgesetzes 2027</strong>{" "}
          vor. Er fasst § 32a EStG für 2027 und 2028 komplett neu — dieser{" "}
          <strong className="text-[#16181D] font-semibold">Brutto Netto Rechner für 2027</strong> rechnet
          seitdem mit genau diesen Zahlen statt mit Schätzungen: Grundfreibetrag{" "}
          {eur(GRUNDFREIBETRAG.entwurf2027)} €, Arbeitnehmer-Pauschbetrag{" "}
          {eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} € und oben ein neuer Spitzensatz von 47 %.
          Verkündet ist das Gesetz noch nicht, deshalb steht „Ohne Reform“ weiter als Untergrenze
          daneben. Als <strong className="text-[#16181D] font-semibold">Netto Brutto Rechner 2027</strong> und{" "}
          <strong className="text-[#16181D] font-semibold">Lohnrechner 2027</strong> zeigt das Tool den
          Unterschied im echten Jahresvergleich.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-14">
        <Calculator initialJahr={2027} />
      </div>

      <div className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-black/80 leading-relaxed shadow-lg mb-12">
        <SlidersHorizontal size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#16181D] font-bold">So lesen Sie die Szenarien:</strong>{" "}
          „Entwurf 2027“ rechnet mit Artikel 1 des Referentenentwurfs — Grundfreibetrag{" "}
          {eur(GRUNDFREIBETRAG.entwurf2027)} €, wirksam ab dem 1.1.2027. „Stufe 2028“ ist die
          zweite Stufe desselben Entwurfs (Artikel 2, Grundfreibetrag{" "}
          {eur(GRUNDFREIBETRAG.stufe2028)} €). „Ohne Reform“ bleibt Ihre Untergrenze für den Fall,
          dass das Verfahren scheitert — ein Referentenentwurf ist noch kein Gesetz. Der Abstand
          zwischen „Ohne Reform“ und „Entwurf 2027“ ist genau das, was im laufenden Verfahren auf
          dem Spiel steht; der Status dazu steht direkt darunter.
        </p>
      </div>

      {/*
        Zwei Diagramme statt einer weiteren Zahlenkolonne: Die erste Kurve
        beantwortet die eigentliche Suchfrage („wie viel mehr Netto bei meinem
        Gehalt?“) über den gesamten Gehaltsbereich auf einmal, die zweite zeigt
        die Tarifänderung, aus der sie folgt. Beide werden serverseitig aus der
        Rechen-Engine erzeugt.
      */}
      <div className="w-full max-w-6xl mx-auto mb-4">
        <EntlastungsKurve />
        <TarifKurve />
      </div>

      <Reform2027Status />

      {/* Steuerreform 2027 content section — targets "steuerreform 2027 rechner" cluster */}
      <div className="w-full max-w-6xl mx-auto bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Steuerreform 2027: Das ändert sich beim Netto
        </h2>
        <div className="text-sm sm:text-base text-black/70 leading-relaxed space-y-4">
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
              <span><strong className="text-[#16181D]">Kindergeld {eur(KINDERGELD.entwurf2027)} € ab 2027</strong> und {eur(KINDERGELD.stufe2028)} € ab 2028, Kinderfreibetrag je Elternteil {eur(KINDERFREIBETRAG.entwurf2027)} € beziehungsweise {eur(KINDERFREIBETRAG.stufe2028)} €: Zusätzliche Entlastung für Familien.</span>
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
            Steuerklasse ab. Nutzen Sie den Rechner im Modus <strong className="text-[#16181D] font-semibold">Brutto zu Netto</strong> oder{" "}
            <strong className="text-[#16181D] font-semibold">Netto zu Brutto</strong>, schalten Sie auf das Steuerjahr 2027
            und vergleichen Sie die Szenarien mit dem geltenden Recht 2026. Den aktuellen Vergleichswert
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
            Hinweis: Die genannten Werte beruhen auf dem Beschluss des Koalitionsausschusses vom
            1. Juli 2026. Das BMF beziffert den Grundfreibetrag ausdrücklich nur als
            „voraussichtlich“; die endgültigen Beträge werden erst im Gesetzgebungsverfahren
            festgelegt. Die volle Entlastungswirkung entfaltet sich schrittweise bis 2028.
          </p>
        </div>
      </div>

      {/* SEO Q&A section for 2027 long-tail queries */}
      <div className="w-full max-w-6xl mx-auto bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zum Brutto Netto Rechner 2027
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-sm sm:text-base">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">{faq.q}</h3>
              <p className="text-black/70 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
