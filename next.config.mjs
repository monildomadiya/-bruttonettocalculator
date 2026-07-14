/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
