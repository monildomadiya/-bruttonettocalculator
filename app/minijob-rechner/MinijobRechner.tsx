"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wallet2, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";

const MINIJOB_GRENZE_2026 = 603;
const MINIJOB_GRENZE_2027 = 633;
const RV_EIGENANTEIL_SATZ = 0.036; // 18,6 % Gesamt - 15 % AG-Pauschale (gewerblich)

function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const faqs = [
  {
    q: "Wie hoch ist die Minijob-Grenze 2026?",
    a: "Die Minijob-Grenze liegt seit dem 1. Januar 2026 bei 603 € monatlich (7.236 € im Jahr). Sie ist seit 2024 dynamisch an den gesetzlichen Mindestlohn gekoppelt: Grenze = Mindestlohn × 130 Stunden ÷ 3. Zum 1. Januar 2027 steigt sie auf 633 €.",
  },
  {
    q: "Zahlt ein Minijobber Lohnsteuer?",
    a: "Nein, in der Regel nicht. Der Arbeitgeber zahlt eine Pauschsteuer von 2 % (inkl. Soli und Kirchensteuer), die er in der Regel nicht auf den Arbeitnehmer abwälzt. Für den Minijobber bleibt der Verdienst dadurch lohnsteuerfrei.",
  },
  {
    q: "Muss ich als Minijobber Rentenversicherungsbeiträge zahlen?",
    a: "Seit 2013 sind Minijobber grundsätzlich rentenversicherungspflichtig und zahlen einen Eigenanteil von 3,6 % ihres Verdienstes. Sie können sich davon auf Antrag befreien lassen — verzichten dann aber auch auf den vollen Rentenanspruch und Vorteile wie Riester-Förderung.",
  },
  {
    q: "Wie viele Stunden darf ich im Minijob 2026 arbeiten?",
    a: "Bei Zahlung des Mindestlohns (13,90 €/Std. in 2026) sind bei einer Verdienstgrenze von 603 € rechnerisch rund 43,4 Stunden im Monat bzw. ca. 10 Stunden pro Woche möglich.",
  },
];

export default function MinijobRechner() {
  const [brutto, setBrutto] = useState(556);
  const [rvBefreit, setRvBefreit] = useState(false);

  const result = useMemo(() => {
    const gedeckelt = Math.min(brutto, MINIJOB_GRENZE_2026);
    const rvEigenanteil = rvBefreit ? 0 : gedeckelt * RV_EIGENANTEIL_SATZ;
    const netto = gedeckelt - rvEigenanteil;
    const ueberGrenze = brutto > MINIJOB_GRENZE_2026;
    return { gedeckelt, rvEigenanteil, netto, ueberGrenze };
  }, [brutto, rvBefreit]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Wallet2 size={14} />
            Verdienstgrenze 603 € · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Minijob-{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Rechner 2026
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihren Netto-Verdienst im Minijob — mit der aktuellen Verdienstgrenze
            von 603 € und dem Rentenversicherungs-Eigenanteil von 3,6 %.
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
              Ihr Verdienst
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Monatlicher Verdienst (brutto)</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
                {result.ueberGrenze && (
                  <p className="text-xs text-amber-600 mt-2">
                    Achtung: Über der Minijob-Grenze von {formatEuro(MINIJOB_GRENZE_2026)} — es handelt sich
                    nicht mehr um einen Minijob, sondern um einen Midijob (Übergangsbereich).
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                <input type="checkbox" checked={rvBefreit} onChange={(e) => setRvBefreit(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Von der Rentenversicherungspflicht befreit
              </label>

              <div className="bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/70">Minijob-Grenze 2026</span>
                  <span className="text-[#16181D] font-bold">{formatEuro(MINIJOB_GRENZE_2026)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/70">Minijob-Grenze 2027</span>
                  <span className="text-[#16181D] font-bold">{formatEuro(MINIJOB_GRENZE_2027)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Wallet2 size={22} className="text-[#E60A1C]" />
              Ihr Nettoverdienst
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Keine Lohnsteuer im Minijob (Pauschsteuer trägt der Arbeitgeber)
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Bruttoverdienst</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(brutto)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Rentenversicherung (Eigenanteil 3,6 %)</span>
                <span className="text-lg font-extrabold text-[#16181D]">− {formatEuro(result.rvEigenanteil)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto-Verdienst / Monat</span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatEuro(result.netto)}</span>
              </div>
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Hauptjob-Gehalt berechnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Explainer / SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Minijob 2026: Wie viel bleibt netto vom 603-Euro-Job?
          </h2>
          <p>
            Ein <strong className="text-[#16181D]">Minijob</strong> (geringfügige Beschäftigung) ist für
            Arbeitnehmer besonders attraktiv: Bis zur Verdienstgrenze von{" "}
            <strong className="text-[#16181D]">603 € im Monat</strong> (Stand 2026) bleibt der Lohn in der
            Regel <strong className="text-[#16181D]">steuer- und abgabenfrei</strong> — brutto ist hier fast
            gleich netto. Die Grenze ist seit 2024 dynamisch an den Mindestlohn gekoppelt und steigt zum
            1. Januar 2027 auf <strong className="text-[#16181D]">633 €</strong>.
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Rentenversicherung: der einzige Abzug</h3>
          <p>
            Der einzige mögliche Abzug beim Arbeitnehmer ist der{" "}
            <strong className="text-[#16181D]">Rentenversicherungs-Eigenanteil von 3,6 %</strong>. Von diesem
            können Sie sich auf Antrag befreien lassen — dann bleibt Ihr Minijob-Lohn zu 100 % netto.
            Bleiben Sie in der Rentenversicherung, sammeln Sie dafür vollwertige Rentenanwartschaften.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5">
            <p className="text-black/60 text-sm">
              <strong className="text-[#16181D]">Achtung Übergangsbereich:</strong> Wer mehr als 603 € verdient,
              ist kein Minijobber mehr, sondern arbeitet im <strong className="text-[#16181D]">Midijob</strong>{" "}
              (Übergangsbereich bis 2.000 €). Dort steigen die Sozialabgaben gleitend an — der Rechner
              warnt Sie automatisch, sobald Sie die Grenze überschreiten.
            </p>
          </div>
          <p>
            Bei Zahlung des Mindestlohns von 13,90 €/Std. entsprechen 603 € rund{" "}
            <strong className="text-[#16181D]">43 Arbeitsstunden im Monat</strong> bzw. etwa 10 Stunden pro Woche.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zum Minijob
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
              Mindestlohn-Rechner, Netto-Stundenlohn-Rechner, Elterngeld-Rechner &amp; mehr —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/mindestlohn" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Mindestlohn-Rechner
              </Link>
              <Link href="/elterngeld-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Elterngeld-Rechner
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
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
