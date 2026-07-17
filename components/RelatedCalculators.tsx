import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export interface RelatedLink {
  href: string;
  label: string;
  desc?: string;
}

/**
 * Reusable "Ähnliche Rechner" / "Passende Ratgeber" internal-linking block.
 * Server-rendered plain <a> links with descriptive anchors. Render at most once
 * per page to avoid duplicate related-content sections.
 */
export default function RelatedCalculators({
  title = "Ähnliche Rechner",
  links,
  className = "",
}: {
  title?: string;
  links: RelatedLink[];
  className?: string;
}) {
  if (!links.length) return null;
  return (
    <section className={`max-w-6xl mx-auto px-5 py-6 ${className}`} aria-labelledby="related-calc-heading">
      <h2 id="related-calc-heading" className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
        <Calculator size={20} className="text-[#E60A1C]" />
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex flex-col justify-between bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.10] hover:border-[#E60A1C]/40 rounded-2xl p-5 shadow-sm transition-all"
          >
            <div>
              <div className="font-bold text-[#16181D] mb-1 group-hover:text-[#E60A1C] transition-colors">{l.label}</div>
              {l.desc && <div className="text-xs text-black/60 leading-relaxed">{l.desc}</div>}
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#E60A1C]">
              Öffnen <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
