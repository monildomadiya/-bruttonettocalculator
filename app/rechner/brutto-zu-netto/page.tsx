import type { Metadata } from "next";
import { Calculator as CalcIcon, ListChecks, ChevronDown } from "lucide-react";
import Calculator from "@/components/Calculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Brutto zu Netto Rechner | Gehaltsberechnung 2026",
  description:
    "Rechnen Sie Ihr Bruttogehalt direkt in Ihr Nettogehalt um — aktuell für 2026 mit allen offiziellen Steuern und Abgaben.",
  keywords: [
    "brutto zu netto rechner",
    "brutto in netto umrechnen",
    "bruttogehalt in nettogehalt",
    "was bleibt vom brutto übrig",
    "nettogehalt berechnen 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/rechner/brutto-zu-netto" },
  openGraph: {
    title: "Brutto zu Netto Rechner 2026 | Gehaltsberechnung",
    description: "Bruttogehalt in Nettogehalt umrechnen — aktuell für 2026 mit Lohnsteuer, Soli & Sozialabgaben.",
    url: "https://bruttonettocalculator.com/rechner/brutto-zu-netto",
    locale: "de_DE",
    type: "website",
    images: [{ url: "https://bruttonettocalculator.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brutto zu Netto Rechner 2026",
    description: "Bruttogehalt sofort in Nettogehalt umrechnen — kostenlos & präzise.",
    images: ["https://bruttonettocalculator.com/og-image.png"],
  },
};

const faqs = [
  {
    q: "In welcher Reihenfolge werden die Abzüge vom Brutto berechnet?",
    a: "Zuerst werden die Sozialversicherungsbeiträge (Renten-, Kranken-, Pflege- und Arbeitslosenversicherung) vom Bruttogehalt abgezogen. Auf das verbleibende zu versteuernde Einkommen wird dann die Lohnsteuer nach § 32a EStG berechnet, zuzüglich Solidaritätszuschlag und ggf. Kirchensteuer. Was danach übrig bleibt, ist Ihr Nettogehalt.",
  },
  {
    q: "Warum bleibt bei gleichem Brutto nicht immer das gleiche Netto übrig?",
    a: "Die Steuerklasse, die Kirchensteuerpflicht, das Bundesland (wegen unterschiedlicher Pflegeversicherungs-Zuschläge) und individuelle Freibeträge wie der Kinderfreibetrag verändern das Ergebnis. Zwei Arbeitnehmer mit identischem Bruttogehalt können deshalb ein spürbar unterschiedliches Netto erhalten.",
  },
  {
    q: "Ein konkretes Beispiel: Wie viel Netto bleiben von 3.500 € Brutto?",
    a: "Bei 3.500 € Bruttogehalt in Steuerklasse I (2026, ohne Kirchensteuer) bleiben nach Abzug von rund 700 € Sozialabgaben und etwa 480 € Lohnsteuer/Soli ca. 2.320 € netto übrig. Der genaue Betrag hängt von Ihrer individuellen Situation ab — geben Sie Ihr Gehalt oben direkt ein, um Ihren exakten Wert zu sehen.",
  },
  {
    q: "Zählt das 13. Monatsgehalt oder Weihnachtsgeld mit in die Brutto-Netto-Rechnung?",
    a: "Nein, dieser Rechner bildet Ihr reguläres Monatsgehalt ab. Einmalzahlungen wie Weihnachts- oder Urlaubsgeld werden steuerlich anders behandelt (als „sonstige Bezüge”) — nutzen Sie dafür unseren separaten Bonus-Steuerrechner.",
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

export default function BruttoZuNettoPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-10 min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <CalcIcon size={14} /> Amtliche Berechnung
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Brutto zu <span className="text-gradient-accent">Netto</span> Rechner
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Geben Sie Ihr Bruttogehalt ein und sehen Sie in Echtzeit und präzise auf den Cent, wie viel davon
          als Nettogehalt auf Ihrem Konto übrig bleibt — inklusive Lohnsteuer, Solidaritätszuschlag und allen
          Sozialabgaben nach § 32a EStG 2026.
        </p>
      </div>

      {/* Ad — right below the hero, above the calculator */}
      <AdUnit placement="content" className="!my-0 !mb-10 !px-0" />

      <div className="w-full max-w-6xl mx-auto mb-16">
        <Calculator />
      </div>

      {/* Ad: in-content between calculator and explanation (high viewability) */}
      <AdUnit placement="content" className="!my-0 !mb-16 !px-0" />

      {/* Erklärung: So wird gerechnet */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
          <ListChecks size={24} className="text-[#E60A1C]" />
          So wird Ihr Brutto zu Netto berechnet
        </h2>
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 space-y-4 text-black/80 text-base sm:text-lg leading-relaxed">
          <p>
            Anders als viele denken, wird die Lohnsteuer nicht direkt vom Bruttogehalt berechnet.
            Zuerst zieht Ihr Arbeitgeber die Sozialversicherungsbeiträge ab — für die Rentenversicherung
            9,3 %, für die Arbeitslosenversicherung 1,3 %, für die Krankenversicherung rund 8,15 %
            (inklusive durchschnittlichem Zusatzbeitrag) und für die Pflegeversicherung 1,8–2,4 %,
            jeweils als Ihr Arbeitnehmeranteil.
          </p>
          <p>
            Erst auf das verbleibende zu versteuernde Einkommen — abzüglich Werbungskosten- und
            Sonderausgabenpauschale — wird die Einkommensteuer nach dem progressiven Tarif des
            § 32a EStG angewendet. Je nach Steuerklasse kommen dann noch Solidaritätszuschlag
            (nur oberhalb bestimmter Freigrenzen) und bei Kirchenmitgliedschaft die Kirchensteuer
            (8 % oder 9 %, je nach Bundesland) hinzu.
          </p>
          <p>
            Das Ergebnis: Bei niedrigen Gehältern bleibt dank Grundfreibetrag prozentual mehr vom
            Brutto übrig, während bei höheren Gehältern die Steuerprogression stärker zuschlägt.
            Deshalb steigt Ihr Netto nie proportional zu Ihrem Brutto.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="w-full max-w-6xl mx-auto pb-10">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zur Brutto-Netto-Berechnung
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
