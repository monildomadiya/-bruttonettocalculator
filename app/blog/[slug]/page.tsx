import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  Tag,
  Calculator,
  ChevronRight,
  BookOpen,
  Share2,
  ExternalLink,
} from "lucide-react";
import { dbQuery, Article } from "@/lib/db";
import { Metadata } from "next";
import { primaryReviewer } from "@/lib/authors";
import ReviewerByline from "@/components/ReviewerByline";
import AdUnit from "@/components/AdUnit";

export const revalidate = 0;

interface FAQItem {
  question: string;
  answer: string;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const rows = await dbQuery<Article[]>(
      "SELECT * FROM articles WHERE slug = ? LIMIT 1",
      [slug]
    );
    if (!rows || rows.length === 0) return null;
    const art = rows[0];
    return {
      ...art,
      faqs:
        typeof art.faqs === "string" ? tryParseJson(art.faqs) : art.faqs || [],
      enable_toc: Boolean(art.enable_toc),
    };
  } catch (err) {
    console.error(`❌ getArticle(${slug}) error:`, err);
    return null;
  }
}

function tryParseJson(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const articles = await dbQuery<Article[]>(
      "SELECT slug FROM articles WHERE status = 'Published'"
    );
    return articles.map((art) => ({ slug: art.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const art = await getArticle(params.slug);
  if (!art) {
    return { title: "Artikel nicht gefunden" };
  }

  return {
    title: art.meta_title || art.headline,
    description: art.meta_description || art.excerpt || "",
    keywords: art.focus_keyword
      ? [art.focus_keyword, art.tags || ""].join(", ")
      : art.tags || "",
    alternates: {
      canonical:
        art.canonical_url ||
        `https://bruttonettocalculator.com/blog/${art.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: art.og_title || art.meta_title || art.headline,
      description:
        art.og_description || art.meta_description || art.excerpt || "",
      url:
        art.canonical_url ||
        `https://bruttonettocalculator.com/blog/${art.slug}`,
      type: "article",
      images:
        art.og_image || art.featured_image
          ? [{ url: art.og_image || art.featured_image! }]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title: art.og_title || art.meta_title || art.headline,
      description:
        art.og_description || art.meta_description || art.excerpt || "",
      images:
        art.og_image || art.featured_image
          ? [art.og_image || art.featured_image!]
          : [],
    },
  };
}

/* Extract H2 headings + slugified IDs for the TOC */
function extractToc(html: string = "") {
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const headings: { text: string; id: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (text) {
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      headings.push({ text, id });
    }
  }
  return headings;
}

/* Inject id attributes into H2 tags so anchor links work */
function injectHeadingIds(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Aktuell";
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticleReaderPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const faqs: FAQItem[] = Array.isArray(article.faqs) ? article.faqs : [];
  const toc = article.enable_toc ? extractToc(article.content) : [];
  const contentWithIds = injectHeadingIds(article.content || "");
  const articleUrl =
    article.canonical_url ||
    `https://bruttonettocalculator.com/blog/${article.slug}`;

  /* ── JSON-LD Schemas ────────────────────────────────────────────── */
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.headline,
    description: article.meta_description || article.excerpt,
    image: article.featured_image ? [article.featured_image] : [],
    datePublished: article.created_at || new Date().toISOString(),
    dateModified:
      article.updated_at || article.created_at || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: primaryReviewer.name,
      jobTitle: primaryReviewer.credentials,
      image: primaryReviewer.photo,
      url: primaryReviewer.profile_url,
    },
    publisher: {
      "@type": "Organization",
      name: "BruttoNettoCalculator",
      logo: {
        "@type": "ImageObject",
        url: "https://bruttonettocalculator.com/BRUTTO-NETTO-LOGO.svg",
        width: 280,
        height: 65,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://bruttonettocalculator.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ratgeber & Blog",
        item: "https://bruttonettocalculator.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.headline,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      {/* ── Structured Data ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="min-h-screen bg-[#060606] text-white relative overflow-hidden">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(230,10,28,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* ── Breadcrumbs ─────────────────────────────────────────── */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-white/40 mb-8 flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-white/80 transition-colors duration-150"
            >
              Startseite
            </Link>
            <ChevronRight size={12} className="text-white/25 flex-shrink-0" />
            <Link
              href="/blog"
              className="hover:text-white/80 transition-colors duration-150"
            >
              Ratgeber &amp; Blog
            </Link>
            {article.category && (
              <>
                <ChevronRight
                  size={12}
                  className="text-white/25 flex-shrink-0"
                />
                <span className="text-white/60">{article.category}</span>
              </>
            )}
          </nav>

          {/* ── Two-column layout ────────────────────────────────────── */}
          <div className="flex gap-12 xl:gap-16 items-start">
            {/* ─── Main content column ─────────────────────────────── */}
            <div className="min-w-0 flex-1">
              {/* Article Header */}
              <header className="mb-10">
                {article.category && (
                  <div className="mb-4">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#FF2E44] bg-[#E60A1C]/[12%] border border-[#E60A1C]/25">
                      {article.category}
                    </span>
                  </div>
                )}

                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.12] text-white mb-5">
                  {article.headline}
                </h1>

                {article.excerpt && (
                  <p className="text-white/65 text-lg sm:text-xl font-normal leading-relaxed mb-6 max-w-2xl">
                    {article.excerpt}
                  </p>
                )}

                {/* Author / Meta bar */}
                <div className="flex flex-wrap items-center gap-4 py-5 border-t border-b border-white/[8%]">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg,#E60A1C,#FF2436)",
                      }}
                      aria-hidden="true"
                    >
                      BN
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white leading-tight">
                        Redaktion BruttoNettoCalculator
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/45 mt-0.5">
                        <Calendar size={11} />
                        <time dateTime={article.created_at || ""}>
                          {formatDate(article.created_at)}
                        </time>
                        {article.updated_at &&
                          article.updated_at !== article.created_at && (
                            <>
                              <span className="text-white/20">·</span>
                              <span>
                                Aktualisiert:{" "}
                                {formatDate(article.updated_at)}
                              </span>
                            </>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/60">
                      <Clock size={12} className="text-[#E60A1C]" />
                      <span>{article.read_time || "5 min read"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/60">
                      <BookOpen size={12} className="text-white/40" />
                      <span>Ratgeber</span>
                    </div>
                  </div>
                </div>

                {/* Reviewer byline */}
                <div className="mt-4">
                  <ReviewerByline />
                </div>
              </header>

              {/* Featured Image */}
              {article.featured_image && (
                <figure className="mb-10 rounded-2xl overflow-hidden border border-white/10 bg-[#0e0e0e]">
                  <img
                    src={article.featured_image}
                    alt={article.featured_image_alt || article.headline}
                    className="w-full h-auto max-h-[480px] object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  {article.featured_image_caption && (
                    <figcaption className="px-4 py-2.5 text-center text-xs text-white/45 bg-black/50 border-t border-white/[8%] italic">
                      {article.featured_image_caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Mobile-only TOC */}
              {toc.length > 0 && (
                <details
                  className="lg:hidden mb-8 rounded-2xl border border-white/[12%] bg-[#0d0d0d] overflow-hidden"
                  open
                >
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-bold text-sm text-white/80 select-none list-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2">
                      <BookOpen size={15} className="text-[#E60A1C]" />
                      Inhaltsverzeichnis
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-white/30 transition-transform details-open:rotate-90"
                    />
                  </summary>
                  <nav
                    aria-label="Inhaltsverzeichnis"
                    className="px-5 pb-5 pt-1"
                  >
                    <ol className="space-y-2">
                      {toc.map((h, i) => (
                        <li key={i}>
                          <a
                            href={`#${h.id}`}
                            className="flex items-start gap-2.5 text-sm text-white/65 hover:text-white transition-colors duration-150 group"
                          >
                            <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#E60A1C]/15 text-[#FF2E44] text-[10px] font-black flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="group-hover:text-white transition-colors">
                              {h.text}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              )}

              {/* ── Article Body ─────────────────────────────────── */}
              <article
                className="article-content"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {/* ── Ad: in-content, right after the article (high viewability / high CPM) ── */}
              <AdUnit placement="inArticle" className="!my-8" />

              {/* Tags */}
              {article.tags && (
                <div className="mt-10 pt-6 border-t border-white/[8%] flex flex-wrap items-center gap-2">
                  <Tag
                    size={14}
                    className="text-white/30 mr-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {article.tags.split(",").map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/65 hover:border-white/20 hover:text-white/85 transition-colors"
                    >
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <section
                  className="mt-14 pt-10 border-t border-white/10"
                  aria-labelledby="faq-heading"
                >
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-6 rounded-full bg-[#E60A1C] inline-block" />
                      <h2
                        id="faq-heading"
                        className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white"
                      >
                        Häufig gestellte Fragen (FAQ)
                      </h2>
                    </div>
                    <p className="text-white/55 text-sm ml-5">
                      Fundierte Antworten auf die wichtigsten Fragen zu diesem
                      Thema.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group rounded-xl bg-[#0d0d0d] border border-white/10 overflow-hidden transition-all duration-200 open:border-white/[18%] open:bg-[#111111] open:shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
                      >
                        <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                          <span className="flex items-start gap-3">
                            <span
                              className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full flex items-center justify-center text-xs font-black text-[#FF2E44]"
                              style={{
                                background: "rgba(230,10,28,0.12)",
                              }}
                            >
                              ?
                            </span>
                            <span className="font-semibold text-sm sm:text-base text-white/90 leading-snug">
                              {faq.question}
                            </span>
                          </span>
                          <span className="flex-shrink-0 text-white/35 text-xl leading-none group-open:rotate-45 transition-transform duration-200">
                            +
                          </span>
                        </summary>
                        <div className="px-5 pb-5 pt-2 border-t border-white/[8%] ml-0">
                          <p className="text-white/70 text-sm sm:text-base leading-relaxed pl-9">
                            {faq.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA Banner */}
              <section
                className="mt-12 sm:mt-16 rounded-2xl overflow-hidden relative"
                style={{
                  background:
                    "linear-gradient(135deg, #110608 0%, #1a0709 50%, #0e0304 100%)",
                  border: "1px solid rgba(230,10,28,0.22)",
                  boxShadow: "0 12px 48px rgba(0,0,0,0.8)",
                }}
              >
                {/* Glow effect */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(230,10,28,0.18) 0%, transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />
                <div className="relative z-10 p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 sm:space-y-3 max-w-lg">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#FF2E44] border border-[#E60A1C]/30 bg-[#E60A1C]/10">
                      <Calculator size={12} />
                      Kostenloser Rechner 2026/2027
                    </div>
                    <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-tight">
                      Berechnen Sie jetzt Ihr exaktes Nettogehalt
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      DSGVO-konform · sekundenschnell · alle Steuerklassen ·
                      inkl. Sozialabgaben 2027
                    </p>
                  </div>
                  <Link
                    href="/rechner/brutto-zu-netto"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-extrabold text-white text-sm transition-all duration-150 hover:scale-105 active:scale-95 whitespace-nowrap"
                    style={{
                      background:
                        "linear-gradient(135deg,#E60A1C,#FF2436)",
                      boxShadow: "0 6px 24px rgba(230,10,28,0.45)",
                    }}
                  >
                    Jetzt berechnen
                    <Calculator size={16} />
                  </Link>
                </div>
              </section>
            </div>

            {/* ─── Sticky Sidebar (desktop only) ──────────────────── */}
            {toc.length > 0 && (
              <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  {/* Table of Contents */}
                  <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[8%] flex items-center gap-2">
                      <BookOpen size={14} className="text-[#E60A1C]" />
                      <h2 className="text-xs font-black tracking-widest uppercase text-white/60">
                        Inhaltsverzeichnis
                      </h2>
                    </div>
                    <nav
                      aria-label="Inhaltsverzeichnis"
                      className="p-4"
                    >
                      <ol className="space-y-1">
                        {toc.map((h, i) => (
                          <li key={i}>
                            <a
                              href={`#${h.id}`}
                              className="flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/5 transition-all duration-150 group"
                            >
                              <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#E60A1C]/[12%] text-[#FF2E44] text-[10px] font-black flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="leading-snug line-clamp-2">
                                {h.text}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </div>

                  {/* Mini Calculator CTA */}
                  <div
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #110608 0%, #1a0709 100%)",
                      border: "1px solid rgba(230,10,28,0.2)",
                    }}
                  >
                    <Calculator
                      size={28}
                      className="text-[#E60A1C] mx-auto mb-3"
                    />
                    <h3 className="font-display font-black text-base text-white mb-2 leading-snug">
                      Nettogehalt berechnen
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-4">
                      Kostenlos, sofort & DSGVO-konform für 2026/2027.
                    </p>
                    <Link
                      href="/rechner/brutto-zu-netto"
                      className="block w-full text-center py-2.5 rounded-full font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
                      style={{
                        background:
                          "linear-gradient(135deg,#E60A1C,#FF2436)",
                        boxShadow: "0 4px 16px rgba(230,10,28,0.4)",
                      }}
                    >
                      Jetzt berechnen
                    </Link>
                  </div>

                  {/* Article meta card */}
                  <div className="rounded-2xl border border-white/[8%] bg-[#0d0d0d] p-5 space-y-3 text-xs text-white/50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white/40 uppercase tracking-wider text-[10px]">
                        Veröffentlicht
                      </span>
                      <time
                        dateTime={article.created_at || ""}
                        className="font-medium text-white/65"
                      >
                        {formatDate(article.created_at)}
                      </time>
                    </div>
                    {article.updated_at &&
                      article.updated_at !== article.created_at && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white/40 uppercase tracking-wider text-[10px]">
                            Aktualisiert
                          </span>
                          <time
                            dateTime={article.updated_at}
                            className="font-medium text-white/65"
                          >
                            {formatDate(article.updated_at)}
                          </time>
                        </div>
                      )}
                    {article.read_time && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white/40 uppercase tracking-wider text-[10px]">
                          Lesezeit
                        </span>
                        <span className="font-medium text-white/65">
                          {article.read_time}
                        </span>
                      </div>
                    )}
                    {article.focus_keyword && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white/40 uppercase tracking-wider text-[10px]">
                          Thema
                        </span>
                        <span className="font-medium text-white/65 truncate max-w-[130px] text-right">
                          {article.focus_keyword}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-white/[6%]">
                      <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white/35 hover:text-white/65 transition-colors text-[11px]"
                      >
                        <ExternalLink size={11} />
                        Artikel-URL kopieren
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
