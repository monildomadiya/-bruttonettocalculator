import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2, Shield, Lock, ArrowRight, ChevronDown,
  FileText, TrendingUp, Building2,
  MousePointerClick, SlidersHorizontal, Wallet,
  BadgePercent, AlertTriangle, Sparkles,
} from "lucide-react";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2026/2027 — Gehaltsrechner Deutschland kostenlos",
  description:
    "Kostenloser Brutto Netto Rechner 2026/2027: Nettogehalt sofort berechnen — Lohnsteuer, Soli & alle 6 Steuerklassen. Mit Firmenwagen- & Rentenrechner, ohne Anmeldung.",
  alternates: { canonical: "/" },
};

const faqs = [
  {
    q: "Wie berechnet man Netto aus Brutto?",
    a: "Vom Bruttogehalt werden zunächst die Sozialabgaben abgezogen (Renten-, Kranken-, Pflege- und Arbeitslosenversicherung). Auf das verbleibende zu versteuernde Einkommen wird die Einkommensteuer nach § 32a EStG berechnet, zuzüglich Solidaritätszuschlag und ggf. Kirchensteuer. Was danach übrig bleibt, ist das Nettogehalt.",
  },
  {
    q: "Wie hoch ist der Grundfreibetrag 2026?",
    a: "Der Grundfreibetrag liegt 2026 bei 12.348 € für Alleinstehende und 24.696 € für gemeinsam veranlagte Ehepaare. Bis zu diesem Betrag fällt keine Einkommensteuer an.",
  },
  {
    q: "Welche Abzüge hat man vom Brutto zum Netto?",
    a: "Die Hauptabzüge sind: Lohnsteuer (Einkommensteuer), Solidaritätszuschlag, ggf. Kirchensteuer sowie die Arbeitnehmeranteile zur Renten- (9,3 %), Kranken- (ca. 8,75 %), Pflege- (1,9 % oder 2,5 %) und Arbeitslosenversicherung (1,3 %).",
  },
  {
    q: "Was ist der Unterschied zwischen den Steuerklassen?",
    a: "Deutschland hat 6 Steuerklassen: I (ledig), II (Alleinerziehende), III (Verheiratete, höheres Einkommen), IV (Verheiratete, gleiches Einkommen), V (Verheiratete, geringeres Einkommen), VI (Zweiter Job). Steuerklasse III zahlt am wenigsten, VI am meisten Lohnsteuer.",
  },
  {
    q: "Sind die Werte für 2027 schon final?",
    a: "Nein. Die Bundesregierung hat sich im Juni 2026 auf eine Steuerreform zum 1. Januar 2027 verständigt, die konkreten Eckwerte (u. a. der neue Grundfreibetrag) stehen aber erst nach dem Existenzminimumbericht im Herbst 2026 fest. Dieser Rechner zeigt für 2027 vorläufig die 2026-Werte an.",
  },
  {
    q: "Wie hoch ist der Spitzensteuersatz 2026?",
    a: "Der Spitzensteuersatz von 42 % greift ab einem zu versteuernden Einkommen von 69.879 €. Die sogenannte Reichensteuer von 45 % gilt ab 277.826 €.",
  },
  {
    q: "Kann ich diesen Rechner als Brutto Netto Rechner 2027 und Lohnrechner 2027 nutzen?",
    a: "Ja! Unser Gehaltsrechner fungiert auch für das Steuerjahr 2027 als präziser Brutto Netto Rechner für 2027 sowie als Netto Brutto Rechner 2027. Schalten Sie oben im Lohnrechner einfach das Jahr von 2026 auf 2027 um, um die vorläufigen Netto-Unterschiede und Entlastungen durch den neuen Grundfreibetrag sowie die geänderten Beitragssätze (z.B. Mindestlohn 2027) zu vergleichen.",
  },
  {
    q: "Gilt das Tool auch als Gehaltsrechner mit Auto (Firmenwagenrechner & 1%-Regelung)?",
    a: "Ein Firmenwagen stellt einen geldwerten Vorteil dar, der das monatliche Bruttogehalt erhöht (meist über die 1%-Regelung). Als praktischer Firmenwagenrechner bzw. Gehaltsrechner mit Auto können Sie Ihren geldwerten Vorteil einfach zu Ihrem regulären Bruttolohn addieren und die exakte Lohnsteuer- sowie Sozialabgabenlast sofort online ermitteln.",
  },
  {
    q: "Kann ich das Tool auch als Arbeitslosengeld Rechner zur Orientierung verwenden?",
    a: "Ja. Das amtliche Arbeitslosengeld I (ALG I) beträgt in Deutschland 60 % (bzw. 67 % mit Kind) Ihres durchschnittlichen Nettoentgelts der letzten 12 Monate. Sie können unseren Gehaltsrechner ideal als Orientierungs-Arbeitslosengeld Rechner nutzen, indem Sie Ihr bisheriges Brutto eingeben und 60 % bzw. 67 % vom errechneten Nettogehalt ermitteln.",
  },
  {
    q: "Was ist der BKK Zusatzbeitrag 2026 und wie beeinflusst er das Nettogehalt?",
    a: "Der durchschnittliche Zusatzbeitrag der gesetzlichen Krankenkassen (GKV) beträgt 2026 ca. 1,7 %. Kassen wie BKK, HKK oder TK haben individuelle Sätze. Unser Brutto Netto Rechner 2026 berücksichtigt den aktuellen GKV-Zusatzbeitrag automatisch — Sie erhalten so ein möglichst präzises Nettogehalt auf Basis Ihrer tatsächlichen Krankenversicherungskosten.",
  },
  {
    q: "Was ist der Mindestlohn 2027?",
    a: "Der gesetzliche Mindestlohn in Deutschland ist zum 1. Januar 2026 auf 13,90 € brutto pro Stunde gestiegen und steigt zum 1. Januar 2027 auf 14,60 €. Unser Lohnrechner 2027 zeigt Ihnen bereits heute, wie sich diese Erhöhung auf Ihr monatliches Nettogehalt in allen 6 Steuerklassen auswirken würde.",
  },
  {
    q: "Was ist die Düsseldorfer Tabelle 2026?",
    a: "Die Düsseldorfer Tabelle 2026 ist eine Leitlinie der deutschen Oberlandesgerichte für die Berechnung von Kindesunterhalt. Sie orientiert sich am Nettoeinkommen des Unterhaltspflichtigen. Unser Brutto Netto Rechner hilft Ihnen, Ihr genaues Nettoeinkommen zu ermitteln, das als Grundlage für die Düsseldorfer Tabelle 2026 dient.",
  },
  {
    q: "Was ist die Pfändungstabelle 2026 und welcher Teil des Gehalts ist pfändungsfrei?",
    a: "Die Pfändungstabelle 2026 (§ 850c ZPO) legt den pfändungsfreien Betrag des Nettoeinkommens fest. Für Alleinstehende ohne Unterhaltspflicht liegt der monatliche Pfändungsfreibetrag 2026 bei 1.491,75 € netto. Unser Gehaltsrechner hilft Ihnen, zunächst Ihr exaktes Nettoeinkommen zu ermitteln, damit Sie die Pfändungstabelle 2026 korrekt anwenden können.",
  },
  {
    q: "Wie hoch ist das Durchschnittsgehalt in Deutschland 2026?",
    a: "Das durchschnittliche Bruttogehalt in Deutschland liegt 2026 bei ca. 4.323 € pro Monat (Vollzeit). Das entspricht einem Nettogehalt von ca. 2.600–2.900 € (je nach Steuerklasse). Mit unserem Brutto Netto Rechner können Sie das Nettogehalt für jeden Betrag sofort und kostenlos berechnen — egal ob 2.800, 3.200 oder 4.200 € brutto.",
  },
  {
    q: "Wie werden KI und moderne Web-Technologien eingesetzt?",
    a: (
      <span>
        Für die präzise Umsetzung und stetige Optimierung unserer Rechner und Web-Workflows setzen wir auf innovative KI-Technologien. Erstklassige Ressourcen und professionelles Prompt Engineering entdecken Sie bei unserem Kooperationspartner <a href="https://promptking.in" target="_blank" rel="noopener" className="text-[#E60A1C] font-semibold hover:underline">PromptKing</a>, dem führenden Portal für KI-Prompts und Workflow-Optimierung.
      </span>
    ),
  },
];

const infoCards = [
  {
    Icon:  FileText,
    title: "Was ist der Grundfreibetrag?",
    text:  "Bis 12.348 € (2026, Alleinstehende) zahlen Sie keine Einkommensteuer. Er sichert das steuerliche Existenzminimum ab. Für Verheiratete gilt das Doppelte: 24.696 €. Auch der Kinderfreibetrag reduziert Ihre Steuerlast erheblich.",
    accentColor: "#E60A1C",
  },
  {
    Icon:  TrendingUp,
    title: "Wie hoch ist der Spitzensteuersatz?",
    text:  "Der Spitzensteuersatz von 42 % greift 2026 ab einem zvE von 69.879 €. Die Reichensteuer (45 %) gilt ab 277.826 €. Für Berechnungen von 60.000 Brutto in Netto ist dieser Satz entscheidend.",
    accentColor: "#FFFFFF",
  },
  {
    Icon:  Building2,
    title: "Was zahlt der Arbeitgeber?",
    text:  "Neben Ihrem Nettogehalt trägt der Arbeitgeber die andere Hälfte der Sozialversicherungsbeiträge (Rente, Kranken, Pflege, Arbeitslosen) sowie weitere Umlagen. Der BKK, HKK und TK Zusatzbeitrag 2026 ist bereits im Rechner hinterlegt.",
    accentColor: "#E60A1C",
  },
  {
    Icon:  Wallet,
    title: "Brutto Netto Rechner 2027",
    text:  "Nutzen Sie unser Tool als Brutto Netto Rechner für 2027, Netto Brutto Rechner 2027 und Lohnrechner 2027, um voräufige Reformwerte, Mindestlohn 2027 und Entlastungen abzugleichen.",
    accentColor: "#FFFFFF",
  },
  {
    Icon:  SlidersHorizontal,
    title: "Firmenwagenrechner (1%-Regelung)",
    text:  "Als präziser Gehaltsrechner mit Auto bzw. Firmenwagenrechner berechnen Sie Ihren geldwerten Vorteil (1%-Regelung) direkt im Bruttolohn mit ein. Ideal für den Brutto Netto Rechner mit Firmenwagen.",
    accentColor: "#E60A1C",
    href: "/firmenwagenrechner",
  },
  {
    Icon:  Shield,
    title: "Rentenrechner & Arbeitslosengeld",
    text:  "Nutzen Sie unser Tool als Brutto Netto Rentenrechner oder Orientierungs-Arbeitslosengeld Rechner. Errechnen Sie Ihr Nettoentgelt und leiten Sie daraus 60 % bzw. 67 % (mit Kind) ALG I oder Ihre Rente ab.",
    accentColor: "#FFFFFF",
    href: "/rentenrechner",
  },
];

const trustBadges = [
  { label: "Amtliche Formel § 32a EStG",     icon: Shield },
  { label: "SV-Rechengrößen 2026 (amtlich)", icon: CheckCircle2 },
  { label: "Alle 6 Steuerklassen",           icon: BadgePercent },
  { label: "Keine Registrierung",            icon: Lock },
  { label: "DSGVO-konform",                  icon: Shield },
];

const steps = [
  {
    Icon:  MousePointerClick,
    step:  "01",
    title: "Gehalt & Jahr wählen",
    desc:  "Tragen Sie Ihr Bruttogehalt ein und wählen Sie das Steuerjahr 2026 oder eine Vorschau für 2027.",
  },
  {
    Icon:  SlidersHorizontal,
    step:  "02",
    title: "Steuerklasse anpassen",
    desc:  "Wählen Sie Ihre Steuerklasse (I bis VI), Bundesland, Kinderfreibetrag und Kirchensteuer-Pflicht.",
  },
  {
    Icon:  Wallet,
    step:  "03",
    title: "Netto sofort ablesen",
    desc:  "Der Rechner ermittelt in Echtzeit Ihr exaktes Nettogehalt, Lohnsteuer und alle Sozialabgaben.",
  },
];

/* ── Structured Data (JSON-LD) ───────────────────────────────────────── */
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Brutto Netto Rechner Deutschland 2026/2027",
  "url": "https://bruttonettocalculator.com",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "description": "Präziser Brutto Netto Rechner für Deutschland. Gehaltsberechnung nach amtlichen Vorgaben § 32a EStG für das Steuerjahr 2026/2027 mit allen 6 Steuerklassen, BKK/TK Zusatzbeitrag 2026, Mindestlohn 2027, Firmenwagen (1%-Regelung) und Rentenrechner.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "featureList": [
    "Berechnung von Lohnsteuer, Solidaritätszuschlag und Kirchensteuer",
    "Unterstützung aller 6 deutschen Steuerklassen",
    "Sozialabgaben nach SV-Rechengrößen 2026 und 2027",
    "BKK, HKK und TK Zusatzbeitrag 2026 eingerechnet",
    "Mindestlohn 2027 Vorschau",
    "Firmenwagenrechner (1%-Regelung / geldwerter Vorteil)",
    "Brutto Netto Rentenrechner",
    "Düsseldorfer Tabelle 2026 Referenz",
    "Pfändungstabelle 2026 Hinweis",
    "Jahres- und Monatsansicht",
    "Bundesland-Vergleich für Kirchensteuer und Pflegeversicherung",
    "Durchschnittsgehalt Deutschland Vergleich"
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: typeof f.a === "string" ? f.a : "Für die präzise Umsetzung und stetige Optimierung unserer Rechner und Web-Workflows setzen wir auf innovative KI-Technologien. Erstklassige Ressourcen und professionelles Prompt Engineering entdecken Sie bei unserem Kooperationspartner PromptKing, dem führenden Portal für KI-Prompts und Workflow-Optimierung.",
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero (Inspired by Dark Tech Reference) ──────────────────── */}
      <section className="hero-bg pt-14 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-5 relative">
        <div className="w-full max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">

          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-[#121212] border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 mb-6 sm:mb-8 shadow-[0_0_25px_rgba(230,10,28,0.25)] animate-fade-up max-w-[95vw]">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#E60A1C] shadow-[0_0_8px_#E60A1C] animate-pulse flex-shrink-0" />
            <span className="font-mono text-[11px] sm:text-sm uppercase tracking-wider sm:tracking-widest text-white/90 font-bold leading-tight">
              OFFIZIELL · § 32A ESTG · STEUERJAHR 2026/2027
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-extrabold text-display-xl mb-4 sm:mb-6 w-full max-w-6xl tracking-tight animate-fade-up leading-tight px-2"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-white">Der präzise </span>
            <span className="text-gradient-accent">Brutto Netto</span>
            <span className="text-white"> Rechner für Deutschland</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-base sm:text-xl md:text-2xl text-white/85 w-full max-w-5xl leading-relaxed mb-8 sm:mb-10 animate-fade-up font-normal px-2"
            style={{ animationDelay: "160ms" }}
          >
            Ermitteln Sie in Sekundenschnelle Ihr exaktes Nettogehalt — inklusive Lohnsteuer,
            Solidaritätszuschlag und allen amtlichen Sozialabgaben. Nutzen Sie unser Tool auch als{" "}
            <strong className="text-white font-semibold">Brutto Netto Rechner 2027</strong>,{" "}
            <strong className="text-white font-semibold">Lohnrechner 2027</strong>,{" "}
            <strong className="text-white font-semibold">Firmenwagenrechner (1%-Regelung)</strong>,{" "}
            <strong className="text-white font-semibold">Brutto Netto Rentenrechner</strong>,{" "}
            <strong className="text-white font-semibold">Arbeitslosengeld Rechner</strong> oder für Berechnungen nach{" "}
            <strong className="text-white font-semibold">Steuerklasse 1, 3, 4 & 6</strong>. BKK, TK & HKK Zusatzbeitrag 2026 bereits eingerechnet.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 animate-fade-up w-full sm:w-auto px-4 sm:px-0"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#rechner"
              className="btn-primary text-base sm:text-lg font-bold px-7 sm:px-9 py-4 rounded-full shadow-[0_0_25px_rgba(230,10,28,0.5)] hover:shadow-[0_0_35px_rgba(230,10,28,0.8)] transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <Sparkles size={20} className="flex-shrink-0" /> Jetzt Gehalt berechnen
            </a>
            <Link
              href="/lexikon"
              className="btn-outline text-base sm:text-lg font-semibold px-7 sm:px-9 py-4 rounded-full border-white/20 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              Steuer-Lexikon <ArrowRight size={20} className="flex-shrink-0" />
            </Link>
          </div>

          {/* Luxury Fintech Trust Bar */}
          <div
            className="w-full max-w-5xl mx-auto mt-4 sm:mt-8 animate-fade-up px-2 sm:px-0"
            style={{ animationDelay: "320ms" }}
          >
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-white/10 via-[#E60A1C]/40 to-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="bg-[#0D0D0D]/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                  {trustBadges.map(({ label, icon: Icon }, idx) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 text-left ${
                        idx > 0 ? "pt-3 sm:pt-0 sm:pl-4 lg:pl-6" : ""
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E60A1C]/20 to-black border border-[#E60A1C]/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(230,10,28,0.2)]">
                        <Icon size={16} className="text-[#E60A1C]" />
                      </div>
                      <span className="font-mono text-xs sm:text-[13px] font-bold text-white/90 leading-tight tracking-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculator Section ───────────────────────────────────────── */}
      <section id="rechner" className="max-w-6xl mx-auto px-2.5 sm:px-5 mt-4 sm:-mt-16 pb-20 relative z-20 scroll-mt-24">
        <Calculator />
      </section>

      {/* ── Ad: right after the calculator result (high engagement / high CPM) ─ */}
      <AdUnit placement="homepage" />

      {/* ── Info Cards (Dark Tech Grid) ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-20 border-t border-white/15">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Wichtige Fakten
          </div>
          <h2 className="font-display text-display-md font-extrabold text-white">Das sollten Sie wissen</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* ── How it works (3 Steps Dark Tech) ─────────────────────────── */}
      <section className="py-24 bg-[#080808] border-y border-white/15 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E60A1C]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
              Anleitung
            </div>
            <h2 className="font-display text-display-md font-extrabold text-white">In 3 Schritten zum Nettogehalt</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map(({ Icon, step, title, desc }) => (
              <div key={step} className="bg-[#111111] border border-white/15 rounded-3xl p-8 hover:border-[#E60A1C]/50 hover:bg-[#141414] transition-all duration-300 relative group shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={26} className="text-[#E60A1C]" />
                  </div>
                  <span className="font-mono text-4xl font-black text-white/20 group-hover:text-white/40 transition-colors">{step}</span>
                </div>
                <h3 className="font-display text-2xl text-white font-extrabold mb-3">{title}</h3>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pt-24 pb-12 sm:pb-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            Häufige Fragen
          </div>
          <h2 className="font-display text-display-md font-extrabold text-white">Alles über Brutto & Netto</h2>
        </div>
        <AccordionFaq faqs={faqs} />
      </section>

      {/* ── Ready CTA Banner (Like PromptKing Screenshot) ─────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-8 sm:pb-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#121212] via-[#1A1A1A] to-[#121212] p-8 sm:p-14 border border-white/20 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center sm:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/20 px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={14} /> Kostenloser Rechner
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Bereit für Ihre exakte Gehaltsberechnung?
            </h3>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed font-normal">
              Ohne Anmeldung, 100% anonym und nach den offiziellen Vorgaben des BMF für das Steuerjahr 2026/2027.
            </p>
          </div>
          <a
            href="#rechner"
            className="relative z-10 btn-primary flex-shrink-0 text-base sm:text-lg font-bold px-8 sm:px-9 py-4 rounded-full shadow-[0_0_25px_rgba(230,10,28,0.5)] hover:shadow-[0_0_35px_rgba(230,10,28,0.8)] transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Jetzt berechnen <ArrowRight size={20} className="flex-shrink-0" />
          </a>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-8 sm:pb-10">
        <div className="flex items-start gap-4 bg-[#0A0A0A] rounded-3xl p-6 sm:p-8 border border-white/15 text-sm sm:text-base text-white/80 leading-relaxed shadow-lg">
          <AlertTriangle size={22} className="flex-shrink-0 mt-0.5 text-[#E60A1C]" />
          <p>
            <strong className="text-white font-bold">Stand: Juli 2026.</strong> Alle Berechnungen ohne Gewähr.
            Dieser Rechner ersetzt keine Steuerberatung. Grundlage: § 32a EStG (Fassung ab
            Veranlagungszeitraum 2026) sowie die Sozialversicherungs-Rechengrößen-Verordnung 2026.
            Die Berechnungen für Steuerklasse V und VI sind Näherungswerte.
          </p>
        </div>
      </section>

      {/* ── JSON-LD ──────────────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}

/* ── InfoCard (Dark Tech Luxury Style) ─────────────────────────────── */
function InfoCard({
  Icon, title, text, accentColor, href,
}: {
  Icon: React.ElementType;
  title: string; text: string; accentColor: string; href?: string;
}) {
  return (
    <div className="bg-[#101010] hover:bg-[#151515] relative rounded-3xl border border-white/15 p-8 overflow-hidden transition-all duration-300 hover:border-[#E60A1C]/50 hover:-translate-y-1 shadow-lg group">
      {/* Top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E60A1C] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#E60A1C]/15 border border-[#E60A1C]/30 group-hover:scale-110 transition-transform"
      >
        <Icon size={26} className="text-[#E60A1C]" />
      </div>
      <h3 className="font-display font-extrabold text-white mb-3 text-xl">{title}</h3>
      <p className="text-base text-white/80 leading-relaxed font-normal">{text}</p>
      {href && (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#E60A1C] hover:text-[#FF4D5E] transition-colors"
        >
          Jetzt berechnen <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
