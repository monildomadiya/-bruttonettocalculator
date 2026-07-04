import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { dbQuery, Article } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fintech & Steuer-Ratgeber | BruttoNettoCalculator",
  description: "Amtliche Berechnungen, Tipps zur Lohnsteuer und detaillierte Erklärungen nach § 32a EStG für Arbeitnehmer in Deutschland.",
  alternates: {
    canonical: "https://bruttonettocalculator.com/blog",
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
    title: "Fintech & Steuer-Ratgeber | BruttoNettoCalculator",
    description: "Amtliche Berechnungen und Tipps zum Nettogehalt für 2026 und 2027.",
    url: "https://bruttonettocalculator.com/blog",
    type: "website",
  },
};

export const revalidate = 0; // Dynamic fetching for instant blog updates

export default async function BlogOverviewPage() {
  let articles: Article[] = [];
  try {
    articles = await dbQuery<Article[]>("SELECT * FROM articles WHERE status = 'Published' ORDER BY created_at DESC");
  } catch (err) {
    console.error("❌ Blog list fetch error:", err);
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#E60A1C]/15 to-[#FF2436]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E60A1C]/15 border border-[#E60A1C]/30 text-[#FF2E44] text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(230,10,28,0.2)]">
            <Sparkles size={14} />
            <span>Wissen & Gesetzliche Neuerungen</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            Fintech & Steuer <span className="text-gradient-accent">Ratgeber</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            Erfahren Sie alles über amtliche Grenzwerte, Steuerklassenwechsel und wie Sie mit der richtigen Steuerstrategie bis zu Tausende Euro netto im Jahr gewinnen.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-[#0e0e0e] border border-white/10 rounded-3xl p-8 max-w-xl mx-auto">
            <BookOpen size={48} className="text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Aktuell werden neue Ratgeber verfasst</h3>
            <p className="text-white/60 text-sm mb-6">
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
            {articles.map((art) => (
              <article
                key={art.slug}
                className="group flex flex-col bg-[#0e0e0e] hover:bg-[#141414] border border-white/10 hover:border-white/25 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:-translate-y-1.5"
              >
                {/* Image */}
                <Link href={`/blog/${art.slug}`} className="block relative h-52 overflow-hidden bg-black/50">
                  {art.featured_image ? (
                    <img
                      src={art.featured_image}
                      alt={art.featured_image_alt || art.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] text-white/20 font-bold">
                      BruttoNetto Ratgeber
                    </div>
                  )}
                  {art.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-bold text-white uppercase tracking-wider shadow">
                      {art.category}
                    </span>
                  )}
                </Link>

                {/* Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
                      <Clock size={14} className="text-[#E60A1C]" />
                      <span>{art.read_time || "3 min read"}</span>
                    </div>

                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-[#FF2E44] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${art.slug}`}>{art.headline}</Link>
                    </h2>

                    <p className="text-white/65 text-sm leading-relaxed line-clamp-3">
                      {art.excerpt || art.meta_description || ""}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href={`/blog/${art.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-extrabold text-white group-hover:text-[#FF2E44] transition-colors"
                    >
                      <span>Weiterlesen</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-xs text-white/40">
                      {art.created_at ? new Date(art.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
