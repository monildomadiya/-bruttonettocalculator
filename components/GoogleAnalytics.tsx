"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function GoogleAnalytics({ gaId = "G-FY0K5KT32H" }: { gaId?: string }) {
  const pathname = usePathname();
  
  // No Analytics on internal routes, and none inside the embeddable widget:
  // /widget promises embedders "keine Werbe- oder Tracking-Skripte" — the
  // iframe runs on third-party sites whose visitors never consented to us.
  const isAdminOrApi =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/api") ||
    pathname?.startsWith("/embed");

  useEffect(() => {
    if (!isAdminOrApi && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, isAdminOrApi, gaId]);

  if (isAdminOrApi) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
