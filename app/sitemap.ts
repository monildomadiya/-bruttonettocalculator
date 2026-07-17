import type { MetadataRoute } from "next";
import { dbQuery, Article } from "@/lib/db";
import { getCommonGrossSalaryAmounts } from "@/data/wage-stats";
import { BUNDESLAENDER } from "@/data/bundeslaender";
import { siteConfig } from "@/lib/authors";

export const revalidate = 0; // Dynamic sitemap generation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://bruttonettocalculator.com";
  // Stable "content updated" date for pages without an individual timestamp.
  // Using the deployment time (new Date()) would reset every URL's
  // <lastmod> on each deploy, which search engines learn to distrust.
  const contentUpdated = new Date(siteConfig.lastUpdatedISO);

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "",                            changeFrequency: "daily",   priority: 1.0 },
    { path: "/blog",                       changeFrequency: "daily",   priority: 0.9 },
    { path: "/gehaltsrechner",             changeFrequency: "monthly", priority: 0.95 },
    { path: "/arbeitgeber-brutto-netto-rechner", changeFrequency: "monthly", priority: 0.92 },
    { path: "/steuerklassenwechsel-rechner", changeFrequency: "monthly", priority: 0.88 },
    { path: "/gehaltserhoehung-rechner",   changeFrequency: "monthly", priority: 0.85 },
    { path: "/jahresgehalt-rechner",       changeFrequency: "monthly", priority: 0.82 },
    { path: "/krankengeld-rechner",        changeFrequency: "monthly", priority: 0.82 },
    { path: "/kurzarbeitergeld-rechner",   changeFrequency: "monthly", priority: 0.8 },
    { path: "/pendlerpauschale-rechner",   changeFrequency: "monthly", priority: 0.8 },
    { path: "/werkstudent-rechner",        changeFrequency: "monthly", priority: 0.8 },
    { path: "/lohnsteuerrechner",          changeFrequency: "monthly", priority: 0.9 },
    { path: "/einkommensteuer-rechner",    changeFrequency: "monthly", priority: 0.9 },
    { path: "/brutto-netto-rechner-2026",  changeFrequency: "weekly",  priority: 0.95 },
    { path: "/brutto-netto-rechner-2027",  changeFrequency: "monthly", priority: 0.9 },
    { path: "/buergergeld-rechner",        changeFrequency: "monthly", priority: 0.88 },
    { path: "/rechner/brutto-zu-netto",    changeFrequency: "monthly", priority: 0.85 },
    { path: "/rechner/netto-zu-brutto",    changeFrequency: "monthly", priority: 0.85 },
    { path: "/brutto-netto-gehaltstabelle", changeFrequency: "monthly", priority: 0.8 },
    { path: "/pfaendungstabelle",           changeFrequency: "yearly",  priority: 0.85 },
    { path: "/mindestlohn",               changeFrequency: "monthly", priority: 0.85 },
    { path: "/steuerklassen",             changeFrequency: "monthly", priority: 0.85 },
    { path: "/witwenrente-rechner",        changeFrequency: "monthly", priority: 0.82 },
    { path: "/bafoeg-rechner",             changeFrequency: "monthly", priority: 0.82 },
    { path: "/teilzeitrechner",            changeFrequency: "monthly", priority: 0.82 },
    { path: "/firmenwagenrechner",         changeFrequency: "monthly", priority: 0.8 },
    { path: "/rentenrechner",              changeFrequency: "monthly", priority: 0.8 },
    { path: "/arbeitslosengeld-rechner",   changeFrequency: "monthly", priority: 0.8 },
    { path: "/minijob-rechner",             changeFrequency: "monthly", priority: 0.8 },
    { path: "/elterngeld-rechner",          changeFrequency: "monthly", priority: 0.8 },
    { path: "/abfindungsrechner",           changeFrequency: "monthly", priority: 0.8 },
    { path: "/weihnachtsgeld-rechner",      changeFrequency: "monthly", priority: 0.82 },
    { path: "/bonus-steuerrechner",         changeFrequency: "monthly", priority: 0.75 },
    { path: "/stundenlohn-rechner",         changeFrequency: "monthly", priority: 0.75 },
    { path: "/en/tax-calculator-germany",  changeFrequency: "monthly", priority: 0.75 },
    { path: "/lexikon",                    changeFrequency: "monthly", priority: 0.75 },
    { path: "/faq",                        changeFrequency: "monthly", priority: 0.75 },
    { path: "/ueber-uns",                  changeFrequency: "yearly",  priority: 0.4 },
    { path: "/kontakt",                    changeFrequency: "yearly",  priority: 0.4 },
    { path: "/impressum",                  changeFrequency: "yearly",  priority: 0.2 },
    { path: "/datenschutz",               changeFrequency: "yearly",  priority: 0.2 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url:             `${base}${path}`,
    lastModified:    contentUpdated,
    changeFrequency,
    priority,
  }));

  // Add all 16 Bundesland pages (brutto netto rechner <bundesland>)
  for (const bl of BUNDESLAENDER) {
    sitemapEntries.push({
      url: `${base}/brutto-netto-rechner/${bl.slug}`,
      lastModified: contentUpdated,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  // Add all programmatic long-tail salary pages
  const longTailAmounts = getCommonGrossSalaryAmounts();
  for (const amount of longTailAmounts) {
    sitemapEntries.push({
      url: `${base}/rechner/${amount}-euro-brutto-netto`,
      lastModified: contentUpdated,
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
          lastModified: art.updated_at ? new Date(art.updated_at) : (art.created_at ? new Date(art.created_at) : contentUpdated),
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
