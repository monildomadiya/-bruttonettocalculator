import type { Metadata } from "next";
import { Users, Shield, ShieldCheck, CheckCircle2, Award, BookOpen, RefreshCw } from "lucide-react";
import { primaryReviewer, siteConfig } from "@/lib/authors";

export const metadata: Metadata = {
  title: "Über uns & Redaktionsstandards — Brutto Netto Rechner 2026",
  description: "Erfahren Sie mehr über unsere Mission, Transparenz, amtliche Steuergrundlagen nach § 32a EStG und unser fachliches Prüfer-Team.",
  alternates: {
    canonical: "https://bruttonettocalculator.com/ueber-uns",
  },
  openGraph: {
    title: "Über uns & Redaktionsstandards | BruttoNettoCalculator.com",
    description: "Unsere Mission, Transparenz und fachliche Prüf-Standards für den Gehaltsrechner 2026.",
    url: "https://bruttonettocalculator.com/ueber-uns",
    locale: "de_DE",
    type: "website",
    images: [{ url: "https://bruttonettocalculator.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns | BruttoNettoCalculator.com",
    description: "Unsere Mission und Redaktionsstandards für den kostenlosen Brutto Netto Rechner 2026.",
    images: ["https://bruttonettocalculator.com/og-image.png"],
  },
};

export default function UeberUnsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://bruttonettocalculator.com/ueber-uns#webpage",
        "url": "https://bruttonettocalculator.com/ueber-uns",
        "name": "Über uns & Redaktionsstandards | Brutto Netto Rechner 2026",
        "description": "Erfahren Sie mehr über unsere Mission, Transparenz und die amtlichen Steuergrundlagen unseres Gehaltsrechners.",
        "mainEntity": {
          "@id": "https://bruttonettocalculator.com/ueber-uns#team",
        },
      },
      {
        // Content is team-authored, so the reviewing entity is an Organization,
        // not a (fabricated) Person. This links to the site-wide Organization.
        "@type": "Organization",
        "@id": "https://bruttonettocalculator.com/ueber-uns#team",
        "name": primaryReviewer.name,
        "description": primaryReviewer.bio,
        "url": primaryReviewer.profile_url,
        "parentOrganization": { "@id": "https://bruttonettocalculator.com/#organization" },
      },
    ],
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Users size={14} /> Mission & Transparenz
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Über <span className="text-gradient-accent">uns & Redaktion</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed">
          BruttoNettoCalculator.com steht für präzise, unabhängige und blitzschnelle Gehaltsberechnungen
          auf Basis der offiziellen Vorgaben der Bundesrepublik Deutschland. Transparenz, fachliche Prüfung und
          stetige Aktualität bilden die Grundpfeiler unseres Angebots.
        </p>
      </div>

      {/* Reviewer Section — E-E-A-T */}
      <div className="mb-16 bg-gradient-to-br from-[#F1F3F5] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E60A1C]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {primaryReviewer.photo ? (
            <img
              src={primaryReviewer.photo}
              alt={primaryReviewer.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-[#E60A1C]/40 shadow-xl shrink-0"
            />
          ) : (
            <span
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl shrink-0 flex items-center justify-center text-white border-4 border-[#E60A1C]/40 shadow-xl"
              style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)" }}
              aria-hidden="true"
            >
              <ShieldCheck size={64} />
            </span>
          )}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-3">
              <Award size={14} /> {primaryReviewer.role}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#16181D] mb-1">
              {primaryReviewer.name}
            </h2>
            <p className="text-sm sm:text-base font-medium text-black/60 mb-4">
              {primaryReviewer.credentials}
            </p>
            <p className="text-base sm:text-lg text-black/80 leading-relaxed mb-6">
              {primaryReviewer.bio}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-black/60 border-t border-black/[0.08] pt-4">
              <span className="flex items-center gap-1.5 text-black/90 font-medium">
                <RefreshCw size={14} className="text-[#E60A1C]" /> Zuletzt aktualisiert: {siteConfig.lastUpdatedDisplay}
              </span>
              <span>•</span>
              <span>Prüfungsbereich: Einkommensteuer (§ 32a EStG), Sozialversicherungsrecht</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Standards & Sources */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#16181D] mb-6 flex items-center gap-3">
          <BookOpen className="text-[#E60A1C]" size={28} /> Unsere Redaktions- und Berechnungsstandards
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-600 font-bold text-lg">
                BMF
              </div>
              <h3 className="font-display font-bold text-xl text-[#16181D] mb-2">Bundesministerium der Finanzen</h3>
              <p className="text-sm text-black/70 leading-relaxed">
                Unsere Einkommensteuerberechnungen basieren exakt auf dem amtlichen Programmverlaufsteuerplan des BMF gem. § 32a EStG. Tarifzonen, Grundfreibeträge und Kinderfreibeträge werden kontinuierlich an neue Verordnungen angepasst.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-black/[0.08] text-xs text-black/50">
              Quelle: Amtliches Lohnsteuer-Handbuch 2026/2027
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 text-green-600 font-bold text-lg">
                SV
              </div>
              <h3 className="font-display font-bold text-xl text-[#16181D] mb-2">Sozialversicherung</h3>
              <p className="text-sm text-black/70 leading-relaxed">
                Beitragsbemessungsgrenzen (BBG) und Beitragssätze für Kranken-, Pflege-, Renten- und Arbeitslosenversicherung werden stichtagsgenau nach der offiziellen Sozialversicherungs-Rechengrößenverordnung implementiert.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-black/[0.08] text-xs text-black/50">
              Quelle: SV-Rechengrößenverordnung 2026
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-600 font-bold text-lg">
                Destatis
              </div>
              <h3 className="font-display font-bold text-xl text-[#16181D] mb-2">Statistisches Bundesamt</h3>
              <p className="text-sm text-black/70 leading-relaxed">
                Vergleichende Lohnstatistiken, Perzentile und Durchschnittsverdienste in unseren Detailrechnern basieren auf offiziellen Erhebungen von Destatis und der Bundesagentur für Arbeit.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-black/[0.08] text-xs text-black/50">
              Quelle: Destatis Verdienst-Strukturerhebung
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Technology */}
      <div className="grid sm:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mb-14">
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center mb-6">
              <Shield size={26} className="text-[#E60A1C]" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#16181D] mb-3">Unsere Mission</h2>
            <p className="text-base sm:text-lg text-black/80 leading-relaxed">
              Gehaltsabrechnungen in Deutschland sind komplex und oft schwer zu durchschauen. Unser Ziel ist es,
              Arbeitnehmern, Freiberuflern und Arbeitgebern ein modernes, intuitives und absolut verlässliches Werkzeug an
              die Hand zu geben, um jede Gehaltsverhandlung optimal vorzubereiten.
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-black/[0.05] border border-black/[0.12] flex items-center justify-center mb-6">
              <CheckCircle2 size={26} className="text-[#16181D]" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#16181D] mb-3">Qualitätsversprechen</h2>
            <p className="text-base sm:text-lg text-black/80 leading-relaxed">
              Unsere Rechner durchlaufen vor jeder Tarifänderung automatisierte Testreihen gegen offizielle
              Berechnungsbeispiele der Finanzbehörden, um Abweichungen auszuschließen und verlässliche Ergebnisse zu gewährleisten.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
