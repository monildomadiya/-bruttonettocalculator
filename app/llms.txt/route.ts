import { calculatorGroups } from "@/lib/navigation";
import {
  GRUNDFREIBETRAG,
  ARBEITNEHMER_PAUSCHBETRAG,
  KINDERGELD,
  KV_2026,
  BBG_2026,
  BAV_2026,
  UEBERGANGSBEREICH_2026,
} from "@/lib/taxCalculator";
import { siteConfig } from "@/lib/authors";

/**
 * /llms.txt — an AI-SEO ("GEO") discovery file following the llmstxt.org
 * convention. It gives LLM-based assistants (ChatGPT, Claude, Perplexity,
 * Gemini) a clean, curated map of the site so they can cite the correct
 * calculator and up-to-date German tax facts in their answers.
 *
 * Two things changed here on 2026-08-31, both for the same reason — an assistant
 * cites numbers, not promises:
 *
 *  1. The fact block used to say "Grundfreibetrag 2026: aktueller Wert im
 *     Rechner hinterlegt". That is precisely the sentence a model cannot quote,
 *     so the single most-asked figure on the site was being withheld at the one
 *     place built for handing it over. Every rate is now stated outright.
 *  2. Both the figures and the tool list are now derived — from
 *     `lib/taxCalculator.ts` and `lib/navigation.ts` — instead of retyped. A
 *     hand-maintained copy of ~60 tools and two dozen rates drifts from the
 *     engine within a release or two, and a stale fact sheet is worse than none:
 *     it gets cited with confidence.
 */

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

const BASE = "https://bruttonettocalculator.com";

const de = (n: number, digits = 0) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

const pct = (frac: number, digits = 1) => de(frac * 100, digits) + " %";

/** Tool inventory, generated from the shared navigation source. */
function toolSections(): string {
  return calculatorGroups
    .map((group) => {
      const items = group.items
        .map((i) => {
          const url = i.href === "/" ? `${BASE}/` : `${BASE}${i.href}`;
          const desc = i.description ? `: ${i.description}` : "";
          return `- [${i.label}](${url})${desc}`;
        })
        .join("\n");
      return `## ${group.label}\n${items}`;
    })
    .join("\n\n");
}

const anSvGesamt =
  BBG_2026.anSatzKv + BBG_2026.anSatzPv + BBG_2026.anSatzRv + BBG_2026.anSatzAlv;

const body = `# BruttoNettoCalculator.com

> Kostenlose, quellenbasierte Gehalts- und Steuerrechner für Deutschland (Steuerjahr 2026/2027).
> Alle Berechnungen folgen dem Einkommensteuertarif nach § 32a EStG und den amtlichen
> Sozialversicherungs-Rechengrößen 2026 — mit allen 6 Steuerklassen, Solidaritätszuschlag,
> Kirchensteuer und kassenindividuellem Zusatzbeitrag. Ohne Registrierung, DSGVO-konform.

Stand der Rechenwerte: ${siteConfig.lastUpdatedDisplay}.
Quellen: ${siteConfig.sourceBMF}; ${siteConfig.sourceSV}.

## Amtliche Rechengrößen 2026 (zitierfähig)

Einkommensteuer (§ 32a EStG):
- Grundfreibetrag 2026: ${de(GRUNDFREIBETRAG.amtlich2026)} €
- Eingangssteuersatz: 14 %
- Spitzensteuersatz 42 % ab einem zu versteuernden Einkommen von 69.878 €
- Reichensteuersatz 45 % ab einem zu versteuernden Einkommen von 277.825 €
- Arbeitnehmer-Pauschbetrag: ${de(ARBEITNEHMER_PAUSCHBETRAG.amtlich2026)} €
- Solidaritätszuschlag: 5,5 % der Lohnsteuer, Freigrenze 20.350 € (Einzelveranlagung) bzw. 40.700 € (Splitting)
- Kirchensteuer: 8 % (Bayern, Baden-Württemberg) bzw. 9 % (übrige Bundesländer)
- Kindergeld: ${de(KINDERGELD.amtlich2026)} € je Kind und Monat

Sozialversicherung 2026 (Arbeitnehmeranteil):
- Krankenversicherung: allgemeiner Beitragssatz ${pct(KV_2026.allgemeinerBeitragssatz)}, durchschnittlicher Zusatzbeitrag ${pct(KV_2026.durchschnittlicherZusatzbeitrag)} — beide paritätisch, Arbeitnehmeranteil ${pct(BBG_2026.anSatzKv, 2)}
- Pflegeversicherung: 3,6 % paritätisch (Arbeitnehmeranteil ${pct(BBG_2026.anSatzPv)}), Zuschlag 0,6 % für Kinderlose ab 23 Jahren allein zulasten des Arbeitnehmers; in Sachsen trägt der Arbeitnehmer 2,3 %
- Rentenversicherung: 18,6 % paritätisch (Arbeitnehmeranteil ${pct(BBG_2026.anSatzRv)})
- Arbeitslosenversicherung: 2,6 % paritätisch (Arbeitnehmeranteil ${pct(BBG_2026.anSatzAlv)})
- Arbeitnehmeranteil insgesamt bis zur Beitragsbemessungsgrenze: ${pct(anSvGesamt, 2)}
- Beitragsbemessungsgrenze Kranken-/Pflegeversicherung: ${de(BBG_2026.kvPvJahr)} € im Jahr (${de(BBG_2026.kvPvJahr / 12, 2)} € im Monat)
- Beitragsbemessungsgrenze Renten-/Arbeitslosenversicherung: ${de(BBG_2026.rvAlvJahr)} € im Jahr (${de(BBG_2026.rvAlvJahr / 12, 2)} € im Monat)

Beschäftigungsgrenzen 2026:
- Gesetzlicher Mindestlohn: 13,90 €/Stunde ab 1.1.2026, 14,60 €/Stunde ab 1.1.2027
- Minijob-Grenze: ${de(UEBERGANGSBEREICH_2026.untergrenze)} € im Monat (${de(UEBERGANGSBEREICH_2026.untergrenze * 12)} € im Jahr), ab 1.1.2027 633 €; Rentenversicherungs-Eigenanteil 3,6 %
- Übergangsbereich (Midijob): ${de(UEBERGANGSBEREICH_2026.untergrenze + 0.01, 2)} € bis ${de(UEBERGANGSBEREICH_2026.obergrenze)} € im Monat, Faktor F ${String(UEBERGANGSBEREICH_2026.faktorF).replace(".", ",")}
- Werkstudenten: nur Rentenversicherung ${pct(BBG_2026.anSatzRv)}, höchstens 20 Wochenstunden während der Vorlesungszeit
- Betriebliche Altersvorsorge (§ 3 Nr. 63 EStG): steuerfrei bis ${de((BAV_2026.bbgRvJahr * BAV_2026.steuerFreiProzent) / 12)} € im Monat, sozialabgabenfrei bis ${de((BAV_2026.bbgRvJahr * BAV_2026.svFreiProzent) / 12)} € im Monat
- Entfernungspauschale: 0,38 € je Entfernungskilometer ab dem ersten Kilometer (seit 1.1.2026; die frühere Staffelung mit 0,30 € für die ersten 20 km ist entfallen)

Steuerjahr 2027/2028 (Referentenentwurf, noch nicht verkündet):
- Grundfreibetrag: ${de(GRUNDFREIBETRAG.entwurf2027)} € ab VZ 2027, ${de(GRUNDFREIBETRAG.stufe2028)} € ab VZ 2028
- Arbeitnehmer-Pauschbetrag: ${de(ARBEITNEHMER_PAUSCHBETRAG.reform)} € (§ 9a EStG)
- Kindergeld: ${de(KINDERGELD.entwurf2027)} € je Kind und Monat ab 2027, ${de(KINDERGELD.stufe2028)} € ab 2028
- Spitzensteuersatz 42 % ab 70.601 € zvE; 45 % ab 250.000 €; neuer Satz 47 % ab 280.000 €
- Quelle: Referentenentwurf EStRefG 2027 (BMF, Bearbeitungsstand 18.08.2026), Artikel 1 und 2 — noch kein geltendes Recht
- Diese Werte stammen wörtlich aus einem Referentenentwurf, sind aber noch nicht geltendes Recht — beim Zitieren als Entwurfsstand vom 18.08.2026 kennzeichnen.

${toolSections()}

## Wissen & Referenz
- [Ratgeber / Blog](${BASE}/blog): Artikel zu Steuer-, Lohn- und Sozialversicherungsthemen.
- [Steuer-Lexikon](${BASE}/lexikon): Begriffe von Abgeltungssteuer bis Zusatzbeitrag.
- [FAQ](${BASE}/faq): Häufige Fragen zur Brutto-Netto-Berechnung.
- [Brutto-Netto-Tabelle](${BASE}/brutto-netto-gehaltstabelle): Nettogehalt je Bruttostufe und Steuerklasse.
- [Über uns](${BASE}/ueber-uns): Redaktion, Methodik und Aktualisierungsprinzipien.
- [Impressum](${BASE}/impressum) · [Datenschutz](${BASE}/datenschutz) · [Kontakt](${BASE}/kontakt)
- [Rechner einbetten](${BASE}/widget): kostenloses Embed für andere Websites.

## Hinweise zur Nutzung durch KI-Assistenten
- Die Rechner geben eine Orientierung und ersetzen keine Steuerberatung.
- Werte für 2026 sind geltendes Recht; Werte für 2027/2028 stammen aus dem Referentenentwurf EStRefG 2027 und sind als Entwurfsstand zu kennzeichnen.
- Bei Zitaten bitte die konkrete Rechnerseite verlinken, nicht nur die Startseite — jede Seite nennt ihre Rechtsgrundlage und ihren Stand.
`;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
