"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart, User, Users, HeartHandshake, Baby, Briefcase, RefreshCw,
  ArrowRight, CheckCircle2, Scale, TrendingUp, Wallet2, Info,
} from "lucide-react";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";
import { getCommonGrossSalaryAmounts } from "@/data/wage-stats";

/**
 * Interactive Steuerklassen-Finder ("Welche Steuerklasse bin ich?").
 *
 * Decision tree over the German Lohnsteuerklassen rules:
 *   Ledig/geschieden        → I  (oder II mit Kind, alleinerziehend)
 *   Verwitwet (≤ Folgejahr) → III (Witwensplitting)
 *   Verheiratet             → III/V, IV/IV oder IV/IV mit Faktor
 *   Zweitjob                → VI  (nur für den zweiten Job)
 *
 * The result panel shows a live 2026 netto preview via the shared tax engine
 * and deep-links into the Steuerklasse pages / Wechsel-Rechner.
 */

type Familienstand = "single" | "married" | "widowed";
type Einkommen = "ich-mehr" | "gleich" | "partner-mehr" | "unsicher";
type Step = "familienstand" | "witwe" | "kind" | "einkommen" | "zweitjob" | "result";

interface FinderState {
  familienstand: Familienstand | null;
  witweRecent: boolean | null;
  kind: boolean | null;
  einkommen: Einkommen | null;
  zweitjob: boolean | null;
}

const INITIAL: FinderState = {
  familienstand: null,
  witweRecent: null,
  kind: null,
  einkommen: null,
  zweitjob: null,
};

interface FinderResult {
  primary: Steuerklasse;
  partner: Steuerklasse | null;
  faktor: boolean;
  witwensplitting: boolean;
  headline: string;
  explanation: string;
}

function deriveResult(s: FinderState): FinderResult {
  // Verwitwet im Todesjahr oder Folgejahr → Steuerklasse III (Witwensplitting)
  if (s.familienstand === "widowed" && s.witweRecent) {
    return {
      primary: 3,
      partner: null,
      faktor: false,
      witwensplitting: true,
      headline: "Steuerklasse III (Witwensplitting)",
      explanation:
        "Im Jahr des Todes Ihres Ehe- oder Lebenspartners und im darauf folgenden Kalenderjahr bleiben Sie in Steuerklasse III (sogenanntes Witwen- oder Gnadensplitting). Danach werden Sie wie Ledige eingestuft — also Steuerklasse I, oder II mit Kind als Alleinerziehende.",
    };
  }

  // Verheiratet / verpartnert, zusammenlebend
  if (s.familienstand === "married") {
    switch (s.einkommen) {
      case "ich-mehr":
        return {
          primary: 3,
          partner: 5,
          faktor: false,
          witwensplitting: false,
          headline: "Steuerklasse III (Ihr Partner: V)",
          explanation:
            "Sie verdienen deutlich mehr als Ihr Partner — die Kombination III/V holt monatlich das meiste Netto aus Ihrem Gehalt. Ihr Partner trägt dafür Steuerklasse V mit höheren Abzügen. Wichtig: Bei III/V ist die Steuererklärung meist Pflicht, und die endgültige Jahressteuer ist am Ende genauso hoch wie bei IV/IV.",
        };
      case "partner-mehr":
        return {
          primary: 5,
          partner: 3,
          faktor: false,
          witwensplitting: false,
          headline: "Steuerklasse V (Ihr Partner: III)",
          explanation:
            "Ihr Partner verdient deutlich mehr — üblich ist dann III für den Hauptverdiener und V für Sie. In Steuerklasse V sind Ihre monatlichen Abzüge am höchsten, dafür bleibt beim Partner in III mehr übrig. Als Paar können Sie alternativ IV/IV mit Faktor wählen, das die Steuer fairer auf beide verteilt.",
        };
      case "unsicher":
        return {
          primary: 4,
          partner: 4,
          faktor: true,
          witwensplitting: false,
          headline: "Steuerklasse IV/IV mit Faktor",
          explanation:
            "Wenn Sie Nachzahlungen vermeiden und die Lohnsteuer fair verteilen wollen, ist IV/IV mit Faktorverfahren die beste Wahl: Das Finanzamt berechnet einen Faktor aus beiden Einkommen, sodass der monatliche Abzug fast exakt der späteren Jahressteuer entspricht.",
        };
      case "gleich":
      default:
        return {
          primary: 4,
          partner: 4,
          faktor: false,
          witwensplitting: false,
          headline: "Steuerklasse IV (Ihr Partner: IV)",
          explanation:
            "Sie verdienen ungefähr gleich viel — dann ist IV/IV die richtige (und nach der Hochzeit automatische) Kombination. Beide werden wie in Steuerklasse I besteuert; ein Wechsel zu III/V würde sich kaum lohnen und kann zu Nachzahlungen führen.",
        };
    }
  }

  // Ledig, geschieden, dauernd getrennt lebend — oder länger verwitwet
  if (s.kind) {
    return {
      primary: 2,
      partner: null,
      faktor: false,
      witwensplitting: false,
      headline: "Steuerklasse II (Alleinerziehend)",
      explanation:
        "Als Alleinerziehende:r mit mindestens einem kindergeldberechtigten Kind im Haushalt steht Ihnen Steuerklasse II zu. Sie enthält zusätzlich den Entlastungsbetrag für Alleinerziehende (4.260 € im Jahr + 240 € je weiterem Kind) — dadurch bleibt mehr Netto als in Steuerklasse I. Tipp: Steuerklasse II gibt es nur auf Antrag beim Finanzamt.",
    };
  }
  return {
    primary: 1,
    partner: null,
    faktor: false,
    witwensplitting: false,
    headline: "Steuerklasse I",
    explanation:
      "Als ledige, geschiedene oder dauernd getrennt lebende Person ohne Kind im Haushalt sind Sie automatisch in Steuerklasse I — der Standardklasse für Alleinstehende. Eine Wahlmöglichkeit gibt es hier nicht; sparen können Sie stattdessen über Freibeträge (z. B. Pendlerpauschale) im ELStAM-Verfahren.",
  };
}

function stepNumber(step: Step, s: FinderState): { current: number; total: number } {
  // 3 visible questions per path (+ result): familienstand → (witwe/kind/einkommen) → zweitjob
  const pathSteps: Step[] =
    s.familienstand === "married"
      ? ["familienstand", "einkommen", "zweitjob"]
      : s.familienstand === "widowed"
        ? s.witweRecent === false
          ? ["familienstand", "witwe", "kind", "zweitjob"]
          : ["familienstand", "witwe", "zweitjob"]
        : ["familienstand", "kind", "zweitjob"];
  const idx = pathSteps.indexOf(step);
  return { current: idx === -1 ? pathSteps.length : idx + 1, total: pathSteps.length };
}

/** Big tappable answer card. */
function AnswerButton({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-[#FFFFFF] hover:bg-[#E60A1C]/5 border border-black/[0.10] hover:border-[#E60A1C]/50 rounded-2xl p-4 sm:p-5 text-left transition-all group"
    >
      <span className="w-11 h-11 rounded-xl bg-[#E60A1C]/10 border border-[#E60A1C]/25 flex items-center justify-center text-[#E60A1C] shrink-0 group-hover:bg-[#E60A1C] group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-bold text-[#16181D] text-sm sm:text-base">{label}</span>
        {sub && <span className="block text-xs sm:text-sm text-black/60 mt-0.5">{sub}</span>}
      </span>
      <ArrowRight size={18} className="text-black/30 group-hover:text-[#E60A1C] group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}

export default function SteuerklassenFinder() {
  const [state, setState] = useState<FinderState>(INITIAL);
  const [step, setStep] = useState<Step>("familienstand");
  const [bruttoStr, setBruttoStr] = useState<string>("3000");

  const brutto = Math.min(100000, Math.max(0, parseInt(bruttoStr.replace(/[^\d]/g, ""), 10) || 0));
  const result = useMemo(() => deriveResult(state), [state]);

  const nettoPreview = useMemo(() => {
    if (step !== "result" || brutto < 500) return null;
    return calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: result.primary === 3 || result.primary === 4 || result.primary === 5,
      // Steuerklasse II setzt ein Kind voraus → kein Kinderlosen-Zuschlag in der PV
      kinderlosUeber23: result.primary !== 2,
      kirche: false,
      steuerklasse: result.primary,
    });
  }, [step, brutto, result]);

  // Deep link into the exact-match Steuerklasse-1 page when one exists for the amount
  const sk1PageAmount = useMemo(() => {
    if (result.primary !== 1 || brutto < 500) return null;
    const rounded = Math.round(brutto / 100) * 100;
    return getCommonGrossSalaryAmounts().includes(rounded) ? rounded : null;
  }, [result, brutto]);

  const { current, total } = stepNumber(step, state);
  const reset = () => { setState(INITIAL); setStep("familienstand"); };

  return (
    <div className="bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Progress */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base">
          <Scale size={18} />
          <span>Steuerklassen-Finder</span>
        </div>
        {step !== "result" ? (
          <span className="text-xs font-mono font-semibold text-black/50 bg-black/[0.05] border border-black/[0.10] px-3 py-1 rounded-full">
            Frage {current} von {total}
          </span>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E60A1C] hover:underline"
          >
            <RefreshCw size={13} /> Neu starten
          </button>
        )}
      </div>

      {/* Q1 — Familienstand */}
      {step === "familienstand" && (
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5">
            Wie ist Ihr Familienstand?
          </h3>
          <div className="space-y-3">
            <AnswerButton
              icon={<User size={20} />}
              label="Ledig, geschieden oder dauernd getrennt lebend"
              sub="Auch: eingetragene Lebenspartnerschaft aufgehoben"
              onClick={() => { setState((p) => ({ ...p, familienstand: "single" })); setStep("kind"); }}
            />
            <AnswerButton
              icon={<Heart size={20} />}
              label="Verheiratet oder verpartnert (zusammenlebend)"
              sub="Nicht dauernd getrennt lebend"
              onClick={() => { setState((p) => ({ ...p, familienstand: "married" })); setStep("einkommen"); }}
            />
            <AnswerButton
              icon={<HeartHandshake size={20} />}
              label="Verwitwet"
              sub="Ehe- oder Lebenspartner verstorben"
              onClick={() => { setState((p) => ({ ...p, familienstand: "widowed" })); setStep("witwe"); }}
            />
          </div>
        </div>
      )}

      {/* Q — Verwitwet: wann? */}
      {step === "witwe" && (
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5">
            Wann ist Ihr Partner verstorben?
          </h3>
          <div className="space-y-3">
            <AnswerButton
              icon={<HeartHandshake size={20} />}
              label="In diesem oder im letzten Kalenderjahr"
              sub="Dann gilt noch das Witwensplitting (Steuerklasse III)"
              onClick={() => { setState((p) => ({ ...p, witweRecent: true })); setStep("zweitjob"); }}
            />
            <AnswerButton
              icon={<User size={20} />}
              label="Vor längerer Zeit"
              sub="Dann werden Sie wie Ledige eingestuft"
              onClick={() => { setState((p) => ({ ...p, witweRecent: false })); setStep("kind"); }}
            />
          </div>
        </div>
      )}

      {/* Q — Kind im Haushalt (alleinerziehend)? */}
      {step === "kind" && (
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5">
            Lebt ein Kind mit Kindergeldanspruch in Ihrem Haushalt — und Sie erziehen überwiegend allein?
          </h3>
          <div className="space-y-3">
            <AnswerButton
              icon={<Baby size={20} />}
              label="Ja, ich bin alleinerziehend"
              sub="Mindestens ein Kind mit Kindergeldanspruch im Haushalt"
              onClick={() => { setState((p) => ({ ...p, kind: true })); setStep("zweitjob"); }}
            />
            <AnswerButton
              icon={<User size={20} />}
              label="Nein"
              sub="Kein Kind im Haushalt oder nicht alleinerziehend"
              onClick={() => { setState((p) => ({ ...p, kind: false })); setStep("zweitjob"); }}
            />
          </div>
        </div>
      )}

      {/* Q — Einkommensverteilung (Verheiratete) */}
      {step === "einkommen" && (
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5">
            Wie verteilt sich das Bruttoeinkommen zwischen Ihnen beiden?
          </h3>
          <div className="space-y-3">
            <AnswerButton
              icon={<TrendingUp size={20} />}
              label="Ich verdiene deutlich mehr"
              sub="Ca. 60 % oder mehr des gemeinsamen Brutto (oder Alleinverdiener)"
              onClick={() => { setState((p) => ({ ...p, einkommen: "ich-mehr" })); setStep("zweitjob"); }}
            />
            <AnswerButton
              icon={<Users size={20} />}
              label="Wir verdienen ungefähr gleich viel"
              sub="Keiner liegt deutlich vorn"
              onClick={() => { setState((p) => ({ ...p, einkommen: "gleich" })); setStep("zweitjob"); }}
            />
            <AnswerButton
              icon={<TrendingUp size={20} className="rotate-180" />}
              label="Mein Partner verdient deutlich mehr"
              sub="Ich bin Zweitverdiener:in"
              onClick={() => { setState((p) => ({ ...p, einkommen: "partner-mehr" })); setStep("zweitjob"); }}
            />
            <AnswerButton
              icon={<Scale size={20} />}
              label="Unsicher — wir wollen Nachzahlungen vermeiden"
              sub="Empfehlung: IV/IV mit Faktorverfahren"
              onClick={() => { setState((p) => ({ ...p, einkommen: "unsicher" })); setStep("zweitjob"); }}
            />
          </div>
        </div>
      )}

      {/* Q — Zweitjob */}
      {step === "zweitjob" && (
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5">
            Haben Sie einen zweiten sozialversicherungspflichtigen Job?
          </h3>
          <p className="text-sm text-black/60 mb-5 -mt-3">Ein Minijob bis 603 € zählt nicht — der bleibt pauschal besteuert und ohne Steuerklasse.</p>
          <div className="space-y-3">
            <AnswerButton
              icon={<Briefcase size={20} />}
              label="Ja, ich habe einen Zweitjob"
              sub="Der zweite Job läuft dann über Steuerklasse VI"
              onClick={() => { setState((p) => ({ ...p, zweitjob: true })); setStep("result"); }}
            />
            <AnswerButton
              icon={<User size={20} />}
              label="Nein, nur ein Hauptjob"
              onClick={() => { setState((p) => ({ ...p, zweitjob: false })); setStep("result"); }}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {step === "result" && (
        <div className="relative">
          <div className="flex items-start gap-4 bg-[#E60A1C]/10 border border-[#E60A1C]/40 rounded-2xl p-5 sm:p-6 mb-5">
            <span className="w-14 h-14 rounded-2xl bg-[#E60A1C] text-white flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-lg">
              {["", "I", "II", "III", "IV", "V", "VI"][result.primary]}
            </span>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-bold mb-1 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Ihr Ergebnis
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D]">
                {result.headline}
              </h3>
              {result.faktor && (
                <span className="inline-block mt-1.5 text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Mit Faktorverfahren
                </span>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-black/75 leading-relaxed mb-5">{result.explanation}</p>

          {state.zweitjob && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-5">
              <Briefcase size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-black/75 leading-relaxed">
                <strong className="text-[#16181D]">Zweitjob = Steuerklasse VI:</strong> Ihr zweiter sozialversicherungspflichtiger
                Job wird immer über Steuerklasse VI abgerechnet — ohne Freibeträge, mit den höchsten Abzügen. Die zu viel
                gezahlte Lohnsteuer holen Sie sich über die Steuererklärung zurück.
              </p>
            </div>
          )}

          {/* Live netto preview */}
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 mb-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#16181D] mb-4">
              <Wallet2 size={16} className="text-[#E60A1C]" /> Ihr Netto in Steuerklasse {result.primary} (2026)
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <label className="block flex-1">
                <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Ihr Bruttogehalt / Monat</span>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bruttoStr}
                    onChange={(e) => setBruttoStr(e.target.value)}
                    className="w-full bg-[#F1F3F5] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-mono font-bold text-lg text-[#16181D] outline-none transition-colors"
                    aria-label="Bruttogehalt pro Monat in Euro"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-mono font-bold">€</span>
                </div>
              </label>
              <div className="flex-1 bg-[#E60A1C]/10 border border-[#E60A1C]/40 rounded-xl px-4 py-3">
                <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-0.5">Netto / Monat</span>
                <span className="font-mono font-extrabold text-2xl text-[#E60A1C]">
                  {nettoPreview ? formatEUR(nettoPreview.nettoMonat) : "—"}
                </span>
              </div>
            </div>
            {nettoPreview && (
              <p className="text-xs text-black/55 mt-3 leading-relaxed">
                {formatEUR(nettoPreview.nettoJahr)} netto im Jahr · Abzüge: {formatEUR(nettoPreview.steuer.summeMonat)} Steuern
                + {formatEUR(nettoPreview.sv.summeMonat)} Sozialabgaben (ohne Kirchensteuer, unverbindlich).
              </p>
            )}
          </div>

          {/* Next-step links */}
          <div className="flex flex-wrap gap-2.5">
            {(result.primary === 3 || result.primary === 4 || result.primary === 5) && (
              <Link
                href="/steuerklassenwechsel-rechner"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors"
              >
                III/V oder IV/IV durchrechnen <ArrowRight size={14} />
              </Link>
            )}
            {sk1PageAmount && (
              <Link
                href={`/rechner/${sk1PageAmount}-euro-brutto-netto-steuerklasse-1`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors"
              >
                {new Intl.NumberFormat("de-DE").format(sk1PageAmount)} € brutto in Steuerklasse 1 im Detail <ArrowRight size={14} />
              </Link>
            )}
            <Link
              href={`/?brutto=${brutto >= 500 ? brutto : 3000}&jahr=2026&sk=${result.primary}#rechner`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
            >
              Im Hauptrechner öffnen <ArrowRight size={14} />
            </Link>
            <Link
              href="/steuerklassen"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
            >
              Alle 6 Steuerklassen erklärt <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-start gap-2 mt-5 text-xs text-black/50 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>
              Orientierungshilfe, keine Steuerberatung. Verheiratete können die Kombination jederzeit beim Finanzamt
              wechseln (bis 30. November mit Wirkung für das laufende Jahr) — die endgültige Jahressteuer ändert sich
              dadurch nicht, nur der monatliche Abzug.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
