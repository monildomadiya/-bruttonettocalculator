"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wallet2, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";

import { MINIJOB_FAQS as faqs, MINIJOB_WERTE, RV_EIGENANTEIL_SATZ, type MinijobJahr } from "./minijobData";

function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const fmtStd = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });

export default function MinijobRechner() {
  const [brutto, setBrutto] = useState(556);
  const [rvBefreit, setRvBefreit] = useState(false);
  const [jahr, setJahr] = useState<MinijobJahr>(2026);
  const werte = MINIJOB_WERTE[jahr];

  const result = useMemo(() => {
    const gedeckelt = Math.min(brutto, werte.grenze);
    const rvEigenanteil = rvBefreit ? 0 : gedeckelt * RV_EIGENANTEIL_SATZ;
    const netto = gedeckelt - rvEigenanteil;
    const ueberGrenze = brutto > werte.grenze;
    return { gedeckelt, rvEigenanteil, netto, ueberGrenze };
  }, [brutto, rvBefreit, werte.grenze]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Wallet2 size={14} />
            Verdienstgrenze 603 € (2026) · 633 € (2027)
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Minijob-{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Rechner 2026/2027
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihren Netto-Verdienst im Minijob — mit der Verdienstgrenze von 603 € (2026)
            bzw. 633 € ab dem 1. Januar 2027 und dem Rentenversicherungs-Eigenanteil von 3,6 %.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihr Verdienst
            </h2>

            <div className="space-y-5">
              <div>
                <span className="block text-sm font-semibold text-black/70 mb-2">Jahr</span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="Jahr wählen">
                  {([2026, 2027] as const).map((j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setJahr(j)}
                      aria-pressed={jahr === j}
                      className={`rounded-xl px-4 py-2.5 text-sm font-bold border transition-all ${
                        jahr === j
                          ? "bg-[#E60A1C] text-white border-[#E60A1C]"
                          : "bg-[#FFFFFF] text-[#16181D] border-black/[0.12] hover:border-[#E60A1C]/50"
                      }`}
                    >
                      {j} · Grenze {MINIJOB_WERTE[j].grenze} €
                    </button>
                  ))}
                </div>
              </div>

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
                    Achtung: Über der Minijob-Grenze {jahr} von {formatEuro(werte.grenze)} — es handelt sich
                    nicht mehr um einen Minijob, sondern um einen{" "}
                    <Link href="/midijob-rechner" className="underline font-semibold">Midijob</Link>{" "}
                    (Übergangsbereich ab {formatEuro(werte.grenze + 0.01)}).
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                <input type="checkbox" checked={rvBefreit} onChange={(e) => setRvBefreit(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Von der Rentenversicherungspflicht befreit
              </label>

              <div className="bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/70">Minijob-Grenze {jahr}</span>
                  <span className="text-[#16181D] font-bold">{formatEuro(werte.grenze)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/70">Mindestlohn {jahr}</span>
                  <span className="text-[#16181D] font-bold">{formatEuro(werte.mindestlohn)} / Std.</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/70">Max. Stunden mit Mindestlohn</span>
                  <span className="text-[#16181D] font-bold">≈ {fmtStd(werte.grenze / werte.mindestlohn)} Std. / Monat</span>
                </div>
              </div>
              {jahr === 2027 && (
                <p className="text-xs text-black/55 leading-relaxed">
                  Grenze und Mindestlohn 2027 stehen fest. Der Rentenversicherungs-Beitragssatz 2027 ist noch
                  nicht festgelegt — gerechnet wird mit dem Eigenanteil 2026 von 3,6 %.
                </p>
              )}
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
            Minijob 2027: Was sich gegenüber 2026 ändert
          </h2>
          <p>
            Zum <strong className="text-[#16181D]">1. Januar 2027</strong> steigt die Minijob-Grenze von 603 € auf{" "}
            <strong className="text-[#16181D]">633 € im Monat</strong>. Sie folgt automatisch dem Mindestlohn, der
            per Verordnung auf 14,60 € steigt — deshalb steht der Wert schon heute fest. Die Tabelle zeigt beide
            Jahre nebeneinander:
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[480px] text-sm sm:text-base">
              <thead>
                <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                  <th className="py-3 px-4">Wert</th>
                  <th className="py-3 px-4 text-right">2026</th>
                  <th className="py-3 px-4 text-right">2027</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                <tr>
                  <td className="py-3 px-4">Minijob-Grenze pro Monat</td>
                  <td className="py-3 px-4 text-right font-mono">{formatEuro(MINIJOB_WERTE[2026].grenze)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#16181D]">{formatEuro(MINIJOB_WERTE[2027].grenze)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Minijob-Grenze pro Jahr</td>
                  <td className="py-3 px-4 text-right font-mono">{formatEuro(MINIJOB_WERTE[2026].grenze * 12)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#16181D]">{formatEuro(MINIJOB_WERTE[2027].grenze * 12)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Mindestlohn pro Stunde</td>
                  <td className="py-3 px-4 text-right font-mono">{formatEuro(MINIJOB_WERTE[2026].mindestlohn)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#16181D]">{formatEuro(MINIJOB_WERTE[2027].mindestlohn)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Max. Stunden/Monat mit Mindestlohn</td>
                  <td className="py-3 px-4 text-right font-mono">≈ {fmtStd(MINIJOB_WERTE[2026].grenze / MINIJOB_WERTE[2026].mindestlohn)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#16181D]">≈ {fmtStd(MINIJOB_WERTE[2027].grenze / MINIJOB_WERTE[2027].mindestlohn)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Midijob (Übergangsbereich) ab</td>
                  <td className="py-3 px-4 text-right font-mono">{formatEuro(MINIJOB_WERTE[2026].grenze + 0.01)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#16181D]">{formatEuro(MINIJOB_WERTE[2027].grenze + 0.01)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Lohnsteuer-Pauschale (Arbeitgeber)</td>
                  <td className="py-3 px-4 text-right font-mono">{MINIJOB_WERTE[2026].pauschsteuerPct} %</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#16181D]">{MINIJOB_WERTE[2027].pauschsteuerPct} %*</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50">
            * Geplant im Regierungsentwurf des Einkommensteuerreformgesetzes 2027 (BT-Drucksache 21/8235, § 40a Abs. 2
            EStG), noch nicht beschlossen. Die Pauschsteuer trägt in der Regel der Arbeitgeber; am Netto des Minijobbers
            ändert sie dann nichts. Grenze und Mindestlohn 2027 sind dagegen bereits geltendes Recht.
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] pt-4">
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
              <strong className="text-[#16181D]">Achtung Übergangsbereich:</strong> Wer mehr als 603 € (2027: 633 €)
              verdient, ist kein Minijobber mehr, sondern arbeitet im{" "}
              <Link href="/midijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Midijob</Link>{" "}
              (Übergangsbereich bis 2.000 €). Dort steigen die Sozialabgaben gleitend an — der Rechner
              warnt Sie automatisch, sobald Sie die Grenze überschreiten.
            </p>
          </div>
          <p>
            Bei Zahlung des Mindestlohns von 13,90 €/Std. entsprechen 603 € rund{" "}
            <strong className="text-[#16181D]">43 Arbeitsstunden im Monat</strong> bzw. etwa 10 Stunden pro Woche.
            2027 bleibt es trotz höherer Grenze bei rund 43 Stunden, weil der Mindestlohn im selben Verhältnis steigt.
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
              alle kostenlos und aktuell für 2026/2027.
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
