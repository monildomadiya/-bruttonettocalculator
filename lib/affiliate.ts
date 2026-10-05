/**
 * Affiliate-Partnerlinks. Jeder Platzhalter rendert NICHTS, solange hier
 * `null` steht — es gibt keine leeren Kästen und keine Platzhalter-Links.
 *
 * Partner eintragen: `href` (Tracking-Link des Partners), `partner` (Name, wird
 * angezeigt), `text` (ein Satz, was der Nutzer dort tun kann). Die Box zeigt
 * automatisch "Anzeige" und setzt `rel="sponsored noopener"`.
 */
export interface AffiliateLink {
  href: string;
  partner: string;
  text: string;
  /** Beschriftung des Knopfs, z. B. "Kassen vergleichen". */
  cta: string;
}

export const AFFILIATE_LINKS: Record<"krankenkassenVergleich" | "steuererklaerung", AffiliateLink | null> = {
  /** /zusatzbeitrag-2027 */
  krankenkassenVergleich: null,
  /** /abfindungsrechner */
  steuererklaerung: null,
};
