import type { MetadataRoute } from "next";
import { KRANKENKASSEN_2026 } from "@/data/krankenkassen";
import { TVOED_VKA_2026 } from "@/data/tvoed";
import { getAllPosts } from "@/lib/blog";
import { getCommonGrossSalaryAmounts, getCommonAnnualSalaryAmounts } from "@/data/wage-stats";
import { BUNDESLAENDER } from "@/data/bundeslaender";
import { BRANCHEN } from "@/data/branchen";
import { siteConfig } from "@/lib/authors";
import { getPublishedPosts } from "@/lib/postsStore";

/*
 * Statisch, nicht dynamisch — bewusst kein `revalidate = 0` mehr.
 *
 * Der Wert stammte aus der Zeit, als die Ratgeber-Beiträge aus MySQL kamen und
 * die Sitemap deshalb bei jedem Abruf eine DB-Runde brauchte. Seit der
 * Umstellung auf `content/blog/` (dateibasiert) ist *keine* Quelle dieser
 * Sitemap mehr dynamisch: KRANKENKASSEN_2026, TVOED_VKA_2026, wage-stats,
 * BUNDESLAENDER, BRANCHEN, siteConfig und BLOG_POSTS sind allesamt statische
 * Imports, die zur Buildzeit feststehen.
 *
 * `revalidate = 0` hat die Route trotzdem weiter als ƒ (Dynamic) gebaut und
 * damit jeden Abruf auf den Origin gezwungen — gemessen am 2026-09-11:
 * **1,14 s TTFB für 57 KB**, bei 413 URLs. Googlebot holt die Sitemap
 * regelmäßig; eine Sitemap, die eine Sekunde braucht, kostet Crawl-Budget, das
 * dem Long Tail fehlt. Ohne die Zeile wird die Datei zur Buildzeit erzeugt, vom
 * Dateisystem ausgeliefert und ist am CDN-Edge cachebar.
 *
 * Neue Beiträge/Rechner landen weiterhin automatisch darin — sie sind Teil des
 * Builds, und jeder Deploy baut neu.
 *
 * Einzige Ausnahme sind die Infografiken (/infografiken/…): Sie kommen aus
 * Cloudinary, nicht aus dem Repo. Ihr Abruf ist gecacht und macht die Sitemap
 * zu ISR — weiterhin aus dem Cache ausgeliefert, nicht pro Abruf berechnet —,
 * und jedes Speichern im Admin erneuert sie über revalidateTag("posts").
 */

// <lastmod> policy — Google only honors lastmod when it tracks real content
// changes, so a date is emitted only where one is actually known:
//  - calculator/amount pages → siteConfig.lastUpdatedISO (the on-page "Stand"
//    date; bump it only when tax data or calculator content changes, never
//    per deploy)
//  - blog articles → real `updated_at` from the DB
//  - legal/info pages → no lastmod (unknown beats fabricated)
// priority/changefreq are omitted entirely: ignored by Google and Bing.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://bruttonettocalculator.com";
  const engineUpdated = new Date(siteConfig.lastUpdatedISO);

  // 3-language cluster — must mirror the page-level hreflang tags exactly
  // (app/page.tsx, app/en/tax-calculator-germany, app/pl/kalkulator-…)
  const languageCluster = {
    "de-DE": `${base}/`,
    "en-DE": `${base}/en/tax-calculator-germany`,
    "pl-DE": `${base}/pl/kalkulator-brutto-netto-niemcy`,
    "x-default": `${base}/`,
  };
  const clusterPaths = new Set(["", "/en/tax-calculator-germany", "/pl/kalkulator-brutto-netto-niemcy"]);

  // Pages whose content is driven by the tax engine / 2026 parameters
  const calculatorRoutes: string[] = [
    "",
    "/gehaltsrechner",
    "/arbeitgeber-brutto-netto-rechner",
    "/steuerklassenwechsel-rechner",
    "/gehaltserhoehung-rechner",
    "/jahresgehalt-rechner",
    "/krankengeld-rechner",
    "/kurzarbeitergeld-rechner",
    "/pendlerpauschale-rechner",
    "/werkstudent-rechner",
    "/lohnsteuerrechner",
    "/einkommensteuer-rechner",
    "/steuerrueckerstattung-rechner",
    "/brutto-netto-rechner-2026",
    "/brutto-netto-rechner-2027",
    "/buergergeld-rechner",
    "/rechner/brutto-zu-netto",
    "/rechner/netto-zu-brutto",
    "/brutto-netto-gehaltstabelle",
    "/pfaendungstabelle",
    "/mindestlohn",
    "/steuerklassen",
    "/welche-steuerklasse-bin-ich",
    "/brutto-netto-rechner-vergleich",
    "/brutto-netto-rechner-beamte",
    "/mehrwertsteuer-rechner",
    "/steuerfreibetrag-2026",
    "/brutto-netto-rechner-krankenkasse",
    "/beitragsbemessungsgrenze-2026",
    "/beitragsbemessungsgrenze-2027",
    "/sozialabgaben-rechner-2027",
    "/brutto-netto-rechner-oesterreich",
    "/tvoed-rechner",
    "/durchschnittsgehalt-deutschland",
    "/private-krankenversicherung-vs-gesetzlich",
    "/witwenrente-rechner",
    "/bafoeg-rechner",
    "/teilzeitrechner",
    "/firmenwagenrechner",
    "/rentenrechner",
    "/rentenpunkte-rechner",
    "/riester-rechner",
    "/grundsicherung-rechner",
    "/bafoeg-rueckzahlung-rechner",
    "/schonvermoegen-rechner",
    "/bav-rechner",
    "/immobilienkredit-rechner",
    "/mieteinnahmen-versteuern",
    "/arbeitslosengeld-rechner",
    "/minijob-rechner",
    "/midijob-rechner",
    "/elterngeld-rechner",
    "/abfindungsrechner",
    "/weihnachtsgeld-rechner",
    "/urlaubsgeld-rechner",
    "/ueberstunden-rechner",
    "/urlaubsanspruch-rechner",
    "/erbschaftssteuer-rechner",
    "/schenkungssteuer-rechner",
    "/abgeltungssteuer-rechner",
    "/bonus-steuerrechner",
    "/stundenlohn-rechner",
    "/en/tax-calculator-germany",
    "/pl/kalkulator-brutto-netto-niemcy",
  ];

  // Informational/legal pages with no known change date → no lastmod
  const infoRoutes: string[] = [
    "/widget",
    "/lexikon",
    "/faq",
    "/ueber-uns",
    "/kontakt",
    "/impressum",
    "/datenschutz",
  ];

  // Kassen-Detailseiten (/krankenkasse/<slug>) — aus den Daten erzeugt, damit
  // eine neue Kasse in data/krankenkassen.ts automatisch in der Sitemap landet.
  const krankenkassenRoutes: string[] = KRANKENKASSEN_2026.map((k) => `/krankenkasse/${k.slug}`);

  // TVöD-Entgeltgruppen (/tvoed/<slug>) — ebenfalls aus den Daten erzeugt.
  const tvoedRoutes: string[] = TVOED_VKA_2026.map((g) => `/tvoed/${g.slug}`);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const path of calculatorRoutes) {
    sitemapEntries.push({
      url: `${base}${path}`,
      lastModified: engineUpdated,
      ...(clusterPaths.has(path) ? { alternates: { languages: languageCluster } } : {}),
    });
  }

  for (const path of krankenkassenRoutes) {
    sitemapEntries.push({ url: `${base}${path}`, lastModified: engineUpdated });
  }

  for (const path of tvoedRoutes) {
    sitemapEntries.push({ url: `${base}${path}`, lastModified: engineUpdated });
  }

  for (const path of infoRoutes) {
    sitemapEntries.push({ url: `${base}${path}` });
  }

  // Branchen-Cluster: Hub + eine Seite je Branche. Aus den Daten erzeugt,
  // damit eine neue Branche in data/branchen.ts automatisch in der Sitemap
  // landet.
  sitemapEntries.push({ url: `${base}/brutto-netto`, lastModified: engineUpdated });
  for (const br of BRANCHEN) {
    sitemapEntries.push({
      url: `${base}/brutto-netto/${br.slug}`,
      lastModified: engineUpdated,
    });
  }

  // Add all 16 Bundesland pages (brutto netto rechner <bundesland>)
  for (const bl of BUNDESLAENDER) {
    sitemapEntries.push({
      url: `${base}/brutto-netto-rechner/${bl.slug}`,
      lastModified: engineUpdated,
    });
  }

  // Add all programmatic long-tail salary pages
  const longTailAmounts = getCommonGrossSalaryAmounts();
  for (const amount of longTailAmounts) {
    sitemapEntries.push({
      url: `${base}/rechner/${amount}-euro-brutto-netto`,
      lastModified: engineUpdated,
    });
    // Steuerklasse-1 exact-match variant — targets "<amount> brutto in netto steuerklasse 1"
    sitemapEntries.push({
      url: `${base}/rechner/${amount}-euro-brutto-netto-steuerklasse-1`,
      lastModified: engineUpdated,
    });
  }

  // Annual-salary pages ("70000 brutto in netto"-type queries)
  for (const amount of getCommonAnnualSalaryAmounts()) {
    sitemapEntries.push({
      url: `${base}/rechner/${amount}-euro-jahresgehalt-brutto-netto`,
      lastModified: engineUpdated,
    });
  }

  // Ratgeber-Beiträge — aus der Datei-Registry (content/blog/), nicht mehr aus
  // der DB. Ein neuer Artikel landet damit automatisch in der Sitemap, und ein
  // DB-Ausfall kann die Beiträge nicht mehr aus dem Index kippen.
  const posts = getAllPosts();
  let newestArticle: Date | undefined;
  for (const post of posts) {
    const articleDate = new Date(post.updatedISO);
    if (!newestArticle || articleDate > newestArticle) newestArticle = articleDate;
    sitemapEntries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: articleDate,
    });
  }
  // Die /blog-Übersicht ändert sich tatsächlich, wenn ihr neuester Beitrag es tut
  sitemapEntries.push({
    url: `${base}/blog`,
    ...(newestArticle ? { lastModified: newestArticle } : {}),
  });

  // Infografiken — aus Cloudinary; leer, solange es keine gibt. Die Galerie
  // selbst steht erst in der Sitemap, wenn sie Inhalt hat (vorher noindex).
  const infografiken = await getPublishedPosts();
  for (const p of infografiken) {
    sitemapEntries.push({ url: `${base}/infografiken/${p.slug}`, lastModified: new Date(p.updatedAt) });
  }
  if (infografiken.length) {
    sitemapEntries.push({
      url: `${base}/infografiken`,
      lastModified: new Date(Math.max(...infografiken.map((p) => Date.parse(p.updatedAt)))),
    });
  }

  return sitemapEntries;
}
