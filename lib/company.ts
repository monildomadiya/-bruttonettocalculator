/**
 * Anbieterdaten — eine Quelle für Impressum und Organization-Schema.
 *
 * Warum zentral: Bis 08/2026 standen die Angaben nur im Impressum-Markup, und
 * das Organization-Schema kannte gar keine Adresse. Zwei Orte, an denen
 * dieselbe Angabe auseinanderlaufen kann, sind einer zu viel — Google gleicht
 * Impressum und strukturierte Daten gegeneinander ab.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  ACHTUNG — HIER STEHEN NOCH PLATZHALTER.                             │
 * │                                                                      │
 * │  "Musterstraße 10, 10115 Berlin" ist keine Adresse, sondern das      │
 * │  deutsche Äquivalent zu "123 Sample Street". Das hat zwei Folgen:    │
 * │                                                                      │
 * │  1. RECHTLICH: § 5 DDG (früher § 5 TMG) verlangt eine ladungsfähige  │
 * │     Anschrift und den Namen des Anbieters. Ein fehlerhaftes          │
 * │     Impressum ist in Deutschland ein klassischer Abmahngrund und     │
 * │     kann bußgeldbewehrt sein. Publiziert die Seite redaktionelle     │
 * │     Inhalte — der Ratgeber tut das —, verlangt § 18 Abs. 2 MStV      │
 * │     zusätzlich einen namentlich benannten Verantwortlichen mit       │
 * │     Anschrift.                                                       │
 * │                                                                      │
 * │  2. SEO: Für ein YMYL-Thema (Geld/Steuern) bewertet Google, ob ein   │
 * │     realer, überprüfbarer Betreiber dahintersteht. Eine erkennbare   │
 * │     Platzhalter-Adresse untergräbt genau das Signal — und ohne echte │
 * │     Adresse ist auch kein Eintrag in Verzeichnissen möglich, also    │
 * │     keine Zitationen, also kein Off-Page-Fundament.                  │
 * │                                                                      │
 * │  ZU TUN: Die mit PLATZHALTER markierten Felder durch die echten      │
 * │  Angaben ersetzen. Danach `isPlaceholder` auf false setzen — dann    │
 * │  verschwindet der Warnhinweis auf der Impressum-Seite und die Daten  │
 * │  fließen ins Organization-Schema.                                    │
 * └──────────────────────────────────────────────────────────────────────┘
 */

export interface CompanyInfo {
  /** Name des Anbieters (natürliche Person oder Firma laut Register). */
  legalName: string;
  /** Tätigkeitsbeschreibung, wie im Impressum ausgewiesen. */
  businessDescription: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  countryCode: string;
  email: string;
  /** Optional — nur angeben, wenn tatsächlich vorhanden. */
  phone?: string;
  /** USt-IdNr. nach § 27a UStG. Leer lassen, wenn keine erteilt wurde. */
  vatId?: string;
  /** Nach § 18 Abs. 2 MStV: benannte natürliche Person mit Anschrift. */
  editoriallyResponsible: string;
  /**
   * Solange true, weist die Impressum-Seite sichtbar darauf hin, dass die
   * Angaben unvollständig sind, und die Adresse wandert NICHT ins
   * Organization-Schema. Lieber eine ehrliche Lücke als eine erfundene
   * Angabe in den strukturierten Daten — Letzteres ist derselbe Fehler wie
   * der frühere erfundene Prüfer.
   */
  isPlaceholder: boolean;
}

export const company: CompanyInfo = {
  legalName: "BruttoNettoCalculator.com", // PLATZHALTER — echter Anbietername fehlt
  businessDescription: "Redaktion & Online-Entwicklungsdienstleistungen",
  streetAddress: "Musterstraße 10", // PLATZHALTER
  postalCode: "10115", // PLATZHALTER
  city: "Berlin", // PLATZHALTER
  country: "Deutschland",
  countryCode: "DE",
  email: "info@bruttonettocalculator.com",
  phone: undefined,
  vatId: undefined,
  editoriallyResponsible: "Redaktionsleitung BruttoNettoCalculator", // PLATZHALTER — Name fehlt
  isPlaceholder: true,
};

/** Einzeilige Anschrift für Fließtext. */
export function addressLine(): string {
  return `${company.streetAddress}, ${company.postalCode} ${company.city}`;
}

/**
 * PostalAddress fürs Organization-Schema — aber nur, wenn die Daten echt sind.
 * Eine Platzhalter-Adresse in strukturierten Daten ist eine überprüfbare
 * Falschangabe, kein Vertrauenssignal.
 */
export function postalAddressSchema() {
  if (company.isPlaceholder) return undefined;
  return {
    "@type": "PostalAddress",
    streetAddress: company.streetAddress,
    postalCode: company.postalCode,
    addressLocality: company.city,
    addressCountry: company.countryCode,
  };
}
