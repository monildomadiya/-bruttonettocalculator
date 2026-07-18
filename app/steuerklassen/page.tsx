import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ChevronDown, Calculator, ArrowRight, Users, RefreshCw } from "lucide-react";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Steuerklassen 2026: Welche Steuerklasse für Verheiratete?",
  description:
    "Steuerklassen 2026 im Vergleich: alle 6 Klassen erklärt und für Verheiratete die Kombinationen III/V, IV/IV und IV/IV mit Faktor. Mit Nettogehalt-Beispielen, Steuerklassenwechsel & FAQ.",
  keywords: [
    "Steuerklassen 2026",
    "Steuerklasse verheiratet",
    "welche Steuerklasse verheiratet",
    "Steuerklasse 3 und 5",
    "Steuerklasse 4 Faktor",
    "Steuerklassenvergleich",
    "Steuerklasse 1 2 3 4 5 6",
    "Steuerklassenwechsel",
    "Steuerklasse III vs IV vs V",
    "Steuerklasse wechseln 2026",
    "welche Steuerklasse bin ich",
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
      name: "Welche Steuerklasse haben Verheiratete automatisch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nach der Heirat werden beide Partner automatisch in Steuerklasse IV eingestuft (IV/IV). Sie können danach jederzeit in III/V oder IV/IV mit Faktor wechseln. Die Steuerklasse ändert nur die monatliche Lohnsteuer-Einbehaltung, nicht die endgültige Jahressteuer.",
      },
    },
    {
      "@type": "Question",
      name: "Wann lohnt sich Steuerklasse III und V?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Kombination III/V bringt monatlich mehr Netto, wenn ein Ehepartner deutlich mehr verdient. Der Geringverdienende wechselt zu V, der Besserverdienende zu III. Bei III/V ist eine Steuererklärung meist Pflicht, weil es zu Nachzahlungen kommen kann; die Jahressteuer ist am Ende gleich wie bei IV/IV.",
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
        text: "Steuerklasse III hat die geringste monatliche Lohnsteuer, weil der Splitting-Vorteil des Ehepaares bereits beim Lohnsteuerabzug des Hauptverdieners berücksichtigt wird. Das ist nur eine vorläufige monatliche Einbehaltung — die tatsächliche Jahressteuer ergibt sich erst aus der gemeinsamen Veranlagung und ist bei III/V und IV/IV gleich hoch.",
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
    badgeColor: "bg-blue-500/20 text-blue-700 border-blue-500/30",
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
    badgeColor: "bg-purple-500/20 text-purple-700 border-purple-500/30",
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
    badgeColor: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
    description:
      "Für Verheiratete oder eingetragene Lebenspartner mit deutlich höherem Einkommen. Der Splitting-Vorteil wird bereits beim monatlichen Lohnsteuerabzug berücksichtigt — höchste monatliche Nettoauszahlung. Der Partner ist dann in Klasse V. Die endgültige Steuer ergibt sich erst aus der gemeinsamen Veranlagung.",
    vorteile: ["Splitting-Vorteil schon im Monat", "Höchstes Netto monatlich", "Für Hauptverdiener"],
    nachteile: ["Partner trägt Klasse V", "Steuererklärung meist Pflicht", "Nur gemeinsam sinnvoll"],
  },
  {
    nr: "IV",
    title: "Steuerklasse IV",
    subtitle: "Verheiratet (gleiches Einkommen)",
    color: "from-yellow-600/20 to-yellow-800/10",
    border: "border-yellow-500/30",
    badge: "Symmetrisch",
    badgeColor: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
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
    badgeColor: "bg-orange-500/20 text-orange-700 border-orange-500/30",
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
    badgeColor: "bg-red-500/20 text-red-700 border-red-500/30",
    description:
      "Pflicht für jeden weiteren Nebenjob ab dem zweiten Arbeitgeber. Kein Grundfreibetrag, keine Pauschalen — maximale Steuerlast.",
    vorteile: ["Pflichtklasse für Zweitjob", "Steuerklärung kann Rückerstattung bringen"],
    nachteile: ["Höchste Steuerklasse", "Kein Freibetrag", "Niedrigstes Netto"],
  },
];

// Net amounts per gross income and Steuerklasse — computed by the SAME tested
// engine the calculator uses (no hand-authored estimates), § 32a EStG 2026,
// kinderlos ab 23, ohne Kirchensteuer.
function netMonat(brutto: number, sk: Steuerklasse): number {
  return calculateNetto({
    bruttoMonat: brutto,
    jahr: 2026,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: sk,
  }).nettoMonat;
}

const vergleichsData = [2500, 3000, 3500, 4000, 5000].map((brutto) => ({
  brutto,
  klassen: {
    I: netMonat(brutto, 1),
    III: netMonat(brutto, 3),
    IV: netMonat(brutto, 4),
    V: netMonat(brutto, 5),
  },
}));

const faqs = [
  {
    q: "Welche Steuerklassen gibt es in Deutschland?",
    a: "Deutschland hat 6 Steuerklassen: I (ledig), II (Alleinerziehende), III (verheiratet, Hauptverdiener), IV (verheiratet, gleiches Einkommen), V (verheiratet, Geringverdiener), VI (Zweitjob).",
  },
  {
    q: "Welche Steuerklasse haben Verheiratete automatisch?",
    a: "Nach der Heirat werden beide Partner automatisch in Steuerklasse IV eingestuft (IV/IV). Danach ist jederzeit ein Wechsel zu III/V oder IV/IV mit Faktor möglich. Die Steuerklasse ändert nur die monatliche Lohnsteuer-Einbehaltung, nicht die endgültige Jahressteuer.",
  },
  {
    q: "Wann lohnt sich Steuerklasse III und V?",
    a: "Die Kombination III/V bringt monatlich mehr Netto, wenn ein Partner deutlich mehr verdient: Hauptverdiener Klasse III, Geringverdiener Klasse V. Bei III/V ist eine Steuererklärung meist Pflicht, da Nachzahlungen möglich sind — die Jahressteuer ist am Ende gleich wie bei IV/IV.",
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
    a: "Steuerklasse III hat die niedrigste monatliche Lohnsteuer, weil der Splitting-Vorteil des Ehepaares bereits beim Lohnsteuerabzug berücksichtigt wird. Das ist nur die vorläufige monatliche Einbehaltung — die tatsächliche Jahressteuerlast ist bei III/V und IV/IV gleich und ergibt sich erst aus der gemeinsamen Veranlagung.",
  },
];

export default function SteuerklassenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.08]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
              <BarChart3 size={14} />
              Alle 6 Steuerklassen · 2026
            </div>
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
              Steuerklassen 2026{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
                im Vergleich
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
              Alle 6 deutschen Steuerklassen erklärt — und für Verheiratete die Kombinationen III/V,
              IV/IV und IV/IV mit Faktor. Mit Nettogehalt-Beispielen 2026, Steuerklassenwechsel und FAQ.
            </p>
          </div>
        </section>

        {/* Steuerklassen cards */}
        <section className="max-w-6xl mx-auto px-5 py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
            Die 6 Steuerklassen im Detail
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steuerklassen.map((sk) => (
              <div
                key={sk.nr}
                className={`relative bg-gradient-to-br ${sk.color} border ${sk.border} rounded-3xl p-6 hover:scale-[1.01] transition-transform`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/[0.05] border border-black/[0.12] flex items-center justify-center text-xl font-extrabold text-[#16181D]">
                    {sk.nr}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sk.badgeColor}`}>
                    {sk.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#16181D] mb-1">{sk.title}</h3>
                <p className="text-xs text-black/50 mb-3 font-medium">{sk.subtitle}</p>
                <p className="text-sm text-black/65 leading-relaxed mb-4">{sk.description}</p>
                <div className="space-y-1.5">
                  {sk.vorteile.map((v, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-emerald-700">
                      <span className="mt-0.5 flex-shrink-0">✓</span>
                      {v}
                    </div>
                  ))}
                  {sk.nachteile.map((n, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-black/40">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
            Steuerklassen III vs. IV vs. V — Nettogehalt 2026
          </h2>
          <p className="text-black/55 mb-6 text-sm sm:text-base">
            Monatliche Nettobeträge (Steuerklasse I, III, IV, V) bei verschiedenen Bruttogehältern —
            berechnet mit unserem Brutto-Netto-Rechner für 2026. Steuerklasse I dient als Referenz für Alleinstehende.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-[#E60A1C]/15 border-b border-black/[0.08]">
                  <th className="px-4 sm:px-6 py-4 text-left font-bold text-[#16181D]">Brutto / Monat</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-[#16181D]">Klasse I</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-emerald-600">Klasse III ↑</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-[#16181D]">Klasse IV</th>
                  <th className="px-4 sm:px-6 py-4 text-right font-bold text-orange-600">Klasse V ↓</th>
                </tr>
              </thead>
              <tbody>
                {vergleichsData.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-black/[0.05] hover:bg-black/[0.04] transition-colors ${
                      i % 2 === 0 ? "bg-[#F4F5F7]" : "bg-[#F4F5F7]"
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-4 font-mono font-bold text-[#16181D]">
                      {formatEUR(row.brutto)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-black/80">
                      {formatEUR(row.klassen.I)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono font-bold text-emerald-600">
                      {formatEUR(row.klassen.III)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-black/80">
                      {formatEUR(row.klassen.IV)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-orange-600">
                      {formatEUR(row.klassen.V)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/35 mt-3">
            Berechnet nach § 32a EStG 2026 (kinderlos ab 23, ohne Kirchensteuer/Kinderfreibetrag).
            Die monatlichen Beträge sind vorläufige Lohnsteuer-Einbehaltungen — die endgültige Jahressteuer
            von Ehepaaren ist bei III/V und IV/IV gleich. Unverbindlich.
          </p>
        </section>

        {/* Verheiratet: welche Steuerklasse? (married-intent cluster) */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-7 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-3 py-1 rounded-full mb-4">
              <Users size={13} /> Für Verheiratete
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-4">
              Welche Steuerklasse gilt nach der Heirat?
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-black/75 leading-relaxed max-w-3xl">
              <p>
                Nach der Heirat werden beide Partner automatisch in <strong className="text-[#16181D]">Steuerklasse IV</strong>{" "}
                eingestuft (IV/IV). Sie können danach jederzeit in eine andere Kombination wechseln. Wichtig: Die
                Steuerklasse bestimmt nur, <strong className="text-[#16181D]">wie viel Lohnsteuer monatlich einbehalten</strong>{" "}
                wird — die tatsächliche Jahressteuer wird erst über die gemeinsame Steuererklärung ermittelt und ist
                bei allen Kombinationen gleich hoch.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5">
                  <div className="font-bold text-[#16181D] mb-1.5">IV / IV</div>
                  <p className="text-xs sm:text-sm text-black/65">Beide verdienen ähnlich viel. Ausgewogene monatliche Abzüge, meist keine Nachzahlung.</p>
                </div>
                <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5">
                  <div className="font-bold text-[#16181D] mb-1.5">III / V</div>
                  <p className="text-xs sm:text-sm text-black/65">Ein Partner verdient deutlich mehr (Hauptverdiener III, Partner V). Mehr Netto im Monat, aber Steuererklärung meist Pflicht — es kann zu Nachzahlungen kommen.</p>
                </div>
                <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5">
                  <div className="font-bold text-[#16181D] mb-1.5">IV / IV mit Faktor</div>
                  <p className="text-xs sm:text-sm text-black/65">Berücksichtigt die unterschiedlichen Einkommen schon monatlich möglichst genau und vermeidet so hohe Nachzahlungen.</p>
                </div>
              </div>
              <p>
                Welche Kombination im Monat am meisten Netto bringt, hängt vom Einkommensverhältnis ab. Vergleichen Sie
                die Varianten mit echten Zahlen im{" "}
                <Link href="/steuerklassenwechsel-rechner" className="text-[#E60A1C] font-semibold hover:underline">
                  Steuerklassenwechsel-Rechner
                </Link>.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/steuerklassenwechsel-rechner"
                className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm sm:text-base"
              >
                <RefreshCw size={16} /> Steuerklassen-Kombination berechnen
              </Link>
            </div>
          </div>
        </section>

        {/* Ad: between the comparison table and the Steuerklassenwechsel section */}
        <AdUnit placement="content" />

        {/* Steuerklassenwechsel */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E60A1C]/20 border border-[#E60A1C]/30 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={18} className="text-[#E60A1C]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D]">
                  Steuerklassenwechsel 2026
                </h2>
                <p className="text-black/50 text-sm mt-1">
                  So wechseln Verheiratete die Steuerklasse
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-black/70 leading-relaxed">
              <div className="space-y-3">
                <p>
                  Seit 2023 können Ehepaare und eingetragene Lebenspartner die Steuerklasse
                  <strong className="text-[#16181D]"> unbegrenzt oft</strong> wechseln. Früher war nur
                  ein Wechsel pro Kalenderjahr möglich.
                </p>
                <p>
                  Der Antrag auf Steuerklassenwechsel muss beim zuständigen{" "}
                  <strong className="text-[#16181D]">Finanzamt</strong> gestellt werden — entweder
                  digital über ELSTER oder mit dem Formular „Antrag auf Steuerklassenwechsel bei
                  Ehegatten / Lebenspartnern".
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  Der Wechsel wirkt in der Regel ab dem{" "}
                  <strong className="text-[#16181D]">nächsten Monat</strong>. Um den Wechsel noch im
                  laufenden Jahr zu berücksichtigen, sollte der Antrag bis zum
                  <strong className="text-[#16181D]"> 30. November</strong> gestellt werden.
                </p>
                <p>
                  Tipp: Bei der{" "}
                  <strong className="text-[#16181D]">Kombination III/V</strong> sollte unbedingt eine
                  Steuererklärung abgegeben werden, da häufig Nachzahlungen entstehen — oder
                  Rückerstattungen möglich sind.
                </p>
              </div>
            </div>

            {/* When to choose which */}
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-[#E60A1C]" />
                  <span className="font-bold text-[#16181D] text-sm">Klasse I oder II wählen</span>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  Wenn Sie ledig, dauerhaft getrennt oder Alleinerziehend sind. Klasse II nur mit
                  Kind im Haushalt.
                </p>
              </div>
              <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-emerald-600" />
                  <span className="font-bold text-[#16181D] text-sm">Klasse III / V wählen</span>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  Wenn ein Partner deutlich mehr verdient. Hauptverdiener III, Geringverdiener V —
                  sinnvoll bei &gt;60/40-Verhältnis.
                </p>
              </div>
              <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-yellow-600" />
                  <span className="font-bold text-[#16181D] text-sm">Klasse IV / IV wählen</span>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  Wenn beide ähnlich viel verdienen. Vermeidet hohe Nachzahlungen, empfohlen bei
                  annähernd gleichem Einkommen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
            Häufige Fragen zu Steuerklassen
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                  <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180"
                  />
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
                Netto für Ihre Steuerklasse berechnen
              </h2>
              <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
                Nutzen Sie unseren präzisen Brutto-Netto-Rechner für alle 6 Steuerklassen, mit
                Kinderfreibetrag, Kirchensteuer und BKK-Zusatzbeitrag 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm sm:text-base"
                >
                  <Calculator size={18} />
                  Brutto-Netto-Rechner
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] text-[#16181D] font-bold px-8 py-3.5 rounded-xl transition-all border border-black/[0.12] text-sm sm:text-base"
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
