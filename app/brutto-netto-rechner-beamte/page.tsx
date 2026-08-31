import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Landmark, ShieldCheck, HeartPulse, CheckCircle2, ArrowRight } from "lucide-react";
import { calculateBeamtenNetto, calculateNetto, formatEUR } from "@/lib/taxCalculator";
import BeamtenRechner from "@/components/BeamtenRechner";
import ReviewerByline from "@/components/ReviewerByline";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

const CANONICAL = "https://bruttonettocalculator.com/brutto-netto-rechner-beamte";

export const metadata: Metadata = {
  title: "Brutto Netto Rechner Beamte 2026 – Netto ohne Sozialabgaben",
  description:
    "Brutto-Netto-Rechner für Beamte 2026: Netto aus den Dienstbezügen berechnen — ohne Renten- und Arbeitslosenversicherung, mit PKV-Eigenanteil im Vergleich.",
  keywords: [
    "brutto netto rechner beamte",
    "beamte netto rechner",
    "beamtenbesoldung netto",
    "beamte brutto netto 2026",
    "brutto netto rechner beamte nrw",
    "beamte sozialabgaben",
    "beamte pkv beihilfe",
    "dienstbezüge netto",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Brutto Netto Rechner für Beamte 2026",
    description:
      "Netto aus Dienstbezügen berechnen: keine Sozialabgaben, Mindestvorsorgepauschale, PKV-Eigenanteil — inklusive Vergleich Beamter vs. Angestellter.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "Brutto Netto Rechner Beamte 2026",
    description: "Netto aus Dienstbezügen — ohne Sozialabgaben, mit PKV und Angestellten-Vergleich.",
  },
};

const faqs = [
  {
    q: "Warum haben Beamte mehr netto als Angestellte?",
    a: "Beamte zahlen keine Beiträge zur Renten-, Arbeitslosen- und gesetzlichen Kranken-/Pflegeversicherung — das spart je nach Gehalt mehrere hundert Euro im Monat. Dafür tragen sie ihre private Krankenversicherung (PKV) selbst, die durch die Beihilfe des Dienstherrn (meist 50 %) aber deutlich günstiger ausfällt als eine volle PKV.",
  },
  {
    q: "Welche Abzüge haben Beamte vom Brutto?",
    a: "Vom Bruttogehalt (Dienstbezüge) gehen nur Lohnsteuer, gegebenenfalls Solidaritätszuschlag und Kirchensteuer ab. Sozialversicherungsbeiträge fallen nicht an. Als praktischer Abzug kommt die PKV-Prämie hinzu, die Beamte direkt an ihre Versicherung zahlen.",
  },
  {
    q: "Was ist die Beihilfe?",
    a: "Die Beihilfe ist der Zuschuss des Dienstherrn zu Krankheitskosten: In der Regel übernimmt sie 50 % der Kosten (70 % für Versorgungsempfänger und Beamte mit zwei oder mehr Kindern, Ehepartner je nach Land). Beamte versichern nur den Rest privat — deshalb sind PKV-Beiträge für Beamte vergleichsweise niedrig.",
  },
  {
    q: "Wie wird die Lohnsteuer bei Beamten berechnet?",
    a: "Grundsätzlich wie bei allen Arbeitnehmern nach § 32a EStG. Da Beamte keine Sozialversicherungsbeiträge zahlen, gilt beim Lohnsteuerabzug statt der SV-Beiträge nur die Mindestvorsorgepauschale (§ 39b EStG): 12 % des Arbeitslohns, höchstens 1.900 € pro Jahr (3.000 € in Steuerklasse III). Dadurch ist das zu versteuernde Einkommen höher als bei Angestellten mit gleichem Brutto.",
  },
  {
    q: "Gilt der Rechner auch für Beamte in NRW, Bayern oder Baden-Württemberg?",
    a: "Ja — die Lohnsteuer ist bundeseinheitlich, daher passt die Netto-Berechnung für alle Länder. Unterschiede zwischen den Bundesländern liegen in der Besoldungstabelle (A/B/R/W-Besoldung je Land unterschiedlich hoch) und im Beihilferecht, nicht in der Steuerberechnung. Geben Sie einfach Ihre Dienstbezüge laut Bezügemitteilung ein.",
  },
  {
    q: "Zahlen Beamte in die Rentenversicherung ein?",
    a: "Nein. Beamte erwerben stattdessen einen Pensionsanspruch (Ruhegehalt) gegenüber ihrem Dienstherrn — bis zu 71,75 % der ruhegehaltfähigen Dienstbezüge nach 40 Dienstjahren. Deshalb fehlt der Rentenversicherungsbeitrag von 9,3 % komplett in der Abrechnung.",
  },
];

export default function BeamteRechnerPage() {
  // Server-side example table — computed with the same engine as the tool
  const beispiele = [3500, 4500, 5500, 6500].map((brutto) => {
    const beamter = calculateBeamtenNetto({ bruttoMonat: brutto, steuerklasse: 1, kirche: false, pkvMonat: 0 });
    const angestellter = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    return { brutto, beamter, angestellter };
  });

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
          { "@type": "ListItem", position: 2, name: "Rechner", item: "https://bruttonettocalculator.com/#rechner" },
          { "@type": "ListItem", position: 3, name: "Brutto Netto Rechner Beamte", item: CANONICAL },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: "Brutto Netto Rechner für Beamte 2026",
        description:
          "Netto aus Dienstbezügen berechnen: keine Sozialabgaben, Mindestvorsorgepauschale nach § 39b EStG, PKV-Eigenanteil und Vergleich zum Angestellten.",
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
        <span className="text-black/80">Brutto Netto Rechner Beamte</span>
      </div>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Landmark size={14} /> Beamte · § 39b EStG
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">Brutto Netto Rechner</span> für Beamte 2026
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Beamte zahlen <strong className="text-[#16181D]">keine Sozialversicherungsbeiträge</strong> — von den
          Dienstbezügen gehen nur Lohnsteuer, ggf. Soli und Kirchensteuer ab. Dieser Rechner berechnet Ihr Netto
          nach der Mindestvorsorgepauschale (§ 39b EStG), zieht auf Wunsch Ihren PKV-Eigenanteil ab und zeigt den
          direkten <strong className="text-[#16181D]">Vergleich zum Angestellten</strong> mit gleichem Brutto.
        </p>
        <ReviewerByline />
      </div>

      {/* Interactive calculator */}
      <div className="mb-16" id="rechner">
        <BeamtenRechner />
      </div>

      {/* Why Beamte differ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Warum Beamte mehr netto haben
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Drei strukturelle Unterschiede machen die Beamten-Abrechnung aus:
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "Keine Sozialabgaben",
              text: "Keine Renten- (9,3 %), Arbeitslosen- (1,3 %), Kranken- (~8,75 %) und Pflegeversicherung (~1,8 %) — zusammen rund 21 % Ersparnis gegenüber Angestellten (bis zu den Bemessungsgrenzen).",
            },
            {
              icon: HeartPulse,
              title: "PKV + Beihilfe",
              text: "Der Dienstherr übernimmt per Beihilfe meist 50 % der Krankheitskosten (70 % mit 2+ Kindern oder als Pensionär). Beamte versichern nur die Restkosten privat — die PKV-Prämie ist daher vergleichsweise niedrig.",
            },
            {
              icon: Landmark,
              title: "Pension statt Rente",
              text: "Statt gesetzlicher Rente gibt es das Ruhegehalt vom Dienstherrn — bis zu 71,75 % der letzten ruhegehaltfähigen Dienstbezüge nach 40 Dienstjahren, ohne eigenen Beitrag während der Laufbahn.",
            },
          ].map((c) => (
            <div key={c.title} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 shadow-sm">
              <span className="w-11 h-11 rounded-xl bg-[#E60A1C]/10 border border-[#E60A1C]/25 flex items-center justify-center text-[#E60A1C] mb-4">
                <c.icon size={20} />
              </span>
              <h3 className="font-bold text-[#16181D] mb-2">{c.title}</h3>
              <p className="text-sm text-black/70 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Example table */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-1">
          Beamter vs. Angestellter: Netto-Beispiele 2026
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Steuerklasse I, ohne Kirchensteuer, vor PKV-Eigenanteil — berechnet mit demselben Rechenkern wie oben.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Netto Beamter</th>
                <th className="py-4 px-5 text-right">Netto Angestellter</th>
                <th className="py-4 px-5 text-right">Vorteil Beamter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {beispiele.map(({ brutto, beamter, angestellter }) => (
                <tr key={brutto} className="hover:bg-black/[0.04] transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-[#16181D]">{formatEUR(brutto)}</td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#16181D] bg-black/[0.04]">{formatEUR(beamter.nettoVorPkvMonat)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/80">{formatEUR(angestellter.nettoMonat)}</td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600">
                    +{formatEUR(beamter.nettoVorPkvMonat - angestellter.nettoMonat)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/55 mt-3 leading-relaxed">
          Vom Beamten-Netto geht in der Praxis noch der PKV-Eigenanteil ab (je nach Alter, Beihilfesatz und Tarif,
          häufig grob 200–400 € im Monat) — im Rechner oben können Sie ihn direkt mit einrechnen.
        </p>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zum Beamten-Netto
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
          href="/private-krankenversicherung-vs-gesetzlich"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
        >
          <HeartPulse size={14} className="text-[#E60A1C]" /> PKV vs. GKV im Vergleich <ArrowRight size={14} />
        </Link>
        <Link
          href="/welche-steuerklasse-bin-ich"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
        >
          <CheckCircle2 size={14} className="text-[#E60A1C]" /> Welche Steuerklasse bin ich? <ArrowRight size={14} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
        >
          Brutto-Netto-Rechner für Angestellte <ArrowRight size={14} />
        </Link>
      </div>
      <ToolContent config={TOOL_CONTENT["/brutto-netto-rechner-beamte"]} />
    </main>
  );
}
