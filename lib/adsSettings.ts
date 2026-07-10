import { getSettings, setSetting } from "@/lib/db";

export interface AdsSettings {
  enabled: boolean;
  publisherId: string;   // e.g. "pub-1234567890123456"
  autoAds: boolean;
  slotHomepage: string;
  slotInArticle: string;
}

const KEYS = {
  enabled: "ads_enabled",
  publisherId: "ads_publisher_id",
  autoAds: "ads_auto_ads",
  slotHomepage: "ads_slot_homepage",
  slotInArticle: "ads_slot_in_article",
} as const;

const DEFAULTS: AdsSettings = {
  enabled: false,
  publisherId: "",
  autoAds: true,
  slotHomepage: "",
  slotInArticle: "",
};

export async function getAdsSettings(): Promise<AdsSettings> {
  const raw = await getSettings(Object.values(KEYS));
  return {
    enabled: raw[KEYS.enabled] === "true",
    publisherId: raw[KEYS.publisherId] || DEFAULTS.publisherId,
    autoAds: raw[KEYS.autoAds] !== null ? raw[KEYS.autoAds] === "true" : DEFAULTS.autoAds,
    slotHomepage: raw[KEYS.slotHomepage] || DEFAULTS.slotHomepage,
    slotInArticle: raw[KEYS.slotInArticle] || DEFAULTS.slotInArticle,
  };
}

export async function saveAdsSettings(settings: Partial<AdsSettings>): Promise<void> {
  if (settings.enabled !== undefined) await setSetting(KEYS.enabled, String(settings.enabled));
  if (settings.publisherId !== undefined) await setSetting(KEYS.publisherId, settings.publisherId.trim());
  if (settings.autoAds !== undefined) await setSetting(KEYS.autoAds, String(settings.autoAds));
  if (settings.slotHomepage !== undefined) await setSetting(KEYS.slotHomepage, settings.slotHomepage.trim());
  if (settings.slotInArticle !== undefined) await setSetting(KEYS.slotInArticle, settings.slotInArticle.trim());
}

/** Normalizes user input like "1234567890123456" or "pub-1234567890123456" to "pub-1234567890123456". */
export function normalizePublisherId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("pub-") ? trimmed : `pub-${trimmed}`;
}
