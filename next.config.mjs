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
      {
        source: "/gehaltsrechner",
        destination: "/",
        permanent: true,
      },
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
      {
        source: "/lohnrechner",
        destination: "/",
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
