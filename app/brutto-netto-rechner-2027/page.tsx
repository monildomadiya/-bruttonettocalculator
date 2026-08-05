import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, AlertCircle, SlidersHorizontal } from "lucide-react";
import Calculator from "@/components/Calculator";
import Reform2027Status, { REFORM_STAND } from "@/components/Reform2027Status";
import { GRUNDFREIBETRAG, ARBEITNEHMER_PAUSCHBETRAG } from "@/lib/taxCalculator";

const eur = (n: number) => n.toLocaleString("de-DE");

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2027 – Steuerreform in 3 Szenarien",
  description:
    "Brutto Netto Rechner 2027: Steuerreform in drei Szenarien durchrechnen — ohne Reform, Stufe 1, Vollausbau. Plus Live-Status des Gesetzgebungsverfahrens.",
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
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/brutto-netto-rechner-2027" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Brutto Netto Rechner 2027 – Steuerreform in 3 Szenarien",
    description:
      "Brutto Netto Rechner 2027 mit echtem Jahresvergleich: Steuerreform 2027 in drei Szenarien durchrechnen — plus Live-Status des Gesetzgebungsverfahrens.",
    url: "https://bruttonettocalculator.com/brutto-netto-rechner-2027",
    locale: "de_DE",
    type: "website",
  },
};

const faqs = [
  {
    q: "Was bringt die Steuerreform 2027 netto?",
    a: `Für die meisten Arbeitnehmer bringt die Reform bei gleichem Bruttogehalt rund 10 bis 40 € mehr Netto pro Monat — je nach Gehalt, Steuerklasse und Reformstufe. Kernstück sind die Anhebung des Grundfreibetrags und des Arbeitnehmer-Pauschbetrags von ${eur(ARBEITNEHMER_PAUSCHBETRAG.amtlich2026)} € auf ${eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} € zum Ausgleich der kalten Progression. Mit dem Rechner oben sehen Sie im direkten Jahresvergleich, wie viel mehr Netto bei Ihrem konkreten Gehalt übrig bleibt.`,
  },
  {
    q: "Wie hoch ist der Grundfreibetrag 2027?",
    a: `Das steht noch nicht fest. Das Bundesfinanzministerium nennt ${eur(GRUNDFREIBETRAG.vollausbau)} € als Endstufe einer zweistufigen Anhebung bis 2028 — ausgehend von ${eur(GRUNDFREIBETRAG.amtlich2026)} € im Jahr 2026. Wie die beiden Stufen aufgeteilt werden, ist nicht beziffert. Unser Szenario „Stufe 1 (2027)“ modelliert deshalb die hälftige Zwischenstufe von ${eur(GRUNDFREIBETRAG.stufe1_2027)} €, das Szenario „Vollausbau“ rechnet mit den vollen ${eur(GRUNDFREIBETRAG.vollausbau)} €.`,
  },
  {
    q: "Warum rechnet dieser Rechner in Szenarien statt mit festen Werten?",
    a: "Weil es für 2027 noch kein Gesetz gibt — nur einen Koalitionsbeschluss vom 1. Juli 2026. Rechner, die einfach eine Zahl für 2027 behaupten, suggerieren eine Sicherheit, die es nicht gibt. Wir zeigen stattdessen die Bandbreite: „Ohne Reform“ als Untergrenze, „Vollausbau“ als Obergrenze und „Stufe 1“ als wahrscheinlichen Wert für den 1.1.2027. So sehen Sie, wie viel überhaupt auf dem Spiel steht.",
  },
  {
    q: "Wie viel mehr Netto habe ich durch die Steuerreform 2027?",
    a: "Das hängt stark von Ihrem Bruttogehalt, Ihrer Steuerklasse und Ihrer Familiensituation ab. Familien mit Kindern profitieren zusätzlich vom höheren Kindergeld (272 € pro Kind) und Kinderfreibetrag. Wichtig: Die steuerliche Entlastung kann teilweise durch steigende Sozialversicherungsbeiträge gemindert werden — die SV-Rechengrößen 2027 stehen noch aus. Geben Sie Ihr Bruttogehalt oben ein und vergleichen Sie die Szenarien.",
  },
  {
    q: "Sind die Sozialabgaben 2027 schon berücksichtigt?",
    a: "Nein — und das ist bewusst so. Die Beitragsbemessungsgrenzen und der durchschnittliche Zusatzbeitrag für 2027 werden erst im Herbst 2026 per Verordnung festgelegt. Alle 2027-Szenarien rechnen daher mit den amtlichen SV-Werten 2026; nur der Steuerteil variiert. Sobald die Verordnung vorliegt, wird der Rechner aktualisiert.",
  },
  {
    q: "Welche 2027-Werte stehen bereits fest?",
    a: "Der gesetzliche Mindestlohn: Die zweistufige Erhöhung auf 14,60 € brutto pro Stunde zum 1. Januar 2027 ist per Verordnung bereits beschlossen und damit geltendes Recht. Die Steuerreform dagegen ist bislang nur eine politische Einigung.",
  },
  {
    q: "Wie funktioniert der Netto Brutto Rechner 2027?",
    a: "Sie können sowohl die normale Brutto-zu-Netto-Rechnung als auch die umgekehrte Netto-zu-Brutto-Kalkulation nutzen. Schalten Sie auf das Steuerjahr 2027 und wählen Sie ein Reformszenario, um Ihre finanzielle Planung frühzeitig auf die geplante Tarifreform abzustimmen.",
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
  name: "Brutto Netto Rechner 2027 – Steuerreform in 3 Szenarien",
  url: "https://bruttonettocalculator.com/brutto-netto-rechner-2027",
  inLanguage: "de-DE",
  dateModified: REFORM_STAND,
  description:
    "Brutto Netto Rechner 2027 mit echtem Jahresvergleich: Steuerreform 2027 in drei Szenarien durchrechnen, plus Live-Status des Gesetzgebungsverfahrens.",
  about: { "@type": "Thing", name: "Einkommensteuerreform 2027 (Deutschland)" },
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
            <Sparkles size={14} /> Vorschau &amp; Steuerreform
          </span>
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-black/60 font-bold bg-black/[0.05] border border-black/10 px-4 py-1.5 rounded-full">
            <span aria-hidden="true">🇩🇪</span> Gilt für Deutschland
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Brutto Netto Rechner <span className="text-gradient-accent">2027</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Die Bundesregierung hat sich im Juni 2026 auf eine Einkommensteuerreform
          zum 1. Januar 2027 verständigt. Ein Gesetz gibt es noch nicht — deshalb
          rechnet dieser <strong className="text-[#16181D] font-semibold">Brutto Netto Rechner für 2027</strong> die Reform
          in <strong className="text-[#16181D] font-semibold">drei ausgewiesenen Szenarien</strong> durch,
          statt eine Scheingenauigkeit zu behaupten. Als{" "}
          <strong className="text-[#16181D] font-semibold">Netto Brutto Rechner 2027</strong> und{" "}
          <strong className="text-[#16181D] font-semibold">Lohnrechner 2027</strong> zeigt das Tool im
          echten Jahresvergleich, was zwischen Untergrenze und Vollausbau für Sie auf dem Spiel steht.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-14">
        <Calculator initialJahr={2027} />
      </div>

      <div className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-black/80 leading-relaxed shadow-lg mb-12">
        <SlidersHorizontal size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#16181D] font-bold">So lesen Sie die Szenarien:</strong>{" "}
          „Ohne Reform“ ist Ihre Untergrenze, falls das Gesetz scheitert. „Vollausbau“ ist die
          Obergrenze mit einem Grundfreibetrag von {eur(GRUNDFREIBETRAG.vollausbau)} €. „Stufe 1
          (2027)“ liegt dazwischen und ist der wahrscheinliche Wert zum 1.1.2027. Die
          Differenz zwischen Unter- und Obergrenze ist genau die Unsicherheit, die aktuell im
          Gesetzgebungsverfahren steckt — der Status dazu steht direkt darunter.
        </p>
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
              <span><strong className="text-[#16181D]">Grundfreibetrag steigt schrittweise auf {eur(GRUNDFREIBETRAG.vollausbau)} €</strong> (von {eur(GRUNDFREIBETRAG.amtlich2026)} € in 2026, Endstufe 2028): Ein größerer Teil des Einkommens bleibt steuerfrei — das erste Netto-Plus für alle Steuerklassen.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Arbeitnehmer-Pauschbetrag steigt auf {eur(ARBEITNEHMER_PAUSCHBETRAG.reform)} €</strong> (von {eur(ARBEITNEHMER_PAUSCHBETRAG.amtlich2026)} €): Wirkt wie eine Erhöhung des Freibetrags und senkt das zu versteuernde Einkommen direkt.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Kindergeld steigt auf 272 € pro Kind</strong> und der Kinderfreibetrag 2027 wird angehoben: Zusätzliche Entlastung für Familien mit Kindern.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Abgeflachte Progressionszone:</strong> Die Tarifeckwerte nach § 32a EStG verschieben sich nach rechts, wovon besonders mittlere Einkommen profitieren.</span>
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
