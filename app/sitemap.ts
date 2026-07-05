import type { MetadataRoute } from "next";
import { dbQuery, Article } from "@/lib/db";
import { getCommonGrossSalaryAmounts } from "@/data/wage-stats";

export const revalidate = 0; // Dynamic sitemap generation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://bruttonettocalculator.com";
  const now  = new Date();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "",                            changeFrequency: "daily",   priority: 1.0 },
    { path: "/blog",                       changeFrequency: "daily",   priority: 0.9 },
    { path: "/brutto-netto-rechner-2027",  changeFrequency: "monthly", priority: 0.9 },
    { path: "/rechner/brutto-zu-netto",    changeFrequency: "monthly", priority: 0.85 },
    { path: "/rechner/netto-zu-brutto",    changeFrequency: "monthly", priority: 0.85 },
    { path: "/lexikon",                    changeFrequency: "monthly", priority: 0.75 },
    { path: "/faq",                        changeFrequency: "monthly", priority: 0.75 },
    { path: "/ueber-uns",                  changeFrequency: "yearly",  priority: 0.4 },
    { path: "/kontakt",                    changeFrequency: "yearly",  priority: 0.4 },
    { path: "/impressum",                  changeFrequency: "yearly",  priority: 0.2 },
    { path: "/datenschutz",               changeFrequency: "yearly",  priority: 0.2 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url:             `${base}${path}`,
    lastModified:    now,
    changeFrequency,
    priority,
  }));

  // Add all programmatic long-tail salary pages
  const longTailAmounts = getCommonGrossSalaryAmounts();
  for (const amount of longTailAmounts) {
    sitemapEntries.push({
      url: `${base}/rechner/${amount}-euro-brutto-netto`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Dynamically fetch all published blog articles for Google indexing
  try {
    const articles = await dbQuery<Article[]>("SELECT slug, updated_at, created_at FROM articles WHERE status = 'Published'");
    if (articles && articles.length > 0) {
      for (const art of articles) {
        sitemapEntries.push({
          url: `${base}/blog/${art.slug}`,
          lastModified: art.updated_at ? new Date(art.updated_at) : (art.created_at ? new Date(art.created_at) : now),
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
  } catch (err) {
    console.error("❌ Sitemap article fetch error:", err);
  }

  return sitemapEntries;
}
