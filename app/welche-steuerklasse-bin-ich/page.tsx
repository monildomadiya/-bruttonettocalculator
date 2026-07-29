import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight, Scale, FileText, Landmark, HelpCircle, ArrowRight,
  CheckCircle2, Users, Baby, Briefcase, User, Heart, HeartHandshake,
} from "lucide-react";
import SteuerklassenFinder from "@/components/SteuerklassenFinder";
import ReviewerByline from "@/components/ReviewerByline";

const CANONICAL = "https://bruttonettocalculator.com/welche-steuerklasse-bin-ich";

export const metadata: Metadata = {
  title: "Welche Steuerklasse bin ich? Finder & Test 2026",
  description:
    "Welche Steuerklasse bin ich? In 3 Fragen zur Antwort: Ledige haben Klasse I, Alleinerziehende II, Verheiratete wählen III/V oder IV/IV, Zweitjobs laufen über VI. Mit interaktivem Finder & Netto-Vorschau 2026.",
  keywords: [
    "welche steuerklasse bin ich",
    "welche steuerklasse habe ich",
    "steuerklasse herausfinden",
    "wo steht meine steuerklasse",
    "steuerklasse test",
    "steuerklassen finder",
    "steuerklasse ledig",
    "steuerklasse verheiratet",
    "steuerklasse alleinerziehend",
    "steuerklasse zweitjob",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Welche Steuerklasse bin ich? — Interaktiver Finder 2026",
    description:
      "Beantworten Sie 3 kurze Fragen und erfahren Sie sofort Ihre Steuerklasse — inklusive Netto-Vorschau 2026 und Wechsel-Tipps.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "Welche Steuerklasse bin ich? Finder & Test 2026",
    description:
      "In 3 Fragen zur eigenen Steuerklasse — interaktiver Finder mit Netto-Vorschau 2026.",
  },
};

// Visible FAQs + FAQPage schema. Deliberately different questions from
// /steuerklassen (that page covers married combinations in depth) — this page
// answers the identity question "welche Steuerklasse bin ich / wo steht sie".
const faqs = [
  {
    q: "Welche Steuerklasse bin ich, wenn ich ledig bin?",
    a: "Ledige, geschiedene und dauernd getrennt lebende Arbeitnehmer sind automatisch in Steuerklasse I. Lebt ein Kind mit Kindergeldanspruch in Ihrem Haushalt und Sie erziehen allein, steht Ihnen auf Antrag Steuerklasse II mit dem Entlastungsbetrag für Alleinerziehende (4.260 € pro Jahr) zu.",
  },
  {
    q: "Wo kann ich sehen, welche Steuerklasse ich habe?",
    a: "Ihre aktuelle Steuerklasse steht auf jeder Gehaltsabrechnung (Feld \"StKl\" oder \"Steuerklasse\", meist oben bei den persönlichen Abrechnungsmerkmalen). Alternativ sehen Sie sie in Ihrem ELSTER-Konto unter \"Auskunft zur elektronischen Lohnsteuerkarte (ELStAM)\" oder erfragen sie direkt beim Finanzamt.",
  },
  {
    q: "Welche Steuerklasse habe ich nach der Hochzeit?",
    a: "Nach der Heirat werden beide Partner automatisch in die Kombination IV/IV eingestuft. Auf Antrag beim Finanzamt können Sie in III/V wechseln (lohnt sich, wenn ein Partner deutlich mehr verdient) oder in IV/IV mit Faktorverfahren, das Nachzahlungen vermeidet.",
  },
  {
    q: "Welche Steuerklasse habe ich als Alleinerziehende?",
    a: "Alleinerziehende mit mindestens einem kindergeldberechtigten Kind im Haushalt erhalten auf Antrag Steuerklasse II. Der Entlastungsbetrag beträgt 4.260 € jährlich plus 240 € für jedes weitere Kind. Ohne Antrag bleiben Sie in Steuerklasse I und verschenken monatlich Netto.",
  },
  {
    q: "Welche Steuerklasse gilt bei zwei Jobs?",
    a: "Ihr Hauptjob läuft über Ihre reguläre Steuerklasse (I bis V). Jeder weitere sozialversicherungspflichtige Job wird über Steuerklasse VI abgerechnet — ohne Grundfreibetrag und mit den höchsten Abzügen. Ein Minijob bis 603 € ist davon ausgenommen, er bleibt pauschal besteuert.",
  },
  {
    q: "Kann ich meine Steuerklasse frei wählen?",
    a: "Nur Verheiratete und eingetragene Lebenspartner haben eine Wahl: III/V, IV/IV oder IV/IV mit Faktor. Der Wechsel ist seit 2023 mehrmals pro Jahr möglich (Antrag beim Finanzamt bis 30. November, z. B. über ELSTER). Ledige, Alleinerziehende und Verwitwete werden gesetzlich zugeordnet.",
  },
];

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
        { "@type": "ListItem", position: 2, name: "Steuerklassen", item: "https://bruttonettocalculator.com/steuerklassen" },
        { "@type": "ListItem", position: 3, name: "Welche Steuerklasse bin ich?", item: CANONICAL },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Welche Steuerklasse bin ich? — Interaktiver Finder 2026",
      description:
        "Interaktiver Steuerklassen-Finder: In 3 Fragen zur eigenen Steuerklasse, mit Netto-Vorschau 2026 und Wechsel-Tipps für Verheiratete.",
      isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
      breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
    },
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

// Compact "who is in which class" reference — the direct answer for scanners & AI answers.
const classOverview = [
  { nr: "I", icon: User, who: "Ledig, geschieden, dauernd getrennt lebend oder länger verwitwet — ohne Kind im Haushalt", note: "Standardklasse für Alleinstehende" },
  { nr: "II", icon: Baby, who: "Alleinerziehende mit mindestens einem kindergeldberechtigten Kind im Haushalt", note: "Entlastungsbetrag 4.260 € / Jahr — nur auf Antrag" },
  { nr: "III", icon: Heart, who: "Verheiratete, deren Partner Klasse V wählt — sinnvoll für den deutlich besser Verdienenden", note: "Geringster monatlicher Abzug" },
  { nr: "IV", icon: Users, who: "Verheiratete mit ähnlichem Einkommen (Standard nach der Hochzeit)", note: "Optional mit Faktorverfahren" },
  { nr: "V", icon: Heart, who: "Verheiratete, deren Partner Klasse III wählt — der Zweitverdiener", note: "Höchste monatliche Abzüge, Vorteil liegt beim Partner" },
  { nr: "VI", icon: Briefcase, who: "Zweiter und jeder weitere sozialversicherungspflichtige Job", note: "Ohne Freibeträge — Ausgleich über die Steuererklärung" },
];

export default function WelcheSteuerklassePage() {
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Breadcrumb Nav */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <Link href="/steuerklassen" className="hover:text-[#16181D] transition-colors">Steuerklassen</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Welche Steuerklasse bin ich?</span>
      </div>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Scale size={14} /> Interaktiver Finder · § 38b EStG
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">Welche Steuerklasse</span> bin ich?
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Die Kurzantwort: <strong className="text-[#16181D]">Ledige haben Steuerklasse I</strong>,{" "}
          <strong className="text-[#16181D]">Alleinerziehende II</strong>, <strong className="text-[#16181D]">Verheiratete
          wählen zwischen III/V, IV/IV und IV mit Faktor</strong> — und ein <strong className="text-[#16181D]">Zweitjob läuft
          immer über VI</strong>. Beantworten Sie unten 3 kurze Fragen, und der Finder nennt Ihnen Ihre Steuerklasse
          inklusive Netto-Vorschau für 2026.
        </p>
        <ReviewerByline />
      </div>

      {/* The interactive finder — the unique tool none of the big portals offer */}
      <div className="mb-16" id="finder">
        <SteuerklassenFinder />
      </div>

      {/* Wo steht meine Steuerklasse? */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Wo steht meine Steuerklasse?
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Sie müssen nicht raten — an diesen drei Stellen können Sie Ihre aktuelle Steuerklasse direkt nachsehen:
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: FileText,
              title: "Gehaltsabrechnung",
              text: "Auf jeder Lohn-/Gehaltsabrechnung im Kopfbereich, meist als Feld \"StKl\" oder \"Steuerklasse\" bei den persönlichen Abrechnungsmerkmalen.",
            },
            {
              icon: Landmark,
              title: "ELSTER (ELStAM)",
              text: "Im ELSTER-Konto unter \"Auskunft zur elektronischen Lohnsteuerkarte (ELStAM)\" sehen Sie Ihre gemeldete Steuerklasse und alle Freibeträge.",
            },
            {
              icon: HelpCircle,
              title: "Finanzamt",
              text: "Ihr zuständiges Finanzamt gibt telefonisch oder schriftlich Auskunft — dort beantragen Sie auch Wechsel (z. B. II als Alleinerziehende oder III/V nach der Hochzeit).",
            },
          ].map((c) => (
            <div key={c.title} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 shadow-sm">
              <span className="w-11 h-11 rounded-xl bg-[#E60A1C]/10 border border-[#E60A1C]/25 flex items-center justify-center text-[#E60A1C] mb-4">
                <c.icon size={20} />
              </span>
              <h3 className="font-bold text-[#16181D] mb-2">{c.title}</h3>
              <p className="text-sm text-black/70 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overview: who belongs where */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Alle 6 Steuerklassen: Wer gehört wohin?
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Die Zuordnung folgt § 38b EStG. Nur Verheiratete haben eine echte Wahlmöglichkeit — alle anderen Klassen
          ergeben sich aus der Lebenssituation.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {classOverview.map((c) => (
            <div key={c.nr} className="flex items-start gap-4 bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
              <span className="w-11 h-11 rounded-xl bg-[#16181D] text-white flex items-center justify-center font-display font-black text-lg shrink-0">
                {c.nr}
              </span>
              <div>
                <p className="text-sm sm:text-base text-black/85 leading-snug font-medium">{c.who}</p>
                <p className="text-xs text-black/55 mt-1.5 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#E60A1C] shrink-0" /> {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href="/steuerklassen"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            Ausführlicher Steuerklassen-Vergleich mit Netto-Beispielen <ArrowRight size={14} />
          </Link>
          <Link
            href="/steuerklassenwechsel-rechner"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            <HeartHandshake size={14} className="text-[#E60A1C]" /> Steuerklassenwechsel-Rechner für Paare <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zur eigenen Steuerklasse
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer list-none hover:bg-black/[0.03] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronRight size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 sm:px-6 pb-5 pt-1 text-black/70 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
