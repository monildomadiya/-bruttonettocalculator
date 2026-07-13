"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Baby, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
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

const NETTO_DECKEL = 2770; // Max. berücksichtigtes Nettoeinkommen (Elterngeld-Reform)
const MINDESTBETRAG = 300;
const HOECHSTBETRAG = 1800;

function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function ersatzRate(nettoEinkommen: number): number {
  if (nettoEinkommen <= 340) return 1.00;
  if (nettoEinkommen < 1000) {
    const diff = 1000 - nettoEinkommen;
    return Math.min(1.00, 0.67 + (diff / 2) * 0.001);
  }
  if (nettoEinkommen <= 1200) return 0.67;
  if (nettoEinkommen <= 1240) {
    const diff = nettoEinkommen - 1200;
    return Math.max(0.65, 0.67 - (diff / 2) * 0.001);
  }
  return 0.65;
}

const faqs = [
  {
    q: "Wie hoch ist das Elterngeld 2026?",
    a: "Das Basiselterngeld beträgt 65–100 % des durchschnittlichen Nettoeinkommens der letzten 12 Monate vor der Geburt — je niedriger das Einkommen, desto höher der Prozentsatz. Mindestens 300 € und höchstens 1.800 € im Monat.",
  },
  {
    q: "Wie wird der Elterngeld-Prozentsatz berechnet?",
    a: "Bei einem Nettoeinkommen zwischen 1.000 € und 1.200 € gilt die Standardrate von 67 %. Darunter steigt der Satz um 0,1 Prozentpunkt je 2 € niedrigerem Einkommen (bis max. 100 %), darüber sinkt er um 0,1 Prozentpunkt je 2 € höherem Einkommen (bis min. 65 %).",
  },
  {
    q: "Gibt es eine Einkommensgrenze für Elterngeld?",
    a: "Ja. Seit 2024 besteht kein Anspruch mehr, wenn das zu versteuernde Einkommen beider Elternteile im letzten abgeschlossenen Kalenderjahr vor der Geburt 175.000 € übersteigt.",
  },
  {
    q: "Was ist der Unterschied zwischen Basiselterngeld und ElterngeldPlus?",
    a: "Beim ElterngeldPlus erhalten Sie monatlich nur die Hälfte des Basiselterngeldbetrags, dafür aber über die doppelte Anzahl an Monaten — das lohnt sich besonders, wenn Sie während des Bezugs bereits in Teilzeit arbeiten.",
  },
];

export default function ElterngeldRechner() {
  const [brutto, setBrutto] = useState(3200);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [geschwisterbonus, setGeschwisterbonus] = useState(false);

  const result = useMemo(() => {
    const netto = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const nettoMonat = netto.nettoMonat;
    const nettoGedeckelt = Math.min(nettoMonat, NETTO_DECKEL);
    const satz = ersatzRate(nettoMonat);
    let elterngeld = Math.min(HOECHSTBETRAG, Math.max(MINDESTBETRAG, nettoGedeckelt * satz));

    if (geschwisterbonus) {
      const bonus = Math.max(elterngeld * 0.10, 75);
      elterngeld += bonus;
    }

    const elterngeldPlusMonat = elterngeld / 2;

    return { nettoMonat, satz, elterngeld, elterngeldPlusMonat };
  }, [brutto, steuerklasse, kirche, geschwisterbonus]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Baby size={14} />
            65–100 % Nettoeinkommen · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Elterngeld-{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Rechner
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihr voraussichtliches Basiselterngeld und ElterngeldPlus auf Basis
            Ihres durchschnittlichen Nettoeinkommens vor der Geburt.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihr Einkommen vor der Geburt
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">
                  Ø Bruttogehalt / Monat (letzte 12 Monate)
                </label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                <select
                  value={steuerklasse}
                  onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                >
                  {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                    <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                  <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                  Kirchensteuer
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                  <input type="checkbox" checked={geschwisterbonus} onChange={(e) => setGeschwisterbonus(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                  Geschwisterbonus (+10 %)
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Baby size={22} className="text-[#E60A1C]" />
              Ihr Elterngeld
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Orientierungswert — keine Rechtsgrundlage
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Geschätztes Nettoeinkommen / Monat</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.nettoMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Ersatzrate</span>
                <span className="text-lg font-extrabold text-[#16181D]">{Math.round(result.satz * 100)} %</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Basiselterngeld / Monat</span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatEuro(result.elterngeld)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">ElterngeldPlus / Monat (doppelte Dauer)</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.elterngeldPlusMonat)}</span>
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

      {/* Explainer / SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Elterngeld berechnen: 65 % vom Netto — mindestens 300 €
          </h2>
          <p>
            Das <strong className="text-[#16181D]">Basiselterngeld</strong> ersetzt einen Teil des wegfallenden
            Einkommens nach der Geburt. Es beträgt <strong className="text-[#16181D]">65–100 % des durchschnittlichen
            Nettoeinkommens</strong> der letzten 12 Monate vor der Geburt — mindestens{" "}
            <strong className="text-[#16181D]">300 €</strong> und höchstens <strong className="text-[#16181D]">1.800 €</strong>{" "}
            im Monat. Auch nicht-erwerbstätige Eltern erhalten den Mindestbetrag von 300 €.
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Warum ist der Prozentsatz nicht fix?</h3>
          <p>
            Der Ersatzsatz ist sozial gestaffelt: Bei einem Nettoeinkommen zwischen{" "}
            <strong className="text-[#16181D]">1.000 € und 1.200 €</strong> gilt die Standardrate von{" "}
            <strong className="text-[#16181D]">67 %</strong>. Verdienen Sie weniger, steigt der Satz schrittweise
            bis auf 100 %; verdienen Sie mehr, sinkt er bis auf 65 %. Geringverdiener werden also relativ
            stärker entlastet.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5">
            <p className="text-black/60 text-sm">
              <strong className="text-[#16181D]">Basiselterngeld vs. ElterngeldPlus:</strong> Beim ElterngeldPlus
              erhalten Sie monatlich nur die Hälfte des Betrags, dafür über die doppelte Anzahl an Monaten.
              Das lohnt sich besonders, wenn Sie während des Bezugs bereits in Teilzeit arbeiten.
            </p>
          </div>
          <p>
            Geben Sie oben Ihr durchschnittliches Netto der letzten 12 Monate ein, um Ihren voraussichtlichen
            Elterngeld-Anspruch und den ElterngeldPlus-Betrag sofort zu sehen.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zum Elterngeld
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
              Weitere Gehaltsrechner entdecken
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Minijob-Rechner, Netto-Stundenlohn-Rechner, Arbeitslosengeld-Rechner &amp; mehr —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/minijob-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Minijob-Rechner
              </Link>
              <Link href="/arbeitslosengeld-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Arbeitslosengeld-Rechner
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
