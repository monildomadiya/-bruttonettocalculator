import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  webpack: (config) => {
    // Normalize the snapshot paths so that the bracket in [Light Mode]
    // doesn't trip up webpack's module resolution / casing on Windows.
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
    };
    return config;
  },
  async redirects() {
    return [
      // Broken legacy blog URL (missing the /blog/ segment) → correct article.
      // Was a hard 404 and the source of the broken canonical Semrush reported.
      {
        source: "/brutto-netto-rechner-2026-mindestlohn-2027",
        destination: "/blog/brutto-netto-rechner-2026-mindestlohn-2027",
        permanent: true,
      },
      // Salary hub moved to the keyword-aligned top-level route.
      {
        source: "/rechner/gehaltstabelle",
        destination: "/brutto-netto-gehaltstabelle",
        permanent: true,
      },
      {
        source: "/rechner",
        destination: "/",
        permanent: true,
      },
      // NOTE: /gehaltsrechner is now a dedicated ranking page — no longer redirected.
      {
        // Primary legacy URL called out in the SEO brief — force 301 (not 308).
        source: "/brutto-netto-rechner",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/netto-rechner",
        destination: "/",
        permanent: true,
      },
      // "lohnrechner" (40.5K/mo) is funneled to the dedicated Lohnsteuerrechner page.
      {
        source: "/lohnrechner",
        destination: "/lohnsteuerrechner",
        permanent: true,
      },
      {
        source: "/steuerklassen-vergleich",
        destination: "/steuerklassen",
        permanent: true,
      },
      {
        source: "/mindestlohn-rechner",
        destination: "/mindestlohn",
        permanent: true,
      },
      // ── Legacy short-URL routes from the pre-redesign build ──────────────
      // These paths do NOT exist in this app/ tree; they were served by the
      // old deployment. Mapped here so that once this build is live, any
      // still-indexed legacy URL or inbound link 301s to its current page
      // instead of 404ing. Every destination is a real, current route.
      // Explicit statusCode 301 (not Next's default 308) per the SEO brief.
      { source: "/netto-brutto",      destination: "/rechner/netto-zu-brutto",          statusCode: 301 },
      { source: "/stundenlohn",       destination: "/stundenlohn-rechner",              statusCode: 301 },
      { source: "/arbeitgeber",       destination: "/arbeitgeber-brutto-netto-rechner", statusCode: 301 },
      { source: "/minijob",           destination: "/minijob-rechner",                  statusCode: 301 },
      { source: "/firmenwagen",       destination: "/firmenwagenrechner",               statusCode: 301 },
      { source: "/pendlerpauschale",  destination: "/pendlerpauschale-rechner",         statusCode: 301 },
      { source: "/abfindung",         destination: "/abfindungsrechner",                statusCode: 301 },
      { source: "/kurzarbeitergeld",  destination: "/kurzarbeitergeld-rechner",         statusCode: 301 },
      { source: "/arbeitslosengeld",  destination: "/arbeitslosengeld-rechner",         statusCode: 301 },
      { source: "/krankengeld",       destination: "/krankengeld-rechner",              statusCode: 301 },
      { source: "/weihnachtsgeld",    destination: "/weihnachtsgeld-rechner",           statusCode: 301 },
      { source: "/elterngeld",        destination: "/elterngeld-rechner",               statusCode: 301 },
      { source: "/rente",             destination: "/rentenrechner",                    statusCode: 301 },
      { source: "/rentenpunkte",      destination: "/rentenrechner",                    statusCode: 301 },
      // No current equivalent — 301 to the closest relevant page rather than 404.
      { source: "/urlaubsgeld",       destination: "/bonus-steuerrechner",              statusCode: 301 },
      { source: "/schenkungssteuer",  destination: "/lexikon",                          statusCode: 301 },
      {
        source: "/pfandungstabelle",
        destination: "/pfaendungstabelle",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/admin-secure",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/admin-secure",
        permanent: false,
      },
      {
        source: "/wp-admin",
        destination: "/admin-secure",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply baseline security headers to every route.
        source: "/:path*",
        headers: [
          {
            // HSTS: force HTTPS for a year, including subdomains. No `preload`
            // — that requires an explicit submission to the preload list and
            // is intentionally left off until the owner opts in.
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Deliberately NO Content-Security-Policy or Permissions-Policy here:
          // a strict CSP would break AdSense/Analytics, and restricting
          // `browsing-topics` would opt the site out of the Topics API that
          // AdSense uses for ad relevance. Locking only unused powerful features.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
