import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Sparkles, Calculator } from "lucide-react";
import { Metadata } from "next";
import { getAllPosts, getUsedCategories, readTime } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ratgeber: Steuern, Gehalt & Sozialabgaben",
  description:
    "Verständliche Ratgeber zu Lohnsteuer, Freibeträgen und Sozialabgaben — mit den amtlichen Werten für 2026 und Beispielrechnungen aus unserer eigenen Steuer-Engine.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
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
    title: "Ratgeber: Steuern, Gehalt & Sozialabgaben | BruttoNettoCalculator",
    description: "Amtliche Werte 2026, echte Rechenbeispiele und Quellenangaben zu jedem Beitrag.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratgeber: Steuern, Gehalt & Sozialabgaben | BruttoNettoCalculator",
    description: "Amtliche Werte 2026, echte Rechenbeispiele und Quellenangaben zu jedem Beitrag.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

/** Beiträge sind Dateien im Repo → die Übersicht ist vollständig statisch. */
export const dynamic = "force-static";

export default function BlogOverviewPage() {
  const posts = getAllPosts();
  const categories = getUsedCategories();

  /* ItemList-Schema: macht die Übersicht als Sammlung maschinenlesbar und
     verweist auf jeden Beitrag — hilft Google beim Erfassen des Clusters. */
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ratgeber — BruttoNettoCalculator",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/${p.slug}`,
      name: p.headline,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-[#F4F5F7] text-[#16181D] py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#E60A1C]/15 to-[#FF2436]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E60A1C]/15 border border-[#E60A1C]/30 text-[#FF2E44] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              <span>Wissen &amp; Gesetzliche Neuerungen</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
              Steuer- &amp; Gehalts<span className="text-gradient-accent">ratgeber</span>
            </h1>
            <p className="text-black/70 text-base sm:text-lg leading-relaxed">
              Freibeträge, Steuerklassen und Sozialabgaben verständlich erklärt — mit den
              amtlichen Werten für 2026, Rechenbeispielen aus unserer eigenen Steuer-Engine
              und Quellenangabe zu jeder Zahl.
            </p>
          </div>

          {/* Kategorie-Übersicht — zusätzliche Orientierung und interne Links */}
          {categories.length > 0 && (
            <nav
              aria-label="Themenbereiche"
              className="flex flex-wrap justify-center gap-2 mb-14"
            >
              {categories.map(({ category, count }) => (
                <a
                  key={category}
                  href={`#${category.toLowerCase().replace(/[^a-zäöüß0-9]+/g, "-")}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-black/[0.08] text-xs font-bold text-black/65 hover:border-[#E60A1C]/30 hover:text-[#FF2E44] transition-colors"
                >
                  {category}
                  <span className="text-black/35 font-medium">{count}</span>
                </a>
              ))}
            </nav>
          )}

          {/* Articles Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-8 max-w-xl mx-auto">
              <BookOpen size={48} className="text-black/20 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Aktuell werden neue Ratgeber verfasst</h2>
              <p className="text-black/60 text-sm mb-6">
                Schauen Sie in Kürze wieder vorbei oder nutzen Sie direkt unseren Rechner.
              </p>
              <Link
                href="/rechner/brutto-zu-netto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg transition-all"
                style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)" }}
              >
                <span>Zum Brutto-Netto-Rechner</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  id={post.category.toLowerCase().replace(/[^a-zäöüß0-9]+/g, "-")}
                  className="group flex flex-col bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.08] hover:border-black/[0.14] rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-sm hover:-translate-y-1.5"
                >
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#E60A1C]/[0.10] border border-[#E60A1C]/20 text-[10px] font-bold text-[#FF2E44] uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-black/45">
                          <Clock size={13} className="text-[#E60A1C]" />
                          {readTime(post)}
                        </span>
                      </div>

                      <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#16181D] group-hover:text-[#FF2E44] transition-colors leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.headline}</Link>
                      </h2>

                      <p className="text-black/65 text-sm leading-relaxed line-clamp-4">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Zeigt schon in der Übersicht, wohin der Beitrag führt */}
                      {post.relatedCalculators.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-black/40">
                          <Calculator size={12} className="text-black/30" />
                          <span>
                            {post.relatedCalculators.length} passende Rechner verlinkt
                          </span>
                        </div>
                      )}

                      <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#16181D] group-hover:text-[#FF2E44] transition-colors"
                        >
                          <span>Weiterlesen</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <time
                          dateTime={post.publishedISO}
                          className="text-xs text-black/40"
                        >
                          {new Date(post.publishedISO).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
