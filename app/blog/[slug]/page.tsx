import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Tag, Share2, Calculator, CheckCircle2, ChevronRight } from "lucide-react";
import { dbQuery, Article } from "@/lib/db";
import { Metadata } from "next";
import { primaryReviewer } from "@/lib/authors";
import ReviewerByline from "@/components/ReviewerByline";

export const revalidate = 0; // Always fresh

interface FAQItem {
  question: string;
  answer: string;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const rows = await dbQuery<Article[]>("SELECT * FROM articles WHERE slug = ? LIMIT 1", [slug]);
    if (!rows || rows.length === 0) return null;
    const art = rows[0];
    return {
      ...art,
      faqs: typeof art.faqs === "string" ? tryParseJson(art.faqs) : art.faqs || [],
      enable_toc: Boolean(art.enable_toc),
    };
  } catch (err) {
    console.error(`❌ getArticle(${slug}) error:`, err);
    return null;
  }
}

function tryParseJson(str: string) {
  try { return JSON.parse(str); } catch { return []; }
}

export async function generateStaticParams() {
  try {
    const articles = await dbQuery<Article[]>("SELECT slug FROM articles WHERE status = 'Published'");
    return articles.map((art) => ({ slug: art.slug }));
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const art = await getArticle(params.slug);
  if (!art) {
    return { title: "Artikel nicht gefunden | BruttoNettoCalculator" };
  }

  return {
    title: `${art.meta_title || art.headline} | BruttoNettoCalculator`,
    description: art.meta_description || art.excerpt || "",
    keywords: art.focus_keyword ? [art.focus_keyword, art.tags || ""].join(", ") : art.tags || "",
    alternates: {
      canonical: art.canonical_url || `https://bruttonettocalculator.com/blog/${art.slug}`,
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
      description: art.og_description || art.meta_description || art.excerpt || "",
      url: art.canonical_url || `https://bruttonettocalculator.com/blog/${art.slug}`,
      type: "article",
      images: art.og_image || art.featured_image ? [{ url: art.og_image || art.featured_image! }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: art.og_title || art.meta_title || art.headline,
      description: art.og_description || art.meta_description || art.excerpt || "",
      images: art.og_image || art.featured_image ? [art.og_image || art.featured_image!] : [],
    },
  };
}

// Simple H2 extractor for Table of Contents
function extractToc(html: string = "") {
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const headings: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (text) headings.push(text);
  }
  return headings;
}

export default async function ArticleReaderPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) {
    notFound();
  }

  const faqs: FAQItem[] = Array.isArray(article.faqs) ? article.faqs : [];
  const toc = article.enable_toc ? extractToc(article.content) : [];
  const articleUrl = article.canonical_url || `https://bruttonettocalculator.com/blog/${article.slug}`;

  // Structured Data JSON-LD
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.headline,
    "description": article.meta_description || article.excerpt,
    "image": article.featured_image ? [article.featured_image] : [],
    "datePublished": article.created_at || new Date().toISOString(),
    "dateModified": article.updated_at || article.created_at || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": primaryReviewer.name,
      "jobTitle": primaryReviewer.credentials,
      "image": primaryReviewer.photo,
      "url": primaryReviewer.profile_url
    },
    "publisher": {
      "@type": "Organization",
      "name": "BruttoNettoCalculator",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bruttonettocalculator.com/BRUTTO-NETTO-LOGO.svg",
        "width": 280,
        "height": 65
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    }
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  return (
    <main className="min-h-screen bg-[#060606] text-white py-12 sm:py-20 px-4 sm:px-8 relative overflow-hidden">
      
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#E60A1C]/15 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/50 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
          <ChevronRight size={14} className="flex-shrink-0 text-white/30" />
          <Link href="/blog" className="hover:text-white transition-colors">Ratgeber & Blog</Link>
          {article.category && (
            <>
              <ChevronRight size={14} className="flex-shrink-0 text-white/30" />
              <span className="text-white/80">{article.category}</span>
            </>
          )}
        </div>

        {/* Article Header */}
        <header className="space-y-6 mb-12">
          {article.category && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E60A1C]/15 border border-[#E60A1C]/30 text-[#FF2E44] text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
          )}

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-white">
            {article.headline}
          </h1>

          {article.excerpt && (
            <p className="text-white/75 text-lg sm:text-2xl font-normal leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Author & Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-sm text-white/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E60A1C] to-[#FF2436] flex items-center justify-center font-bold text-white text-sm shadow">
                BN
              </div>
              <div>
                <div className="font-bold text-white">Redaktion BruttoNettoCalculator</div>
                <div className="text-xs text-white/50 flex items-center gap-2">
                  <Calendar size={12} />
                  <span>{article.created_at ? new Date(article.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }) : "Aktuell"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold">
                <Clock size={13} className="text-[#FF2E44]" />
                <span>{article.read_time || "3 min read"}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <ReviewerByline />
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image && (
          <figure className="mb-12 rounded-3xl overflow-hidden border border-white/15 bg-[#0e0e0e] shadow-2xl">
            <img
              src={article.featured_image}
              alt={article.featured_image_alt || article.headline}
              className="w-full h-auto max-h-[500px] object-cover"
            />
            {article.featured_image_caption && (
              <figcaption className="p-3 text-center text-xs text-white/50 bg-black/60 border-t border-white/10 font-medium">
                {article.featured_image_caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Table of Contents Box (if enabled & headings exist) */}
        {toc.length > 0 && (
          <nav aria-label="Inhaltsverzeichnis" className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#0e0e0e] border border-white/15 shadow-xl">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#FF2E44] mb-4 flex items-center gap-2">
              <span>INHALTSVERZEICHNIS DES ARTIKELS</span>
            </h2>
            <ul className="space-y-2.5">
              {toc.map((heading, idx) => (
                <li key={idx} className="text-sm font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-[#FF2E44] font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{heading}</span>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Rich Article Content */}
        <article className="prose prose-invert prose-lg max-w-none text-white/85 leading-relaxed space-y-6 [&>h2]:font-display [&>h2]:font-black [&>h2]:text-2xl sm:[&>h2]:text-3xl [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-white/10 [&>h3]:font-display [&>h3]:font-bold [&>h3]:text-xl sm:[&>h3]:text-2xl [&>h3]:text-white [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-[#E60A1C] [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:italic [&>blockquote]:bg-white/[0.02] [&>blockquote]:rounded-r-2xl">
          <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
        </article>

        {/* Tags */}
        {article.tags && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
            <Tag size={16} className="text-white/40 mr-2" />
            {article.tags.split(",").map((t, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
                #{t.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Interactive FAQ Section */}
        {faqs.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/15">
            <div className="text-center sm:text-left mb-8">
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white mb-2">
                Häufig gestellte Fragen (FAQ)
              </h2>
              <p className="text-white/60 text-sm">
                Amtliche Antworten auf die wichtigsten Fragen zu diesem Thema.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group rounded-2xl bg-[#0e0e0e] border border-white/15 p-5 sm:p-6 transition-all duration-300 open:bg-[#121212] open:border-white/25 shadow-md">
                  <summary className="font-bold text-base sm:text-lg text-white cursor-pointer flex items-center justify-between gap-4 outline-none list-none">
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#E60A1C]/15 text-[#FF2E44] flex items-center justify-center text-xs font-black flex-shrink-0">?</span>
                      {faq.question}
                    </span>
                    <span className="text-xl text-white/40 group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-4 pt-4 border-t border-white/10 text-white/75 text-sm sm:text-base leading-relaxed pl-9">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA Calculator Banner */}
        <section className="my-16 sm:my-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0e0e0e] border border-white/20 shadow-[0_15px_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E60A1C]/20 border border-[#E60A1C]/40 text-[#FF2E44] text-xs font-bold uppercase tracking-wider">
              <Calculator size={13} />
              <span>Amtlicher Rechner 2026/2027</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              Berechnen Sie jetzt Ihr exaktes Nettogehalt
            </h3>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Nutzen Sie unseren kostenlosen, DSGVO-konformen Rechner für eine sekundenschnelle Auswertung aller Steuern und Sozialabgaben.
            </p>
          </div>

          <Link
            href="/rechner/brutto-zu-netto"
            className="px-8 py-4 rounded-full font-extrabold text-white text-base shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 6px 25px rgba(230,10,28,0.50)" }}
          >
            <span>Jetzt Gehalt berechnen</span>
            <Calculator size={18} />
          </Link>
        </section>

      </div>
    </main>
  );
}
