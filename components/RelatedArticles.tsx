import Link from "next/link";
import { ArrowRight, BookOpen, Calculator } from "lucide-react";
import { getRelatedPosts, readTime } from "@/lib/blog";

/**
 * "Ähnliche Artikel"-Block unter jedem Ratgeber-Beitrag.
 *
 * Quelle ist die Datei-Registry (content/blog/), nicht mehr die Datenbank —
 * dadurch ist der Block Teil des statischen Builds und kann nicht mehr leer
 * ausfallen, wenn MySQL wackelt. Die Auswahl erfolgt über getRelatedPosts:
 * gleiche Kategorie zuerst, dann Tag-Überschneidungen, dann gemeinsame
 * Rechner-Ziele. Das erzeugt echte Themen-Cluster statt beliebiger Links —
 * und beschreibende Ankertexte (die Artikelüberschrift) statt "mehr".
 */
export default function RelatedArticles({
  currentSlug,
}: {
  currentSlug: string;
  /** Nicht mehr genutzt — die Kategorie kommt jetzt aus der Registry. */
  category?: string;
}) {
  const related = getRelatedPosts(currentSlug, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-black/[0.08]" aria-labelledby="related-heading">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} className="text-[#E60A1C]" />
        <h2 id="related-heading" className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#16181D]">
          Ähnliche Artikel
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((art) => (
          <Link
            key={art.slug}
            href={`/blog/${art.slug}`}
            className="group flex flex-col justify-between bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.08] hover:border-[#E60A1C]/40 rounded-2xl p-5 shadow-sm transition-all"
          >
            <div>
              <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-[#FF2E44]">
                {art.category}
              </span>
              <h3 className="font-bold text-base text-[#16181D] leading-snug mb-2 line-clamp-3 group-hover:text-[#FF2E44] transition-colors">
                {art.headline}
              </h3>
              <p className="text-xs text-black/55 leading-relaxed line-clamp-2">{art.excerpt}</p>
            </div>
            <span className="mt-4 inline-flex items-center justify-between gap-1.5 text-xs font-bold text-[#E60A1C]">
              <span className="inline-flex items-center gap-1.5">
                Artikel lesen <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="font-medium text-black/35">{readTime(art)}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Link to the most relevant calculator (descriptive anchor). */}
      <div className="mt-6">
        <Link
          href="/rechner/brutto-zu-netto"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#16181D] hover:text-[#E60A1C] transition-colors"
        >
          <Calculator size={16} className="text-[#E60A1C]" />
          Passenden Brutto-Netto-Rechner öffnen
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
