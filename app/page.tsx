import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield, ArrowRight, ChevronDown,
  FileText, TrendingUp, Building2,
  MousePointerClick, SlidersHorizontal, Wallet,
  AlertTriangle, Sparkles,
} from "lucide-react";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2026/2027 — Gehaltsrechner kostenlos",
  description:
    "Kostenloser Brutto Netto Rechner 2026/2027: Nettogehalt sofort berechnen — Lohnsteuer, Soli & alle 6 Steuerklassen. Mit Firmenwagen- & Rentenrechner, ohne Anmeldung.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Brutto Netto Rechner 2026/2027 — Gehaltsrechner Deutschland kostenlos",
    description:
      "Kostenloser Brutto Netto Rechner 2026/2027: Nettogehalt sofort berechnen — Lohnsteuer, Soli & alle 6 Steuerklassen. Mit Firmenwagen- & Rentenrechner, ohne Anmeldung.",
    url: "https://bruttonettocalculator.com",
    locale: "de_DE",
    type: "website",
  },
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
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  "name": "Brutto Netto Rechner Deutschland 2026/2027",
  "url": "https://bruttonettocalculator.com",
  "description": "Präziser Brutto Netto Rechner für Deutschland. Gehaltsberechnung nach § 32a EStG für das Steuerjahr 2026/2027 mit allen 6 Steuerklassen, BKK/TK Zusatzbeitrag 2026, Mindestlohn 2027, Firmenwagen (1%-Regelung) und Rentenrechner.",
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
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-[#FFFFFF] border border-black/[0.12] rounded-full px-4 sm:px-6 py-2 sm:py-2.5 mb-6 sm:mb-8 animate-fade-up max-w-[95vw]">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#E60A1C] animate-pulse flex-shrink-0" />
            <span className="font-mono text-[11px] sm:text-sm uppercase tracking-wider sm:tracking-widest text-black/90 font-bold leading-tight">
              AUF BASIS OFFIZIELLER WERTE · § 32A ESTG · 2026/2027
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-extrabold text-display-xl mb-4 sm:mb-6 w-full max-w-6xl tracking-tight animate-fade-up leading-tight px-2"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-[#16181D]">Der präzise </span>
            <span className="text-gradient-accent">Brutto Netto</span>
            <span className="text-[#16181D]"> Rechner für Deutschland</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-base sm:text-xl md:text-2xl text-black/85 w-full max-w-5xl leading-relaxed mb-8 sm:mb-10 animate-fade-up font-normal px-2"
            style={{ animationDelay: "160ms" }}
          >
            Ermitteln Sie in Sekundenschnelle Ihr exaktes Nettogehalt — inklusive Lohnsteuer,
            Solidaritätszuschlag und allen amtlichen Sozialabgaben. Nutzen Sie unser Tool auch als{" "}
            <strong className="text-[#16181D] font-semibold">Brutto Netto Rechner 2027</strong>,{" "}
            <strong className="text-[#16181D] font-semibold">Lohnrechner 2027</strong>,{" "}
            <strong className="text-[#16181D] font-semibold">Firmenwagenrechner (1%-Regelung)</strong>,{" "}
            <strong className="text-[#16181D] font-semibold">Brutto Netto Rentenrechner</strong>,{" "}
            <strong className="text-[#16181D] font-semibold">Arbeitslosengeld Rechner</strong> oder für Berechnungen nach{" "}
            <strong className="text-[#16181D] font-semibold">Steuerklasse 1, 3, 4 & 6</strong>. BKK, TK & HKK Zusatzbeitrag 2026 bereits eingerechnet.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 animate-fade-up w-full sm:w-auto px-4 sm:px-0"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#rechner"
              className="btn-primary text-base sm:text-lg font-bold px-7 sm:px-9 py-4 rounded-full transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <Sparkles size={20} className="flex-shrink-0" /> Jetzt Gehalt berechnen
            </a>
            <Link
              href="/lexikon"
              className="btn-outline text-base sm:text-lg font-semibold px-7 sm:px-9 py-4 rounded-full border-black/[0.12] hover:border-[#E60A1C]/50 hover:bg-black/[0.05] transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              Steuer-Lexikon <ArrowRight size={20} className="flex-shrink-0" />
            </Link>
          </div>

          {/* Ad: hero banner (replaces the former trust badges) */}
          <AdUnit placement="homepage" className="!mt-8 sm:!mt-10 !mb-0" />
        </div>
      </section>

      {/* ── Calculator Section ───────────────────────────────────────── */}
      <section id="rechner" className="max-w-6xl mx-auto px-2.5 sm:px-5 mt-4 sm:-mt-16 pb-20 relative z-20 scroll-mt-24">
        <Calculator />
      </section>

      {/* ── Ad: right after the calculator result (high engagement / high CPM) ─ */}
      <AdUnit placement="homepage" />

      {/* ── Info Cards (Dark Tech Grid) ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-20 border-t border-black/[0.10]">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Wichtige Fakten
          </div>
          <h2 className="font-display text-display-md font-extrabold text-[#16181D]">Das sollten Sie wissen</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* ── How it works (3 Steps Dark Tech) ─────────────────────────── */}
      <section className="py-24 bg-[#F4F5F7] border-y border-black/[0.10] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E60A1C]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
              Anleitung
            </div>
            <h2 className="font-display text-display-md font-extrabold text-[#16181D]">In 3 Schritten zum Nettogehalt</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map(({ Icon, step, title, desc }) => (
              <div key={step} className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 hover:border-[#E60A1C]/50 hover:bg-[#F1F3F5] transition-all duration-300 relative group shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={26} className="text-[#E60A1C]" />
                  </div>
                  <span className="font-mono text-4xl font-black text-black/20 group-hover:text-black/40 transition-colors">{step}</span>
                </div>
                <h3 className="font-display text-2xl text-[#16181D] font-extrabold mb-3">{title}</h3>
                <p className="text-base sm:text-lg text-black/80 leading-relaxed font-normal">{desc}</p>
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
          <h2 className="font-display text-display-md font-extrabold text-[#16181D]">Alles über Brutto & Netto</h2>
        </div>
        <AccordionFaq faqs={faqs} />
      </section>

      {/* ── Alle Rechner (internal-link hub / HTML-sitemap for crawlers) ─ */}
      <section className="max-w-6xl mx-auto px-5 pt-8 pb-16 sm:pb-20 border-t border-black/[0.10]">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Alle Rechner
          </div>
          <h2 className="font-display text-display-md font-extrabold text-[#16181D]">Alle Rechner im Überblick</h2>
          <p className="text-black/70 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Über 30 kostenlose Rechner für Gehalt, Steuern und Sozialleistungen — alle aktuell für das Steuerjahr 2026/2027.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: "Gehaltsrechner", href: "/gehaltsrechner" },
            { label: "Lohnsteuerrechner", href: "/lohnsteuerrechner" },
            { label: "Einkommensteuer-Rechner", href: "/einkommensteuer-rechner" },
            { label: "Arbeitgeber-Rechner", href: "/arbeitgeber-brutto-netto-rechner" },
            { label: "Steuerklassenwechsel", href: "/steuerklassenwechsel-rechner" },
            { label: "Gehaltserhöhung-Rechner", href: "/gehaltserhoehung-rechner" },
            { label: "Jahresgehalt-Rechner", href: "/jahresgehalt-rechner" },
            { label: "Stundenlohn-Rechner", href: "/stundenlohn-rechner" },
            { label: "Netto zu Brutto", href: "/rechner/netto-zu-brutto" },
            { label: "Brutto zu Netto", href: "/rechner/brutto-zu-netto" },
            { label: "Brutto-Netto-Tabelle", href: "/brutto-netto-gehaltstabelle" },
            { label: "Brutto Netto Rechner 2026", href: "/brutto-netto-rechner-2026" },
            { label: "Brutto Netto Rechner 2027", href: "/brutto-netto-rechner-2027" },
            { label: "Teilzeitrechner", href: "/teilzeitrechner" },
            { label: "Minijob-Rechner", href: "/minijob-rechner" },
            { label: "Werkstudent-Rechner", href: "/werkstudent-rechner" },
            { label: "Firmenwagenrechner", href: "/firmenwagenrechner" },
            { label: "Abfindungsrechner", href: "/abfindungsrechner" },
            { label: "Bonus-Steuerrechner", href: "/bonus-steuerrechner" },
            { label: "Weihnachtsgeld-Rechner", href: "/weihnachtsgeld-rechner" },
            { label: "Rentenrechner", href: "/rentenrechner" },
            { label: "Elterngeld-Rechner", href: "/elterngeld-rechner" },
            { label: "Arbeitslosengeld-Rechner", href: "/arbeitslosengeld-rechner" },
            { label: "Kurzarbeitergeld-Rechner", href: "/kurzarbeitergeld-rechner" },
            { label: "Krankengeld-Rechner", href: "/krankengeld-rechner" },
            { label: "Bürgergeld-Rechner", href: "/buergergeld-rechner" },
            { label: "Witwenrente-Rechner", href: "/witwenrente-rechner" },
            { label: "BAföG-Rechner", href: "/bafoeg-rechner" },
            { label: "Pendlerpauschale-Rechner", href: "/pendlerpauschale-rechner" },
            { label: "Steuerklassen", href: "/steuerklassen" },
            { label: "Mindestlohn 2026/2027", href: "/mindestlohn" },
            { label: "Pfändungstabelle 2026", href: "/pfaendungstabelle" },
            { label: "Steuer-Lexikon", href: "/lexikon" },
            { label: "Häufige Fragen (FAQ)", href: "/faq" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between gap-2 bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.10] hover:border-[#E60A1C]/50 rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#16181D] shadow-sm transition-all"
            >
              <span className="truncate">{label}</span>
              <ArrowRight size={14} className="text-[#E60A1C] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Ready CTA Banner (Like PromptKing Screenshot) ─────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-8 sm:pb-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#FFFFFF] via-[#F1F3F5] to-[#FFFFFF] p-8 sm:p-14 border border-black/[0.12] overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center sm:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/20 px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={14} /> Kostenloser Rechner
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#16181D] mb-3 tracking-tight">
              Bereit für Ihre exakte Gehaltsberechnung?
            </h3>
            <p className="text-black/85 text-base sm:text-lg leading-relaxed font-normal">
              Ohne Anmeldung, 100% anonym und nach den offiziellen Vorgaben des BMF für das Steuerjahr 2026/2027.
            </p>
          </div>
          <a
            href="#rechner"
            className="relative z-10 btn-primary flex-shrink-0 text-base sm:text-lg font-bold px-8 sm:px-9 py-4 rounded-full transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Jetzt berechnen <ArrowRight size={20} className="flex-shrink-0" />
          </a>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-8 sm:pb-10">
        <div className="flex items-start gap-4 bg-[#F4F5F7] rounded-3xl p-6 sm:p-8 border border-black/[0.10] text-sm sm:text-base text-black/80 leading-relaxed shadow-lg">
          <AlertTriangle size={22} className="flex-shrink-0 mt-0.5 text-[#E60A1C]" />
          <p>
            <strong className="text-[#16181D] font-bold">Stand: Juli 2026.</strong> Alle Berechnungen ohne Gewähr.
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
    <div className="bg-[#FFFFFF] hover:bg-[#F1F3F5] relative rounded-3xl border border-black/[0.10] p-8 overflow-hidden transition-all duration-300 hover:border-[#E60A1C]/50 hover:-translate-y-1 shadow-lg group">
      {/* Top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E60A1C] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#E60A1C]/15 border border-[#E60A1C]/30 group-hover:scale-110 transition-transform"
      >
        <Icon size={26} className="text-[#E60A1C]" />
      </div>
      <h3 className="font-display font-extrabold text-[#16181D] mb-3 text-xl">{title}</h3>
      <p className="text-base text-black/80 leading-relaxed font-normal">{text}</p>
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
