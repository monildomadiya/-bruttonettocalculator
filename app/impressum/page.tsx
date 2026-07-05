import type { Metadata } from "next";
import { Landmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Impressum | Brutto Netto Rechner 2026",
  description: "Amtliche Angaben, Anbieterkennzeichnung gem. § 5 TMG und rechtliche Hinweise zum Gehaltsrechner BruttoNettoCalculator.com.",
  alternates: { canonical: "https://bruttonettocalculator.com/impressum" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Impressum | BruttoNettoCalculator.com",
    description: "Anbieterkennzeichnung gem. § 5 TMG für BruttoNettoCalculator.com.",
    url: "https://bruttonettocalculator.com/impressum",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impressum | BruttoNettoCalculator.com",
    description: "Anbieterkennzeichnung gem. § 5 TMG für BruttoNettoCalculator.com.",
  },
};

export default function ImpressumPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Landmark size={14} /> Amtliche Angaben
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Impres<span className="text-gradient-accent">sum</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          Gesetzliche Pflichtangaben und Anbieterkennzeichnung gemäß § 5 TMG.
        </p>
      </div>

      <div className="bg-[#101010] border border-white/15 rounded-3xl p-8 sm:p-12 text-white/80 leading-relaxed space-y-8 shadow-xl w-full max-w-6xl">
        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">Angaben gemäß § 5 TMG</h2>
          <p className="text-white/70">
            BruttoNettoCalculator.com<br />
            Redaktion & Online-Entwicklungsdienstleistungen<br />
            Musterstraße 10<br />
            10115 Berlin, Deutschland
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">Kontakt</h2>
          <p className="text-white/70">
            E-Mail: info@bruttonettocalculator.com<br />
            Website: https://bruttonettocalculator.com
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">Redaktionell verantwortlich</h2>
          <p className="text-white/70">
            Redaktionsleitung BruttoNettoCalculator<br />
            Musterstraße 10, 10115 Berlin
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">Haftungsausschluss (Disclaimer)</h2>
          <p className="text-white/70 mb-3">
            <strong className="text-white">Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter
            Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Berechnungen und Inhalte können wir
            jedoch keine Gewähr übernehmen.
          </p>
          <p className="text-white/70">
            <strong className="text-white">Haftung für Links:</strong> Unser Angebot enthält ggf. Links zu externen Websites
            Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
            keine Gewähr übernehmen.
          </p>
        </div>
      </div>
    </section>
  );
}
