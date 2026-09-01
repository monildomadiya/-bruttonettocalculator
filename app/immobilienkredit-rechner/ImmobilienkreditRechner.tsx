"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Home, Calculator, Info, ChevronDown, ArrowRight, Landmark } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

const NEBENKOSTEN_PCT = 12; // Grunderwerbsteuer + Notar/Grundbuch + Makler (Richtwert)

const faqs = [
  { q: "Wie viel Haus kann ich mir mit meinem Gehalt leisten?", a: "Als Faustregel sollte die monatliche Kreditrate höchstens rund 35 % Ihres Haushalts-Nettoeinkommens betragen. Aus dieser Rate, Ihrem Eigenkapital, dem Sollzins und der anfänglichen Tilgung ergibt sich das maximal finanzierbare Darlehen und der mögliche Kaufpreis. Dieser Rechner ermittelt beides automatisch." },
  { q: "Wie hoch sind die Kaufnebenkosten?", a: "Beim Immobilienkauf fallen zusätzlich zum Kaufpreis Nebenkosten an: Grunderwerbsteuer (je nach Bundesland 3,5–6,5 %), Notar und Grundbuch (ca. 1,5–2 %) sowie ggf. Maklercourtage (ca. 3,57 %). In Summe sind das meist 10–15 % des Kaufpreises — der Rechner kalkuliert mit 12 %." },
  { q: "Wie viel Eigenkapital brauche ich?", a: "Empfohlen werden mindestens die Kaufnebenkosten (rund 10–15 %) plus idealerweise 10–20 % des Kaufpreises aus Eigenkapital. Je mehr Eigenkapital, desto niedriger Darlehen, Zins und Rate. Eine Finanzierung ganz ohne Eigenkapital ist teurer und nicht bei jeder Bank möglich." },
  { q: "Was bedeutet anfängliche Tilgung?", a: "Die anfängliche Tilgung ist der Anteil des Darlehens, den Sie im ersten Jahr zurückzahlen (zusätzlich zu den Zinsen). Bei niedrigen Zinsen werden mindestens 2 %, besser 3 % empfohlen — je höher die Tilgung, desto schneller sind Sie schuldenfrei." },
];

export default function ImmobilienkreditRechner() {
  const [nettoMonat, setNettoMonat] = useState(3500);
  const [eigenkapital, setEigenkapital] = useState(50000);
  const [sollzins, setSollzins] = useState(3.8);
  const [tilgung, setTilgung] = useState(2);
  const [rateAnteil, setRateAnteil] = useState(35);

  const r = useMemo(() => {
    const maxRate = Math.max(0, (nettoMonat * rateAnteil) / 100);
    const annuitaetPct = sollzins + tilgung;
    const maxDarlehen = annuitaetPct > 0 ? (maxRate * 12 * 100) / annuitaetPct : 0;
    const maxKaufpreis = (maxDarlehen + Math.max(0, eigenkapital)) / (1 + NEBENKOSTEN_PCT / 100);
    const nebenkosten = maxKaufpreis * (NEBENKOSTEN_PCT / 100);

    // Laufzeit (Monate) einer Annuität: n = -ln(1 - i·L/R) / ln(1+i)
    const i = sollzins / 100 / 12;
    let laufzeitJahre = 0;
    if (maxDarlehen > 0 && maxRate > maxDarlehen * i && i > 0) {
      const n = -Math.log(1 - (maxDarlehen * i) / maxRate) / Math.log(1 + i);
      laufzeitJahre = n / 12;
    }
    return { maxRate, maxDarlehen, maxKaufpreis, nebenkosten, laufzeitJahre };
  }, [nettoMonat, eigenkapital, sollzins, tilgung, rateAnteil]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Home size={14} /> Baufinanzierung · Immobilienkredit · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Wie viel Haus kann ich mir{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">leisten?</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Der <strong className="text-[#16181D]">Immobilienkredit-Rechner</strong> zeigt aus Ihrem
            <strong className="text-[#16181D]"> Netto­einkommen</strong> und Eigenkapital, welchen
            <strong className="text-[#16181D]"> Kaufpreis</strong> und welches Darlehen realistisch finanzierbar sind —
            inklusive monatlicher Rate und Laufzeit.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Finanzierung
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Netto-Haushaltseinkommen / Monat (€)</label>
                <input type="number" value={nettoMonat} onChange={(e) => setNettoMonat(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">
                  Netto unklar? <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Zum Gehaltsrechner</Link>
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Eigenkapital (€)</label>
                <input type="number" value={eigenkapital} onChange={(e) => setEigenkapital(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Sollzins (% p.a.)</label>
                  <input type="number" step="0.1" value={sollzins} onChange={(e) => setSollzins(Number(e.target.value))}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Anf. Tilgung (%)</label>
                  <input type="number" step="0.5" value={tilgung} onChange={(e) => setTilgung(Number(e.target.value))}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Rate max. % vom Netto: {rateAnteil} %</label>
                <input type="range" min={20} max={45} step={1} value={rateAnteil} onChange={(e) => setRateAnteil(Number(e.target.value))}
                  className="w-full accent-[#E60A1C]" />
                <p className="text-xs text-black/50 mt-1">Empfohlen: max. 35 % des Nettoeinkommens für die Kreditrate.</p>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Landmark size={22} className="text-[#E60A1C]" /> Ihr Finanzierungsrahmen
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Unverbindliche Orientierung — keine Finanzierungsberatung
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Möglicher Kaufpreis (inkl. Nebenkosten)</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.maxKaufpreis)}</div>
              <div className="text-xs text-black/50 mt-2">
                davon {formatEUR(r.nebenkosten)} Kaufnebenkosten (~{NEBENKOSTEN_PCT} %)
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Maximales Darlehen</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.maxDarlehen)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Monatliche Rate</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.maxRate)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Geschätzte Laufzeit</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">
                  {r.laufzeitJahre > 0 ? `${r.laufzeitJahre.toFixed(1).replace(".", ",")} Jahre` : "—"}
                </span>
              </div>
            </div>
            <Link href="/gehaltsrechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Netto-Gehalt berechnen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Baufinanzierung 2026: So viel Immobilie ist drin</h2>
          <p>
            Wie viel Haus oder Wohnung Sie sich leisten können, hängt vor allem von Ihrem
            <strong className="text-[#16181D]"> Nettoeinkommen</strong>, Ihrem <strong className="text-[#16181D]">Eigenkapital</strong>
            und den aktuellen <strong className="text-[#16181D]">Bauzinsen</strong> ab. Als Faustregel sollte die monatliche
            Kreditrate rund <strong className="text-[#16181D]">35 % Ihres Netto­einkommens</strong> nicht übersteigen, damit
            genug Puffer für Leben und Rücklagen bleibt.
          </p>
          <p>
            Aus Rate, Zins und Tilgung ergibt sich Ihr maximales Darlehen. Plus Eigenkapital und abzüglich der
            <strong className="text-[#16181D]"> Kaufnebenkosten</strong> (Grunderwerbsteuer, Notar, ggf. Makler — zusammen
            rund {NEBENKOSTEN_PCT} %) erhalten Sie den realistisch finanzierbaren Kaufpreis. Da Sie das genaue Netto kennen
            sollten, lohnt vorab ein Blick in den{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link> oder
            — bei Bonuszahlungen — in den{" "}
            <Link href="/jahresgehalt-rechner" className="text-[#E60A1C] font-semibold hover:underline">Jahresgehalt-Rechner</Link>.
          </p>
          <p>
            Die tatsächlichen Konditionen hängen von Bank, Bonität und Beleihung ab; dieser Rechner liefert eine
            unverbindliche Orientierung und ersetzt keine Finanzierungsberatung.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Baufinanzierung</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
