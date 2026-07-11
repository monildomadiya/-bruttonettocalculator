import type { Metadata } from "next";
import { Sparkles, AlertCircle } from "lucide-react";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2027 – Steuerreform & Lohnrechner",
  description:
    "Steuerreform 2027 Rechner: Berechnen Sie Ihr Nettogehalt ab dem 1.1.2027 mit höherem Grundfreibetrag. Kostenloser Brutto Netto Rechner 2027 & Lohnrechner 2027 mit Jahresvergleich – so viel Netto bringt Ihnen die Steuerreform.",
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
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/brutto-netto-rechner-2027" },
};

const faqs = [
  {
    q: "Was bringt die Steuerreform 2027 netto?",
    a: "Kernstück der Steuerreform 2027 ist die Anhebung des Grundfreibetrags sowie der Kinderfreibeträge zum Ausgleich der kalten Progression. Für die meisten Arbeitnehmer bedeutet das bei gleichem Bruttogehalt ein spürbar höheres Nettogehalt ab dem 1. Januar 2027. Mit dem Steuerreform-2027-Rechner oben sehen Sie im direkten Jahresvergleich, wie viel mehr Netto bei Ihrem konkreten Gehalt übrig bleibt.",
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
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Brutto Netto Rechner <span className="text-gradient-accent">2027</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          Die Bundesregierung hat sich im Juni 2026 auf eine Einkommensteuerreform
          zum 1. Januar 2027 verständigt: eine Anhebung des Grundfreibetrags, des
          Kinderfreibetrags und des Kindergelds sowie eine Abflachung der zweiten
          Progressionszone. Als Ihr zuverlässiger <strong className="text-white font-semibold">Brutto Netto Rechner für 2027</strong>, <strong className="text-white font-semibold">Netto Brutto Rechner 2027</strong> und <strong className="text-white font-semibold">Lohnrechner 2027</strong> zeigt dieses Tool im Jahresvergleich die Entlastungspotenziale auf Basis der aktuell verfügbaren amtlichen Eckwerte.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-14">
        <Calculator />
      </div>

      <div className="w-full max-w-6xl mx-auto bg-[#101010] border border-white/15 rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-white/80 leading-relaxed shadow-lg mb-12">
        <AlertCircle size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-white font-bold">Aktualisiert: Juli 2026.</strong> Sobald die finalen 2027-Eckwerte
          (voraussichtlich Herbst/Winter 2026) offiziell verabschiedet vorliegen, wird dieser <strong className="text-white">Lohnrechner 2027</strong> automatisch mit den exakten Formeln nach § 32a EStG 2027 aktualisiert.
        </p>
      </div>

      {/* Steuerreform 2027 content section — targets "steuerreform 2027 rechner" cluster */}
      <div className="w-full max-w-6xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 sm:p-10 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
          Steuerreform 2027: Das ändert sich beim Netto
        </h2>
        <div className="text-sm sm:text-base text-white/70 leading-relaxed space-y-4">
          <p>
            Die <strong className="text-white font-semibold">Steuerreform 2027</strong> soll die
            sogenannte kalte Progression ausgleichen — also die schleichende Mehrbelastung, wenn
            Gehaltssteigerungen nur die Inflation ausgleichen, aber dennoch in einen höheren
            Steuersatz führen. Mit dem <strong className="text-white font-semibold">Steuerreform 2027 Rechner</strong>{" "}
            auf dieser Seite berechnen Sie den Effekt für Ihr persönliches Gehalt.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-white">Höherer Grundfreibetrag:</strong> Ein größerer Teil des Einkommens bleibt steuerfrei — das erste Netto-Plus für alle Steuerklassen.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-white">Angehobener Kinderfreibetrag &amp; Kindergeld:</strong> Zusätzliche Entlastung für Familien mit Kindern.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E60A1C] font-bold">›</span>
              <span><strong className="text-white">Abgeflachte Progressionszone:</strong> Der Steuertarif nach § 32a EStG steigt langsamer an, wovon besonders mittlere Einkommen profitieren.</span>
            </li>
          </ul>
          <p>
            Nutzen Sie den Rechner im Modus <strong className="text-white font-semibold">Brutto zu Netto</strong> oder{" "}
            <strong className="text-white font-semibold">Netto zu Brutto</strong> und schalten Sie auf das Steuerjahr 2027,
            um Ihre Entlastung durch die Steuerreform 2027 im direkten Vergleich zu 2026 zu sehen.
          </p>
        </div>
      </div>

      {/* SEO Q&A section for 2027 long-tail queries */}
      <div className="w-full max-w-6xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
          Häufige Fragen zum Brutto Netto Rechner 2027
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-sm sm:text-base">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-bold text-white text-base sm:text-lg mb-2">{faq.q}</h3>
              <p className="text-white/70 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
