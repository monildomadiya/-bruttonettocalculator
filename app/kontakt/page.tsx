import type { Metadata } from "next";
import { Mail, MessageSquare, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt — Brutto Netto Rechner 2026",
  description: "Treten Sie mit unserem Team in Kontakt bei Fragen, Feedback oder Verbesserungsvorschlägen zum Gehaltsrechner.",
  alternates: { canonical: "https://bruttonettocalculator.com/kontakt" },
  openGraph: {
    title: "Kontakt | BruttoNettoCalculator.com",
    description: "Fragen, Feedback oder Verbesserungsvorschläge — kontaktieren Sie unser Team.",
    url: "https://bruttonettocalculator.com/kontakt",
    locale: "de_DE",
    type: "website",
  },
};

export default function KontaktPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <MessageSquare size={14} /> Kundenservice & Feedback
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Kon<span className="text-gradient-accent">takt</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          Haben Sie Fragen, Feedback oder einen Vorschlag zur Erweiterung unserer Steuer- oder Gehaltsformeln? Wir freuen uns auf Ihre Nachricht!
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
        <div className="bg-[#101010] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center mb-6">
              <Mail size={26} className="text-[#E60A1C]" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Direkter E-Mail-Support</h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6">
              Senden Sie uns Ihr Feedback oder Anregungen direkt per E-Mail. Unser Redaktions- und Entwicklerteam
              prüft jede Eingabe sorgfältig.
            </p>
          </div>
          <a
            href="mailto:info@bruttonettocalculator.com"
            className="inline-flex items-center gap-3 text-[#E60A1C] font-mono text-lg font-bold hover:underline"
          >
            info@bruttonettocalculator.com
          </a>
        </div>

        <div className="bg-[#101010] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
              <Clock size={26} className="text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Schnelle Bearbeitungszeit</h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Wir bemühen uns, alle technischen Anfragen zu Steuerklassen oder Berechnungsformeln innerhalb von
              24 bis 48 Stunden zu beantworten.
            </p>
          </div>
          <div className="text-sm font-mono text-white/50 pt-6 border-t border-white/10">
            Erreichbarkeit: Montag bis Freitag, 09:00 – 18:00 Uhr
          </div>
        </div>
      </div>
    </section>
  );
}
