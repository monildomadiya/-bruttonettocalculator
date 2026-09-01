"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PiggyBank, Calculator, Info, ChevronDown, ArrowRight, TrendingUp } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

// Amtliche Rechengrößen der gesetzlichen Rentenversicherung (GRV)
const DURCHSCHNITTSENTGELT_2026 = 51944; // vorläufiges Durchschnittsentgelt 2026 (€/Jahr)
const RENTENWERT_2026 = 42.52;            // aktueller Rentenwert ab 1. Juli 2026 (€/Entgeltpunkt/Monat)
const BBG_RV_2026 = 101400;               // Beitragsbemessungsgrenze RV 2026 (€/Jahr)
const MAX_EP_PRO_JAHR = BBG_RV_2026 / DURCHSCHNITTSENTGELT_2026; // ~1,9521

const faqs = [
  { q: "Wie viel ist ein Rentenpunkt 2026 wert?", a: "Ein Entgeltpunkt (Rentenpunkt) ist ab dem 1. Juli 2026 42,52 € monatliche Bruttorente wert. Zum 1. Juli 2026 sind die Renten um 4,24 % gestiegen (vorher 40,79 €). Der Wert gilt bundeseinheitlich in West und Ost." },
  { q: "Wie bekomme ich einen Entgeltpunkt?", a: "Sie erhalten für ein Kalenderjahr genau einen Entgeltpunkt, wenn Ihr rentenversicherungspflichtiges Bruttoeinkommen dem Durchschnittsentgelt aller Versicherten entspricht. 2026 liegt dieses Durchschnittsentgelt vorläufig bei 51.944 € brutto im Jahr. Verdienen Sie mehr, gibt es anteilig mehr Punkte — maximal rund 1,95 pro Jahr (Beitragsbemessungsgrenze)." },
  { q: "Wie berechne ich meine spätere Rente aus Rentenpunkten?", a: "Ihre monatliche Bruttorente = Summe Ihrer Entgeltpunkte × aktueller Rentenwert (42,52 €) × Zugangsfaktor × Rentenartfaktor. Für die reguläre Altersrente sind Zugangs- und Rentenartfaktor 1,0. Von dieser Bruttorente gehen später noch Beiträge zur Kranken- und Pflegeversicherung sowie ggf. Steuern ab." },
  { q: "Warum sind meine Punkte nur eine Prognose?", a: "Dieser Rechner nimmt ein über alle Jahre gleichbleibendes Einkommen an und rechnet mit den heutigen Werten. Ihre tatsächliche Rente hängt von Ihrem realen Einkommensverlauf, Kindererziehungs- und Anrechnungszeiten sowie künftigen Rentenanpassungen ab. Die verbindliche Auskunft gibt Ihre Renteninformation der Deutschen Rentenversicherung." },
];

export default function RentenpunkteRechner() {
  const [bruttoJahr, setBruttoJahr] = useState(45000);
  const [jahre, setJahre] = useState(40);

  const r = useMemo(() => {
    const epProJahrRoh = bruttoJahr / DURCHSCHNITTSENTGELT_2026;
    const epProJahr = Math.min(epProJahrRoh, MAX_EP_PRO_JAHR);
    const gedeckelt = epProJahrRoh > MAX_EP_PRO_JAHR;
    const gesamtEP = epProJahr * Math.max(0, jahre);
    const monatsrente = gesamtEP * RENTENWERT_2026;
    return { epProJahr, gesamtEP, monatsrente, gedeckelt };
  }, [bruttoJahr, jahre]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <PiggyBank size={14} /> Rentenpunkte · Entgeltpunkte · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Rentenpunkte-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2026</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie, wie viele <strong className="text-[#16181D]">Entgeltpunkte</strong> Sie mit Ihrem Gehalt sammeln
            und welche <strong className="text-[#16181D]">monatliche Rente</strong> daraus entsteht — mit dem aktuellen
            Rentenwert von <strong className="text-[#16181D]">42,52 €</strong> (ab Juli 2026).
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttojahresgehalt (€)</label>
                <input type="number" value={bruttoJahr} onChange={(e) => setBruttoJahr(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">
                  Brutto unklar? <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Zum Gehaltsrechner</Link> · Durchschnitt 2026: {formatEUR(DURCHSCHNITTSENTGELT_2026)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Beitragsjahre: {jahre} Jahre</label>
                <input type="range" min={1} max={50} step={1} value={jahre} onChange={(e) => setJahre(Number(e.target.value))}
                  className="w-full accent-[#E60A1C]" />
                <p className="text-xs text-black/50 mt-1">Anzahl der Jahre mit diesem Einkommen (vereinfachte Annahme: gleichbleibendes Gehalt).</p>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <TrendingUp size={22} className="text-[#E60A1C]" /> Ihre Rentenprognose
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Bruttorente vor KV/PV-Beiträgen & Steuer — unverbindliche Prognose
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Voraussichtliche Monatsrente (brutto, heutiger Wert)</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.monatsrente)}</div>
              <div className="text-xs text-black/50 mt-2">
                aus {r.gesamtEP.toFixed(2).replace(".", ",")} Entgeltpunkten × {RENTENWERT_2026.toFixed(2).replace(".", ",")} €
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Entgeltpunkte pro Jahr</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{r.epProJahr.toFixed(3).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Entgeltpunkte gesamt</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{r.gesamtEP.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Jährliche Rente</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.monatsrente * 12)}</span>
              </div>
            </div>
            {r.gedeckelt && (
              <p className="text-xs text-amber-600 mt-3">
                Ihr Einkommen liegt über der Beitragsbemessungsgrenze ({formatEUR(BBG_RV_2026)}/Jahr). Es sind maximal {MAX_EP_PRO_JAHR.toFixed(3).replace(".", ",")} Entgeltpunkte pro Jahr möglich.
              </p>
            )}
            <Link href="/rentenrechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Weiter zum Rentenrechner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Rentenpunkte 2026: So funktioniert die Berechnung</h2>
          <p>
            Ihre gesetzliche Rente basiert auf <strong className="text-[#16181D]">Entgeltpunkten</strong> (umgangssprachlich
            Rentenpunkten). Für jedes Jahr, in dem Sie genau das Durchschnittsentgelt aller Versicherten verdienen
            ({formatEUR(DURCHSCHNITTSENTGELT_2026)} brutto 2026), erhalten Sie <strong className="text-[#16181D]">einen Entgeltpunkt</strong>.
            Verdienen Sie das Doppelte, gibt es zwei Punkte — allerdings gedeckelt durch die Beitragsbemessungsgrenze
            (max. rund {MAX_EP_PRO_JAHR.toFixed(2).replace(".", ",")} Punkte pro Jahr).
          </p>
          <p>
            Zum Renteneintritt werden alle gesammelten Entgeltpunkte mit dem <strong className="text-[#16181D]">aktuellen
            Rentenwert</strong> multipliziert. Dieser ist zum 1. Juli 2026 um 4,24 % auf <strong className="text-[#16181D]">42,52 €</strong>
            gestiegen. 40 Entgeltpunkte („Eckrentner") ergeben damit rund {formatEUR(40 * RENTENWERT_2026)} Bruttorente im Monat.
            Ihr genaues Brutto sollten Sie vorab im{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link> prüfen.
          </p>
          <p>
            Wichtig: Von der Bruttorente gehen später noch Beiträge zur Kranken- und Pflegeversicherung sowie ggf. Steuern ab.
            Dieser Rechner liefert eine Orientierung und ersetzt nicht die offizielle Renteninformation der Deutschen Rentenversicherung.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zu Rentenpunkten</h2>
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
