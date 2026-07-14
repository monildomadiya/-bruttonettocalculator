"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface AdsSettings {
  enabled: boolean;
  publisherId: string; // stored as "pub-XXXXXXXXXXXXXXXX"
  autoAds: boolean;
  slotDefault: string; // single responsive unit used for any placement without its own slot
  slotHomepage: string;
  slotInArticle: string;
  slotContent: string;
}

const AdsContext = createContext<AdsSettings | null>(null);

/** Read the current ad settings (null until loaded). */
export function useAds(): AdsSettings | null {
  return useContext(AdsContext);
}

/** Normalizes "pub-XXXX" → "ca-pub-XXXX" as expected by the AdSense loader/units. */
export function toClientId(publisherId: string): string {
  if (!publisherId) return "";
  return publisherId.startsWith("ca-") ? publisherId : `ca-${publisherId}`;
}

/**
 * Fetches the admin-managed ad configuration once and shares it with the
 * AdSense loader and every <AdUnit> via context, so the whole ads system is
 * controlled from /admin-secure/ads without any code change.
 */
export default function AdsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdsSettings | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/settings/ads")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (active && data?.success && data.settings) {
          setSettings(data.settings as AdsSettings);
        }
      })
      .catch(() => {
        /* network/DB issue — silently skip ads rather than break the page */
      });
    return () => {
      active = false;
    };
  }, []);

  return <AdsContext.Provider value={settings}>{children}</AdsContext.Provider>;
}
