import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/studio/"],
      },
      {
        // Prevent AI training bots from crawling
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: "/",
      },
    ],
    sitemap: "https://bruttonettocalculator.com/sitemap.xml",
    host:    "https://bruttonettocalculator.com",
  };
}
