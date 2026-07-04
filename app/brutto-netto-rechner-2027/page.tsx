import type { Metadata } from "next";
import { Sparkles, AlertCircle } from "lucide-react";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2027 (vorläufig) | BruttoNettoCalculator",
  description:
    "Brutto Netto Rechner für 2027: Die Steuerreform der Bundesregierung tritt voraussichtlich zum 1.1.2027 in Kraft. Konkrete Werte stehen erst nach dem Existenzminimumbericht (Herbst 2026) fest.",
};

export default function Rechner2027Page() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-10 min-h-[80vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Sparkles size={14} /> Vorschau & Steuerreform
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Brutto Netto Rechner <span className="text-gradient-accent">2027</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          Die Bundesregierung hat sich im Juni 2026 auf eine Einkommensteuerreform
          zum 1. Januar 2027 verständigt: eine Anhebung des Grundfreibetrags, des
          Kinderfreibetrags und des Kindergelds sowie eine Abflachung der zweiten
          Progressionszone. Die genauen Eckwerte — insbesondere der neue
          Grundfreibetrag — werden aber erst nach dem turnusmäßigen
          Existenzminimumbericht im Herbst 2026 final festgelegt und müssen den
          Bundesrat passieren. Bis dahin zeigt dieser Rechner als bestmögliche
          Annäherung die aktuell gültigen 2026-Werte.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-14">
        <Calculator />
      </div>

      <div className="w-full max-w-6xl mx-auto bg-[#101010] border border-white/15 rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-white/80 leading-relaxed shadow-lg">
        <AlertCircle size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-white font-bold">Aktualisiert: Juli 2026.</strong> Sobald die finalen 2027-Eckwerte
          (voraussichtlich Herbst/Winter 2026) offiziell verabschiedet vorliegen, wird diese Seite
          automatisch mit den exakten Formeln nach § 32a EStG 2027 aktualisiert.
        </p>
      </div>
    </section>
  );
}
