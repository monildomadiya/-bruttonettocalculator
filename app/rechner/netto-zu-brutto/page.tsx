import type { Metadata } from "next";
import { ArrowRightLeft, Sparkles } from "lucide-react";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Netto zu Brutto Rechner | Gehaltsberechnung 2026",
  description:
    "Rechnen Sie Ihr gewünschtes Nettogehalt in das benötigte Bruttogehalt um — exakt kalkuliert für Verhandlungen im Steuerjahr 2026.",
};

export default function NettoZuBruttoPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-10 min-h-[80vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <ArrowRightLeft size={14} /> Umkehrberechnung
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Netto zu <span className="text-gradient-accent">Brutto</span> Rechner
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          Sie kennen Ihr gewünschtes Nettogehalt und möchten genau wissen, welches Bruttogehalt Sie dafür im
          Bewerbungsgespräch verhandeln müssen? Nutzen Sie unseren Präzisionsrechner, um Ihr Zielgehalt
          durch schnelle Anpassung der Bruttowerte in Sekundenschnelle auf den Euro genau zu ermitteln.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-14">
        <Calculator />
      </div>

      <div className="w-full max-w-6xl mx-auto bg-[#101010] border border-white/15 rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-white/80 leading-relaxed shadow-lg">
        <Sparkles size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-white font-bold">Pro-Tipp für Verhandlungen:</strong> Aufgrund des progressiven Steuertarifs nach § 32a EStG
          und der Beitragsbemessungsgrenzen steigt die Steuerbelastung mit höherem Brutto nicht linear. Testen Sie
          verschiedene Bruttostufen oben direkt in Echtzeit aus!
        </p>
      </div>
    </section>
  );
}
