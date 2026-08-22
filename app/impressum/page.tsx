import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { company, addressLine } from "@/lib/company";

export const metadata: Metadata = {
  title: "Impressum — Brutto Netto Rechner 2026",
  description: "Amtliche Angaben, Anbieterkennzeichnung gem. § 5 TMG und rechtliche Hinweise zum Gehaltsrechner BruttoNettoCalculator.com.",
  alternates: { canonical: "https://bruttonettocalculator.com/impressum" },
  robots: { index: true, follow: true },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
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
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Impres<span className="text-gradient-accent">sum</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Gesetzliche Pflichtangaben und Anbieterkennzeichnung gemäß § 5 TMG.
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 sm:p-12 text-black/80 leading-relaxed space-y-8 shadow-xl w-full max-w-6xl">
        {company.isPlaceholder && (
          /* Sichtbar, solange lib/company.ts noch Platzhalter enthält. Besser
             ein ehrlicher Hinweis als eine Anschrift, die es nicht gibt —
             und ein Hinweis, den man nicht übersehen kann, wird auch behoben. */
          <div className="rounded-2xl border border-amber-500/40 bg-amber-50 px-5 py-4">
            <p className="text-sm font-bold text-amber-900 mb-1">
              Hinweis: Diese Angaben werden derzeit vervollständigt
            </p>
            <p className="text-sm text-amber-900/80">
              Die vollständige Anbieterkennzeichnung nach § 5 DDG wird kurzfristig
              ergänzt. Bis dahin erreichen Sie uns jederzeit unter{" "}
              <a href={`mailto:${company.email}`} className="underline font-semibold">
                {company.email}
              </a>
              .
            </p>
          </div>
        )}

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">Angaben gemäß § 5 DDG</h2>
          <p className="text-black/70">
            {company.legalName}<br />
            {company.businessDescription}<br />
            {company.streetAddress}<br />
            {company.postalCode} {company.city}, {company.country}
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">Kontakt</h2>
          <p className="text-black/70">
            E-Mail:{" "}
            <a href={`mailto:${company.email}`} className="hover:underline">
              {company.email}
            </a>
            <br />
            {company.phone && (
              <>
                Telefon: {company.phone}
                <br />
              </>
            )}
            Website: https://bruttonettocalculator.com
          </p>
        </div>

        {company.vatId && (
          <div>
            <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <p className="text-black/70">
              Gemäß § 27a Umsatzsteuergesetz: {company.vatId}
            </p>
          </div>
        )}

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">
            Redaktionell verantwortlich gemäß § 18 Abs. 2 MStV
          </h2>
          <p className="text-black/70">
            {company.editoriallyResponsible}<br />
            {addressLine()}
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">Streitschlichtung</h2>
          <p className="text-black/70">
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">Haftungsausschluss (Disclaimer)</h2>
          <p className="text-black/70 mb-3">
            <strong className="text-[#16181D]">Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter
            Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Berechnungen und Inhalte können wir
            jedoch keine Gewähr übernehmen.
          </p>
          <p className="text-black/70">
            <strong className="text-[#16181D]">Haftung für Links:</strong> Unser Angebot enthält ggf. Links zu externen Websites
            Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
            keine Gewähr übernehmen.
          </p>
        </div>
      </div>
    </section>
  );
}
