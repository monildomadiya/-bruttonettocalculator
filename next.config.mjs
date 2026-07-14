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
      {
        source: "/rechner",
        destination: "/",
        permanent: true,
      },
      // NOTE: /gehaltsrechner is now a dedicated ranking page — no longer redirected.
      {
        source: "/brutto-netto-rechner",
        destination: "/",
        permanent: true,
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
};

export default nextConfig;
