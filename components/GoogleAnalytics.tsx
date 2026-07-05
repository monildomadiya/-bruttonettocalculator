"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function GoogleAnalytics({ gaId = "G-FY0K5KT32H" }: { gaId?: string }) {
  const pathname = usePathname();
  
  // Do NOT render or execute Google Analytics on admin dashboard or API routes!
  const isAdminOrApi = pathname?.startsWith("/admin") || pathname?.startsWith("/api");

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
