import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bruttonettocalculator.com";
  const now  = new Date();

  const routes: Array<{
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

  return routes.map(({ path, changeFrequency, priority }) => ({
    url:             `${base}${path}`,
    lastModified:    now,
    changeFrequency,
    priority,
  }));
}
