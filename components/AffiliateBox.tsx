import { ExternalLink } from "lucide-react";
import { AFFILIATE_LINKS } from "@/lib/affiliate";

/**
 * Gekennzeichnete Partner-Empfehlung. Ohne konfigurierten Link (lib/affiliate.ts)
 * gibt die Komponente `null` zurück — die Seite sieht dann aus, als gäbe es sie nicht.
 */
export default function AffiliateBox({ slot }: { slot: keyof typeof AFFILIATE_LINKS }) {
  const link = AFFILIATE_LINKS[slot];
  if (!link) return null;
  return (
    <aside className="my-8 rounded-2xl border border-black/[0.10] bg-[#FFFFFF] p-5 sm:p-6 shadow-sm" aria-label="Anzeige">
      <p className="text-[11px] font-mono uppercase tracking-widest text-black/50 font-bold mb-2">Anzeige</p>
      <p className="text-sm sm:text-base text-black/80 leading-relaxed mb-4">{link.text}</p>
      <a
        href={link.href}
        target="_blank"
        rel="sponsored noopener"
        className="inline-flex items-center gap-2 bg-[#16181D] hover:bg-black text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
      >
        {link.cta} bei {link.partner}
        <ExternalLink size={15} aria-hidden="true" />
      </a>
    </aside>
  );
}
