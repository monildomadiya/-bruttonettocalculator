/**
 * Ratgeber-Registry — dateibasiert statt Datenbank.
 *
 * Warum nicht mehr MySQL:
 *   - Die Artikel wurden bisher aus der `articles`-Tabelle gelesen. Fällt die
 *     DB aus, ist der komplette Ratgeber weg (genau das ist in Produktion
 *     schon passiert, siehe Kommentar in lib/db.ts). Google sieht dann leere
 *     Seiten bzw. 404 — der teuerste denkbare Fehler für die Indexierung.
 *   - `revalidate = 0` erzwang bei jedem Aufruf eine DB-Runde. Jetzt sind die
 *     Beiträge Teil des Builds → statisches HTML, kein TTFB durch SQL.
 *   - Inhalte liegen im Git-Repo: versioniert, reviewbar, deploybar. Ein
 *     neuer Artikel ist ein Commit, kein manueller CMS-Klick.
 *
 * Ein Artikel = eine Datei unter content/blog/. Registrierung in
 * content/blog/index.ts. Alles Weitere (Sitemap, Related-Links, Schema,
 * Kategorie-Filter) leitet sich automatisch daraus ab.
 */

import { BLOG_POSTS } from "@/content/blog";

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogSource {
  /** Anzeigename, z. B. "BMF — Lohnsteuer-Handbuch 2026". */
  label: string;
  url: string;
}

export interface BlogPost {
  /** URL-Segment unter /blog/<slug>. Nie ändern — sonst 404 + Rankingverlust. */
  slug: string;
  /** <h1> der Seite. */
  headline: string;
  /** <title> — darf von der H1 abweichen (kürzer, keyword-first). */
  metaTitle: string;
  /** Meta-Description, 140–160 Zeichen. */
  metaDescription: string;
  /** Teaser für Listen und den Intro-Absatz. */
  excerpt: string;
  /** Haupt-Keyword, auf das der Beitrag optimiert ist. */
  focusKeyword: string;
  /** Neben-Keywords / Varianten aus der Recherche (Autocomplete-Cluster). */
  secondaryKeywords: string[];
  category: BlogCategory;
  tags: string[];
  /** ISO-Datum der Erstveröffentlichung. */
  publishedISO: string;
  /** ISO-Datum der letzten inhaltlichen Änderung. Treibt <lastmod>. */
  updatedISO: string;
  /**
   * Direktantwort auf die Hauptfrage — 40–60 Wörter, eigenständig lesbar.
   * Zielt bewusst auf Featured Snippets und KI-Antworten (AI Overviews,
   * ChatGPT, Perplexity): Diese Systeme zitieren zusammenhängende Passagen,
   * die eine Frage vollständig beantworten, ohne den Rest der Seite zu brauchen.
   */
  answer: string;
  /** Kernzahlen als Fakten-Box — schnell scanbar, snippet-tauglich. */
  keyFacts?: { label: string; value: string }[];
  /** Artikeltext als HTML (H2/H3, p, ul, table). Keine H1 — die rendert die Seite. */
  content: string;
  faqs: BlogFaq[];
  /** Rechner-Routen, auf die der Beitrag verlinkt (interne Verlinkung). */
  relatedCalculators: string[];
  /** Quellenangaben — E-E-A-T-Signal und Beleg für die genannten Zahlen. */
  sources: BlogSource[];
}

export const BLOG_CATEGORIES = [
  "Steuerklassen & Gehalt",
  "Freibeträge & Abzüge",
  "Sozialversicherung",
  "Familie & Kinder",
  "Rente & Vorsorge",
  "Job & Sonderfälle",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/* ────────────────────────── Abfragen ────────────────────────── */

/** Alle Beiträge, neueste zuerst. */
export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedISO).getTime() - new Date(a.publishedISO).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

/**
 * Verwandte Beiträge für die interne Verlinkung.
 *
 * Reihenfolge: (1) gleiche Kategorie, (2) überlappende Tags, (3) neueste.
 * So bekommt jeder Artikel echte thematische Nachbarn statt "irgendwas Neues"
 * — das ist der Unterschied zwischen einer Themen-Cluster-Struktur, die Google
 * als zusammenhängende Autorität liest, und wahllosen Footer-Links.
 */
export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return getAllPosts().slice(0, count);

  const others = getAllPosts().filter((p) => p.slug !== currentSlug);
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));

  const scored = others.map((p) => {
    let score = 0;
    if (p.category === current.category) score += 10;
    for (const tag of p.tags) if (currentTags.has(tag.toLowerCase())) score += 3;
    // Gemeinsame Rechner-Ziele = thematisch benachbart
    for (const c of p.relatedCalculators) {
      if (current.relatedCalculators.includes(c)) score += 2;
    }
    return { post: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || new Date(b.post.publishedISO).getTime() - new Date(a.post.publishedISO).getTime())
    .slice(0, count)
    .map((s) => s.post);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

/** Kategorien, zu denen es tatsächlich Beiträge gibt (für Filter-Chips). */
export function getUsedCategories(): { category: BlogCategory; count: number }[] {
  const counts = new Map<BlogCategory, number>();
  for (const p of BLOG_POSTS) counts.set(p.category, (counts.get(p.category) || 0) + 1);
  return BLOG_CATEGORIES.filter((c) => counts.has(c)).map((c) => ({
    category: c,
    count: counts.get(c) || 0,
  }));
}

/* ────────────────────────── Hilfsfunktionen ────────────────────────── */

/** Wörter im Fließtext — Basis für die Lesezeit. */
export function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Lesezeit aus dem tatsächlichen Seiteninhalt, nicht handgepflegt — ein von
 * Hand gesetztes "3 min read" wird beim ersten Edit falsch und ist dann ein
 * kleines, aber echtes Qualitätssignal gegen die Seite. Gezählt wird alles,
 * was der Leser tatsächlich vorfindet: Direktantwort, Fließtext und die
 * FAQ-Antworten (die auf diesen Seiten ein gutes Fünftel des Textes ausmachen).
 */
export function readTime(post: BlogPost): string {
  const faqWords = post.faqs.reduce(
    (sum, f) => sum + countWords(f.question) + countWords(f.answer),
    0
  );
  const words = countWords(post.content) + countWords(post.answer) + faqWords;
  return `${Math.max(2, Math.round(words / 200))} Min. Lesezeit`;
}

/** Slug für Anker-Links aus einer Überschrift (deutsche Umlaute sauber). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** H2-Überschriften für das Inhaltsverzeichnis. */
export function extractToc(html: string): { text: string; id: string }[] {
  const out: { text: string; id: string }[] = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) out.push({ text, id: headingId(text) });
  }
  return out;
}

/** Setzt id-Attribute auf H2, damit die TOC-Anker funktionieren. */
export function injectHeadingIds(html: string): string {
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_full, attrs, inner) => {
    const text = String(inner).replace(/<[^>]+>/g, "").trim();
    return `<h2${attrs} id="${headingId(text)}">${inner}</h2>`;
  });
}
