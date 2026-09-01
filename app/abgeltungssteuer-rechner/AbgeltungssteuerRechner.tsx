"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

/** § 20 Abs. 9 EStG — Sparer-Pauschbetrag seit 2023. */
const SPARERPAUSCHBETRAG_EINZEL = 1000;
const SPARERPAUSCHBETRAG_ZUSAMMEN = 2000;

const KAPST_SATZ = 0.25;
const SOLI_SATZ = 0.055;

const faqs = [
  {
    q: "Wie hoch ist die Abgeltungssteuer?",
    a: "25 % auf Kapitalerträge, plus 5,5 % Solidaritätszuschlag auf diese Steuer. Ohne Kirchensteuer ergibt das eine Gesamtbelastung von 26,375 %. Mit Kirchensteuer sind es 27,82 % (8 %, Bayern und Baden-Württemberg) beziehungsweise 27,99 % (9 %, übrige Bundesländer).",
  },
  {
    q: "Wie hoch ist der Sparer-Pauschbetrag?",
    a: "1.000 € pro Person und Jahr, bei zusammen veranlagten Ehepaaren 2.000 € (§ 20 Abs. 9 EStG). Bis zu diesem Betrag bleiben Kapitalerträge steuerfrei — aber nur, wenn Sie Ihrer Bank einen Freistellungsauftrag erteilt haben. Ohne Auftrag führt die Bank die Steuer ab dem ersten Euro ab.",
  },
  {
    q: "Warum wird beim Soli die Abgeltungssteuer nicht mit abgeschafft?",
    a: "Die Soli-Freigrenze, die den Zuschlag für die meisten Arbeitnehmer entfallen lässt, gilt nur für die veranlagte Einkommensteuer und die Lohnsteuer. Auf die Kapitalertragsteuer wird der Solidaritätszuschlag von 5,5 % unverändert und ohne Freigrenze erhoben.",
  },
  {
    q: "Was ist die Günstigerprüfung?",
    a: "Liegt Ihr persönlicher Steuersatz unter 25 %, können Sie in der Steuererklärung die Günstigerprüfung nach § 32d Abs. 6 EStG beantragen. Das Finanzamt versteuert die Kapitalerträge dann mit Ihrem niedrigeren persönlichen Satz und erstattet die zu viel gezahlte Abgeltungssteuer. Der Antrag lohnt sich vor allem bei geringem Einkommen, im Studium und in der Rente.",
  },
  {
    q: "Wie wirkt die Kirchensteuer auf die Abgeltungssteuer?",
    a: "Sie wird auf die Kapitalertragsteuer erhoben, nicht auf den Ertrag. Weil die Kirchensteuer zugleich als Sonderausgabe abziehbar ist, mindert sich die Kapitalertragsteuer selbst — die Bank rechnet mit der Formel Ertrag ÷ (4 + Kirchensteuersatz). Die Gesamtbelastung steigt dadurch nur auf 27,82 % beziehungsweise 27,99 %.",
  },
  {
    q: "Gilt die Abgeltungssteuer auch für Fonds und ETFs?",
    a: "Ja, allerdings mit einer Besonderheit: Bei Aktienfonds bleiben 30 % der Erträge steuerfrei, bei Mischfonds 15 % (Teilfreistellung nach § 20 InvStG). Zusätzlich fällt auf thesaurierende Fonds jährlich eine Vorabpauschale an, die beim späteren Verkauf angerechnet wird.",
  },
  {
    q: "Was ist eine Nichtveranlagungsbescheinigung?",
    a: "Wer voraussichtlich unter dem Grundfreibetrag bleibt — etwa Studierende oder Kinder mit eigenem Depot —, kann beim Finanzamt eine NV-Bescheinigung beantragen. Die Bank behält dann gar keine Abgeltungssteuer ein, auch über den Sparer-Pauschbetrag hinaus. Sie gilt in der Regel drei Jahre.",
  },
];

export default function AbgeltungssteuerRechner({ content }: { content?: React.ReactNode }) {
  const [ertrag, setErtrag] = useState(5000);
  const [zusammen, setZusammen] = useState(false);
  const [freistellung, setFreistellung] = useState(true);
  const [kirchensteuersatz, setKirchensteuersatz] = useState(0);

  const result = useMemo(() => {
    const brutto = Math.max(0, ertrag);
    const pauschbetrag = freistellung
      ? zusammen
        ? SPARERPAUSCHBETRAG_ZUSAMMEN
        : SPARERPAUSCHBETRAG_EINZEL
      : 0;

    const steuerpflichtig = Math.max(0, brutto - pauschbetrag);

    // Mit Kirchensteuer mindert deren Sonderausgabenabzug die KapESt selbst:
    // KapESt = Ertrag / (4 + k). Ohne Kirchensteuer schlicht 25 %.
    const kapst =
      kirchensteuersatz > 0
        ? steuerpflichtig / (4 + kirchensteuersatz)
        : steuerpflichtig * KAPST_SATZ;

    const soli = kapst * SOLI_SATZ;
    const kirchensteuer = kapst * kirchensteuersatz;

    const steuerGesamt = kapst + soli + kirchensteuer;
    const netto = brutto - steuerGesamt;

    return {
      brutto,
      pauschbetrag,
      steuerpflichtig,
      kapst,
      soli,
      kirchensteuer,
      steuerGesamt,
      netto,
      effektiverSatz: brutto > 0 ? (steuerGesamt / brutto) * 100 : 0,
      grenzbelastung: steuerpflichtig > 0 ? (steuerGesamt / steuerpflichtig) * 100 : 0,
    };
  }, [ertrag, zusammen, freistellung, kirchensteuersatz]);

  const labelClass = "block text-sm font-semibold text-black/70 mb-2";

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <TrendingUp size={14} />
            Kapitalerträge · § 32d EStG
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Abgeltungssteuer berechnen:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Was bleibt von Zinsen und Dividenden?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            25 % Kapitalertragsteuer plus Solidaritätszuschlag und gegebenenfalls Kirchensteuer — abzüglich
            Sparer-Pauschbetrag. Der Rechner zeigt, was von Ihren Kapitalerträgen netto übrig bleibt.
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
              Ihre Kapitalerträge
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="ab-ertrag" className={labelClass}>
                  Kapitalerträge pro Jahr (€)
                </label>
                <input
                  id="ab-ertrag"
                  type="number"
                  step="100"
                  value={ertrag}
                  onChange={(e) => setErtrag(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
                <p className="text-xs text-black/50 mt-1.5">
                  Zinsen, Dividenden und realisierte Kursgewinne zusammen.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 shadow-sm space-y-3">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-[#16181D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freistellung}
                    onChange={(e) => setFreistellung(e.target.checked)}
                    className="accent-[#E60A1C] w-4 h-4"
                  />
                  Freistellungsauftrag erteilt
                </label>
                <label className="flex items-center gap-2.5 text-sm font-semibold text-black/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={zusammen}
                    onChange={(e) => setZusammen(e.target.checked)}
                    className="accent-[#E60A1C] w-4 h-4"
                    disabled={!freistellung}
                  />
                  Gemeinsam veranlagt (2.000 € statt 1.000 €)
                </label>
                {!freistellung && (
                  <p className="text-xs text-amber-700/90 bg-amber-50 border border-amber-500/20 rounded-lg px-3 py-2">
                    Ohne Freistellungsauftrag zieht die Bank die Steuer ab dem ersten Euro ab. Zu viel
                    gezahlte Steuer holen Sie über die Steuererklärung zurück.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ab-kirche" className={labelClass}>
                  Kirchensteuer
                </label>
                <select
                  id="ab-kirche"
                  value={kirchensteuersatz}
                  onChange={(e) => setKirchensteuersatz(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                >
                  <option value={0}>Keine Kirchensteuer</option>
                  <option value={0.08}>8 % — Bayern, Baden-Württemberg</option>
                  <option value={0.09}>9 % — übrige Bundesländer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <TrendingUp size={22} className="text-[#E60A1C]" />
              Ihre Steuer
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuer- oder Anlageberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Kapitalerträge</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.brutto)}</span>
              </div>

              {result.pauschbetrag > 0 && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                  <span className="text-black/80 text-sm font-semibold">− Sparer-Pauschbetrag</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    − {formatEUR(Math.min(result.pauschbetrag, result.brutto))}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Steuerpflichtig</span>
                <span className="text-lg font-extrabold text-[#16181D]">
                  {formatEUR(result.steuerpflichtig)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Kapitalertragsteuer</span>
                <span className="text-lg font-extrabold text-[#16181D]">− {formatEUR(result.kapst)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Solidaritätszuschlag (5,5 %)</span>
                <span className="text-lg font-extrabold text-[#16181D]">− {formatEUR(result.soli)}</span>
              </div>
              {result.kirchensteuer > 0 && (
                <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                  <span className="text-black/70 text-sm font-medium">− Kirchensteuer</span>
                  <span className="text-lg font-extrabold text-[#16181D]">
                    − {formatEUR(result.kirchensteuer)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-5">
                <span className="text-black/80 text-sm font-semibold">Netto-Kapitalertrag</span>
                <span className="text-3xl font-extrabold text-emerald-600">{formatEUR(result.netto)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-black/55 mb-1">Belastung gesamt</div>
                  <div className="text-lg font-extrabold text-[#16181D]">
                    {result.effektiverSatz.toFixed(2).replace(".", ",")} %
                  </div>
                </div>
                <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-black/55 mb-1">auf steuerpflichtigen Teil</div>
                  <div className="text-lg font-extrabold text-[#16181D]">
                    {result.grenzbelastung.toFixed(2).replace(".", ",")} %
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/einkommensteuer-rechner"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Persönlichen Steuersatz prüfen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {content}

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zur Abgeltungssteuer
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
    </div>
  );
}

export { faqs as abgeltungssteuerFaqs };
