import { ListOrdered } from "lucide-react";

export interface TocItem {
  /** id des Zielelements (ohne #) — muss auf der Seite existieren. */
  id: string;
  label: string;
}

/**
 * Inhaltsverzeichnis für lange Rechnerseiten (die 2027-Seite ist mobil ~27
 * Bildschirme lang). Bewusst ein Server Component ohne JavaScript: reine
 * Sprunglinks, die auch Google als "Springe zu"-Links im Snippet verwenden kann.
 * Der Abstand unter dem Sticky-Header kommt global aus `scroll-padding-top`
 * in globals.css, die Ziele brauchen deshalb nur eine id.
 *
 * Platzierung ÜBER dem Rechner, aber mobil nur eine horizontal wischbare Zeile
 * (~50 px): Unter dem Rechner landete es mobil 4,5 Bildschirme tief, weil die
 * Ergebnisaufschlüsselung dort ~3.000 px hoch ist — als umgebrochene Chip-Liste
 * war es 337 px hoch und hätte den Rechner unter den Falz geschoben. Ab sm
 * brechen die Chips normal um.
 */
export default function TableOfContents({
  items,
  title = "Springe zu",
  className = "",
  centered = false,
}: {
  items: TocItem[];
  title?: string;
  className?: string;
  /** Für zentrierte Heros (Startseite, Gehaltsrechner): ab sm mittig ausgerichtet. */
  centered?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Inhaltsverzeichnis" className={`w-full max-w-6xl mx-auto min-w-0 ${className}`}>
      <div className={`flex items-center gap-3 min-w-0 ${centered ? "sm:justify-center" : ""}`}>
        <p className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-black/55 font-bold flex-shrink-0">
          <ListOrdered size={14} className="text-[#E60A1C]" aria-hidden="true" />
          {title}
        </p>
        <ol className={`flex flex-nowrap sm:flex-wrap gap-2 ${centered ? "sm:justify-center" : ""} overflow-x-auto sm:overflow-visible -mx-5 px-5 sm:mx-0 sm:px-0 pb-1 sm:pb-0 min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
          {items.map((item) => (
            <li key={item.id} className="flex-shrink-0">
              <a
                href={`#${item.id}`}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-black/[0.12] bg-[#FFFFFF] hover:border-[#E60A1C]/50 px-3.5 py-2 text-sm font-semibold text-[#16181D] transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
