import type { Metadata } from "next";
import Link from "next/link";
import { Scale, AlertCircle, ChevronDown, Calculator, BookOpen } from "lucide-react";
import { pageImageUrl } from "@/lib/pageImage";
import { pageStand } from "@/lib/pageDates";
import {
  PFAENDUNG,
  pfaendbarerBetrag,
  pfaendungsfreibetrag,
  WEIHNACHTSGELD_UNPFAENDBAR,
} from "@/lib/pfaendung";

/*
 * Alle Beträge kommen aus lib/pfaendung.ts (BGBl. 2026 I Nr. 80, gültig ab
 * 1.7.2026) und sind gegen die amtliche Tabelle geprüft (npm run
 * test:pfaendung). Bis 25.10.2026 stand hier noch der Freibetrag von Juli 2024
 * (1.491,75 €) mit frei erfundenen Tabellenwerten.
 */

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const GRUND = eur(PFAENDUNG.grundfreibetrag);
const STAND = pageStand("/pfaendungstabelle");

const TITLE = `Pfändungstabelle 2026/27: Freibetrag ${GRUND} € ab Juli`;
const DESCRIPTION = `Pfändungstabelle ab ${PFAENDUNG.gueltigAb} (BGBl.): Freibetrag ${GRUND} € netto, mit Unterhaltspflichten bis ${eur(pfaendungsfreibetrag(5))} €. Pfändbare Beträge für 0 bis 5 Personen, gültig bis ${PFAENDUNG.gueltigBis}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Pfändungstabelle 2026",
    "Pfändungstabelle 2027",
    "Pfändungstabelle",
    "pfändungsfreies Einkommen",
    "Pfändungsfreibetrag 2026",
    "§ 850c ZPO",
    "Lohnpfändung 2026",
    "Pfändungsfreigrenze 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/pfaendungstabelle" },
  openGraph: {
    images: [pageImageUrl("/pfaendungstabelle")],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://bruttonettocalculator.com/pfaendungstabelle",
    locale: "de_DE",
    type: "website",
  },
};

const PERSONEN = [0, 1, 2, 3, 4, 5];
const NETTO_ZEILEN = [1600, 1700, 1800, 1900, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600, 4800];

const tableData = NETTO_ZEILEN.map((netto) => ({ netto, werte: PERSONEN.map((n) => pfaendbarerBetrag(netto, n)) }));

const freibetraege = PERSONEN.map((n) => ({
  personen: n === 0 ? "0 (keine)" : n === 5 ? "5 und mehr" : String(n),
  betrag: `${eur(pfaendungsfreibetrag(n))} €`,
}));

/** Erste Tabellenzeile mit pfändbarem Betrag (ohne Unterhaltspflicht). */
const ERSTE_ZEILE = Math.ceil(PFAENDUNG.grundfreibetrag / 10) * 10;
const beispielNetto = 2500;
const beispielPfaendbar = pfaendbarerBetrag(beispielNetto, 0);

const faqs = [
  {
    q: "Wie hoch ist der pfändungsfreie Betrag 2026?",
    a: `Seit dem ${PFAENDUNG.gueltigAb} sind ${GRUND} € netto im Monat unpfändbar, wenn Sie niemandem Unterhalt zahlen (vorher ${eur(PFAENDUNG.vorjahrGrundfreibetrag)} €). Mit einer unterhaltsberechtigten Person steigt der Freibetrag auf ${eur(pfaendungsfreibetrag(1))} €, für die zweite bis fünfte Person um je ${eur(PFAENDUNG.weiterePerson)} €.`,
  },
  {
    q: "Wie wird der pfändbare Betrag berechnet?",
    a: `Der Nettolohn wird auf volle 10 € abgerundet. Vom Teil über dem Freibetrag sind ohne Unterhaltspflicht 3/10 geschützt, gepfändet werden 7/10. Jede unterhaltsberechtigte Person schützt einen weiteren Teil: die erste 2/10, die zweite bis fünfte je 1/10. Beispiel: Bei ${eur(beispielNetto)} € netto ohne Unterhaltspflicht sind ${eur(beispielPfaendbar)} € pfändbar. Was über ${eur(PFAENDUNG.grenzeVollPfaendbar)} € liegt, ist voll pfändbar (§ 850c Abs. 3 und 5 ZPO).`,
  },
  {
    q: "Gibt es schon die Pfändungstabelle 2027?",
    a: `Die Tabelle gilt vom ${PFAENDUNG.gueltigAb} bis zum ${PFAENDUNG.gueltigBis}, also für den größten Teil von 2027. Die Freigrenzen werden jedes Jahr zum 1. Juli an die Entwicklung des steuerlichen Grundfreibetrags angepasst (§ 850c Abs. 4 ZPO). Die Werte ab 1. Juli 2027 gibt das Bundesjustizministerium im Frühjahr 2027 bekannt.`,
  },
  {
    q: "Ist Weihnachtsgeld pfändbar?",
    a: `Nur teilweise. Unpfändbar ist Weihnachtsgeld bis zur Hälfte des auf volle 10 € aufgerundeten Grundfreibetrags, seit Juli 2026 also bis ${eur(WEIHNACHTSGELD_UNPFAENDBAR)} € (§ 850a Nr. 4 ZPO). Was darüber liegt, wird dem Monatslohn zugerechnet und nach der Tabelle gepfändet.`,
  },
  {
    q: "Wann ist mein gesamtes Gehalt pfändungsfrei?",
    a: `Wenn Ihr Nettolohn unter ${eur(ERSTE_ZEILE)} € bleibt (ohne Unterhaltspflicht). Erst ab dieser Tabellenzeile ist ein Betrag pfändbar, weil die Tabelle den Lohn auf volle 10 € abrundet. Mit Unterhaltspflichten liegt die Grenze entsprechend höher, siehe Übersicht.`,
  },
  {
    q: "Gilt die Pfändungstabelle auch für Selbstständige?",
    a: "§ 850c ZPO gilt für Arbeitseinkommen. Bei Selbstständigen setzt das Vollstreckungsgericht den pfändungsfreien Betrag auf Antrag fest (§ 850i ZPO) und orientiert sich dabei an denselben Freigrenzen. Für Konten gilt der Pfändungsschutz über das P-Konto (§ 850k ZPO).",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function PfaendungstabellePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
        {/* Hero */}
        <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
              <Scale size={14} />
              § 850c ZPO · Gültig ab 01.07.2026
            </div>
            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
              Pfändungstabelle{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
                2026/2027
              </span>
            </h1>
            <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
              Pfändungsfreigrenzen nach § 850c ZPO vom {PFAENDUNG.gueltigAb} bis {PFAENDUNG.gueltigBis}: Freibetrag und
              pfändbarer Betrag für 0 bis 5&nbsp;Unterhaltspflichten, nach der amtlichen Tabelle berechnet.
            </p>

            {/* Key stat cards */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-[#E60A1C]">{GRUND}&nbsp;€</div>
                <div className="text-xs text-black/50 mt-1">Grundfreibetrag / Monat</div>
              </div>
              <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-[#16181D]">{eur(PFAENDUNG.grenzeVollPfaendbar)}&nbsp;€</div>
                <div className="text-xs text-black/50 mt-1">darüber voll pfändbar</div>
              </div>
              <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-4 col-span-2 sm:col-span-1">
                <div className="text-2xl font-extrabold text-[#16181D]">01.07.2026</div>
                <div className="text-xs text-black/50 mt-1">gültig bis 30.06.2027</div>
              </div>
            </div>
          </div>
        </section>

        {/* Info notice */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="flex gap-3 bg-amber-50 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800/80 leading-relaxed">
              <strong className="text-amber-700">Hinweis:</strong> Die Werte gelten für Lohnzahlungen ab dem{" "}
              {PFAENDUNG.gueltigAb} (Pfändungsfreigrenzenbekanntmachung 2026, BGBl. 2026 I Nr. 80). Stand dieser Seite:{" "}
              {STAND.display}. Bei Fragen zur Lohnpfändung hilft eine Schuldnerberatung oder ein Rechtsanwalt. Keine
              Rechtsberatung.
            </p>
          </div>
        </section>

        {/* What is Pfändungstabelle */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-5">
              Was ist die <span className="text-[#E60A1C]">Pfändungstabelle</span>?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-black/70 text-sm sm:text-base leading-relaxed">
              <div className="space-y-3">
                <p>
                  Die <strong className="text-[#16181D]">Pfändungstabelle</strong> legt nach{" "}
                  <strong className="text-[#16181D]">§ 850c ZPO</strong> fest, welcher Teil Ihres Nettolohns bei einer
                  Lohnpfändung an Gläubiger gehen darf. Ihr Arbeitgeber liest den Betrag direkt aus der Tabelle ab.
                </p>
                <p>
                  Die Freigrenzen steigen jedes Jahr zum <strong className="text-[#16181D]">1. Juli</strong>. Seit dem{" "}
                  {PFAENDUNG.gueltigAb} sind {GRUND} € geschützt, vorher waren es{" "}
                  {eur(PFAENDUNG.vorjahrGrundfreibetrag)} €. Diese Werte gelten bis zum {PFAENDUNG.gueltigBis}.
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  Der <strong className="text-[#16181D]">Freibetrag</strong> steigt mit jeder Person, der Sie Unterhalt
                  zahlen: um {eur(PFAENDUNG.erstePerson)} € für die erste und um je {eur(PFAENDUNG.weiterePerson)} € für
                  die zweite bis fünfte Person.
                </p>
                <p>
                  Vom Lohn über dem Freibetrag werden ohne Unterhaltspflicht <strong className="text-[#16181D]">7/10</strong>{" "}
                  gepfändet, mit einer Person 5/10, mit zwei 4/10 und so weiter bis 1/10 bei fünf Personen. Was über{" "}
                  {eur(PFAENDUNG.grenzeVollPfaendbar)} € liegt, ist voll pfändbar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Freibetraege table */}
        <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-6">
            Pfändungsfreigrenzen ab 1. Juli 2026
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-[#E60A1C]/15 border-b border-black/[0.08]">
                  <th className="px-5 py-4 text-left font-bold text-[#16181D]">Unterhalts&shy;berechtigte Personen</th>
                  <th className="px-5 py-4 text-right font-bold text-[#16181D]">Monatlicher Pfändungs&shy;freibetrag</th>
                </tr>
              </thead>
              <tbody>
                {freibetraege.map((row, i) => (
                  <tr key={i} className="border-b border-black/[0.05] transition-colors hover:bg-black/[0.04] bg-[#F4F5F7]">
                    <td className="px-5 py-4 text-black/80">{row.personen}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-emerald-600">{row.betrag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Full data table */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
            Pfändungstabelle 2026/2027: pfändbare Beträge
          </h2>
          <p className="text-black/60 mb-6 text-sm sm:text-base">
            Pfändbarer Betrag in € pro Monat, jeweils für die Tabellenzeile ab diesem Nettolohn (die amtliche Tabelle rechnet
            in 10-€-Schritten). Spalten: Anzahl der unterhaltsberechtigten Personen.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#E60A1C]/15 border-b border-black/[0.08]">
                  <th className="px-3 sm:px-5 py-4 text-left font-bold text-[#16181D] whitespace-nowrap">Netto­lohn / Monat</th>
                  {PERSONEN.map((n) => (
                    <th key={n} className="px-3 sm:px-5 py-4 text-right font-bold text-[#16181D] whitespace-nowrap">
                      {n === 5 ? "5+" : n} {n === 1 ? "Person" : "Pers."}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black/[0.05] bg-[#F4F5F7]">
                  <td className="px-3 sm:px-5 py-3 font-mono text-black/80 whitespace-nowrap">bis {eur(ERSTE_ZEILE - 0.01)} €</td>
                  {PERSONEN.map((n) => (
                    <td key={n} className="px-3 sm:px-5 py-3 text-right font-mono text-emerald-600">0,00 €</td>
                  ))}
                </tr>
                {tableData.map((row) => (
                  <tr key={row.netto} className="border-b border-black/[0.05] transition-colors hover:bg-black/[0.04] bg-[#F4F5F7]">
                    <td className="px-3 sm:px-5 py-3 font-mono text-black/80 whitespace-nowrap">{eur(row.netto)} €</td>
                    {row.werte.map((w, n) => (
                      <td key={n} className={`px-3 sm:px-5 py-3 text-right font-mono ${w === 0 ? "text-emerald-600" : "text-[#FF4D5E]"}`}>
                        {eur(w)} €
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50 mt-3">
            Grün = nichts pfändbar · Rot = pfändbarer Betrag · Über {eur(PFAENDUNG.grenzeVollPfaendbar)} € ist der Mehrbetrag
            voll pfändbar. Quelle:{" "}
            <a href={PFAENDUNG.quelle} className="underline" rel="noopener" target="_blank">
              Pfändungsfreigrenzenbekanntmachung 2026, BGBl. 2026 I Nr. 80
            </a>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-5 py-10">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">
            Häufige Fragen zur Pfändungstabelle
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
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-5 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
                Nettolohn exakt berechnen
              </h2>
              <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
                Die Pfändungstabelle geht vom Nettolohn aus. Den berechnet der Brutto-Netto-Rechner für Ihr Gehalt, mit allen
                Steuerklassen und Sozialabgaben.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm sm:text-base"
                >
                  <Calculator size={18} />
                  Brutto-Netto-Rechner öffnen
                </Link>
                <Link
                  href="/lexikon"
                  className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] text-[#16181D] font-bold px-7 py-3.5 rounded-xl transition-all border border-black/[0.12] text-sm sm:text-base"
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
