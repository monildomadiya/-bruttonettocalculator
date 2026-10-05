import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield, ArrowRight, ChevronDown,
  FileText, TrendingUp, Building2,
  MousePointerClick, SlidersHorizontal, Wallet,
  AlertTriangle, Sparkles, ArrowLeftRight, Scale,
} from "lucide-react";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import { ORG_ID } from "@/lib/seo";
import SupportButton from "@/components/SupportButton";
import LatestPosts from "@/components/LatestPosts";
import TableOfContents from "@/components/TableOfContents";
import { LANGUAGE_CLUSTER } from "@/lib/expat/cluster";
import { calculateNetto, formatEUR, GRUNDFREIBETRAG, ARBEITNEHMER_PAUSCHBETRAG, KINDERGELD, BBG_2026, SV_RECHENGROESSEN_2027_ENTWURF } from "@/lib/taxCalculator";
import { pageImageUrl } from "@/lib/pageImage";
import { WAGE_STATS_2026 } from "@/data/wage-stats";
import { standardSteuerjahr, istWeihnachtsgeldSaison } from "@/lib/steuerjahr2027";

// Eigenes Stand-Datum der Startseite. Sie ist die rankende URL für
// "brutto netto rechner 2027" und wird öfter inhaltlich aktualisiert als der Rest
// der Seite (siteConfig.lastUpdatedISO). Speist sichtbares Datum + dateModified;
// bei echten Inhaltsänderungen hier UND in CONTENT_UPDATED[""] (app/sitemap.ts) anheben.
const STARTSEITE_STAND = { iso: "2026-10-05", display: "5. Oktober 2026" };

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2026/2027 — Gehaltsrechner kostenlos",
  description:
    "Kostenloser Brutto Netto Rechner 2026/2027: Nettogehalt sofort berechnen — Lohnsteuer, Soli & alle 6 Steuerklassen. Mit Firmenwagen- & Rentenrechner, ohne Anmeldung.",
  alternates: {
    canonical: "https://bruttonettocalculator.com/",
    languages: LANGUAGE_CLUSTER,
  },
  openGraph: {
    images: [pageImageUrl("/")],
    title: "Brutto Netto Rechner 2026/2027 — Gehaltsrechner Deutschland kostenlos",
    description:
      "Kostenloser Brutto Netto Rechner 2026/2027: Nettogehalt sofort berechnen — Lohnsteuer, Soli & alle 6 Steuerklassen. Mit Firmenwagen- & Rentenrechner, ohne Anmeldung.",
    url: "https://bruttonettocalculator.com",
    locale: "de_DE",
    type: "website",
  },
};

/*
 * Kein eigenes `revalidate`: Das Root-Layout setzt bereits `revalidate = 3600`
 * (ISR, stündlich). Deshalb springt das Standard-Steuerjahr des Rechners
 * (`standardSteuerjahr()`) am 1.1.2027 binnen einer Stunde ohne Deploy auf 2027,
 * und der saisonale Weihnachtsgeld-Hinweis verschwindet im Januar von selbst.
 * Siehe lib/steuerjahr2027.ts.
 */

// Reformbeispiele für die FAQ, direkt aus der Engine (SK I, kinderlos, ohne KiSt,
// Sozialabgaben auf dem Stand 2026 — also reiner Steuereffekt).
const reformPlus = (brutto: number) => {
  const basis = { bruttoMonat: brutto, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 as const };
  return calculateNetto({ ...basis, jahr: 2027 }).nettoMonat - calculateNetto({ ...basis, jahr: 2026 }).nettoMonat;
};
const eur2 = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const reform3000 = reformPlus(3000);
const reform5000 = reformPlus(5000);
// "brutto netto rechner 2027" wird von Google teils als Betrag gelesen ("Wie viel Netto
// bleibt von 2027 Brutto?" in den Weiteren Fragen). Die FAQ beantwortet diese Lesart mit Engine-Werten.
const netto2027Euro = (jahr: 2026 | 2027, kirche: boolean) =>
  calculateNetto({ bruttoMonat: 2027, jahr, verheiratet: false, kinderlosUeber23: true, kirche, steuerklasse: 1 }).nettoMonat;
// Ab welchem Brutto (50-€-Raster) kostet der BMAS-Entwurf der BBG mehr, als die Steuerreform bringt?
const svKippBrutto = (() => {
  for (let brutto = 3000; brutto <= 12000; brutto += 50) {
    const basis = { bruttoMonat: brutto, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 as const };
    const plus = calculateNetto({ ...basis, jahr: 2027, sv2027: "entwurf" }).nettoMonat - calculateNetto({ ...basis, jahr: 2026 }).nettoMonat;
    if (plus < 0) return brutto;
  }
  return 12000;
})();

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
    a: "Die Hauptabzüge sind: Lohnsteuer (Einkommensteuer), Solidaritätszuschlag, ggf. Kirchensteuer sowie die Arbeitnehmeranteile zur Renten- (9,3 %), Kranken- (ca. 8,75 %), Pflege- (1,8 % oder 2,4 % ohne Kinder) und Arbeitslosenversicherung (1,3 %).",
  },
  {
    q: "Was ist der Unterschied zwischen den Steuerklassen?",
    a: "Deutschland hat 6 Steuerklassen: I (ledig), II (Alleinerziehende), III (Verheiratete, höheres Einkommen), IV (Verheiratete, gleiches Einkommen), V (Verheiratete, geringeres Einkommen), VI (Zweiter Job). Steuerklasse III zahlt am wenigsten, VI am meisten Lohnsteuer.",
  },
  {
    q: "Sind die Werte für 2027 schon final?",
    a: `Noch nicht. Die Bundesregierung hat am 2. September 2026 den Gesetzentwurf zur Steuerreform 2027 beschlossen; seit dem 28. September liegt er dem Bundestag als Drucksache 21/8235 vor. Dieser Rechner verwendet für 2027 die Werte des Entwurfs — Grundfreibetrag ${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} €, Arbeitnehmer-Pauschbetrag ${ARBEITNEHMER_PAUSCHBETRAG.reform.toLocaleString("de-DE")} €, Kindergeld ${KINDERGELD.entwurf2027} €. Verbindlich werden sie erst nach Bundestag und Bundesrat; die Sozialabgaben 2027 rechnet er bis zum Beschluss der Rechengrößen mit den Werten 2026.`,
  },
  {
    q: "Wie hoch ist der Spitzensteuersatz 2026?",
    a: "Der Spitzensteuersatz von 42 % greift ab einem zu versteuernden Einkommen von 69.879 €. Die sogenannte Reichensteuer von 45 % gilt ab 277.826 €.",
  },
  {
    q: "Kann ich diesen Rechner als Brutto Netto Rechner 2027 nutzen?",
    a: `Ja. Stellen Sie oben im Rechner das Steuerjahr von 2026 auf 2027 um: Die Lohnsteuer folgt dann dem Gesetzentwurf zur Steuerreform (Grundfreibetrag ${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} €, Arbeitnehmer-Pauschbetrag ${ARBEITNEHMER_PAUSCHBETRAG.reform.toLocaleString("de-DE")} €). Für die Sozialabgaben wählen Sie unter „Sozialabgaben 2027“ zwischen dem Stand 2026 und den höheren Beitragsbemessungsgrenzen aus dem BMAS-Entwurf. Der Rechner zeigt das Netto 2027 direkt neben dem Wert für 2026.`,
  },
  {
    q: "Ab wann gilt der Brutto Netto Rechner 2027?",
    a: "Die Werte 2027 gelten für Gehälter, die ab dem 1. Januar 2027 gezahlt werden. Schon jetzt können Sie im Rechner das Steuerjahr 2027 wählen und Ihr Netto vorab berechnen. Ab dem 1. Januar 2027 ist 2027 hier automatisch voreingestellt. Sobald das Gesetz zur Steuerreform verkündet ist und die Rechengrößen-Verordnung 2027 vorliegt, ersetzen wir die vorläufigen Werte durch die endgültigen.",
  },
  {
    q: "Wie viel mehr Netto bringt die Steuerreform 2027?",
    a: `Wenig: Nach dem Gesetzentwurf bleiben bei 3.000 € brutto in Steuerklasse I rund ${eur2(reform3000)} € und bei 5.000 € rund ${eur2(reform5000)} € mehr netto im Monat (kinderlos, ohne Kirchensteuer, Sozialabgaben auf dem Stand 2026). Steigen 2027 wie im BMAS-Entwurf vorgesehen die Beitragsbemessungsgrenzen, zahlen Gutverdiener mehr Sozialabgaben. Ab rund ${svKippBrutto.toLocaleString("de-DE")} € brutto bleibt dann insgesamt weniger netto als 2026.`,
  },
  {
    q: "Wie viel netto sind 2.027 € brutto?",
    a: `Bei 2.027 € brutto im Monat bleiben 2026 in Steuerklasse I rund ${eur2(netto2027Euro(2026, false))} € netto (kinderlos, ohne Kirchensteuer, durchschnittlicher Zusatzbeitrag der Krankenkasse). Mit 9 % Kirchensteuer sind es rund ${eur2(netto2027Euro(2026, true))} €. Im Jahr 2027 steigt das Netto nach dem Gesetzentwurf zur Steuerreform auf rund ${eur2(netto2027Euro(2027, false))} € (Sozialabgaben auf dem Stand 2026). Für eine andere Steuerklasse oder mit Kindern geben Sie 2.027 € einfach oben in den Rechner ein.`,
  },
  {
    q: "Warum sind die Werte für 2027 vorläufig?",
    a: "Weil die maßgeblichen Regeln noch nicht verkündet sind. Steuertarif, Grundfreibetrag und Arbeitnehmer-Pauschbetrag stammen aus dem Regierungsentwurf, den Bundestag und Bundesrat noch beschließen müssen. Die Beitragsbemessungsgrenzen 2027 stehen bisher nur in einem Referentenentwurf des BMAS. Den durchschnittlichen Zusatzbeitrag 2027 gibt das Bundesgesundheitsministerium bis zum 1. November 2026 bekannt. Endgültig sind schon der Mindestlohn von 14,60 € und die Minijob-Grenze von 633 €.",
  },
  {
    q: "Gilt das Tool auch als Gehaltsrechner mit Auto (Firmenwagenrechner & 1%-Regelung)?",
    a: "Ein Firmenwagen stellt einen geldwerten Vorteil dar, der das monatliche Bruttogehalt erhöht (meist über die 1%-Regelung). Als praktischer Firmenwagenrechner bzw. Gehaltsrechner mit Auto können Sie Ihren geldwerten Vorteil einfach zu Ihrem regulären Bruttolohn addieren und die voraussichtliche Lohnsteuer- sowie Sozialabgabenlast sofort online abschätzen.",
  },
  {
    q: "Kann ich das Tool auch als Arbeitslosengeld Rechner zur Orientierung verwenden?",
    a: "Ja. Das amtliche Arbeitslosengeld I (ALG I) beträgt in Deutschland 60 % (bzw. 67 % mit Kind) Ihres durchschnittlichen Nettoentgelts der letzten 12 Monate. Sie können unseren Gehaltsrechner ideal als Orientierungs-Arbeitslosengeld Rechner nutzen, indem Sie Ihr bisheriges Brutto eingeben und 60 % bzw. 67 % vom errechneten Nettogehalt ermitteln.",
  },
  {
    q: "Was ist der GKV-Zusatzbeitrag 2026 und wie beeinflusst er das Nettogehalt?",
    a: "Der vom Bundesgesundheitsministerium für 2026 festgelegte durchschnittliche Zusatzbeitragssatz der gesetzlichen Krankenkassen (GKV) beträgt 2,9 %. Ihre konkrete Krankenkasse (z. B. BKK, HKK oder TK) kann einen höheren oder niedrigeren Satz erheben. Unser Rechner verwendet den durchschnittlichen Satz von 2,9 % als Standardwert — der individuelle Kassensatz kann davon abweichen.",
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
    a: "Die Pfändungstabelle 2026 (§ 850c ZPO) legt den pfändungsfreien Betrag des Nettoeinkommens fest. Für Alleinstehende ohne Unterhaltspflicht liegt der monatliche Pfändungsfreibetrag 2026 bei 1.491,75 € netto. Unser Gehaltsrechner hilft Ihnen, zunächst Ihr voraussichtliches Nettoeinkommen zu ermitteln, damit Sie die Pfändungstabelle 2026 korrekt anwenden können.",
  },
  {
    q: "Wie hoch ist das Durchschnittsgehalt in Deutschland 2026?",
    a: `Laut Destatis verdienten Vollzeitbeschäftigte im April 2025 im Durchschnitt ${WAGE_STATS_2026.averageGrossMonthly.toLocaleString("de-DE")} € brutto im Monat (ohne Sonderzahlungen); das mittlere Gehalt (Median) lag bei ${WAGE_STATS_2026.medianGrossMonthly.toLocaleString("de-DE")} €. In Steuerklasse I bleiben 2026 vom Durchschnittsgehalt rund ${Math.round(calculateNetto({ bruttoMonat: WAGE_STATS_2026.averageGrossMonthly, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 }).nettoMonat).toLocaleString("de-DE")} € netto (kinderlos, ohne Kirchensteuer). Mit dem Rechner oben ermitteln Sie das Netto für jeden anderen Betrag.`,
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
    text:  "Stellen Sie im Rechner das Steuerjahr auf 2027: Er rechnet dann mit dem Gesetzentwurf zur Steuerreform (Grundfreibetrag 12.564 €) und zeigt, was 2027 netto übrig bleibt.",
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
    desc:  "Der Rechner ermittelt in Echtzeit Ihr voraussichtliches Nettogehalt, Lohnsteuer und alle Sozialabgaben.",
  },
];

/* ── Structured Data (JSON-LD) ───────────────────────────────────────── */
// Mirrors the visible "In 3 Schritten zum Nettogehalt" section (same `steps` array).
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "In 3 Schritten zum Nettogehalt",
  description:
    "So berechnen Sie Ihr Nettogehalt 2026/2027 mit dem Brutto-Netto-Rechner: Bruttogehalt eingeben, Steuerklasse wählen, Netto sofort ablesen.",
  totalTime: "PT1M",
  step: steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.desc,
  })),
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  "name": "Brutto Netto Rechner Deutschland 2026/2027",
  "url": "https://bruttonettocalculator.com",
  "description": "Präziser Brutto Netto Rechner für Deutschland. Gehaltsberechnung nach § 32a EStG für das Steuerjahr 2026/2027 mit allen 6 Steuerklassen, BKK/TK Zusatzbeitrag 2026, Mindestlohn 2027, Firmenwagen (1%-Regelung) und Rentenrechner.",
  // Honest authorship/review signals: content is produced and reviewed by the
  // site's editorial team (Organization node in the global @graph), not a named
  // individual. See lib/authors.ts for why no personal reviewer is claimed.
  dateModified: STARTSEITE_STAND.iso,
  lastReviewed: STARTSEITE_STAND.iso,
  reviewedBy: { "@id": ORG_ID },
  author: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
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

// Ohne "€" in den Zellen (steht im Kopf/Fußtext): vier Spalten passen so auch bei 375 px ohne Querscrollen.
const eurZahl = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Netto 2026 ↔ 2027 für den Antwortblock — direkt aus der Rechen-Engine.
// Zwei 2027-Spalten: nur Steuerreform (Sozialabgaben Stand 2026) und zusätzlich
// die Beitragsbemessungsgrenzen aus dem BMAS-Entwurf. Ab rund 6.000 € brutto
// dreht das Vorzeichen — die "2027 weniger netto"-Frage, die Finanztip & Co.
// gerade aufgreifen, beantwortet der Block so selbst.
const netto2027Zeilen = [2500, 3800, 5000, 7000].map((brutto) => {
  const basis = { bruttoMonat: brutto, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 as const };
  const n2026 = calculateNetto({ ...basis, jahr: 2026 }).nettoMonat;
  const n2027 = calculateNetto({ ...basis, jahr: 2027 }).nettoMonat;
  const n2027Sv = calculateNetto({ ...basis, jahr: 2027, sv2027: "entwurf" }).nettoMonat;
  return { brutto, n2026, n2027, plus: n2027 - n2026, n2027Sv, plusSv: n2027Sv - n2026 };
});
const zeile3800 = netto2027Zeilen.find((z) => z.brutto === 3800)!;
const zeile7000 = netto2027Zeilen.find((z) => z.brutto === 7000)!;
const eurRund = (n: number) => Math.round(Math.abs(n)).toLocaleString("de-DE");

export default function HomePage() {
  return (
    <>
      {/* ── Hero (Inspired by Dark Tech Reference) ──────────────────── */}
      <section className="hero-bg pb-8 sm:pb-28 px-4 sm:px-5 relative">
        <div className="w-full max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">

          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-[#FFFFFF] border border-black/[0.12] rounded-full px-4 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-8 animate-fade-up max-w-[95vw]">
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
            {/* H1 trägt die Jahre: Die Startseite ist die Ziel-URL für
                "brutto netto rechner 2027" (siehe Kommentar am Antwortblock #netto-2027). */}
            <span className="text-gradient-accent">Brutto Netto Rechner</span>
            <span className="text-[#16181D]"> 2026 &amp; 2027 für Deutschland</span>
          </h1>

          {/* Sub-headline — kurz halten: Der Rechner soll auf dem Handy möglichst
              ohne Scrollen sichtbar sein. Die frühere Aufzählung fett gesetzter
              Keywords ("auch als Lohnrechner 2027, Firmenwagenrechner, …") schob
              ihn unter den Falz und las sich wie Keyword-Stuffing. */}
          <p
            className="text-base sm:text-lg md:text-xl text-black/80 w-full max-w-3xl leading-relaxed mb-6 sm:mb-8 animate-fade-up font-normal px-2"
            style={{ animationDelay: "160ms" }}
          >
            Nettogehalt in Sekunden berechnen — mit Lohnsteuer, Solidaritätszuschlag, Kirchensteuer
            und allen Sozialabgaben für alle sechs Steuerklassen. Offizielle Werte 2026, für 2027
            mit dem Gesetzentwurf zur Steuerreform.
          </p>

          <p className="-mt-3 sm:-mt-5 mb-5 sm:mb-7 text-xs sm:text-sm text-black/60 font-medium animate-fade-up px-2">
            Aktualisiert am <time dateTime={STARTSEITE_STAND.iso}>{STARTSEITE_STAND.display}</time> · 2027 nach
            Regierungsentwurf (BT-Drs. 21/8235)
          </p>

          <TableOfContents
            centered
            className="mb-4 sm:mb-6 text-left"
            items={[
              { id: "netto-2027", label: "Netto 2027" },
              { id: "wissen", label: "Das sollten Sie wissen" },
              { id: "gehaelter", label: "Beliebte Gehälter" },
              { id: "schritte", label: "In 3 Schritten" },
              { id: "steuerklassen-kombi", label: "III/V oder IV/IV?" },
              { id: "faq", label: "Häufige Fragen" },
              { id: "alle-rechner", label: "Alle Rechner" },
            ]}
          />

          {/* CTA buttons — nur ab sm: Mobil steht der Rechner direkt darunter, ein
              "Jetzt berechnen"-Sprungknopf schob ihn nur unter den Falz. */}
          <div
            className="hidden sm:flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-4 sm:mb-8 animate-fade-up w-full sm:w-auto px-4 sm:px-0"
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

        </div>
      </section>

      {/* ── Calculator Section ───────────────────────────────────────── */}
      <section id="rechner" className="max-w-6xl mx-auto px-2.5 sm:px-5 mt-4 sm:-mt-16 pb-20 relative z-20 scroll-mt-24">
        <Calculator initialJahr={standardSteuerjahr()} />

        {/* Quick-intent links: surface adjacent tools at the moment of intent (SXO) */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {/* Ankertext bewusst NICHT "Brutto Netto Rechner 2027": Für diese Suche
              rankt die Startseite selbst (GSC 23.–29.9.2026: Pos. 1,9). Der
              Exact-Match-Chip vom 30.9. ließ Google stattdessen die Fachseite
              wählen (4.10.: Fachseite #3, Startseite #13). Die Fachseite bedient
              die Reform-Frage — siehe app/brutto-netto-rechner-2027/page.tsx. */}
          <Link
            href="/brutto-netto-rechner-2027"
            className="group inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-[#E60A1C]/40 hover:border-[#E60A1C]/70 rounded-full px-5 py-2.5 text-sm font-bold text-[#16181D] shadow-sm transition-all"
          >
            <Sparkles size={16} className="text-[#E60A1C]" /> Steuerreform 2027: wie viel mehr Netto?
          </Link>
          <Link
            href="/rechner/netto-zu-brutto"
            className="group inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.12] hover:border-[#E60A1C]/50 rounded-full px-5 py-2.5 text-sm font-bold text-[#16181D] shadow-sm transition-all"
          >
            <ArrowLeftRight size={16} className="text-[#E60A1C]" /> Netto → Brutto berechnen
          </Link>
          <Link
            href="/arbeitgeber-brutto-netto-rechner"
            className="group inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.12] hover:border-[#E60A1C]/50 rounded-full px-5 py-2.5 text-sm font-bold text-[#16181D] shadow-sm transition-all"
          >
            <Building2 size={16} className="text-[#E60A1C]" /> Arbeitgeberkosten berechnen
          </Link>
          <Link
            href="/steuerklassenwechsel-rechner"
            className="group inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.12] hover:border-[#E60A1C]/50 rounded-full px-5 py-2.5 text-sm font-bold text-[#16181D] shadow-sm transition-all"
          >
            <SlidersHorizontal size={16} className="text-[#E60A1C]" /> Steuerklassen vergleichen
          </Link>
        </div>

        {/* Saisonaler Hinweis Okt.–Dez. (lib/steuerjahr2027.ts): Weihnachtsgeld hat im
            November das 8- bis 10-fache Suchvolumen. Fester Platz unter den Chips,
            keine Layoutverschiebung — die Seite wird serverseitig gerendert. */}
        {istWeihnachtsgeldSaison() && (
          <Link
            href="/weihnachtsgeld-rechner"
            className="group mt-5 mx-auto max-w-2xl flex items-center justify-between gap-3 bg-[#FFF8E6] hover:bg-[#FFF1CC] border border-amber-500/40 rounded-2xl px-5 py-3.5 text-sm sm:text-base text-[#16181D] transition-colors"
          >
            <span>
              <strong>Weihnachtsgeld 2026:</strong> Wie viel bleibt netto? Zum Weihnachtsgeld-Rechner
            </span>
            <ArrowRight size={18} className="text-[#E60A1C] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

      </section>

      {/* ── Netto 2027 — Antwort auf "brutto netto rechner 2027" ──────────
          Die Startseite rankt selbst für die 2027-Suche (nicht die Fachseite).
          Dieser Block beantwortet sie direkt: ein zitierfähiger Satz plus eine
          Engine-Tabelle 2026 ↔ 2027 — Antwortmaschinen zitieren Tabellen. */}
      <section data-section="" id="netto-2027" className="max-w-6xl mx-auto px-5 pt-4 pb-12 sm:pb-16">
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-4 sm:p-10 shadow-sm">
          <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-3">
            <TrendingUp size={13} aria-hidden="true" /> Steuerjahr 2027
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] leading-tight">
            Brutto Netto Rechner 2027: So viel Netto bleibt 2027
          </h2>
          <p className="mt-3 text-sm sm:text-base text-black/75 leading-relaxed max-w-3xl">
            Ihr Netto für 2027 berechnen Sie oben im Rechner: Bruttogehalt eingeben und das Steuerjahr auf{" "}
            <strong className="text-[#16181D]">2027</strong> stellen. Gerechnet wird dann mit dem Gesetzentwurf zur
            Steuerreform (BT-Drucksache 21/8235): Grundfreibetrag{" "}
            {GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} € statt{" "}
            {GRUNDFREIBETRAG.amtlich2026.toLocaleString("de-DE")} €, Arbeitnehmer-Pauschbetrag{" "}
            {ARBEITNEHMER_PAUSCHBETRAG.reform.toLocaleString("de-DE")} €. Bei{" "}
            {zeile3800.brutto.toLocaleString("de-DE")} € brutto bleiben so rund {eurRund(zeile3800.plus)} € mehr
            im Monat. Kommen die höheren Beitragsbemessungsgrenzen aus dem BMAS-Entwurf, haben Gutverdiener 2027
            trotzdem <strong className="text-[#16181D]">weniger Netto</strong> — bei{" "}
            {zeile7000.brutto.toLocaleString("de-DE")} € brutto rund {eurRund(zeile7000.plusSv)} € im Monat.
            Beschlossen ist beides noch nicht.
          </p>
          <div className="mt-5 bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-base">
              <thead>
                <tr className="border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                  <th className="py-3 px-2 sm:px-4">Brutto (€)</th>
                  <th className="py-3 px-2 sm:px-4 text-right">Netto 2026</th>
                  <th className="py-3 px-2 sm:px-4 text-right">Netto 2027¹</th>
                  <th className="py-3 px-2 sm:px-4 text-right">Netto 2027²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {netto2027Zeilen.map((z) => (
                  <tr key={z.brutto}>
                    <td className="py-3 px-2 sm:px-4 font-mono font-bold text-[#16181D] whitespace-nowrap">{eurZahl(z.brutto)}</td>
                    <td className="py-3 px-2 sm:px-4 text-right font-mono whitespace-nowrap">{eurZahl(z.n2026)}</td>
                    {[z.plus, z.plusSv].map((plus, i) => (
                      <td key={i} className="py-3 px-2 sm:px-4 text-right font-mono whitespace-nowrap">
                        <span className="font-bold text-[#16181D]">{eurZahl(i === 0 ? z.n2027 : z.n2027Sv)}</span>
                        <span className={`block text-[11px] sm:text-xs ${plus >= 0 ? "text-emerald-700" : "text-[#E60A1C]"}`}>
                          {plus >= 0 ? "+" : "−"}
                          {eurZahl(Math.abs(plus))}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50 mt-3 leading-relaxed">
            Beträge in Euro pro Monat, Steuerklasse I, kinderlos, ohne Kirchensteuer; darunter die Differenz zu 2026.
            Lohnsteuer 2027 jeweils nach dem Gesetzentwurf. ¹ Sozialabgaben mit den amtlichen Werten 2026.
            ² Mit den Beitragsbemessungsgrenzen aus dem BMAS-Referentenentwurf vom 21.09.2026 (Beitragssätze wie 2026).
            Wie viel mehr Netto die Reform über alle Gehälter bringt und wie weit das Verfahren ist, zeigt der{" "}
            <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">
              Steuerreform-Rechner 2027
            </Link>
            .
          </p>

          <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mt-8 mb-3">
            Was ändert sich 2027 beim Nettogehalt?
          </h3>
          <ul className="space-y-2 text-sm sm:text-base text-black/75 leading-relaxed list-disc pl-5">
            <li>
              <strong className="text-[#16181D]">Grundfreibetrag und Tarif:</strong>{" "}
              {GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} € statt{" "}
              {GRUNDFREIBETRAG.amtlich2026.toLocaleString("de-DE")} €, Spitzensteuersatz 42 % ab 70.601 €, neu 47 % ab
              280.000 € zu versteuerndem Einkommen (Gesetzentwurf, vorläufig).{" "}
              <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">Zur Steuerreform 2027</Link>
            </li>
            <li>
              <strong className="text-[#16181D]">Beitragsbemessungsgrenzen:</strong> Kranken- und Pflegeversicherung{" "}
              {SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat.toLocaleString("de-DE")} € statt{" "}
              {(BBG_2026.kvPvJahr / 12).toLocaleString("de-DE", { minimumFractionDigits: 2 })} € im Monat, Rente{" "}
              {SV_RECHENGROESSEN_2027_ENTWURF.rvAlvBbgMonat.toLocaleString("de-DE")} € statt{" "}
              {(BBG_2026.rvAlvJahr / 12).toLocaleString("de-DE", { minimumFractionDigits: 2 })} € (BMAS-Entwurf).{" "}
              <Link href="/beitragsbemessungsgrenze-2027" className="text-[#E60A1C] font-semibold hover:underline">Beitragsbemessungsgrenze 2027</Link>
            </li>
            <li>
              <strong className="text-[#16181D]">Zusatzbeitrag:</strong> Den Durchschnitt für 2027 legt das
              Bundesgesundheitsministerium bis zum 1. November fest, die Kassen folgen im Dezember.{" "}
              <Link href="/zusatzbeitrag-2027" className="text-[#E60A1C] font-semibold hover:underline">Zusatzbeitrag 2027 aller Kassen</Link>
            </li>
            <li>
              <strong className="text-[#16181D]">Mindestlohn und Minijob:</strong> 14,60 € pro Stunde statt 13,90 €,
              Minijob-Grenze 633 € statt 603 € (beschlossen).{" "}
              <Link href="/blog/mindestlohn-2027" className="text-[#E60A1C] font-semibold hover:underline">Mindestlohn 2027</Link>
              {" · "}
              <Link href="/blog/minijob-2027" className="text-[#E60A1C] font-semibold hover:underline">Minijob 2027</Link>
            </li>
          </ul>

          <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mt-8 mb-3">
            Gehaltsrechner und Lohnrechner 2027
          </h3>
          <p className="text-sm sm:text-base text-black/75 leading-relaxed max-w-3xl">
            Ob Sie ihn Gehaltsrechner, Lohnrechner oder Nettorechner nennen: Für Monatsgehalt und Stundenlohn gilt
            dieselbe Rechnung. Wer nach Stunden bezahlt wird, rechnet den Lohn mit dem{" "}
            <Link href="/stundenlohn-rechner" className="text-[#E60A1C] font-semibold hover:underline">Stundenlohn-Rechner</Link>{" "}
            in ein Monatsbrutto um und stellt hier anschließend das Steuerjahr 2027 ein. Für ein Wunschnetto liefert
            der{" "}
            <Link href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">Netto-Brutto-Rechner</Link>{" "}
            das nötige Bruttogehalt.
          </p>
        </div>
      </section>

      {/* ── Info Cards (Dark Tech Grid) ─────────────────────────────── */}
      <section data-section="" className="max-w-6xl mx-auto px-5 py-20 border-t border-black/[0.10]">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Wichtige Fakten
          </div>
          <h2 id="wissen" className="font-display text-display-md font-extrabold text-[#16181D]">Das sollten Sie wissen</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* ── Beliebte Gehälter (exact-salary internal links) ──────────── */}
      <section data-section="" className="max-w-6xl mx-auto px-5 pt-4 pb-16 sm:pb-20">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <Wallet size={14} /> Beliebte Gehälter
          </div>
          <h2 id="gehaelter" className="font-display text-display-md font-extrabold text-[#16181D]">Beliebte Gehälter berechnen</h2>
          <p className="text-black/70 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Direkt zum fertig berechneten Nettogehalt für ein konkretes Bruttogehalt — mit allen 6 Steuerklassen für 2026.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1200, 2800, 3000, 3300, 3500, 4000, 4400, 5000].map((amount) => (
            <Link
              key={amount}
              href={`/rechner/${amount}-euro-brutto-netto`}
              className="group flex items-center justify-between gap-2 bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.10] hover:border-[#E60A1C]/50 rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#16181D] shadow-sm transition-all"
            >
              <span className="truncate">{amount.toLocaleString("de-DE")} € Brutto in Netto</span>
              <ArrowRight size={14} className="text-[#E60A1C] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link href="/brutto-netto-gehaltstabelle" className="text-sm font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1.5">
            Alle Beträge in der Brutto-Netto-Gehaltstabelle <ArrowRight size={14} />
          </Link>
        </p>
      </section>

      {/* ── Neueste Infografiken (renders nothing until the first post) ── */}
      <LatestPosts />

      {/* ── How it works (3 Steps Dark Tech) ─────────────────────────── */}
      <section data-section="" className="py-24 bg-[#F4F5F7] border-y border-black/[0.10] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E60A1C]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
              Anleitung
            </div>
            <h2 id="schritte" className="font-display text-display-md font-extrabold text-[#16181D]">In 3 Schritten zum Nettogehalt</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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

      {/* ── Steuerklassen-Kombination (comparison table for married couples) ── */}
      <section data-section="" className="max-w-6xl mx-auto px-5 pt-24 pb-8 sm:pb-10">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <Scale size={14} /> Für Ehepaare
          </div>
          <h2 id="steuerklassen-kombi" className="font-display text-display-md font-extrabold text-[#16181D]">Steuerklassen-Kombination: III/V oder IV/IV?</h2>
          <p className="text-black/70 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Verheiratete können zwischen drei Kombinationen wählen. Sie ändert nur die{" "}
            <strong className="text-[#16181D]">monatliche Verteilung</strong> — nicht die endgültige Jahressteuer.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-black/[0.10] shadow-lg">
          <table className="w-full text-left text-sm sm:text-base border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#F4F5F7] border-b border-black/[0.10]">
                <th className="px-5 py-4 font-display font-extrabold text-[#16181D]">Kombination</th>
                <th className="px-5 py-4 font-display font-extrabold text-[#16181D]">Passt für</th>
                <th className="px-5 py-4 font-display font-extrabold text-[#16181D]">Monatliches Netto</th>
                <th className="px-5 py-4 font-display font-extrabold text-[#16181D]">Steuererklärung</th>
              </tr>
            </thead>
            <tbody className="[&>tr]:border-b [&>tr]:border-black/[0.08] [&>tr:last-child]:border-0">
              <tr className="bg-[#FFFFFF]">
                <td className="px-5 py-4 font-bold text-[#16181D] whitespace-nowrap">III / V</td>
                <td className="px-5 py-4 text-black/80">Sehr <strong className="text-[#16181D]">ungleiche</strong> Gehälter (ca. 60/40 oder mehr)</td>
                <td className="px-5 py-4 text-black/80">Höchstes gemeinsames Netto <strong className="text-[#16181D]">jetzt</strong>: Partner in III zahlt am wenigsten, Partner in V am meisten Lohnsteuer.</td>
                <td className="px-5 py-4 text-black/80"><strong className="text-[#E60A1C]">Pflicht</strong>, oft mit Nachzahlung</td>
              </tr>
              <tr className="bg-[#FFFFFF]">
                <td className="px-5 py-4 font-bold text-[#16181D] whitespace-nowrap">IV / IV</td>
                <td className="px-5 py-4 text-black/80">Etwa <strong className="text-[#16181D]">gleich hohe</strong> Gehälter</td>
                <td className="px-5 py-4 text-black/80">Ausgewogen: jeder Partner wird wie ledig besteuert, nah an der späteren Jahressteuer.</td>
                <td className="px-5 py-4 text-black/80">Freiwillig, selten hohe Nachzahlung</td>
              </tr>
              <tr className="bg-[#FFFFFF]">
                <td className="px-5 py-4 font-bold text-[#16181D] whitespace-nowrap">IV / IV mit Faktor</td>
                <td className="px-5 py-4 text-black/80">Gehaltsunterschied, aber <strong className="text-[#16181D]">faire</strong> Aufteilung gewünscht</td>
                <td className="px-5 py-4 text-black/80">Am genauesten pro Person: der Splittingvorteil wird schon monatlich berücksichtigt.</td>
                <td className="px-5 py-4 text-black/80"><strong className="text-[#E60A1C]">Pflicht</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-start gap-3 bg-[#F4F5F7] rounded-2xl p-5 border border-black/[0.10] text-sm sm:text-base text-black/80 leading-relaxed">
          <Scale size={20} className="flex-shrink-0 mt-0.5 text-[#E60A1C]" />
          <p>
            <strong className="text-[#16181D]">Wichtig:</strong> Die{" "}
            <strong className="text-[#16181D]">Jahressteuer ist in allen Kombinationen gleich</strong>. Die Steuerklasse steuert nur,{" "}
            <em>wann</em> Sie zahlen: monatlich mehr Netto (III/V) bedeutet meist eine Nachzahlung, monatlich weniger (IV/IV) eher eine Erstattung. Der endgültige Ausgleich erfolgt über die Zusammenveranlagung in der Steuererklärung.
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/steuerklassenwechsel-rechner" className="text-sm font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1.5">
            Ihre Kombination exakt berechnen im Steuerklassenwechsel-Rechner <ArrowRight size={14} />
          </Link>
        </p>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────── */}
      <section data-section="" className="max-w-6xl mx-auto px-5 pt-24 pb-12 sm:pb-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            Häufige Fragen
          </div>
          <h2 id="faq" className="font-display text-display-md font-extrabold text-[#16181D]">Alles über Brutto & Netto</h2>
        </div>
        <AccordionFaq faqs={faqs} />
      </section>

      {/* ── Coffee section — the layout-level one is skipped on "/" (no
           related-tools block there); here the hub, CTA and disclaimer below
           keep it apart from the end-of-content ad. ─────────────────────── */}
      <SupportButton variant="story" lang="de" placement="page_inline" />

      {/* ── Alle Rechner (internal-link hub / HTML-sitemap for crawlers) ─ */}
      <section data-section="" className="max-w-6xl mx-auto px-5 pt-8 pb-16 sm:pb-20 border-t border-black/[0.10]">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Alle Rechner
          </div>
          <h2 id="alle-rechner" className="font-display text-display-md font-extrabold text-[#16181D]">Alle Rechner im Überblick</h2>
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
            { label: "Steuerreform-Rechner 2027", href: "/brutto-netto-rechner-2027" },
            { label: "Teilzeitrechner", href: "/teilzeitrechner" },
            { label: "Minijob-Rechner", href: "/minijob-rechner" },
            { label: "Werkstudent-Rechner", href: "/werkstudent-rechner" },
            { label: "Firmenwagenrechner", href: "/firmenwagenrechner" },
            { label: "Abfindungsrechner", href: "/abfindungsrechner" },
            { label: "Bonus-Steuerrechner", href: "/bonus-steuerrechner" },
            { label: "Weihnachtsgeld-Rechner", href: "/weihnachtsgeld-rechner" },
            { label: "Rentenrechner", href: "/rentenrechner" },
            { label: "Rentenpunkte-Rechner", href: "/rentenpunkte-rechner" },
            { label: "Riester-Rechner", href: "/riester-rechner" },
            { label: "Grundsicherung-Rechner", href: "/grundsicherung-rechner" },
            { label: "BAföG-Rückzahlung-Rechner", href: "/bafoeg-rueckzahlung-rechner" },
            { label: "Schonvermögen-Rechner", href: "/schonvermoegen-rechner" },
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

      {/* ── Ready CTA Banner ──────────────────────────────────────────── */}
      <section data-section="" className="max-w-6xl mx-auto px-5 pb-8 sm:pb-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#FFFFFF] via-[#F1F3F5] to-[#FFFFFF] p-8 sm:p-14 border border-black/[0.12] overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center sm:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/20 px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={14} /> Kostenloser Rechner
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#16181D] mb-3 tracking-tight">
              Bereit für Ihre Gehaltsberechnung?
            </h3>
            <p className="text-black/85 text-base sm:text-lg leading-relaxed font-normal">
              Ohne Anmeldung, 100% anonym und auf Basis der amtlichen Rechengrößen für das Steuerjahr 2026/2027.
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
      <section data-section="" className="max-w-6xl mx-auto px-5 pb-8 sm:pb-10">
        <div className="flex items-start gap-4 bg-[#F4F5F7] rounded-3xl p-6 sm:p-8 border border-black/[0.10] text-sm sm:text-base text-black/80 leading-relaxed shadow-lg">
          <AlertTriangle size={22} className="flex-shrink-0 mt-0.5 text-[#E60A1C]" />
          <p>
            <strong className="text-[#16181D] font-bold">Stand: {STARTSEITE_STAND.display}.</strong> Alle Berechnungen ohne Gewähr.
            Dieser Rechner ersetzt keine Steuerberatung. Grundlage: § 32a EStG (Fassung ab
            Veranlagungszeitraum 2026) sowie die Sozialversicherungs-Rechengrößen-Verordnung 2026; für
            2027 der Regierungsentwurf zur Steuerreform und der BMAS-Entwurf der Rechengrößen (vorläufig).
          </p>
        </div>
      </section>

      {/* ── JSON-LD ──────────────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
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
