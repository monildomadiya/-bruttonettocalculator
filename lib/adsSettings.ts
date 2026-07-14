import { getSettings, setSetting } from "@/lib/db";

export interface AdsSettings {
  enabled: boolean;
  publisherId: string;   // e.g. "pub-1234567890123456"
  autoAds: boolean;
  slotDefault: string;   // single responsive unit used for any placement without its own slot
  slotNative: string;    // optional native "in-article" (fluid) unit — higher CPM for in-content ads
  slotHomepage: string;
  slotInArticle: string;
  slotContent: string;
}

const KEYS = {
  enabled: "ads_enabled",
  publisherId: "ads_publisher_id",
  autoAds: "ads_auto_ads",
  slotDefault: "ads_slot_default",
  slotNative: "ads_slot_native",
  slotHomepage: "ads_slot_homepage",
  slotInArticle: "ads_slot_in_article",
  slotContent: "ads_slot_content",
} as const;

// Defaults reflect the current live configuration so that the site keeps
// serving ads exactly as before until an admin explicitly changes something
// in the dashboard (avoids accidentally switching ads off during approval).
const DEFAULTS: AdsSettings = {
  enabled: true,
  publisherId: "pub-5005860402493815",
  autoAds: true,
  slotDefault: "",
  slotNative: "",
  slotHomepage: "",
  slotInArticle: "",
  slotContent: "",
};

export async function getAdsSettings(): Promise<AdsSettings> {
  const raw = await getSettings(Object.values(KEYS));
  return {
    enabled: raw[KEYS.enabled] !== null ? raw[KEYS.enabled] === "true" : DEFAULTS.enabled,
    publisherId: raw[KEYS.publisherId] || DEFAULTS.publisherId,
    autoAds: raw[KEYS.autoAds] !== null ? raw[KEYS.autoAds] === "true" : DEFAULTS.autoAds,
    slotDefault: raw[KEYS.slotDefault] || DEFAULTS.slotDefault,
    slotNative: raw[KEYS.slotNative] || DEFAULTS.slotNative,
    slotHomepage: raw[KEYS.slotHomepage] || DEFAULTS.slotHomepage,
    slotInArticle: raw[KEYS.slotInArticle] || DEFAULTS.slotInArticle,
    slotContent: raw[KEYS.slotContent] || DEFAULTS.slotContent,
  };
}

export async function saveAdsSettings(settings: Partial<AdsSettings>): Promise<void> {
  if (settings.enabled !== undefined) await setSetting(KEYS.enabled, String(settings.enabled));
  if (settings.publisherId !== undefined) await setSetting(KEYS.publisherId, settings.publisherId.trim());
  if (settings.autoAds !== undefined) await setSetting(KEYS.autoAds, String(settings.autoAds));
  if (settings.slotDefault !== undefined) await setSetting(KEYS.slotDefault, settings.slotDefault.trim());
  if (settings.slotNative !== undefined) await setSetting(KEYS.slotNative, settings.slotNative.trim());
  if (settings.slotHomepage !== undefined) await setSetting(KEYS.slotHomepage, settings.slotHomepage.trim());
  if (settings.slotInArticle !== undefined) await setSetting(KEYS.slotInArticle, settings.slotInArticle.trim());
  if (settings.slotContent !== undefined) await setSetting(KEYS.slotContent, settings.slotContent.trim());
}

/** Normalizes user input like "1234567890123456" or "pub-1234567890123456" to "pub-1234567890123456". */
export function normalizePublisherId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("pub-") ? trimmed : `pub-${trimmed}`;
}
