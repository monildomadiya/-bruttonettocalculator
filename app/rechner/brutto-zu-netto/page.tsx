import type { Metadata } from "next";
import { Calculator as CalcIcon } from "lucide-react";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Brutto zu Netto Rechner | Gehaltsberechnung 2026",
  description:
    "Rechnen Sie Ihr Bruttogehalt direkt in Ihr Nettogehalt um — aktuell für 2026 mit allen offiziellen Steuern und Abgaben.",
};

export default function BruttoZuNettoPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-10 min-h-[80vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <CalcIcon size={14} /> Amtliche Berechnung
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Brutto zu <span className="text-gradient-accent">Netto</span> Rechner
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          Geben Sie Ihr Bruttogehalt ein und sehen Sie in Echtzeit und präzise auf den Cent, wie viel davon
          als Nettogehalt auf Ihrem Konto übrig bleibt — inklusive Lohnsteuer, Solidaritätszuschlag und allen
          Sozialabgaben nach § 32a EStG 2026.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <Calculator />
      </div>
    </section>
  );
}
