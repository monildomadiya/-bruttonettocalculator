import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Landmark, Table2, BookOpen, Gavel } from "lucide-react";
import EinkommensteuerRechner2027 from "./EinkommensteuerRechner2027";
import Section from "@/components/ui/Section";
import { ENTWURF, GRUNDFREIBETRAG } from "@/lib/taxCalculator";
import { LEGISLATION_STATUS } from "@/lib/config2027";
import { pageStand } from "@/lib/pageDates";
import { bruttoReihe, einkommensteuerVergleich, eurDe, eurDeSigned } from "@/lib/vergleich2027";
import { pageImageUrl } from "@/lib/pageImage";

/*
 * Einkommensteuer-Rechner 2027 — Ziel: „einkommensteuer 2027 rechner“ (Pos. 7,4;
 * bisher rankte dafür die Steuerreform-Seite mit falscher Suchintention),
 * „einkommensteuerrechner 2027“, „einkommensteuerreform 2027 rechner“.
 * Alle Werte aus den § 32a-Funktionen der Engine (lib/vergleich2027.ts).
 */

const PATH = "/einkommensteuer-rechner-2027";
const CANONICAL = `https://bruttonettocalculator.com${PATH}`;
const STAND = pageStand(PATH);
const TITLE = "Einkommensteuer-Rechner 2027 – Steuer 2026 vs. 2027 vs. 2028";
const DESCRIPTION =
  "Einkommensteuer 2027 berechnen: zvE eingeben, Grund- oder Splittingtarif wählen – Steuer, Durchschnitts- und Grenzsteuersatz 2026 vs. 2027 vs. 2028.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "einkommensteuer 2027 rechner",
    "einkommensteuerrechner 2027",
    "einkommensteuerreform 2027 rechner",
    "einkommensteuer 2027",
    "einkommensteuertabelle 2027",
    "splittingtabelle 2027",
    "grundfreibetrag 2027",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/** Tabellen: zvE 15.000–150.000 € in 5.000-€-Schritten, Grund- und Splittingtarif. */
const ZVE_ZEILEN = bruttoReihe(15000, 150000, 5000);
function tabelle(splitting: boolean) {
  return ZVE_ZEILEN.map((zve) => {
    const [a, b, c] = einkommensteuerVergleich(zve, splitting);
    return { zve, e26: a.est, e27: b.est, e28: c.est };
  });
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${CANONICAL}#app`,
      name: "Einkommensteuer-Rechner 2027",
      url: CANONICAL,
      description: DESCRIPTION,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      inLanguage: "de-DE",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      dateModified: STAND.iso,
      isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
      publisher: { "@id": "https://bruttonettocalculator.com/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
        { "@type": "ListItem", position: 2, name: "Einkommensteuer-Rechner 2027", item: CANONICAL },
      ],
    },
  ],
};

function EStTabelle({ splitting }: { splitting: boolean }) {
  const zeilen = tabelle(splitting);
  const name = splitting ? "Splittingtabelle" : "Grundtabelle";
  return (
    <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[640px]">
        <caption className="text-left px-3 pt-3 pb-2 text-sm font-bold text-[#16181D]">
          {name}: Einkommensteuer 2026, 2027 und 2028 ({splitting ? "zusammen veranlagt" : "einzeln veranlagt"})
        </caption>
        <thead>
          <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-[11px] font-mono uppercase tracking-wider text-black/70">
            <th scope="col" className="py-2.5 px-3">zvE / Jahr</th>
            <th scope="col" className="py-2.5 px-3 text-right">ESt 2026</th>
            <th scope="col" className="py-2.5 px-3 text-right">ESt 2027</th>
            <th scope="col" className="py-2.5 px-3 text-right">ESt 2028</th>
            <th scope="col" className="py-2.5 px-3 text-right border-l border-black/10">2027 vs. 2026</th>
            <th scope="col" className="py-2.5 px-3 text-right">2028 vs. 2026</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10 tabular-nums">
          {zeilen.map((z) => (
            <tr key={z.zve}>
              <th scope="row" className="py-2 px-3 font-mono font-bold text-[#16181D] whitespace-nowrap">{eurDe(z.zve)}</th>
              <td className="py-2 px-3 text-right font-mono whitespace-nowrap">{eurDe(z.e26)}</td>
              <td className="py-2 px-3 text-right font-mono font-bold whitespace-nowrap">{eurDe(z.e27)}</td>
              <td className="py-2 px-3 text-right font-mono whitespace-nowrap">{eurDe(z.e28)}</td>
              <td className="py-2 px-3 text-right font-mono whitespace-nowrap border-l border-black/10 text-emerald-700">{eurDeSigned(z.e27 - z.e26)}</td>
              <td className="py-2 px-3 text-right font-mono whitespace-nowrap text-emerald-700">{eurDeSigned(z.e28 - z.e26)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const de = (n: number) => n.toLocaleString("de-DE");

export default function EinkommensteuerRechner2027Page() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-16 pb-24 text-[#16181D] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-4 sm:mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Einkommensteuer-Rechner 2027</span>
      </nav>

      <header className="mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-4">
          <Landmark size={14} /> § 32a EStG · 2026 / 2027 / 2028
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 sm:mb-4">
          <span className="text-gradient-accent">Einkommensteuer-Rechner 2027:</span> Ihre Steuer nach der Reform
        </h1>
        <p className="text-base sm:text-xl text-black/80 max-w-4xl leading-relaxed">
          Zu versteuerndes Einkommen eingeben, Grund- oder Splittingtarif wählen: Der Rechner zeigt Ihre
          Einkommensteuer, den Soli, die Kirchensteuer sowie Durchschnitts- und Grenzsteuersatz für 2026, 2027 und
          2028 nebeneinander — 2027 und 2028 nach dem Gesetzentwurf zur Einkommensteuerreform.
        </p>
        <p className="mt-3 text-xs sm:text-sm text-black/60 font-medium">
          Aktualisiert am <time dateTime={STAND.iso}>{STAND.display}</time> · {LEGISLATION_STATUS.short}
        </p>
      </header>

      <div className="mb-10 sm:mb-14">
        <EinkommensteuerRechner2027 />
      </div>

      <Section
        id="tabelle"
        eyebrow="Tabelle"
        eyebrowIcon={Table2}
        title="Einkommensteuer 2026, 2027 und 2028 im Vergleich (Tabelle)"
        intro="Einkommensteuer pro Jahr ohne Soli und Kirchensteuer, zu versteuerndes Einkommen von 15.000 bis 150.000 € in 5.000-€-Schritten. 2027 und 2028 vorläufig nach dem Regierungsentwurf."
      >
        <div className="space-y-6">
          <EStTabelle splitting={false} />
          <EStTabelle splitting />
        </div>
        <p className="text-xs text-black/55 mt-3 leading-relaxed">
          Grundtabelle: Einzelveranlagung. Splittingtabelle: Zusammenveranlagung, das gemeinsame zvE ist in der ersten
          Spalte angegeben (§ 32a Abs. 5 EStG). Negative Werte = weniger Steuer als 2026.
        </p>
      </Section>

      <Section
        id="grundfreibetrag"
        eyebrow="Grundfreibetrag"
        eyebrowIcon={BookOpen}
        title={`Grundfreibetrag 2027: ${de(GRUNDFREIBETRAG.entwurf2027)} € (2028: ${de(GRUNDFREIBETRAG.stufe2028)} €)`}
        prose
      >
        <p>
          Bis zum Grundfreibetrag bleibt das zu versteuernde Einkommen steuerfrei. Er steigt nach dem Gesetzentwurf von{" "}
          {de(GRUNDFREIBETRAG.amtlich2026)} € (2026) auf <strong>{de(GRUNDFREIBETRAG.entwurf2027)} €</strong> im Jahr 2027
          und auf <strong>{de(GRUNDFREIBETRAG.stufe2028)} €</strong> im Jahr 2028; bei Zusammenveranlagung gilt jeweils
          das Doppelte ({de(GRUNDFREIBETRAG.entwurf2027 * 2)} € bzw. {de(GRUNDFREIBETRAG.stufe2028 * 2)} €).
        </p>
        <p>
          Der Grundfreibetrag sichert das steuerliche Existenzminimum. Weil der Tarif an ihm ansetzt, entlastet seine
          Anhebung jeden Steuerpflichtigen. Gleichzeitig ändert der Entwurf den oberen Tarif: Der Spitzensteuersatz von
          42 % beginnt erst bei 70.601 € (2026: 69.879 €), der Satz von 45 % schon ab 250.000 € (2026: 277.826 €), und
          ab 280.000 € gilt neu ein Satz von 47 %. Sehr hohe Einkommen zahlen deshalb ab 2027 mehr.
        </p>
      </Section>

      <Section id="lohnsteuer" eyebrow="Einordnung" eyebrowIcon={BookOpen} title="Einkommensteuer oder Lohnsteuer?" prose>
        <p>
          Die <strong>Einkommensteuer</strong> ist die Jahressteuer auf Ihr gesamtes zu versteuerndes Einkommen — sie
          wird mit der Steuererklärung endgültig festgesetzt. Die <strong>Lohnsteuer</strong> ist nur die Vorauszahlung
          darauf, die Ihr Arbeitgeber jeden Monat vom Gehalt einbehält. Sie wird nach Ihrer Steuerklasse aus dem
          Bruttolohn hochgerechnet, nach denselben Tarifformeln.
        </p>
        <p>
          Dieser Rechner beginnt beim zu versteuernden Einkommen, also nach Abzug von Werbungskosten,
          Sonderausgaben und Freibeträgen. Wenn Sie von Ihrem Bruttogehalt ausgehen, rechnet der{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto Netto Rechner</Link> Lohnsteuer
          und Sozialabgaben für 2026 und 2027.
        </p>
      </Section>

      <Section id="stand" eyebrow="Gesetzgebung" eyebrowIcon={Gavel} title="Stand des Gesetzes" prose>
        <p>
          <strong>{LEGISLATION_STATUS.short}.</strong> Die Werte für 2027 (Artikel 1) und 2028 (Artikel 2) stammen
          wörtlich aus dem {ENTWURF.langname} ({ENTWURF.drucksache}). Verbindlich werden sie erst, wenn Bundestag und
          Bundesrat zugestimmt haben und das Gesetz verkündet ist; bis dahin können sie sich noch ändern.
        </p>
        <p>
          Quelle:{" "}
          <a href={LEGISLATION_STATUS.quelle} target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] font-semibold hover:underline">
            {ENTWURF.drucksache} (PDF, Deutscher Bundestag)
          </a>
          . Wie viel mehr Netto die Reform beim Gehalt bringt, zeigt der{" "}
          <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">Steuerreform-Rechner 2027</Link>.
        </p>
      </Section>
    </div>
  );
}
