import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Steuer-Lexikon | Brutto Netto Rechner 2026",
  description: "Kurz und verständlich erklärt: die wichtigsten Begriffe rund um Brutto, Netto, Steuern und Sozialversicherung.",
  alternates: { canonical: "https://bruttonettocalculator.com/lexikon" },
  openGraph: {
    title: "Steuer-Lexikon | Brutto Netto Rechner 2026",
    description: "Alle wichtigen Steuerbegriffe einfach erklärt: Grundfreibetrag, Soli, Beitragsbemessungsgrenze & mehr.",
    url: "https://bruttonettocalculator.com/lexikon",
    locale: "de_DE",
    type: "website",
    images: [{ url: "https://bruttonettocalculator.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steuer-Lexikon 2026",
    description: "Steuerbegriffe einfach erklärt: Grundfreibetrag, Soli, Beitragsbemessungsgrenze & mehr.",
    images: ["https://bruttonettocalculator.com/og-image.png"],
  },
};

const begriffe = [
  {
    titel: "Grundfreibetrag",
    kurz: "Der Grundfreibetrag ist der Teil des Einkommens, auf den keine Einkommensteuer anfällt. 2026 liegt er bei 12.348 € für Alleinstehende und 24.696 € für Verheiratete.",
  },
  {
    titel: "Solidaritätszuschlag",
    kurz: "Der Solidaritätszuschlag (Soli) beträgt 5,5 % der Einkommensteuer und wird seit 2021 nur noch von den oberen rund 10 % der Steuerzahler in voller Höhe gezahlt.",
  },
  {
    titel: "Beitragsbemessungsgrenze",
    kurz: "Die Beitragsbemessungsgrenze ist das maximale Bruttoeinkommen, bis zu dem Sozialversicherungsbeiträge erhoben werden. Einkommen darüber ist beitragsfrei.",
  },
  {
    titel: "Steuerklasse",
    kurz: "Die Steuerklasse bestimmt die Höhe der monatlichen Lohnsteuer-Vorauszahlung und richtet sich nach Familienstand und Erwerbssituation (Klassen I bis VI).",
  },
  {
    titel: "Spitzensteuersatz",
    kurz: "Der Spitzensteuersatz von 42 % greift ab einem zu versteuernden Einkommen von 69.879 € (2026). Ab 277.826 € greift die Reichensteuer von 45 %.",
  },
  {
    titel: "Sozialabgaben",
    kurz: "Pflichtbeiträge zur Renten-, Kranken-, Pflege- und Arbeitslosenversicherung, die im Regelfall je zur Hälfte von Arbeitnehmer und Arbeitgeber getragen werden.",
  },
];

export default function LexikonPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <BookOpen size={14} /> Nachschlagewerk
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Steuer-<span className="text-gradient-accent">Lexikon</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Alle relevanten Fachbegriffe rund um Ihr Gehalt, Steuern und Abgaben einfach und präzise auf den Punkt gebracht.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
        {begriffe.map((b) => (
          <div
            key={b.titel}
            className="bg-[#101010] border border-white/15 hover:border-[#E60A1C]/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                {b.titel}
              </h2>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                {b.kurz}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
