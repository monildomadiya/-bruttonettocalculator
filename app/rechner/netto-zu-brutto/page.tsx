import type { Metadata } from "next";
import { ArrowRightLeft, Sparkles, ListChecks, ChevronDown } from "lucide-react";
import Calculator from "@/components/Calculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Netto zu Brutto Rechner | Gehaltsberechnung 2026",
  description:
    "Rechnen Sie Ihr gewünschtes Nettogehalt in das benötigte Bruttogehalt um — exakt kalkuliert für Verhandlungen im Steuerjahr 2026.",
  keywords: [
    "netto zu brutto rechner",
    "netto in brutto umrechnen",
    "gewünschtes netto berechnen",
    "gehaltsverhandlung brutto berechnen",
    "wunschgehalt netto in brutto",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/rechner/netto-zu-brutto" },
  openGraph: {
    title: "Netto zu Brutto Rechner 2026 | Gehaltsberechnung",
    description: "Zielnettogehalt in Bruttogehalt umrechnen — ideal für Gehaltsverhandlungen 2026.",
    url: "https://bruttonettocalculator.com/rechner/netto-zu-brutto",
    locale: "de_DE",
    type: "website",
    images: [{ url: "https://bruttonettocalculator.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Netto zu Brutto Rechner 2026",
    description: "Nettowunschgehalt in Bruttobedarf umrechnen — kostenlos & präzise.",
    images: ["https://bruttonettocalculator.com/og-image.png"],
  },
};

const faqs = [
  {
    q: "Warum lässt sich Netto nicht einfach direkt in Brutto zurückrechnen?",
    a: "Weil Lohnsteuer und Sozialabgaben nicht linear vom Brutto abhängen — der Steuertarif nach § 32a EStG ist progressiv, und einige Abgaben entfallen oberhalb der Beitragsbemessungsgrenzen. Es gibt also keine einfache Umkehrformel; das benötigte Brutto muss iterativ ermittelt werden, indem verschiedene Bruttowerte durchgerechnet werden, bis das gewünschte Netto erreicht ist.",
  },
  {
    q: "Wie nutze ich den Rechner für eine Gehaltsverhandlung?",
    a: "Stellen Sie sich vor, Sie möchten 2.800 € netto im Monat erhalten. Geben Sie im Rechner oben verschiedene Bruttobeträge ein und beobachten Sie das errechnete Netto, bis es Ihrem Zielwert entspricht — das so ermittelte Brutto ist die Zahl, die Sie im Gespräch mit dem Arbeitgeber nennen sollten.",
  },
  {
    q: "Ändert sich das benötigte Brutto, wenn ich die Steuerklasse wechsle?",
    a: "Ja, teils erheblich. Wer z. B. von Steuerklasse I in Steuerklasse III wechselt, benötigt für dasselbe Nettogehalt ein niedrigeres Brutto, da in Steuerklasse III weniger Lohnsteuer vorab einbehalten wird. Für Verheiratete lohnt sich daher immer ein Vergleich beider Steuerklassen-Kombinationen (III/V oder IV/IV).",
  },
  {
    q: "Ist der Rechner auch für Freelancer oder bei Stundensatz-Verhandlungen nützlich?",
    a: "Ja, indem Sie Ihr gewünschtes monatliches Netto in ein erforderliches Brutto umrechnen, erhalten Sie eine solide Orientierung für Honorar- oder Gehaltsverhandlungen. Beachten Sie aber, dass Selbstständige keine Arbeitgeberanteile zur Sozialversicherung erhalten und ihre Beiträge in der Regel vollständig selbst tragen.",
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

export default function NettoZuBruttoPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-10 min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <ArrowRightLeft size={14} /> Umkehrberechnung
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Netto zu <span className="text-gradient-accent">Brutto</span> Rechner
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Sie kennen Ihr gewünschtes Nettogehalt und möchten genau wissen, welches Bruttogehalt Sie dafür im
          Bewerbungsgespräch verhandeln müssen? Nutzen Sie unseren Präzisionsrechner, um Ihr Zielgehalt
          durch schnelle Anpassung der Bruttowerte in Sekundenschnelle auf den Euro genau zu ermitteln.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-10">
        <Calculator />
      </div>

      <div className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-black/80 leading-relaxed shadow-lg mb-16">
        <Sparkles size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#16181D] font-bold">Pro-Tipp für Verhandlungen:</strong> Aufgrund des progressiven Steuertarifs nach § 32a EStG
          und der Beitragsbemessungsgrenzen steigt die Steuerbelastung mit höherem Brutto nicht linear. Testen Sie
          verschiedene Bruttostufen oben direkt in Echtzeit aus!
        </p>
      </div>

      {/* Ad: in-content after the calculator + tip block (high viewability) */}
      <AdUnit placement="content" className="!my-0 !mb-16 !px-0" />

      {/* Erklärung: So funktioniert die Rückrechnung */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
          <ListChecks size={24} className="text-[#E60A1C]" />
          Warum die Rückrechnung nicht mit einer einfachen Formel funktioniert
        </h2>
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 space-y-4 text-black/80 text-base sm:text-lg leading-relaxed">
          <p>
            Bei der klassischen Brutto-zu-Netto-Rechnung ist der Rechenweg klar vorgegeben: erst
            Sozialabgaben, dann Lohnsteuer. Bei der umgekehrten Richtung — Sie kennen nur Ihr
            Wunsch-Netto und suchen das dafür nötige Brutto — gibt es keine geschlossene Formel,
            weil die Steuerlast selbst vom gesuchten Bruttobetrag abhängt.
          </p>
          <p>
            Deshalb arbeitet dieser Rechner mit einer Annäherung: Er testet verschiedene
            Bruttowerte durch, berechnet für jeden das resultierende Netto und nähert sich so
            iterativ Ihrem Zielbetrag an. Das ist exakt die Methode, die auch professionelle
            Gehaltsabrechnungsprogramme verwenden, wenn ein Arbeitgeber ein Netto-Fixgehalt
            zusagt.
          </p>
          <p>
            Für Sie als Verhandlungspartner bedeutet das: Je höher Ihr Wunsch-Netto, desto
            überproportional stärker muss das Brutto steigen, um die zusätzliche Steuerprogression
            auszugleichen. Ein realistisches Gefühl für diesen Effekt bekommen Sie am schnellsten,
            indem Sie oben mehrere Bruttowerte direkt ausprobieren.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="w-full max-w-6xl mx-auto pb-10">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zur Netto-Brutto-Rückrechnung
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
