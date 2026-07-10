import type { Metadata } from "next";
import Link from "next/link";
import { Scale, AlertCircle, ChevronDown, Calculator, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Pfändungstabelle 2026 — Aktuelle Pfändungsfreigrenzen",
  description:
    "Pfändungstabelle 2026 mit aktuellen Pfändungsfreigrenzen nach § 850c ZPO. Pfändungsfreies Einkommen 2026: Grundfreibetrag 1.491,75 € + Erhöhung für Unterhaltspflichten. Alle Werte sofort abrufbar.",
  keywords: [
    "Pfändungstabelle 2026",
    "Pfändungstabelle",
    "pfändungsfreies Einkommen",
    "Pfändungsfreibetrag 2026",
    "§ 850c ZPO",
    "pfändbares Einkommen berechnen",
    "Lohnpfändung 2026",
    "Pfändungsfreigrenze 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/pfaendungstabelle" },
  openGraph: {
    title: "Pfändungstabelle 2026 — Aktuelle Pfändungsfreigrenzen",
    description:
      "Alle Pfändungsfreigrenzen 2026 nach § 850c ZPO auf einen Blick. Basis-Freibetrag: 1.491,75 €.",
    url: "https://bruttonettocalculator.com/pfaendungstabelle",
    locale: "de_DE",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was ist die Pfändungstabelle 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Pfändungstabelle 2026 listet nach § 850c ZPO, welche Teile des Nettogehalts pfändbar sind. Der Grundfreibetrag beträgt 2026 monatlich 1.491,75 €. Einkommen unterhalb dieser Grenze ist vollständig geschützt.",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch ist der pfändungsfreie Betrag 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der monatliche Pfändungsfreibetrag 2026 beträgt 1.491,75 € (ohne Unterhaltspflichten). Für jede unterhaltsberechtigte Person erhöht sich der Freibetrag um ca. 553,25 €.",
      },
    },
    {
      "@type": "Question",
      name: "Was ändert sich bei der Pfändungstabelle jährlich?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Pfändungsfreibetrag wird alle zwei Jahre angepasst und orientiert sich am Anstieg des Grundfreibetrags nach § 32a EStG. Die aktuell gültige Tabelle nach § 850c ZPO gilt ab dem 1. Juli 2025 bis 30. Juni 2027.",
      },
    },
    {
      "@type": "Question",
      name: "Wann ist mein gesamtes Gehalt pfändungsfrei?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ihr Nettogehalt ist vollständig pfändungsfrei, wenn es den monatlichen Grundfreibetrag von 1.491,75 € nicht übersteigt. Bei Unterhaltspflichten erhöht sich dieser Betrag entsprechend.",
      },
    },
    {
      "@type": "Question",
      name: "Gilt die Pfändungstabelle für Arbeitnehmer und Selbstständige?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Pfändungstabelle gilt grundsätzlich für alle Arten von Arbeitseinkommen, auch für Selbstständige. Bei Selbstständigen wird das pfändbare Einkommen nach § 850i ZPO individuell durch das Vollstreckungsgericht festgesetzt.",
      },
    },
  ],
};

// Full Pfändungstabelle 2026 data
const tableData = [
  { nettoMonatlich: "bis 1.491,75", p0: "0,00", p1: "0,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "1.500,00", p0: "6,63", p1: "0,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "1.600,00", p0: "82,38", p1: "0,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "1.700,00", p0: "158,13", p1: "0,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "1.800,00", p0: "233,88", p1: "0,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "1.900,00", p0: "309,63", p1: "0,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "2.000,00", p0: "385,38", p1: "0,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "2.100,00", p0: "461,13", p1: "55,00", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "2.200,00", p0: "536,88", p1: "130,75", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "2.300,00", p0: "612,63", p1: "206,50", p2: "0,00", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "2.400,00", p0: "688,38", p1: "282,25", p2: "75,75", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "2.500,00", p0: "764,13", p1: "358,00", p2: "151,50", p3: "0,00", p4: "0,00" },
  { nettoMonatlich: "2.600,00", p0: "839,88", p1: "433,75", p2: "227,25", p3: "20,75", p4: "0,00" },
  { nettoMonatlich: "2.700,00", p0: "915,63", p1: "509,50", p2: "303,00", p3: "96,50", p4: "0,00" },
  { nettoMonatlich: "2.800,00", p0: "991,38", p1: "585,25", p2: "378,75", p3: "172,25", p4: "0,00" },
  { nettoMonatlich: "2.900,00", p0: "1.067,13", p1: "661,00", p2: "454,50", p3: "248,00", p4: "41,50" },
  { nettoMonatlich: "3.000,00", p0: "1.142,88", p1: "736,75", p2: "530,25", p3: "323,75", p4: "117,25" },
  { nettoMonatlich: "3.100,00", p0: "1.218,63", p1: "812,50", p2: "606,00", p3: "399,50", p4: "193,00" },
  { nettoMonatlich: "3.200,00", p0: "1.294,38", p1: "888,25", p2: "681,75", p3: "475,25", p4: "268,75" },
  { nettoMonatlich: "3.300,00", p0: "1.370,13", p1: "964,00", p2: "757,50", p3: "551,00", p4: "344,50" },
  { nettoMonatlich: "3.400,00", p0: "1.445,88", p1: "1.039,75", p2: "833,25", p3: "626,75", p4: "420,25" },
  { nettoMonatlich: "3.500,00", p0: "1.521,63", p1: "1.115,50", p2: "908,00", p3: "702,50", p4: "496,00" },
];

const freibetraege = [
  { personen: "0 (keine)", betrag: "1.491,75 €" },
  { personen: "1", betrag: "2.045,00 €" },
  { personen: "2", betrag: "2.308,67 €" },
  { personen: "3", betrag: "2.572,33 €" },
  { personen: "4", betrag: "2.836,00 €" },
  { personen: "5+", betrag: "3.099,67 €" },
];

const faqs = [
  {
    q: "Was ist die Pfändungstabelle 2026?",
    a: "Die Pfändungstabelle 2026 ist eine gesetzliche Tabelle nach § 850c ZPO, die zeigt, welcher Anteil Ihres Nettogehalts durch Gläubiger gepfändet werden darf. Der monatliche Grundfreibetrag beträgt 2026 exakt 1.491,75 €.",
  },
  {
    q: "Wie hoch ist der pfändungsfreie Betrag 2026?",
    a: "Der Grundfreibetrag für Pfändungen liegt 2026 bei 1.491,75 € monatlich (netto). Für jede unterhaltspflichtige Person (Kind, Ehepartner) erhöht sich dieser Betrag. Bei einer unterhaltsberechtigten Person beträgt der Freibetrag 2.045,00 €.",
  },
  {
    q: "Was ändert sich bei der Pfändungstabelle jährlich?",
    a: "Der Pfändungsfreibetrag wird alle zwei Jahre angepasst. Die aktuelle Tabelle gilt vom 1. Juli 2025 bis 30. Juni 2027 und orientiert sich am Grundfreibetrag (§ 32a EStG). Nächste Anpassung ist für Juli 2027 vorgesehen.",
  },
  {
    q: "Wann ist mein gesamtes Gehalt pfändungsfrei?",
    a: "Ihr Nettogehalt ist vollständig pfändungsfrei, solange es 1.491,75 € monatlich nicht überschreitet. Bei Unterhaltspflichten erhöht sich dieser Schutz entsprechend der Tabelle.",
  },
  {
    q: "Gilt die Pfändungstabelle für Arbeitnehmer und Selbstständige?",
    a: "§ 850c ZPO gilt direkt für Arbeitseinkommen (Lohn/Gehalt). Für Selbstständige setzt das Vollstreckungsgericht den pfändbaren Betrag nach § 850i ZPO individuell fest, orientiert sich aber ebenfalls an diesen Werten.",
  },
];

export default function PfaendungstabellePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
              <Scale size={14} />
              § 850c ZPO · Gültig ab 01.07.2025
            </div>
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
              Pfändungstabelle{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
                2026
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Aktuelle Pfändungsfreigrenzen nach § 850c ZPO. Pfändungsfreies Einkommen für
              0–5&nbsp;Unterhaltspflichten auf einen Blick — kostenlos &amp; aktuell.
            </p>

            {/* Key stat cards */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-[#E60A1C]">1.491,75&nbsp;€</div>
                <div className="text-xs text-white/50 mt-1">Grundfreibetrag / Monat</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-white">§ 850c</div>
                <div className="text-xs text-white/50 mt-1">Rechtsgrundlage ZPO</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <div className="text-2xl font-extrabold text-white">Jul 2025</div>
                <div className="text-xs text-white/50 mt-1">Letzte Aktualisierung</div>
              </div>
            </div>
          </div>
        </section>

        {/* Info notice */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="flex gap-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
            <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/80 leading-relaxed">
              <strong className="text-amber-300">Hinweis:</strong> Die Pfändungstabelle 2026 gilt
              für Pfändungen ab dem 1. Juli 2025. Bei rechtlichen Fragen zur Lohnpfändung wenden Sie
              sich an einen Rechtsanwalt oder eine Schuldnerberatung. Keine Rechtsberatung.
            </p>
          </div>
        </section>

        {/* What is Pfändungstabelle */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-5">
              Was ist die{" "}
              <span className="text-[#E60A1C]">Pfändungstabelle 2026</span>?
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-white/70 text-sm sm:text-base leading-relaxed">
              <div className="space-y-3">
                <p>
                  Die <strong className="text-white">Pfändungstabelle</strong> legt nach{" "}
                  <strong className="text-white">§ 850c ZPO</strong> (Zivilprozessordnung) fest,
                  welcher Anteil Ihres Nettoeinkommens durch Gläubiger gepfändet werden darf. Sie
                  schützt Arbeitnehmer vor einer Vollpfändung des Lohns.
                </p>
                <p>
                  Das Bundesministerium der Justiz aktualisiert die Tabelle regelmäßig — zuletzt
                  zum <strong className="text-white">1. Juli 2025</strong>. Diese Version gilt bis
                  zum 30. Juni 2027.
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  Der <strong className="text-white">Pfändungsfreibetrag</strong> erhöht sich mit
                  der Anzahl der unterhaltsberechtigten Personen (z. B. Kinder, Ehegatten). Je mehr
                  Unterhaltspflichten bestehen, desto größer der geschützte Betrag.
                </p>
                <p>
                  Nur das Einkommen <em>über</em> dem jeweiligen Freibetrag ist pfändbar —
                  allerdings nie mehr als 3/7 des übersteigenden Betrags (§ 850c Abs. 2 ZPO).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Freibetraege table */}
        <section className="max-w-6xl mx-auto px-5 py-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Pfändungsfreigrenzen 2026 — Übersicht
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-[#E60A1C]/15 border-b border-white/10">
                  <th className="px-5 py-4 text-left font-bold text-white">Unterhalts&shy;pflichtige Personen</th>
                  <th className="px-5 py-4 text-right font-bold text-white">Monatlicher Pfändungs&shy;freibetrag</th>
                </tr>
              </thead>
              <tbody>
                {freibetraege.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                      i % 2 === 0 ? "bg-[#090909]" : "bg-[#070707]"
                    }`}
                  >
                    <td className="px-5 py-4 text-white/80">{row.personen}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400">
                      {row.betrag}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Full data table */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Vollständige Pfändungstabelle 2026
          </h2>
          <p className="text-white/60 mb-6 text-sm sm:text-base">
            Pfändbarer Betrag in € pro Monat je nach Nettoeinkommen und Anzahl der
            Unterhaltspflichten (0–4+):
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#E60A1C]/15 border-b border-white/10">
                  <th className="px-3 sm:px-5 py-4 text-left font-bold text-white whitespace-nowrap">
                    Netto­einkommen / Monat
                  </th>
                  <th className="px-3 sm:px-5 py-4 text-right font-bold text-white whitespace-nowrap">
                    0 Personen
                  </th>
                  <th className="px-3 sm:px-5 py-4 text-right font-bold text-white whitespace-nowrap">
                    1 Person
                  </th>
                  <th className="px-3 sm:px-5 py-4 text-right font-bold text-white whitespace-nowrap">
                    2 Personen
                  </th>
                  <th className="px-3 sm:px-5 py-4 text-right font-bold text-white whitespace-nowrap">
                    3 Personen
                  </th>
                  <th className="px-3 sm:px-5 py-4 text-right font-bold text-white whitespace-nowrap">
                    4+ Personen
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                      i % 2 === 0 ? "bg-[#090909]" : "bg-[#070707]"
                    }`}
                  >
                    <td className="px-3 sm:px-5 py-3 font-mono text-white/80 whitespace-nowrap">
                      {row.nettoMonatlich} €
                    </td>
                    <td className={`px-3 sm:px-5 py-3 text-right font-mono ${row.p0 === "0,00" ? "text-emerald-500" : "text-[#FF4D5E]"}`}>
                      {row.p0} €
                    </td>
                    <td className={`px-3 sm:px-5 py-3 text-right font-mono ${row.p1 === "0,00" ? "text-emerald-500" : "text-[#FF4D5E]"}`}>
                      {row.p1} €
                    </td>
                    <td className={`px-3 sm:px-5 py-3 text-right font-mono ${row.p2 === "0,00" ? "text-emerald-500" : "text-[#FF4D5E]"}`}>
                      {row.p2} €
                    </td>
                    <td className={`px-3 sm:px-5 py-3 text-right font-mono ${row.p3 === "0,00" ? "text-emerald-500" : "text-[#FF4D5E]"}`}>
                      {row.p3} €
                    </td>
                    <td className={`px-3 sm:px-5 py-3 text-right font-mono ${row.p4 === "0,00" ? "text-emerald-500" : "text-[#FF4D5E]"}`}>
                      {row.p4} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/40 mt-3">
            🟢 Grün = 0 € pfändbar (Freibetrag greift) · 🔴 Rot = pfändbarer Betrag · Quelle: § 850c ZPO, gültig ab 01.07.2025
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-5 py-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            Häufige Fragen zur Pfändungstabelle
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="px-6 pb-5 pt-1 text-white/65 text-sm sm:text-base leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-5 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Nettogehalt exakt berechnen
              </h2>
              <p className="text-white/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
                Mit unserem kostenlosen Brutto-Netto-Rechner berechnen Sie Ihr genaues Nettogehalt
                — inklusive aller Steuerklassen, Sozialabgaben und Freibeträge für 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(230,10,28,0.4)] hover:shadow-[0_0_35px_rgba(230,10,28,0.6)] text-sm sm:text-base"
                >
                  <Calculator size={18} />
                  Brutto-Netto-Rechner öffnen
                </Link>
                <Link
                  href="/lexikon"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-7 py-3.5 rounded-xl transition-all border border-white/20 text-sm sm:text-base"
                >
                  <BookOpen size={18} />
                  Steuer-Lexikon
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
