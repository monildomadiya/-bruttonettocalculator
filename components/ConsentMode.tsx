import { CMP_ACTIVE } from "@/lib/adsConfig";

/**
 * Google Consent Mode v2 defaults.
 *
 * Must run **before** any Google tag (AdSense loader, gtag.js) so the tags know
 * to start in a cookieless, non-personalised state and to queue their hits until
 * the CMP answers. Hence: a plain inline `<script>` rendered as the very first
 * element in `<body>`, ahead of the AdSense loader.
 *
 * What each signal does:
 *  - `ad_storage` / `analytics_storage` gate the advertising and analytics
 *    cookies themselves;
 *  - `ad_user_data` / `ad_personalization` are the two v2 additions — Google
 *    requires both for personalised ads in the EEA, and personalised inventory
 *    is what carries the higher CPC;
 *  - `wait_for_update` holds tags for 500 ms so a CMP that answers quickly is
 *    respected instead of being raced;
 *  - `ads_data_redaction` strips ad identifiers from network requests while
 *    consent is denied;
 *  - `url_passthrough` keeps `gclid`/campaign attribution working through the
 *    denied state, so measurement survives a refusal.
 *
 * Rendered only when a CMP is actually live (see `CMP_ACTIVE`) — defaults with
 * nothing to update them would permanently deny analytics storage.
 */
export default function ConsentMode() {
  if (!CMP_ACTIVE) return null;

  const js = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
 'ad_storage':'denied',
 'ad_user_data':'denied',
 'ad_personalization':'denied',
 'analytics_storage':'denied',
 'functionality_storage':'granted',
 'security_storage':'granted',
 'wait_for_update':500
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);`.trim();

  return <script id="consent-mode-default" dangerouslySetInnerHTML={{ __html: js }} />;
}
