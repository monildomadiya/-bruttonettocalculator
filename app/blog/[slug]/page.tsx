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
import { Metadata } from "next";
import { blogCanonical } from "@/lib/seo";
import { primaryReviewer } from "@/lib/authors";
import ReviewerByline from "@/components/ReviewerByline";
import RelatedArticles from "@/components/RelatedArticles";
import {
  getPostBySlug,
  getAllSlugs,
  readTime,
  extractToc,
  injectHeadingIds,
  type BlogPost,
} from "@/lib/blog";
import { allCalculatorLinks } from "@/lib/navigation";

/** Social-Vorschaubild für Beiträge ohne eigenes Bild. */
const FALLBACK_OG_IMAGE = "https://bruttonettocalculator.com/og-image.png";

/**
 * Beiträge liegen als Dateien im Repo (content/blog/), nicht mehr in MySQL.
 * Damit kann Next die Seiten zur Buildzeit vollständig statisch erzeugen —
 * kein `revalidate = 0`, keine DB-Abfrage pro Request, kein Ausfallrisiko.
 */
export const dynamic = "force-static";

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Die JSX unten stammt aus der DB-Zeit und erwartet snake_case-Felder. Statt
 * ~600 Zeilen Markup anzufassen, wird der typisierte BlogPost hier einmal auf
 * genau diese Form abgebildet — weniger Änderungsfläche, gleiches Ergebnis.
 */
function toViewModel(post: BlogPost) {
  return {
    ...post,
    headline: post.headline,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    faqs: post.faqs,
    focus_keyword: post.focusKeyword,
    meta_title: post.metaTitle,
    meta_description: post.metaDescription,
    created_at: post.publishedISO,
    updated_at: post.updatedISO,
    read_time: readTime(post),
    featured_image: "",
    featured_image_alt: "",
    featured_image_caption: "",
    enable_toc: true,
  };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Artikel nicht gefunden" };
  }
  const art = toViewModel(post);

  // A blog post always lives at /blog/<slug>. We derive the canonical from the
  // slug rather than trusting the stored canonical_url — an editor value that
  // was missing the /blog/ segment produced the broken canonical Semrush flagged
  // (…/brutto-netto-rechner-2026-mindestlohn-2027 → 404). This guarantees a
  // single, self-referencing, non-WWW canonical on every article.
  const canonicalUrl = blogCanonical(art.slug);

  return {
    title: art.meta_title || art.headline,
    description: art.meta_description || art.excerpt || "",
    keywords: [post.focusKeyword, ...post.secondaryKeywords, ...post.tags].join(", "),
    alternates: {
      canonical: canonicalUrl,
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
      title: art.meta_title || art.headline,
      description: art.meta_description || art.excerpt || "",
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedISO,
      modifiedTime: post.updatedISO,
      // Ohne Bild greift das Site-Default — eine leere Liste würde bedeuten,
      // dass der Beitrag beim Teilen und in sozialen Vorschauen gar kein Bild hat.
      images: [{ url: art.featured_image || FALLBACK_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: art.meta_title || art.headline,
      description: art.meta_description || art.excerpt || "",
      images: [art.featured_image || FALLBACK_OG_IMAGE],
    },
  };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Aktuell";
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Nav-Eintrag zu einer Rechner-Route — für die "Passende Rechner"-Box. */
function calculatorLink(href: string) {
  return allCalculatorLinks.find((l) => l.href === href);
}

export default function ArticleReaderPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const article = toViewModel(post);
  const faqs: FAQItem[] = post.faqs;
  const toc = extractToc(post.content);
  const contentWithIds = injectHeadingIds(post.content);
  // Self-referencing /blog/<slug> URL — siehe generateMetadata.
  const articleUrl = blogCanonical(post.slug);

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
    // Team-authored content → Organization author (not a fabricated Person),
    // linked to the site-wide Organization entity defined in the root layout.
    author: {
      "@type": "Organization",
      "@id": "https://bruttonettocalculator.com/#organization",
      name: primaryReviewer.name,
      url: primaryReviewer.profile_url,
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://bruttonettocalculator.com/#organization",
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

      <main className="min-h-screen bg-[#F4F5F7] text-[#16181D] relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* ── Breadcrumbs ─────────────────────────────────────────── */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-black/40 mb-8 flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-black/80 transition-colors duration-150"
            >
              Startseite
            </Link>
            <ChevronRight size={12} className="text-black/25 flex-shrink-0" />
            <Link
              href="/blog"
              className="hover:text-black/80 transition-colors duration-150"
            >
              Ratgeber &amp; Blog
            </Link>
            {article.category && (
              <>
                <ChevronRight
                  size={12}
                  className="text-black/25 flex-shrink-0"
                />
                <span className="text-black/60">{article.category}</span>
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

                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.12] text-[#16181D] mb-5">
                  {article.headline}
                </h1>

                {article.excerpt && (
                  <p className="text-black/65 text-lg sm:text-xl font-normal leading-relaxed mb-6 max-w-2xl">
                    {article.excerpt}
                  </p>
                )}

                {/* Author / Meta bar */}
                <div className="flex flex-wrap items-center gap-4 py-5 border-t border-b border-black/[8%]">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[#16181D] font-black text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg,#E60A1C,#FF2436)",
                      }}
                      aria-hidden="true"
                    >
                      BN
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#16181D] leading-tight">
                        Redaktion BruttoNettoCalculator
                      </div>
                      <div className="flex items-center gap-2 text-xs text-black/45 mt-0.5">
                        <Calendar size={11} />
                        <time dateTime={article.created_at || ""}>
                          {formatDate(article.created_at)}
                        </time>
                        {article.updated_at &&
                          article.updated_at !== article.created_at && (
                            <>
                              <span className="text-black/20">·</span>
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
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] text-xs font-semibold text-black/60">
                      <Clock size={12} className="text-[#E60A1C]" />
                      <span>{article.read_time || "5 min read"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] text-xs font-semibold text-black/60">
                      <BookOpen size={12} className="text-black/40" />
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
                <figure className="mb-10 rounded-2xl overflow-hidden border border-black/[0.08] bg-[#FFFFFF]">
                  <img
                    src={article.featured_image}
                    alt={article.featured_image_alt || article.headline}
                    className="w-full h-auto max-h-[480px] object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  {article.featured_image_caption && (
                    <figcaption className="px-4 py-2.5 text-center text-xs text-black/45 bg-black/[0.04] border-t border-black/[8%] italic">
                      {article.featured_image_caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Mobile-only TOC */}
              {toc.length > 0 && (
                <details
                  className="lg:hidden mb-8 rounded-2xl border border-black/[12%] bg-[#FFFFFF] overflow-hidden"
                  open
                >
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-bold text-sm text-black/80 select-none list-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2">
                      <BookOpen size={15} className="text-[#E60A1C]" />
                      Inhaltsverzeichnis
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-black/30 transition-transform details-open:rotate-90"
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
                            className="flex items-start gap-2.5 text-sm text-black/65 hover:text-[#16181D] transition-colors duration-150 group"
                          >
                            <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#E60A1C]/15 text-[#FF2E44] text-[10px] font-black flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="group-hover:text-[#16181D] transition-colors">
                              {h.text}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              )}

              {/* ── Direktantwort ────────────────────────────────────
                  Die Hauptfrage vollständig in 40–60 Wörtern beantwortet,
                  bewusst eigenständig lesbar: Genau solche geschlossenen
                  Passagen zitieren Google-Snippets und KI-Antwortsysteme. */}
              <section
                aria-labelledby="direktantwort"
                className="mb-10 rounded-2xl border border-[#E60A1C]/20 bg-[#FFF6F7] p-6 sm:p-7"
              >
                <h2
                  id="direktantwort"
                  className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-[#FF2E44] mb-3"
                >
                  <span className="w-1 h-4 rounded-full bg-[#E60A1C] inline-block" />
                  Kurz beantwortet
                </h2>
                <p className="text-[#16181D] text-base sm:text-lg leading-relaxed font-medium">
                  {post.answer}
                </p>
              </section>

              {/* ── Kernzahlen ─────────────────────────────────────── */}
              {post.keyFacts && post.keyFacts.length > 0 && (
                <section
                  aria-labelledby="kernzahlen"
                  className="mb-10 rounded-2xl border border-black/[0.08] bg-[#FFFFFF] overflow-hidden"
                >
                  <h2
                    id="kernzahlen"
                    className="px-6 py-4 border-b border-black/[0.08] text-xs font-black tracking-widest uppercase text-black/60"
                  >
                    Die wichtigsten Zahlen auf einen Blick
                  </h2>
                  <dl className="divide-y divide-black/[0.06]">
                    {post.keyFacts.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-baseline justify-between gap-4 px-6 py-3.5"
                      >
                        <dt className="text-sm text-black/60">{f.label}</dt>
                        <dd className="text-sm font-bold text-[#16181D] text-right">
                          {f.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* ── Article Body ─────────────────────────────────── */}
              <article
                className="article-content"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-black/[8%] flex flex-wrap items-center gap-2">
                  <Tag
                    size={14}
                    className="text-black/30 mr-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {post.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-xs font-semibold text-black/65 hover:border-black/[0.12] hover:text-black/85 transition-colors"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <section
                  className="mt-14 pt-10 border-t border-black/[0.08]"
                  aria-labelledby="faq-heading"
                >
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-6 rounded-full bg-[#E60A1C] inline-block" />
                      <h2
                        id="faq-heading"
                        className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#16181D]"
                      >
                        Häufig gestellte Fragen (FAQ)
                      </h2>
                    </div>
                    <p className="text-black/55 text-sm ml-5">
                      Fundierte Antworten auf die wichtigsten Fragen zu diesem
                      Thema.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group rounded-xl bg-[#FFFFFF] border border-black/[0.08] overflow-hidden transition-all duration-200 open:border-black/[18%] open:bg-[#FFFFFF] open:shadow-sm"
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
                            <span className="font-semibold text-sm sm:text-base text-black/90 leading-snug">
                              {faq.question}
                            </span>
                          </span>
                          <span className="flex-shrink-0 text-black/35 text-xl leading-none group-open:rotate-45 transition-transform duration-200">
                            +
                          </span>
                        </summary>
                        <div className="px-5 pb-5 pt-2 border-t border-black/[8%] ml-0">
                          <p className="text-black/70 text-sm sm:text-base leading-relaxed pl-9">
                            {faq.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Passende Rechner ────────────────────────────────
                  Interne Verlinkung mit beschreibendem Ankertext auf die
                  Tool-Seiten. Der Ratgeber beantwortet die Frage, der Rechner
                  liefert die Zahl — dieser Übergang ist der eigentliche Zweck
                  des Beitrags und zugleich das stärkste interne Linksignal. */}
              {post.relatedCalculators.length > 0 && (
                <section
                  className="mt-14 pt-10 border-t border-black/[0.08]"
                  aria-labelledby="rechner-heading"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Calculator size={18} className="text-[#E60A1C]" />
                    <h2
                      id="rechner-heading"
                      className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#16181D]"
                    >
                      Passende Rechner zum Thema
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {post.relatedCalculators.map((href) => {
                      const link = calculatorLink(href);
                      if (!link) return null;
                      return (
                        <Link
                          key={href}
                          href={href}
                          className="group flex items-start gap-3 rounded-xl border border-black/[0.08] bg-[#FFFFFF] p-4 hover:border-[#E60A1C]/30 hover:bg-[#FFF6F7] transition-all duration-200"
                        >
                          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#E60A1C]/[0.10] flex items-center justify-center">
                            <link.icon size={17} className="text-[#E60A1C]" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-bold text-sm text-[#16181D] group-hover:text-[#FF2E44] transition-colors">
                              {link.label}
                            </span>
                            {link.description && (
                              <span className="block text-xs text-black/50 mt-0.5 leading-snug">
                                {link.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── Quellen ─────────────────────────────────────────
                  Belegt jede genannte Zahl mit ihrer Rechtsgrundlage. Für
                  YMYL-Themen (Geld, Steuern) erwartet Google nachprüfbare
                  Quellen — ohne sie bleibt der Beitrag Behauptung. */}
              {post.sources.length > 0 && (
                <section
                  className="mt-14 pt-10 border-t border-black/[0.08]"
                  aria-labelledby="quellen-heading"
                >
                  <h2
                    id="quellen-heading"
                    className="text-xs font-black tracking-widest uppercase text-black/60 mb-4"
                  >
                    Quellen &amp; Rechtsgrundlagen
                  </h2>
                  <ul className="space-y-2">
                    {post.sources.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ExternalLink
                          size={13}
                          className="text-black/25 mt-1 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-black/60 hover:text-[#FF2E44] underline decoration-black/15 underline-offset-2 transition-colors"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs text-black/45 leading-relaxed">
                    Stand: {formatDate(post.updatedISO)}. Alle Angaben wurden
                    nach bestem Wissen recherchiert und beziehen sich auf die
                    Rechtslage in Deutschland. Der Beitrag dient der Information
                    und ersetzt keine individuelle Steuerberatung.
                  </p>
                </section>
              )}

              {/* Ähnliche Artikel (reusable related-posts block) */}
              <RelatedArticles currentSlug={article.slug} category={article.category} />

              {/* CTA Banner */}
              <section
                className="mt-12 sm:mt-16 rounded-2xl overflow-hidden relative"
                style={{
                  background:
                    "linear-gradient(135deg, #FFECEE 0%, #FFF6F7 50%, #FFE4E7 100%)",
                  border: "1px solid rgba(230,10,28,0.20)",
                  boxShadow: "0 4px 16px rgba(16,24,40,0.06)",
                }}
              >
                {/* Glow effect */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(230,10,28,0.14) 0%, transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />
                <div className="relative z-10 p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 sm:space-y-3 max-w-lg">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#FF2E44] border border-[#E60A1C]/30 bg-[#E60A1C]/10">
                      <Calculator size={12} />
                      Kostenloser Rechner 2026/2027
                    </div>
                    <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-[#16181D] tracking-tight leading-tight">
                      Berechnen Sie jetzt Ihr exaktes Nettogehalt
                    </h3>
                    <p className="text-black/60 text-sm leading-relaxed">
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
                      boxShadow: "0 2px 8px rgba(230,10,28,0.18)",
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
                  <div className="rounded-2xl border border-black/[0.08] bg-[#FFFFFF] overflow-hidden">
                    <div className="px-5 py-4 border-b border-black/[8%] flex items-center gap-2">
                      <BookOpen size={14} className="text-[#E60A1C]" />
                      <h2 className="text-xs font-black tracking-widest uppercase text-black/60">
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
                              className="flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm text-black/55 hover:text-[#16181D] hover:bg-black/[0.04] transition-all duration-150 group"
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
                        "linear-gradient(135deg, #FFECEE 0%, #FFE4E7 100%)",
                      border: "1px solid rgba(230,10,28,0.18)",
                      boxShadow: "0 4px 14px rgba(16,24,40,0.06)",
                    }}
                  >
                    <Calculator
                      size={28}
                      className="text-[#E60A1C] mx-auto mb-3"
                    />
                    <h3 className="font-display font-black text-base text-[#16181D] mb-2 leading-snug">
                      Nettogehalt berechnen
                    </h3>
                    <p className="text-black/50 text-xs leading-relaxed mb-4">
                      Kostenlos, sofort & DSGVO-konform für 2026/2027.
                    </p>
                    <Link
                      href="/rechner/brutto-zu-netto"
                      className="block w-full text-center py-2.5 rounded-full font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
                      style={{
                        background:
                          "linear-gradient(135deg,#E60A1C,#FF2436)",
                        boxShadow: "0 2px 8px rgba(230,10,28,0.18)",
                      }}
                    >
                      Jetzt berechnen
                    </Link>
                  </div>

                  {/* Article meta card */}
                  <div className="rounded-2xl border border-black/[8%] bg-[#FFFFFF] p-5 space-y-3 text-xs text-black/50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-black/40 uppercase tracking-wider text-[10px]">
                        Veröffentlicht
                      </span>
                      <time
                        dateTime={article.created_at || ""}
                        className="font-medium text-black/65"
                      >
                        {formatDate(article.created_at)}
                      </time>
                    </div>
                    {article.updated_at &&
                      article.updated_at !== article.created_at && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-black/40 uppercase tracking-wider text-[10px]">
                            Aktualisiert
                          </span>
                          <time
                            dateTime={article.updated_at}
                            className="font-medium text-black/65"
                          >
                            {formatDate(article.updated_at)}
                          </time>
                        </div>
                      )}
                    {article.read_time && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-black/40 uppercase tracking-wider text-[10px]">
                          Lesezeit
                        </span>
                        <span className="font-medium text-black/65">
                          {article.read_time}
                        </span>
                      </div>
                    )}
                    {article.focus_keyword && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-black/40 uppercase tracking-wider text-[10px]">
                          Thema
                        </span>
                        <span className="font-medium text-black/65 truncate max-w-[130px] text-right">
                          {article.focus_keyword}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-black/[6%]">
                      <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-black/35 hover:text-black/65 transition-colors text-[11px]"
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
