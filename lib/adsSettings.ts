import { getSettings, setSetting } from "@/lib/db";

export interface AdsSettings {
  enabled: boolean;
  publisherId: string;   // e.g. "pub-1234567890123456"
  autoAds: boolean;
}

const KEYS = {
  enabled: "ads_enabled",
  publisherId: "ads_publisher_id",
  autoAds: "ads_auto_ads",
} as const;

// Defaults reflect the current live configuration so that the site keeps
// serving ads exactly as before until an admin explicitly changes something
// in the dashboard (avoids accidentally switching ads off during approval).
const DEFAULTS: AdsSettings = {
  enabled: true,
  publisherId: "pub-5005860402493815",
  autoAds: true,
};

export async function getAdsSettings(): Promise<AdsSettings> {
  const raw = await getSettings(Object.values(KEYS));
  return {
    enabled: raw[KEYS.enabled] !== null ? raw[KEYS.enabled] === "true" : DEFAULTS.enabled,
    publisherId: raw[KEYS.publisherId] || DEFAULTS.publisherId,
    autoAds: raw[KEYS.autoAds] !== null ? raw[KEYS.autoAds] === "true" : DEFAULTS.autoAds,
  };
}

export async function saveAdsSettings(settings: Partial<AdsSettings>): Promise<void> {
  if (settings.enabled !== undefined) await setSetting(KEYS.enabled, String(settings.enabled));
  if (settings.publisherId !== undefined) await setSetting(KEYS.publisherId, settings.publisherId.trim());
  if (settings.autoAds !== undefined) await setSetting(KEYS.autoAds, String(settings.autoAds));
}

/** Normalizes user input like "1234567890123456" or "pub-1234567890123456" to "pub-1234567890123456". */
export function normalizePublisherId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("pub-") ? trimmed : `pub-${trimmed}`;
}
