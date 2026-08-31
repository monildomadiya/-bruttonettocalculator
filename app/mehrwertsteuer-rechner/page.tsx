import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Receipt, CheckCircle2, ArrowRight, Percent } from "lucide-react";
import MwstRechner from "@/components/MwstRechner";
import ReviewerByline from "@/components/ReviewerByline";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

const CANONICAL = "https://bruttonettocalculator.com/mehrwertsteuer-rechner";

export const metadata: Metadata = {
  title: "MwSt-Rechner 2026: Mehrwertsteuer 19 % & 7 % berechnen",
  description:
    "Mehrwertsteuer-Rechner: MwSt (19 % oder 7 %) aufschlagen oder herausrechnen — Netto zu Brutto und Brutto zu Netto, mit Formeln und 7-%-Liste.",
  keywords: [
    "mwst rechner",
    "mehrwertsteuer rechner",
    "mwst berechnen",
    "mehrwertsteuer berechnen",
    "19 prozent mwst rechner",
    "7 prozent mwst",
    "umsatzsteuer rechner",
    "netto brutto mwst",
    "mwst herausrechnen",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "MwSt-Rechner — Mehrwertsteuer 19 % & 7 % berechnen",
    description:
      "MwSt aufschlagen oder herausrechnen: Netto ↔ Brutto mit 19 % oder 7 % — inklusive Formeln und 7-%-Liste.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "MwSt-Rechner: 19 % & 7 % Mehrwertsteuer berechnen",
    description: "Netto ↔ Brutto mit 19 % oder 7 % MwSt — sofort und kostenlos.",
  },
};

const faqs = [
  {
    q: "Wie rechne ich die Mehrwertsteuer aus einem Bruttobetrag heraus?",
    a: "Teilen Sie den Bruttobetrag durch 1,19 (bei 19 % MwSt) bzw. 1,07 (bei 7 %). Beispiel: 119 € brutto ÷ 1,19 = 100 € netto, die enthaltene MwSt beträgt 19 €. Ein häufiger Fehler ist, einfach 19 % vom Brutto abzuziehen — das ergibt einen falschen (zu niedrigen) Nettowert.",
  },
  {
    q: "Wie schlage ich die Mehrwertsteuer auf einen Nettobetrag auf?",
    a: "Multiplizieren Sie den Nettobetrag mit 1,19 (Regelsatz 19 %) oder 1,07 (ermäßigter Satz 7 %). Beispiel: 100 € netto × 1,19 = 119 € brutto.",
  },
  {
    q: "Wann gilt der ermäßigte Steuersatz von 7 %?",
    a: "Der ermäßigte Satz nach § 12 Abs. 2 UStG gilt u. a. für die meisten Lebensmittel, Bücher, Zeitungen und E-Books, Personennahverkehr, Hotelübernachtungen sowie Eintritt zu Kulturveranstaltungen. Restaurantspeisen, die meisten Getränke, Elektronik und Dienstleistungen fallen dagegen unter den Regelsatz von 19 %.",
  },
  {
    q: "Ist Mehrwertsteuer dasselbe wie Umsatzsteuer?",
    a: "Im Alltag ja: \"Mehrwertsteuer\" (MwSt) ist der umgangssprachliche Begriff, das Gesetz spricht von Umsatzsteuer (USt). Auf Rechnungen sind beide Bezeichnungen üblich und meinen dieselbe Steuer.",
  },
  {
    q: "Wer muss keine Umsatzsteuer ausweisen?",
    a: "Kleinunternehmer nach § 19 UStG: Wer im Vorjahr höchstens 25.000 € Umsatz hatte und im laufenden Jahr 100.000 € nicht überschreitet, kann die Kleinunternehmerregelung nutzen und stellt Rechnungen ohne Umsatzsteuer aus — darf dafür aber auch keine Vorsteuer abziehen.",
  },
];

export default function MehrwertsteuerRechnerPage() {
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
          { "@type": "ListItem", position: 2, name: "Rechner", item: "https://bruttonettocalculator.com/#rechner" },
          { "@type": "ListItem", position: 3, name: "MwSt-Rechner", item: CANONICAL },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: "MwSt-Rechner — Mehrwertsteuer 19 % & 7 % berechnen",
        description:
          "Mehrwertsteuer aufschlagen oder herausrechnen: Netto ↔ Brutto mit 19 % oder 7 % nach § 12 UStG.",
        isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
        breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
      },
      {
        "@type": "FAQPage",
        "@id": `${CANONICAL}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <Link href="/#rechner" className="hover:text-[#16181D] transition-colors">Rechner</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">MwSt-Rechner</span>
      </div>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Receipt size={14} /> Umsatzsteuer · § 12 UStG
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">MwSt-Rechner:</span> Mehrwertsteuer berechnen
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Mehrwertsteuer <strong className="text-[#16181D]">aufschlagen oder herausrechnen</strong> — mit dem
          Regelsatz von <strong className="text-[#16181D]">19 %</strong> oder dem ermäßigten Satz von{" "}
          <strong className="text-[#16181D]">7 %</strong>. Die Formel: Brutto = Netto × 1,19 (bzw. × 1,07);
          umgekehrt Netto = Brutto ÷ 1,19. Der Rechner zeigt Netto, Steueranteil und Brutto sofort an.
        </p>
        <ReviewerByline />
      </div>

      {/* Interactive calculator */}
      <div className="mb-16" id="rechner">
        <MwstRechner />
      </div>

      {/* 19 vs 7 table */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          19 % oder 7 %? Die wichtigsten Kategorien
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Der ermäßigte Satz nach § 12 Abs. 2 UStG deckt Güter des Grundbedarfs und Kultur ab — mit teils kuriosen
          Grenzfällen:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-xl bg-[#E60A1C]/10 border border-[#E60A1C]/25 flex items-center justify-center text-[#E60A1C] font-mono font-extrabold">7%</span>
              <h3 className="font-bold text-[#16181D]">Ermäßigter Satz</h3>
            </div>
            <ul className="space-y-2 text-sm text-black/75">
              {[
                "Grundnahrungsmittel (Brot, Milch, Obst, Gemüse …)",
                "Bücher, Zeitungen, Zeitschriften & E-Books",
                "Personennahverkehr & Bahnfernverkehr",
                "Hotelübernachtungen (ohne Frühstück)",
                "Eintritt für Theater, Konzerte, Museen",
                "Schnittblumen, Saatgut, lebende Tiere",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#E60A1C] shrink-0 mt-0.5" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-xl bg-[#16181D] text-white flex items-center justify-center font-mono font-extrabold">19%</span>
              <h3 className="font-bold text-[#16181D]">Regelsatz</h3>
            </div>
            <ul className="space-y-2 text-sm text-black/75">
              {[
                "Die meisten Getränke (auch Mineralwasser & Saft)",
                "Restaurant- & Lieferservice-Speisen vor Ort",
                "Elektronik, Kleidung, Möbel, Autos",
                "Handwerk & Dienstleistungen",
                "Streaming, Software, Telekommunikation",
                "Benzin, Strom, Gas",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Percent size={15} className="text-black/40 shrink-0 mt-0.5" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zur Mehrwertsteuer
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer list-none hover:bg-black/[0.03] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronRight size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 sm:px-6 pb-5 pt-1 text-black/70 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
        >
          Brutto-Netto-Rechner fürs Gehalt <ArrowRight size={14} />
        </Link>
        <Link
          href="/stundenlohn-rechner"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
        >
          Stundenlohn-Rechner <ArrowRight size={14} />
        </Link>
        <Link
          href="/einkommensteuer-rechner"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
        >
          Einkommensteuer-Rechner <ArrowRight size={14} />
        </Link>
      </div>
      <ToolContent config={TOOL_CONTENT["/mehrwertsteuer-rechner"]} />
    </main>
  );
}
