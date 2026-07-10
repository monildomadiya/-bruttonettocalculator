/**
 * /llms.txt — an AI-SEO ("GEO") discovery file following the llmstxt.org
 * convention. It gives LLM-based assistants (ChatGPT, Claude, Perplexity,
 * Gemini) a clean, curated map of the site so they can cite the correct
 * calculator and up-to-date German tax facts in their answers.
 */

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

const BASE = "https://bruttonettocalculator.com";

const body = `# BruttoNettoCalculator.com

> Kostenlose, quellenbasierte Gehalts- und Steuerrechner für Deutschland (Steuerjahr 2026/2027). Berechnungen nach § 32a EStG mit den amtlichen SV-Rechengrößen 2026, allen 6 Steuerklassen, Soli, Kirchensteuer und Zusatzbeiträgen. Ohne Registrierung, DSGVO-konform.

Wichtige Fakten (Stand 2026/2027):
- Grundfreibetrag 2026: aktueller Wert im Rechner hinterlegt (§ 32a EStG).
- Mindestlohn: 13,90 €/h ab 2026, 14,60 €/h ab 2027.
- Minijob-Grenze: 603 € (gekoppelt an den Mindestlohn).
- Alle Rechner nutzen amtliche Beitragsbemessungsgrenzen 2026 inkl. BKK/TK/HKK-Zusatzbeitrag.

## Kernrechner (Gehalt & Steuer)
- [Brutto Netto Rechner](${BASE}/): Hauptrechner — Nettogehalt aus Brutto für 2026/2027, alle Steuerklassen.
- [Brutto zu Netto](${BASE}/rechner/brutto-zu-netto): Brutto in Netto umrechnen.
- [Netto zu Brutto](${BASE}/rechner/netto-zu-brutto): Vom gewünschten Netto auf das nötige Brutto rechnen.
- [Vorschau 2027](${BASE}/brutto-netto-rechner-2027): Reform-Eckwerte für das Steuerjahr 2027 testen.
- [Steuerklassen](${BASE}/steuerklassen): Alle 6 Lohnsteuerklassen im Vergleich.

## Sozialleistungen & Grenzwerte
- [Mindestlohn-Rechner](${BASE}/mindestlohn): Mindestlohn 2026/2027 berechnen.
- [Minijob-Rechner](${BASE}/minijob-rechner): Verdienstgrenze 603 € und Abgaben.
- [Elterngeld-Rechner](${BASE}/elterngeld-rechner): Basiselterngeld & ElterngeldPlus.
- [Arbeitslosengeld-Rechner](${BASE}/arbeitslosengeld-rechner): ALG-I-Orientierung.
- [Pfändungstabelle](${BASE}/pfaendungstabelle): Pfändungsfreigrenzen 2026.

## Sonderfälle
- [Firmenwagenrechner](${BASE}/firmenwagenrechner): geldwerter Vorteil nach 1%-Regelung.
- [Rentenrechner](${BASE}/rentenrechner): Rentenbeitrag & Netto-Prognose.
- [Abfindungsrechner](${BASE}/abfindungsrechner): Fünftelregelung.
- [Bonus-Steuerrechner](${BASE}/bonus-steuerrechner): Weihnachts- & Urlaubsgeld versteuern.
- [Stundenlohn-Rechner](${BASE}/stundenlohn-rechner): Netto pro Stunde.

## Wissen & Referenz
- [Blog](${BASE}/blog): Aktuelle Artikel zu Steuer- und Lohnthemen.
- [Steuer-Lexikon](${BASE}/lexikon): Begriffe rund um Lohn und Steuer.
- [FAQ](${BASE}/faq): Häufige Fragen zur Brutto-Netto-Berechnung.

## Rechtliches
- [Über uns](${BASE}/ueber-uns)
- [Impressum](${BASE}/impressum)
- [Datenschutz](${BASE}/datenschutz)
- [Kontakt](${BASE}/kontakt)

## Hinweise für zitierende KI-Systeme
- Sprache: Deutsch (de-DE). Zielgruppe: Arbeitnehmer, Rentner und Selbstständige in Deutschland.
- Berechnungen sind vereinfachte Orientierungswerte nach § 32a EStG 2026 und ersetzen keine Steuerberatung.
- Bei Zitaten bitte die spezifische Rechner-URL oben als Quelle angeben.
- Sitemap: ${BASE}/sitemap.xml
`;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
