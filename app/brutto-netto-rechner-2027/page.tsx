import type { Metadata } from "next";
import { Sparkles, AlertCircle } from "lucide-react";
import Calculator from "@/components/Calculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2027 – Steuerreform & Lohnrechner",
  description:
    "Steuerreform 2027 Rechner: Grundfreibetrag steigt auf 12.900 €, Kindergeld auf 272 €. Berechnen Sie mit dem Brutto Netto Rechner 2027 & Lohnrechner 2027, wie viel mehr Netto vom Brutto Sie ab dem 1.1.2027 haben – kostenlos & im Jahresvergleich zu 2026.",
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
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/brutto-netto-rechner-2027" },
};

const faqs = [
  {
    q: "Was bringt die Steuerreform 2027 netto?",
    a: "Kernstück der Steuerreform 2027 ist die Anhebung des Grundfreibetrags sowie der Kinderfreibeträge zum Ausgleich der kalten Progression. Für die meisten Arbeitnehmer bedeutet das bei gleichem Bruttogehalt ein spürbar höheres Nettogehalt ab dem 1. Januar 2027. Mit dem Steuerreform-2027-Rechner oben sehen Sie im direkten Jahresvergleich, wie viel mehr Netto bei Ihrem konkreten Gehalt übrig bleibt.",
  },
  {
    q: "Wie hoch ist der Grundfreibetrag 2027?",
    a: "Nach den im Juni 2026 verkündeten Reformplänen soll der steuerliche Grundfreibetrag von 12.348 € (2026) schrittweise auf rund 12.900 € angehoben werden. Bis zu diesem Betrag fällt keine Einkommensteuer an — ein höherer Grundfreibetrag 2027 bedeutet also für alle Steuerklassen ein höheres Nettogehalt. Die endgültigen Werte werden erst mit dem Existenzminimumbericht im Herbst 2026 final festgelegt.",
  },
  {
    q: "Wie viel mehr Netto habe ich durch die Steuerreform 2027?",
    a: "Das hängt stark von Ihrem Bruttogehalt, Ihrer Steuerklasse und Ihrer Familiensituation ab. Familien mit Kindern profitieren zusätzlich vom höheren Kindergeld (272 € pro Kind) und Kinderfreibetrag. Wichtig: Die steuerliche Entlastung kann teilweise durch steigende Sozialversicherungsbeiträge gemindert werden. Geben Sie Ihr Bruttogehalt oben in den Rechner ein und vergleichen Sie das Steuerjahr 2026 mit 2027, um Ihr persönliches Netto-Plus zu sehen.",
  },
  {
    q: "Wie funktioniert der Netto Brutto Rechner 2027?",
    a: "Sie können im Rechner sowohl die normale Brutto-zu-Netto-Rechnung als auch die umgekehrte Netto-zu-Brutto-Kalkulation nutzen. Schalten Sie einfach auf das Steuerjahr 2027, um Ihre finanzielle Planung frühzeitig auf die geplante Tarifreform abzustimmen.",
  },
  {
    q: "Was ändert sich beim Lohnrechner 2027 gegenüber 2026?",
    a: "Hauptziel der Reform 2027 ist der Ausgleich der kalten Progression durch höhere Grund- und Kinderfreibeträge. Für Arbeitnehmer bedeutet das: Von Ihrem Bruttogehalt verbleibt ab Januar 2027 spürbar mehr Netto 2027 auf dem Konto.",
  },
  {
    q: "Warum steht die 2027-Reform noch nicht final fest?",
    a: "Die konkreten Tarifeckwerte für 2027 werden traditionell erst mit dem Existenzminimumbericht der Bundesregierung im Herbst des Vorjahres final festgelegt. Bis dahin dient dieser Rechner als vorläufige Orientierung auf Basis der bisher bekannten politischen Eckpunkte.",
  },
  {
    q: "Sollte ich meine Gehaltsverhandlung auf die Reform 2027 abstimmen?",
    a: "Es kann sinnvoll sein, bei mehrjährigen Vertragsverhandlungen die erwartete Entlastung ab 2027 mit einzukalkulieren — verbindlich planen sollten Sie damit aber erst, sobald die endgültigen Tarifwerte amtlich verabschiedet sind.",
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
  "@type": "WebApplication",
  name: "Brutto Netto Rechner 2027 – Steuerreform Rechner",
  url: "https://bruttonettocalculator.com/brutto-netto-rechner-2027",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "de-DE",
  description:
    "Kostenloser Steuerreform 2027 Rechner: Nettogehalt ab dem 1.1.2027 mit höherem Grundfreibetrag berechnen und im Jahresvergleich zu 2026 sehen.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
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
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Sparkles size={14} /> Vorschau & Steuerreform
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Brutto Netto Rechner <span className="text-gradient-accent">2027</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Die Bundesregierung hat sich im Juni 2026 auf eine Einkommensteuerreform
          zum 1. Januar 2027 verständigt: eine Anhebung des Grundfreibetrags, des
          Kinderfreibetrags und des Kindergelds sowie eine Abflachung der zweiten
          Progressionszone. Als Ihr zuverlässiger <strong className="text-[#16181D] font-semibold">Brutto Netto Rechner für 2027</strong>, <strong className="text-[#16181D] font-semibold">Netto Brutto Rechner 2027</strong> und <strong className="text-[#16181D] font-semibold">Lohnrechner 2027</strong> zeigt dieses Tool im Jahresvergleich die Entlastungspotenziale auf Basis der aktuell verfügbaren amtlichen Eckwerte.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-14">
        <Calculator />
      </div>

      {/* Ad: right after the 2027 calculator (highest-traffic page, high engagement) */}
      <AdUnit placement="content" className="!my-0 !mb-12 !px-0" />

      <div className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-black/80 leading-relaxed shadow-lg mb-12">
        <AlertCircle size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#16181D] font-bold">Aktualisiert: Juli 2026.</strong> Sobald die finalen 2027-Eckwerte
          (voraussichtlich Herbst/Winter 2026) offiziell verabschiedet vorliegen, wird dieser <strong className="text-[#16181D]">Lohnrechner 2027</strong> automatisch mit den exakten Formeln nach § 32a EStG 2027 aktualisiert.
        </p>
      </div>

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
              <span><strong className="text-[#16181D]">Grundfreibetrag 2027 steigt auf rund 12.900 €</strong> (von 12.348 € in 2026): Ein größerer Teil des Einkommens bleibt steuerfrei — das erste Netto-Plus für alle Steuerklassen.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Kindergeld steigt auf 272 € pro Kind</strong> und der Kinderfreibetrag 2027 wird angehoben: Zusätzliche Entlastung für Familien mit Kindern.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-[#16181D]">Abgeflachte Progressionszone:</strong> Der Steuertarif nach § 32a EStG steigt langsamer an, wovon besonders mittlere Einkommen profitieren.</span>
            </li>
          </ul>
          <p>
            Wie viel mehr Netto vom Brutto Sie 2027 konkret haben, hängt von Ihrem Gehalt und Ihrer
            Steuerklasse ab. Nutzen Sie den Rechner im Modus <strong className="text-[#16181D] font-semibold">Brutto zu Netto</strong> oder{" "}
            <strong className="text-[#16181D] font-semibold">Netto zu Brutto</strong> und schalten Sie auf das Steuerjahr 2027,
            um Ihre persönliche Entlastung durch die Steuerreform 2027 im direkten Vergleich zu 2026 zu sehen.
          </p>
          <p className="text-xs text-black/50">
            Hinweis: Die genannten Werte (Grundfreibetrag rund 12.900 €, Kindergeld 272 €) beruhen auf den
            im Juni 2026 verkündeten Reformplänen und werden bis zur endgültigen Verabschiedung im Herbst/Winter 2026
            noch konkretisiert. Die volle Entlastungswirkung entfaltet sich schrittweise bis 2028.
          </p>
        </div>
      </div>

      {/* Ad: between the reform explainer and the FAQ block (deep-scroll) */}
      <AdUnit placement="content" className="!my-0 !mb-8 !px-0" />

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
