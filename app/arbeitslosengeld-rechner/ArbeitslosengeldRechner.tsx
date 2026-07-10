"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Umbrella, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
import { calculateNetto } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const faqs = [
  {
    q: "Wie viel Arbeitslosengeld (ALG I) bekomme ich?",
    a: "Das Arbeitslosengeld I beträgt 60 % Ihres pauschalierten Nettoentgelts der letzten 12 Monate — bzw. 67 %, wenn Sie mindestens ein Kind haben (erhöhter Leistungssatz). Die Bundesagentur für Arbeit nutzt dafür ein pauschaliertes Nettoentgelt, das sich von Ihrem individuellen Netto geringfügig unterscheiden kann.",
  },
  {
    q: "Wie lange bekomme ich Arbeitslosengeld?",
    a: "Die Bezugsdauer richtet sich nach Ihrem Alter und der Dauer der vorherigen Beschäftigung: zwischen 6 Monaten (mind. 12 Monate versichert) und bis zu 24 Monaten (ab 58 Jahren mit entsprechend langer Beschäftigungszeit).",
  },
  {
    q: "Ist dieser Rechner rechtsverbindlich?",
    a: "Nein. Dieser Rechner liefert einen Näherungswert auf Basis Ihres geschätzten Nettogehalts. Die tatsächliche Höhe des Arbeitslosengeldes wird von der Agentur für Arbeit anhand des pauschalierten Nettoentgelts nach der Leistungsentgeltverordnung verbindlich festgestellt.",
  },
];

export default function ArbeitslosengeldRechner() {
  const [brutto, setBrutto] = useState(3500);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kind, setKind] = useState(false);
  const [kirche, setKirche] = useState(false);

  const result = useMemo(() => {
    const netto = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const satz = kind ? 0.67 : 0.60;
    const algMonat = netto.nettoMonat * satz;

    return { nettoMonat: netto.nettoMonat, satz, algMonat };
  }, [brutto, steuerklasse, kind, kirche]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Umbrella size={14} />
            ALG I · Orientierungswert 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Arbeitslosengeld-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              (ALG I)
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Schätzen Sie Ihr Arbeitslosengeld I auf Basis Ihres letzten Bruttogehalts —
            60 % bzw. 67 % Ihres Nettoentgelts, je nachdem ob Sie Kinder haben.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihr letztes Gehalt
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Bruttogehalt / Monat (letzte 12 Monate)</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Steuerklasse</label>
                <select
                  value={steuerklasse}
                  onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-semibold focus:border-[#E60A1C] outline-none"
                >
                  {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                    <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/70 cursor-pointer">
                  <input type="checkbox" checked={kind} onChange={(e) => setKind(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                  Mindestens ein Kind (erhöhter Satz 67 %)
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-white/70 cursor-pointer">
                  <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                  Kirchensteuer
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
              <Umbrella size={22} className="text-[#E60A1C]" />
              Geschätztes Arbeitslosengeld
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-400/80 bg-amber-950/20 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Näherungswert — keine Rechtsgrundlage, siehe FAQ
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Geschätztes Nettogehalt / Monat</span>
                <span className="text-lg font-extrabold text-white">{formatEuro(result.nettoMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Leistungssatz</span>
                <span className="text-lg font-extrabold text-white">{Math.round(result.satz * 100)} %</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-white/80 text-sm font-semibold">Arbeitslosengeld I / Monat (ca.)</span>
                <span className="text-2xl font-extrabold text-emerald-400">{formatEuro(result.algMonat)}</span>
              </div>
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(230,10,28,0.35)] hover:shadow-[0_0_30px_rgba(230,10,28,0.55)] text-sm"
            >
              Nettogehalt exakt berechnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
          Häufige Fragen zum Arbeitslosengeld
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-white/5 transition-colors">
                <span className="font-semibold text-white text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
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
              Weitere Gehaltsrechner entdecken
            </h2>
            <p className="text-white/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Firmenwagenrechner, Rentenrechner, Mindestlohn 2026 &amp; Pfändungstabelle —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/firmenwagenrechner" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Firmenwagenrechner
              </Link>
              <Link href="/rentenrechner" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Rentenrechner
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_25px_rgba(230,10,28,0.4)] text-sm">
                <Calculator size={16} />
                Brutto-Netto-Rechner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
