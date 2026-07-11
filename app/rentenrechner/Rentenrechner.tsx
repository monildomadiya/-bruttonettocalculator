"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PiggyBank, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
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
    q: "Wie viel zahle ich in die gesetzliche Rentenversicherung ein?",
    a: "Der Rentenversicherungsbeitrag beträgt 18,6 % Ihres Bruttogehalts (bis zur Beitragsbemessungsgrenze), aufgeteilt je zur Hälfte zwischen Arbeitnehmer und Arbeitgeber — Sie zahlen also 9,3 % aus Ihrem eigenen Bruttogehalt.",
  },
  {
    q: "Wie wird meine spätere gesetzliche Rente berechnet?",
    a: "Die Rentenhöhe basiert auf Entgeltpunkten: Pro Jahr erhalten Sie Entgeltpunkte, indem Ihr Bruttojahresgehalt durch das Durchschnittsentgelt aller Versicherten geteilt wird. Die Summe Ihrer Entgeltpunkte über das gesamte Erwerbsleben wird mit dem aktuellen Rentenwert multipliziert — das Ergebnis ist Ihre monatliche Bruttorente.",
  },
  {
    q: "Sind Durchschnittsentgelt und Rentenwert fest?",
    a: "Nein. Beide Werte werden jährlich von der Deutschen Rentenversicherung angepasst (der Rentenwert i. d. R. zum 1. Juli). Die hier hinterlegten Werte sind Beispielwerte — für eine verbindliche Prognose nutzen Sie bitte Ihre Renteninformation der Deutschen Rentenversicherung.",
  },
];

export default function Rentenrechner() {
  const [brutto, setBrutto] = useState(4000);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);

  const [beitragsjahre, setBeitragsjahre] = useState(35);
  const [durchschnittsentgelt, setDurchschnittsentgelt] = useState(50493);
  const [rentenwert, setRentenwert] = useState(39.32);

  const result = useMemo(() => {
    const netto = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const rvAlvBbgJahr = 101400; // Beitragsbemessungsgrenze RV/ALV 2026
    const bruttoJahr = Math.min(brutto * 12, rvAlvBbgJahr);
    const entgeltpunkteProJahr = durchschnittsentgelt > 0 ? bruttoJahr / durchschnittsentgelt : 0;
    const gesamtRentenpunkte = entgeltpunkteProJahr * beitragsjahre;
    const bruttoRenteMonat = gesamtRentenpunkte * rentenwert;

    return {
      rentenbeitragMonat: netto.sv.rente,
      entgeltpunkteProJahr,
      gesamtRentenpunkte,
      bruttoRenteMonat,
    };
  }, [brutto, steuerklasse, kirche, beitragsjahre, durchschnittsentgelt, rentenwert]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <PiggyBank size={14} />
            Rentenrechner · Orientierungswert
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Brutto Netto{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Rentenrechner
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihren Rentenversicherungsbeitrag vom Bruttogehalt und schätzen Sie Ihre
            spätere gesetzliche Bruttorente auf Basis des Entgeltpunkte-Systems.
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
              Ihr Gehalt
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Bruttogehalt / Monat</label>
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

              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 cursor-pointer">
                <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Kirchensteuer
              </label>

              <div className="h-px bg-white/10" />

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Beitragsjahre (Erwerbsleben)</label>
                <input
                  type="number"
                  value={beitragsjahre}
                  onChange={(e) => setBeitragsjahre(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2">Durchschnittsentgelt (Jahr)</label>
                  <input
                    type="number"
                    value={durchschnittsentgelt}
                    onChange={(e) => setDurchschnittsentgelt(Number(e.target.value))}
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-2.5 text-white font-semibold text-sm focus:border-[#E60A1C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2">Aktueller Rentenwert (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rentenwert}
                    onChange={(e) => setRentenwert(Number(e.target.value))}
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-2.5 text-white font-semibold text-sm focus:border-[#E60A1C] outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Beispielwerte — die Deutsche Rentenversicherung passt Durchschnittsentgelt und Rentenwert
                jährlich an. Für eine verbindliche Prognose nutzen Sie Ihre persönliche Renteninformation.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
              <PiggyBank size={22} className="text-[#E60A1C]" />
              Rentenversicherung &amp; Prognose
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-400/80 bg-amber-950/20 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Grobe Orientierung — keine Rentenberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Ihr Rentenbeitrag (AN-Anteil 9,3 %) / Monat</span>
                <span className="text-lg font-extrabold text-white">{formatEuro(result.rentenbeitragMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Entgeltpunkte / Jahr</span>
                <span className="text-lg font-extrabold text-white">{result.entgeltpunkteProJahr.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Rentenpunkte gesamt ({beitragsjahre} Jahre)</span>
                <span className="text-lg font-extrabold text-white">{result.gesamtRentenpunkte.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-white/80 text-sm font-semibold">Geschätzte Bruttorente / Monat</span>
                <span className="text-2xl font-extrabold text-emerald-400">{formatEuro(result.bruttoRenteMonat)}</span>
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
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 sm:p-10 text-white/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gesetzliche Rente berechnen: Von Entgeltpunkten zur Monatsrente
          </h2>
          <p>
            Ihre spätere <strong className="text-white">gesetzliche Rente</strong> hängt nicht direkt von
            Ihrem Nettogehalt ab, sondern von <strong className="text-white">Entgeltpunkten</strong>. Wer in
            einem Jahr genau das Durchschnittsentgelt aller Versicherten verdient, erhält einen Entgeltpunkt.
            Verdienen Sie mehr, gibt es anteilig mehr Punkte — bis zur Beitragsbemessungsgrenze.
          </p>
          <div className="bg-[#101010] border border-white/10 rounded-2xl p-5">
            <p className="font-mono text-white text-sm mb-2">Formel Monatsrente:</p>
            <p className="font-mono text-[#E60A1C] text-sm sm:text-base">
              Entgeltpunkte × aktueller Rentenwert
            </p>
            <p className="mt-3 text-white/60 text-sm">
              Beispiel: 35 Entgeltpunkte ergeben mit dem aktuellen Rentenwert eine monatliche Brutto-Rente,
              von der noch Kranken- und Pflegeversicherungsbeiträge sowie ggf. Steuern abgehen.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Wie viel zahlen Sie ein?</h3>
          <p>
            Der Beitrag zur gesetzlichen Rentenversicherung beträgt <strong className="text-white">18,6 %</strong>{" "}
            des Bruttogehalts (bis zur Beitragsbemessungsgrenze von 101.400 € im Jahr 2026) — je zur Hälfte
            von Arbeitnehmer und Arbeitgeber getragen. Aus Ihrem eigenen Brutto zahlen Sie also{" "}
            <strong className="text-white">9,3 %</strong>. Genau diesen Anteil zeigt der Rechner zusammen mit
            Ihrer voraussichtlichen Rente an.
          </p>
          <p>
            Wichtig: Die gesetzliche Rente unterliegt im Ruhestand der{" "}
            <strong className="text-white">nachgelagerten Besteuerung</strong> — je nach Renteneintrittsjahr
            ist ein steigender Anteil steuerpflichtig. Der Rechner liefert eine realistische Orientierung, ersetzt
            aber keine individuelle Rentenberatung der Deutschen Rentenversicherung.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
          Häufige Fragen zum Rentenrechner
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
              Firmenwagenrechner, Arbeitslosengeld-Rechner, Mindestlohn 2026 &amp; Pfändungstabelle —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/firmenwagenrechner" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Firmenwagenrechner
              </Link>
              <Link href="/arbeitslosengeld-rechner" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
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
