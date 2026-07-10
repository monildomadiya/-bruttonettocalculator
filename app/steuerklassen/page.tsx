import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ChevronDown, Calculator, ArrowRight, Users, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Steuerklassen 2026 — Alle 6 Steuerklassen im Vergleich",
  description:
    "Steuerklassen 2026 Vergleich: Alle 6 Steuerklassen erklärt mit Nettogehalt-Beispielen für 2.500–5.000 € Brutto. Steuerklassenwechsel, Steuerklasse III vs. IV vs. V — jetzt informieren.",
  keywords: [
    "Steuerklassen 2026",
    "Steuerklassenvergleich",
    "Steuerklasse 1 2 3 4 5 6",
    "Steuerklassenwechsel",
    "Steuerklasse III vs IV vs V",
    "Steuerklasse wechseln 2026",
    "Steuerklasse 3 und 5",
    "welche Steuerklasse bin ich",
    "Steuerklasse Unterschied",
    "Lohnsteuer Steuerklassen",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/steuerklassen" },
  openGraph: {
    title: "Steuerklassen 2026 — Alle 6 Steuerklassen im Vergleich",
    description:
      "Klarer Vergleich aller 6 deutschen Steuerklassen mit Nettogehalt-Beispielen, Steuerklassenwechsel-Info und FAQ.",
    url: "https://bruttonettocalculator.com/steuerklassen",
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
      name: "Welche Steuerklassen gibt es in Deutschland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In Deutschland gibt es 6 Steuerklassen: Klasse I (ledig/geschieden), II (Alleinerziehende), III (verheiratet, höheres Einkommen), IV (verheiratet, gleiches Einkommen), V (verheiratet, geringeres Einkommen) und VI (Zweitjob).",
      },
    },
    {
      "@type": "Question",
      name: "Wann lohnt sich Steuerklasse III und V?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Kombination III/V lohnt sich, wenn ein Ehepartner deutlich mehr verdient. Der Geringverdienende wechselt zu V (höhere Steuerlast), der Besserverdienende zu III (niedrigere Steuerlast). Am Jahresende wird über die gemeinsame Steuererklärung ausgeglichen.",
      },
    },
    {
      "@type": "Question",
      name: "Wie oft kann ich die Steuerklasse wechseln?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Verheiratete Paare können die Steuerklasse seit 2023 unbegrenzt oft wechseln (bis 30. November des Jahres beim Finanzamt). Früher war nur ein Wechsel pro Jahr möglich.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen Steuerklasse IV und IV mit Faktor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Steuerklasse IV (ohne Faktor) teilt die Steuer gleichmäßig auf. IV mit Faktorverfahren berücksichtigt unterschiedliche Einkommen beider Ehepartner genauer und vermeidet Nachzahlungen bei der Steuererklärung.",
      },
    },
    {
      "@type": "Question",
      name: "Welche Steuerklasse zahlt am wenigsten Steuern?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Steuerklasse III zahlt die geringste monatliche Lohnsteuer, da sie für den Hauptverdiener im Ehepaar den doppelten Grundfreibetrag gewährt. Im Jahresausgleich wird die Gesamtsteuer des Haushalts gemeinsam berechnet.",
      },
    },
  ],
};

const steuerklassen = [
  {
    nr: "I",
    title: "Steuerklasse I",
    subtitle: "Ledig, geschieden, verwitwet",
    color: "from-blue-600/20 to-blue-800/10",
    border: "border-blue-500/30",
    badge: "Standardklasse",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    description:
      "Die häufigste Steuerklasse. Gilt für ledige, dauerhaft getrennt lebende oder geschiedene Arbeitnehmer. Kein erhöhter Freibetrag, keine Splitting-Vorteile.",
    vorteile: ["Einfache Berechnung", "Für Alleinstehende optimal", "Kein Partner-Ausgleich nötig"],
    nachteile: ["Kein Splitting-Vorteil", "Höhere Last als Klasse III"],
  },
  {
    nr: "II",
    title: "Steuerklasse II",
    subtitle: "Alleinerziehende",
    color: "from-purple-600/20 to-purple-800/10",
    border: "border-purple-500/30",
    badge: "Entlastungsbetrag",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description:
      "Für Alleinerziehende, die mit mindestens einem Kind (Kindergeld/Kinderfreibetrag) im Haushalt leben. Zusätzlicher Entlastungsbetrag von 4.260 € / Jahr (2026).",
    vorteile: ["Entlastungsbetrag 4.260 €", "Weniger Steuern als Klasse I", "Kinderfreibetrag"],
    nachteile: ["Nur für Alleinerziehende", "Kind muss im Haushalt leben"],
  },
  {
    nr: "III",
    title: "Steuerklasse III",
    subtitle: "Verheiratet (Hauptverdiener)",
    color: "from-emerald-600/20 to-emerald-800/10",
    border: "border-emerald-500/30",
    badge: "Niedrigste Steuer",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description:
      "Für Verheiratete oder eingetragene Lebenspartner mit deutlich höherem Einkommen. Doppelter Grundfreibetrag — höchste monatliche Nettoauszahlung. Partner muss in Klasse V sein.",
    vorteile: ["Doppelter Grundfreibetrag", "Höchstes Netto monatlich", "Splitting-Vorteil"],
    nachteile: ["Partner trägt Klasse V", "Jahresausgleich nötig", "Nur gemeinsam sinnvoll"],
  },
  {
    nr: "IV",
    title: "Steuerklasse IV",
    subtitle: "Verheiratet (gleiches Einkommen)",
    color: "from-yellow-600/20 to-yellow-800/10",
    border: "border-yellow-500/30",
    badge: "Symmetrisch",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    description:
      "Für Eheleute oder Lebenspartner mit ähnlichem Einkommen. Beide haben Steuerklasse IV. Ähnlich wie Klasse I — kein großer monatlicher Vorteil, aber wenig Nachzahlung am Ende.",
    vorteile: ["Ausgeglichene Steuerlast", "Wenig Nachzahlung", "Faktorverfahren möglich"],
    nachteile: ["Kein großer Monatsvorteil", "Weniger Netto als Klasse III"],
  },
  {
    nr: "V",
    title: "Steuerklasse V",
    subtitle: "Verheiratet (Geringverdiener)",
    color: "from-orange-600/20 to-orange-800/10",
    border: "border-orange-500/30",
    badge: "Höchste Last",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    description:
      "Gegenpart zu Klasse III. Kein Grundfreibetrag, hohe monatliche Steuer. Nur sinnvoll, wenn der andere Partner deutlich mehr verdient und Klasse III hat.",
    vorteile: ["Haushalts-Gesamtvorteil", "Im Jahresausgleich ausgeglichen"],
    nachteile: ["Niedrigstes Netto monatlich", "Kein eigener Grundfreibetrag", "Druck auf Geringverdiener"],
  },
  {
    nr: "VI",
    title: "Steuerklasse VI",
    subtitle: "Zweiter Job / weiterer Job",
    color: "from-red-600/20 to-red-800/10",
    border: "border-red-500/30",
    badge: "Für Zweitjob",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    description:
      "Pflicht für jeden weiteren Nebenjob ab dem zweiten Arbeitgeber. Kein Grundfreibetrag, keine Pauschalen — maximale Steuerlast.",
    vorteile: ["Pflichtklasse für Zweitjob", "Steuerklärung kann Rückerstattung bringen"],
    nachteile: ["Höchste Steuerklasse", "Kein Freibetrag", "Niedrigstes Netto"],
  },
];

// Pre-calculated approximate net amounts per gross income and Steuerklasse
// (Estimated, not from live calculator)
const vergleichsData = [
  {
    brutto: 2500,
    klassen: { I: 1850, III: 2075, IV: 1850, V: 1550 },
  },
  {
    brutto: 3000,
    klassen: { I: 2185, III: 2470, IV: 2185, V: 1770 },
  },
  {
    brutto: 3500,
    klassen: { I: 2490, III: 2840, IV: 2490, V: 1990 },
  },
  {
    brutto: 4000,
    klassen: { I: 2790, III: 3210, IV: 2790, V: 2210 },
  },
  {
    brutto: 5000,
    klassen: { I: 3310, III: 3870, IV: 3310, V: 2650 },
  },
];

function formatEuro(v: number) {
  return v.toLocaleString("de-DE") + " €";
}

const faqs = [
  {
    q: "Welche Steuerklassen gibt es in Deutschland?",
    a: "Deutschland hat 6 Steuerklassen: I (ledig), II (Alleinerziehende), III (verheiratet, Hauptverdiener), IV (verheiratet, gleiches Einkommen), V (verheiratet, Geringverdiener), VI (Zweitjob).",
  },
  {
    q: "Wann lohnt sich Steuerklasse III und V?",
    a: "Die Kombination III/V lohnt sich, wenn ein Partner deutlich mehr verdient. Der Hauptverdiener erhält Klasse III (doppelter Freibetrag, weniger Steuer), der Geringverdiener Klasse V. Im Jahresausgleich wird die tatsächliche Steuerschuld ermittelt.",
  },
  {
    q: "Wie oft kann ich die Steuerklasse wechseln?",
    a: "Seit 2023 ist der Steuerklassenwechsel für Verheiratete unbegrenzt möglich (Antrag beim Finanzamt bis 30. November). Früher war nur ein Wechsel pro Jahr erlaubt.",
  },
  {
    q: "Was ist der Unterschied zwischen Steuerklasse IV und IV mit Faktor?",
    a: "Steuerklasse IV verteilt die Steuer gleichmäßig. Das Faktorverfahren (IV/IV mit Faktor) berücksichtigt unterschiedliche Einkommen der Partner und minimiert Nachzahlungen.",
  },
  {
    q: "Welche Steuerklasse zahlt am wenigsten Steuern?",
    a: "Steuerklasse III hat die niedrigste monatliche Lohnsteuer durch den doppelten Grundfreibetrag. Im Haushalt gesamt (III + V) entspricht die Jahressteuerlast dem Ehegattensplitting — gleich wie bei Klasse IV/IV.",
  },
];

export default function SteuerklassenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/8 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
              <BarChart3 size={14} />
              Alle 6 Steuerklassen · 2026
            </div>
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
              Steuerklassen{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
                im Vergleich
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Alle 6 deutschen Steuerklassen erklärt: Unterschiede, Nettogehalt-Beispiele für
              2026, Steuerklassenwechsel und Tipps — auf einen Blick.
            </p>
          </div>
        </section>

        {/* Steuerklassen cards */}
        <section className="max-w-6xl mx-auto px-5 py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            Die 6 Steuerklassen im Detail
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steuerklassen.map((sk) => (
              <div
                key={sk.nr}
                className={`relative bg-gradient-to-br ${sk.color} border ${sk.border} rounded-3xl p-6 hover:scale-[1.01] transition-transform`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-extrabold text-white">
                    {sk.nr}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sk.badgeColor}`}>
                    {sk.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white mb-1">{sk.title}</h3>
                <p className="text-xs text-white/50 mb-3 font-medium">{sk.subtitle}</p>
                <p className="text-sm text-white/65 leading-relaxed mb-4">{sk.description}</p>
                <div className="space-y-1.5">
                  {sk.vorteile.map((v, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-emerald-300">
                      <span className="mt-0.5 flex-shrink-0">✓</span>
                      {v}
                    </div>
                  ))}
                  {sk.nachteile.map((n, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/40">
                      <span className="mt-0.5 flex-shrink-0">−</span>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="max-w-6xl mx-auto px-5 py-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Steuerklassen III vs. IV vs. V — Nettogehalt 2026
          </h2>
          <p className="text-white/55 mb-6 text-sm sm:text-base">
            Geschätzte monatliche Nettobeträge (Steuerklasse I, III, IV, V) bei verschiedenen
            Bruttogehältern. Steuerklasse I als Referenz für Alleinstehende.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-[#E60A1C]/15 border-b border-white/10">
                  <th className="px-4 sm:px-6 py-4 text-left font-bold text-white">Brutto / Monat</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-white">Klasse I</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-emerald-400">Klasse III ↑</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-white">Klasse IV</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-orange-400">Klasse V ↓</th>
                </tr>
              </thead>
              <tbody>
                {vergleichsData.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      i % 2 === 0 ? "bg-[#090909]" : "bg-[#070707]"
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-4 font-mono font-bold text-white">
                      {formatEuro(row.brutto)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-white/80">
                      {formatEuro(row.klassen.I)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono font-bold text-emerald-400">
                      {formatEuro(row.klassen.III)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-white/80">
                      {formatEuro(row.klassen.IV)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-orange-400">
                      {formatEuro(row.klassen.V)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/35 mt-3">
            ⚠ Schätzwerte — Einzelfall-Berechnung im Brutto-Netto-Rechner empfohlen. Ohne
            Kirchensteuer, Kinderfreibetrag etc.
          </p>
        </section>

        {/* Steuerklassenwechsel */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-7 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E60A1C]/20 border border-[#E60A1C]/30 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={18} className="text-[#E60A1C]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Steuerklassenwechsel 2026
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  So wechseln Verheiratete die Steuerklasse
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-white/70 leading-relaxed">
              <div className="space-y-3">
                <p>
                  Seit 2023 können Ehepaare und eingetragene Lebenspartner die Steuerklasse
                  <strong className="text-white"> unbegrenzt oft</strong> wechseln. Früher war nur
                  ein Wechsel pro Kalenderjahr möglich.
                </p>
                <p>
                  Der Antrag auf Steuerklassenwechsel muss beim zuständigen{" "}
                  <strong className="text-white">Finanzamt</strong> gestellt werden — entweder
                  digital über ELSTER oder mit dem Formular „Antrag auf Steuerklassenwechsel bei
                  Ehegatten / Lebenspartnern".
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  Der Wechsel wirkt in der Regel ab dem{" "}
                  <strong className="text-white">nächsten Monat</strong>. Um den Wechsel noch im
                  laufenden Jahr zu berücksichtigen, sollte der Antrag bis zum
                  <strong className="text-white"> 30. November</strong> gestellt werden.
                </p>
                <p>
                  Tipp: Bei der{" "}
                  <strong className="text-white">Kombination III/V</strong> sollte unbedingt eine
                  Steuererklärung abgegeben werden, da häufig Nachzahlungen entstehen — oder
                  Rückerstattungen möglich sind.
                </p>
              </div>
            </div>

            {/* When to choose which */}
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-[#E60A1C]" />
                  <span className="font-bold text-white text-sm">Klasse I oder II wählen</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Wenn Sie ledig, dauerhaft getrennt oder Alleinerziehend sind. Klasse II nur mit
                  Kind im Haushalt.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-emerald-400" />
                  <span className="font-bold text-white text-sm">Klasse III / V wählen</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Wenn ein Partner deutlich mehr verdient. Hauptverdiener III, Geringverdiener V —
                  sinnvoll bei &gt;60/40-Verhältnis.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-yellow-400" />
                  <span className="font-bold text-white text-sm">Klasse IV / IV wählen</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Wenn beide ähnlich viel verdienen. Vermeidet hohe Nachzahlungen, empfohlen bei
                  annähernd gleichem Einkommen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            Häufige Fragen zu Steuerklassen
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
                Netto für Ihre Steuerklasse berechnen
              </h2>
              <p className="text-white/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
                Nutzen Sie unseren präzisen Brutto-Netto-Rechner für alle 6 Steuerklassen, mit
                Kinderfreibetrag, Kirchensteuer und BKK-Zusatzbeitrag 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(230,10,28,0.4)] hover:shadow-[0_0_35px_rgba(230,10,28,0.6)] text-sm sm:text-base"
                >
                  <Calculator size={18} />
                  Brutto-Netto-Rechner
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-3.5 rounded-xl transition-all border border-white/20 text-sm sm:text-base"
                >
                  <ArrowRight size={16} />
                  Zur FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
