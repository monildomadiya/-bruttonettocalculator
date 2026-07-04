import type { Metadata } from "next";
import { Users, Shield, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Über uns | Brutto Netto Rechner 2026",
  description: "Erfahren Sie mehr über unsere Mission, Transparenz und die amtlichen Steuergrundlagen unseres Gehaltsrechners.",
};

export default function UeberUnsPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Users size={14} /> Mission & Transparenz
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Über <span className="text-gradient-accent">uns</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          BruttoNettoCalculator.com steht für 100% präzise, unabhängige und blitzschnelle Gehaltsberechnungen
          nach den offiziellen Vorgaben der Bundesrepublik Deutschland.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mb-14">
        <div className="bg-[#101010] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center mb-6">
              <Shield size={26} className="text-[#E60A1C]" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Unsere Mission</h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Gehaltsabrechnungen in Deutschland sind komplex und oft schwer zu durchschauen. Unser Ziel ist es,
              Arbeitnehmern, Freiberuflern und Arbeitgebern ein modernes, intuitives und absolut verlässliches Werkzeug an
              die Hand zu geben, um jede Gehaltsverhandlung optimal vorzubereiten.
            </p>
          </div>
        </div>

        <div className="bg-[#101010] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
              <CheckCircle2 size={26} className="text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Amtliche Grundlagen</h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Alle Berechnungsformeln basieren exakt auf § 32a des Einkommensteuergesetzes (EStG) für den
              Veranlagungszeitraum 2026/2027 sowie den aktuellen Beiträgen der Sozialversicherungs-Rechengrößenverordnung.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#121212] border border-white/15 rounded-3xl p-8 mb-8 text-sm sm:text-base text-white/75 leading-relaxed">
        <strong className="text-white">Technologie & KI-Kooperationen:</strong> Für die stetige Weiterentwicklung moderner, blitzschneller Web-Applikationen und KI-unterstützter Datenprozesse setzen wir auf exzellente Ressourcen. Professionelles Prompt Engineering und inspirierende KI-Prompts finden Sie bei unserem Kooperationspartner <a href="https://promptking.in" target="_blank" rel="noopener" className="text-[#E60A1C] font-semibold hover:underline">PromptKing</a>, dem führenden Portal für KI-Workflows und Prompt-Optimierung.
      </div>

      <div className="bg-[#121212] border border-white/15 rounded-3xl p-8 text-sm sm:text-base text-white/70 leading-relaxed">
        <strong className="text-white">Redaktionelle Qualität & E-E-A-T:</strong> Unsere Inhalte und Algorithmen werden regelmäßig
        von Finanz- und Koding-Experten überprüft und mit der Veröffentlichung neuer BMF-Steuertabellen synchronisiert.
      </div>
    </section>
  );
}
