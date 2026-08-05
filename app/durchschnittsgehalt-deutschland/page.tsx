import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BarChart3, ArrowRight, Info, Wallet2, MapPin } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { DESTATIS_JAHR_2025, BRANCHEN_MEDIAN_2025, WAGE_STATS_2026 } from "@/data/wage-stats";
import GehaltsvergleichRechner from "@/components/GehaltsvergleichRechner";
import ReviewerByline from "@/components/ReviewerByline";

const CANONICAL = "https://bruttonettocalculator.com/durchschnittsgehalt-deutschland";

export const metadata: Metadata = {
  title: "Durchschnittsgehalt Deutschland 2026: 64.441 € brutto netto",
  description:
    "Durchschnittsgehalt Deutschland: 64.441 € brutto im Jahr, Median 54.066 € (Destatis 2025). Wie viel netto bleibt und wo Sie im Perzentil-Vergleich stehen.",
  keywords: [
    "durchschnittsgehalt deutschland",
    "durchschnittsgehalt deutschland 2026",
    "durchschnittseinkommen deutschland",
    "mediangehalt deutschland",
    "durchschnittsgehalt netto",
    "gehaltsvergleich deutschland",
    "wie viel verdienen die deutschen",
    "durchschnittslohn deutschland",
    "gehalt vergleichen perzentil",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Durchschnittsgehalt Deutschland 2026 — brutto, netto & Perzentil-Vergleich",
    description:
      "64.441 € Durchschnitt, 54.066 € Median (Destatis). Vergleichen Sie Ihr Gehalt mit der amtlichen Verdienstverteilung.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "Durchschnittsgehalt Deutschland 2026: 64.441 € brutto",
    description: "Durchschnitt, Median und Perzentile der amtlichen Destatis-Verdienststatistik — plus Netto-Rechner.",
  },
};

const d = DESTATIS_JAHR_2025;

function nettoVon(bruttoJahr: number) {
  return calculateNetto({
    bruttoMonat: bruttoJahr / 12,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: 1,
  });
}

export default function DurchschnittsgehaltPage() {
  // Netto-Werte kommen aus derselben Engine wie der Hauptrechner.
  const nettoDurchschnitt = nettoVon(d.durchschnittJahr);
  const nettoMedian = nettoVon(d.medianJahr);
  const nettoWest = nettoVon(d.medianWest);
  const nettoOst = nettoVon(d.medianOst);

  const verteilung = [
    {
      label: "Unterstes 10 %",
      wert: `bis ${formatEUR(d.unten10Bis)}`,
      desc: "Jede zehnte vollzeitbeschäftigte Person verdient höchstens so viel im Jahr.",
      netto: nettoVon(d.unten10Bis).nettoMonat,
    },
    {
      label: "Median (50 %)",
      wert: formatEUR(d.medianJahr),
      desc: "Die Mitte: Die eine Hälfte verdient mehr, die andere weniger. Aussagekräftiger als der Durchschnitt.",
      netto: nettoMedian.nettoMonat,
      highlight: true,
    },
    {
      label: "Durchschnitt (Mittelwert)",
      wert: formatEUR(d.durchschnittJahr),
      desc: "Arithmetisches Mittel — durch sehr hohe Einkommen nach oben gezogen und daher deutlich über dem Median.",
      netto: nettoDurchschnitt.nettoMonat,
      highlight: true,
    },
    {
      label: "Oberstes 10 %",
      wert: `ab ${formatEUR(d.top10Ab)}`,
      desc: "Ab diesem Jahresbrutto gehört man zum bestverdienenden Zehntel aller Vollzeitbeschäftigten.",
      netto: nettoVon(d.top10Ab).nettoMonat,
    },
    {
      label: "Oberstes 1 %",
      wert: `ab ${formatEUR(d.top1Ab)}`,
      desc: "Die Spitzenverdiener. Ab hier greift auf große Teile des Einkommens der Spitzensteuersatz.",
      netto: nettoVon(d.top1Ab).nettoMonat,
    },
  ];

  const faqs = [
    {
      q: "Wie hoch ist das Durchschnittsgehalt in Deutschland?",
      a: `Vollzeitbeschäftigte in Deutschland verdienten 2025 im Durchschnitt ${formatEUR(d.durchschnittJahr)} brutto im Jahr einschließlich Sonderzahlungen (Statistisches Bundesamt, veröffentlicht am ${d.veroeffentlicht}). Der Median — der Wert genau in der Mitte — lag mit ${formatEUR(d.medianJahr)} deutlich darunter. Pro Monat entspricht der Durchschnitt rund ${formatEUR(d.durchschnittJahr / 12)} brutto, der Median rund ${formatEUR(d.medianJahr / 12)}.`,
    },
    {
      q: "Was bleibt vom Durchschnittsgehalt netto übrig?",
      a: `Von ${formatEUR(d.durchschnittJahr)} Bruttojahresgehalt bleiben in Steuerklasse I (kinderlos, ohne Kirchensteuer, Rechengrößen 2026) rund ${formatEUR(nettoDurchschnitt.nettoMonat)} netto pro Monat bzw. ${formatEUR(nettoDurchschnitt.nettoJahr)} im Jahr. Die Abgabenquote liegt damit bei etwa ${(100 - (nettoDurchschnitt.nettoJahr / d.durchschnittJahr) * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} % aus Lohnsteuer, Solidaritätszuschlag und Sozialversicherungsbeiträgen.`,
    },
    {
      q: "Warum ist der Median wichtiger als der Durchschnitt?",
      a: `Der Durchschnitt wird von wenigen sehr hohen Einkommen nach oben verzerrt: Das oberste Prozent verdient ab ${formatEUR(d.top1Ab)} im Jahr und zieht den Mittelwert deutlich nach oben. Der Median dagegen teilt die Beschäftigten exakt in zwei Hälften und beschreibt damit besser, was ein typischer Vollzeitbeschäftigter verdient. Die Lücke zwischen beiden Werten beträgt ${formatEUR(d.durchschnittJahr - d.medianJahr)} im Jahr.`,
    },
    {
      q: "Wie groß ist der Gehaltsunterschied zwischen Ost und West?",
      a: `Der Median-Bruttojahresverdienst lag 2025 in den westdeutschen Bundesländern bei ${formatEUR(d.medianWest)}, in den ostdeutschen Ländern ohne Berlin bei ${formatEUR(d.medianOst)} — eine Differenz von ${formatEUR(d.medianWest - d.medianOst)} im Jahr. Netto entspricht das einem Unterschied von rund ${formatEUR(nettoWest.nettoMonat - nettoOst.nettoMonat)} pro Monat.`,
    },
    {
      q: "Ab welchem Gehalt gehört man zu den Top 10 Prozent?",
      a: `Ab einem Bruttojahresverdienst von ${formatEUR(d.top10Ab)} gehört eine vollzeitbeschäftigte Person zum obersten Zehntel in Deutschland. Zum obersten Prozent zählt man ab ${formatEUR(d.top1Ab)} im Jahr. Umgekehrt verdient das unterste Zehntel höchstens ${formatEUR(d.unten10Bis)} brutto im Jahr.`,
    },
    {
      q: "In welchen Branchen wird am meisten verdient?",
      a: `Die höchsten Medianverdienste erzielten 2025 die Energieversorgung mit ${formatEUR(77522)} und Finanz- und Versicherungsdienstleistungen mit ${formatEUR(76594)} im Jahr. Am unteren Ende lagen das Gastgewerbe mit ${formatEUR(35545)} sowie Land- und Forstwirtschaft und Fischerei mit ${formatEUR(35689)} — ein Abstand von mehr als dem Doppelten zwischen der bestbezahlten und der schlechtestbezahlten Branche.`,
    },
    {
      q: "Sind das die Zahlen für 2026?",
      a: `Es sind die aktuellsten amtlichen Zahlen. Die Verdienststatistik des Statistischen Bundesamtes erscheint mit rund einem Jahr Verzug: Die Werte für das Berichtsjahr 2025 wurden am ${d.veroeffentlicht} veröffentlicht, Zahlen für 2026 liegen noch nicht vor. Die Netto-Berechnungen auf dieser Seite verwenden dagegen bereits die Steuer- und Sozialversicherungswerte 2026.`,
    },
    {
      q: "Zählen Urlaubs- und Weihnachtsgeld mit?",
      a: `Ja — die Jahreswerte des Statistischen Bundesamtes enthalten steuerpflichtige Sonderzahlungen wie Urlaubs- und Weihnachtsgeld. Wenn Sie Ihr Gehalt vergleichen, sollten Sie diese also mitrechnen. Ohne Sonderzahlungen lag der durchschnittliche Bruttomonatsverdienst von Vollzeitbeschäftigten im April 2025 bei ${formatEUR(WAGE_STATS_2026.averageGrossMonthly)} bei ${d.wochenstunden.toLocaleString("de-DE")} bezahlten Wochenstunden.`,
    },
  ];

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
          { "@type": "ListItem", position: 2, name: "Durchschnittsgehalt Deutschland", item: CANONICAL },
        ],
      },
      {
        "@type": "Dataset",
        "@id": `${CANONICAL}#dataset`,
        name: "Durchschnitts- und Mediangehalt in Deutschland 2025",
        description:
          "Bruttojahresverdienste vollzeitbeschäftigter Arbeitnehmer in Deutschland 2025 inklusive Sonderzahlungen: Durchschnitt, Median, Dezile, Ost-West-Vergleich und Branchenmediane.",
        temporalCoverage: "2025",
        creator: { "@type": "GovernmentOrganization", name: "Statistisches Bundesamt (Destatis)" },
        isBasedOn: d.quelleUrl,
        isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
      },
      {
        "@type": "WebApplication",
        "@id": `${CANONICAL}#app`,
        name: "Gehaltsvergleich Deutschland — Perzentil-Rechner",
        url: CANONICAL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Durchschnittsgehalt Deutschland</span>
      </div>

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <BarChart3 size={14} /> Destatis-Daten · Berichtsjahr {d.berichtsjahr}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">Durchschnittsgehalt</span> in Deutschland
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Vollzeitbeschäftigte verdienten in Deutschland zuletzt{" "}
          <strong className="text-[#16181D]">{formatEUR(d.durchschnittJahr)} brutto im Jahr</strong> — der Median lag
          mit <strong className="text-[#16181D]">{formatEUR(d.medianJahr)}</strong> allerdings deutlich darunter
          (Statistisches Bundesamt, Berichtsjahr {d.berichtsjahr}). Netto bleiben vom Durchschnittsgehalt rund{" "}
          <strong className="text-[#E60A1C]">{formatEUR(nettoDurchschnitt.nettoMonat)} im Monat</strong>. Vergleichen
          Sie unten, wo Ihr eigenes Gehalt in der amtlichen Verteilung steht.
        </p>
        <ReviewerByline />
      </div>

      {/* Rechner */}
      <div id="vergleich" className="mb-14 scroll-mt-24">
        <GehaltsvergleichRechner />
      </div>

      {/* Kernzahlen */}
      <div className="mb-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Durchschnitt (Jahr)", wert: formatEUR(d.durchschnittJahr), sub: "arithmetisches Mittel, Vollzeit" },
          { label: "Median (Jahr)", wert: formatEUR(d.medianJahr), sub: "die Mitte aller Vollzeitgehälter" },
          { label: "Durchschnitt (Monat)", wert: formatEUR(WAGE_STATS_2026.averageGrossMonthly), sub: "April 2025, ohne Sonderzahlungen" },
          { label: "Stundenverdienst", wert: formatEUR(d.stundenverdienst), sub: `bei ${d.wochenstunden.toLocaleString("de-DE")} Std./Woche` },
        ].map((k) => (
          <div key={k.label} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">{k.label}</div>
            <div className="font-mono font-extrabold text-xl sm:text-2xl text-[#E60A1C] break-all">{k.wert}</div>
            <div className="text-xs text-black/55 mt-1 leading-snug">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Verteilung */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Die Gehaltsverteilung in Deutschland
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Das Statistische Bundesamt veröffentlicht nicht nur Mittelwerte, sondern auch die Schwellen der
          Einkommensverteilung. Die Netto-Spalte ist mit unserem Rechenkern für Steuerklasse I (kinderlos, ohne
          Kirchensteuer, Rechengrößen 2026) berechnet:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.10] shadow-sm">
          <table className="w-full text-sm bg-[#FFFFFF] min-w-[640px]">
            <caption className="sr-only">
              Verteilung der Bruttojahresverdienste von Vollzeitbeschäftigten in Deutschland {d.berichtsjahr}
            </caption>
            <thead>
              <tr className="bg-[#F1F3F5] text-left">
                <th scope="col" className="px-4 py-3 font-bold text-[#16181D]">Position</th>
                <th scope="col" className="px-4 py-3 font-bold text-[#16181D] text-right whitespace-nowrap">Brutto / Jahr</th>
                <th scope="col" className="px-4 py-3 font-bold text-[#16181D] text-right whitespace-nowrap">Netto / Monat</th>
                <th scope="col" className="px-4 py-3 font-bold text-[#16181D]">Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              {verteilung.map((v) => (
                <tr key={v.label} className={`border-t border-black/[0.06] ${v.highlight ? "bg-[#E60A1C]/[0.04]" : ""}`}>
                  <th scope="row" className="px-4 py-3 font-semibold text-[#16181D] text-left whitespace-nowrap">
                    {v.label}
                  </th>
                  <td className="px-4 py-3 text-right font-mono font-bold text-[#E60A1C] whitespace-nowrap">{v.wert}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#16181D] whitespace-nowrap">{formatEUR(v.netto)}</td>
                  <td className="px-4 py-3 text-black/70 leading-relaxed">{v.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-2 mt-4 text-xs text-black/50 leading-relaxed">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>
            Quelle: {d.quelle}. Bruttojahresverdienste vollzeitbeschäftigter Arbeitnehmer inklusive
            steuerpflichtiger Sonderzahlungen. Netto-Werte eigene Berechnung mit den Rechengrößen 2026.
          </span>
        </div>
      </div>

      {/* Ost/West */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
          <MapPin size={24} className="text-[#E60A1C]" /> Ost und West: {formatEUR(d.medianWest - d.medianOst)} Unterschied
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Mehr als 35 Jahre nach der Wiedervereinigung besteht die Verdienstlücke fort — hier im Median, also beim
          typischen Gehalt, nicht beim verzerrungsanfälligen Mittelwert:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "Westdeutsche Bundesländer", brutto: d.medianWest, netto: nettoWest.nettoMonat },
            { name: "Ostdeutsche Bundesländer (ohne Berlin)", brutto: d.medianOst, netto: nettoOst.nettoMonat },
          ].map((r) => (
            <div key={r.name} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-[#16181D] text-sm sm:text-base mb-3">{r.name}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-mono font-extrabold text-2xl text-[#E60A1C]">{formatEUR(r.brutto)}</span>
                <span className="text-xs text-black/50">Median brutto / Jahr</span>
              </div>
              <div className="text-sm text-black/70">
                entspricht rund <strong className="text-[#16181D] font-mono">{formatEUR(r.netto)}</strong> netto pro Monat
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Link
            href="/brutto-netto-gehaltstabelle"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            Gehaltstabelle nach Bundesland ansehen <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Branchen */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Höchste und niedrigste Verdienste nach Branche
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Zwischen der bestbezahlten und der schlechtestbezahlten Branche liegt mehr als das Doppelte —
          Medianverdienste {d.berichtsjahr}:
        </p>
        <div className="space-y-3">
          {BRANCHEN_MEDIAN_2025.map((b) => (
            <div
              key={b.branche}
              className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-3"
            >
              <span className="font-semibold text-[#16181D] text-sm sm:text-base">{b.branche}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono font-extrabold text-lg text-[#E60A1C]">{formatEUR(b.median)}</span>
                <span className="text-xs text-black/50 font-mono whitespace-nowrap">
                  ≈ {formatEUR(nettoVon(b.median).nettoMonat)} netto/Mon.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Netto vom Durchschnitt */}
      <div className="mb-16 bg-gradient-to-br from-[#E60A1C]/10 via-[#FFFFFF] to-[#FFFFFF] border border-[#E60A1C]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-3 py-1 rounded-full mb-4">
          <Wallet2 size={13} /> Mit unserem Rechenkern ermittelt
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Vom Durchschnittsgehalt bleiben {formatEUR(nettoDurchschnitt.nettoMonat)} netto
        </h2>
        <p className="text-base sm:text-lg text-black/80 leading-relaxed mb-6 max-w-4xl">
          {formatEUR(d.durchschnittJahr)} brutto im Jahr bedeuten in Steuerklasse I (kinderlos, ohne Kirchensteuer){" "}
          <strong className="text-[#E60A1C] font-extrabold">{formatEUR(nettoDurchschnitt.nettoJahr)}</strong> netto im
          Jahr. Vom Mediangehalt ({formatEUR(d.medianJahr)}) bleiben{" "}
          <strong className="text-[#16181D]">{formatEUR(nettoMedian.nettoMonat)}</strong> netto pro Monat. Der
          Bruttounterschied von {formatEUR(d.durchschnittJahr - d.medianJahr)} schrumpft netto auf{" "}
          <strong className="text-[#16181D]">{formatEUR(nettoDurchschnitt.nettoJahr - nettoMedian.nettoJahr)}</strong> —
          weil der Steuersatz mit dem Einkommen steigt.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/?brutto=${Math.round(d.durchschnittJahr / 12)}&jahr=2026&sk=1#rechner`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors"
          >
            Eigenes Gehalt berechnen <ArrowRight size={14} />
          </Link>
          <Link
            href="/gehaltserhoehung-rechner"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            Was bringt eine Gehaltserhöhung netto? <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zum Durchschnittsgehalt
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
    </main>
  );
}
