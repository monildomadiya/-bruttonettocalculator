/**
 * hreflang-Cluster der Brutto-Netto-Rechner (gleiche Funktion, verschiedene
 * Sprachen, alle rechnen deutsches Recht → Region DE). Muss auf JEDER Seite
 * des Clusters identisch stehen und in sitemap.ts gespiegelt werden — sonst
 * ignoriert Google die Annotationen (fehlende Rückverweise).
 */
const BASE = "https://bruttonettocalculator.com";

export const LANGUAGE_CLUSTER: Record<string, string> = {
  "de-DE": `${BASE}/`,
  "en-DE": `${BASE}/en/tax-calculator-germany`,
  "pl-DE": `${BASE}/pl/kalkulator-brutto-netto-niemcy`,
  "ro-DE": `${BASE}/ro/calculator-salariu-germania`,
  "tr-DE": `${BASE}/tr/almanya-maas-hesaplama`,
  "uk-DE": `${BASE}/uk/kalkuliator-zarplaty-nimechchyna`,
  "x-default": `${BASE}/`,
};
