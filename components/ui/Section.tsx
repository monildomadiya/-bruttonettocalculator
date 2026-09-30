import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Einheitlicher Inhaltsabschnitt für Rechner- und Ratgeberseiten.
 *
 * Warum: Vor 10/2026 gab es auf der Site ~12 verschiedene Section-Wrapper und
 * H2-Varianten (text-xl … text-3xl, mit/ohne font-display, mb-2 … mb-8), dazu
 * Karten mit p-8 auch mobil. Dieser Baustein legt fest:
 *   • Rhythmus: gleicher Abstand zwischen allen Abschnitten (mb-10 / sm:mb-14)
 *   • Kopf: optionale Eyebrow-Pille, H2 in font-display, optionaler Intro-Satz
 *   • Fläche: "plain" (ohne Kasten), "card" (weiß, Rahmen), "muted" (grau)
 *   • Innenabstand: mobil p-5 statt p-8 — auf 375 px war ein Viertel der
 *     Breite Polsterung.
 *
 * `data-section` markiert jede Abschnittsgrenze. Phase 2 (In-Content-Anzeigen)
 * setzt Anzeigen ausschließlich ZWISCHEN solche Abschnitte, nie hinein — so
 * landet keine Anzeige mitten in einer Tabelle oder neben einem Knopf.
 *
 * `id` liegt auf der <section>, nicht auf der H2: Sprunglinks aus dem
 * Inhaltsverzeichnis landen so an der Oberkante der Karte (Abstand zum
 * Sticky-Header regelt `scroll-padding-top` in globals.css).
 */

export type SectionVariant = "plain" | "card" | "muted";

const SURFACE: Record<SectionVariant, string> = {
  plain: "",
  card: "bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-10 shadow-sm",
  muted: "bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10",
};

export default function Section({
  id,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  titleId,
  intro,
  variant = "plain",
  prose = false,
  className = "",
  bodyClassName = "",
  children,
}: {
  id?: string;
  eyebrow?: ReactNode;
  eyebrowIcon?: LucideIcon;
  title?: ReactNode;
  /** Optionale id auf der H2 (z. B. für aria-labelledby oder bestehende Anker). */
  titleId?: string;
  intro?: ReactNode;
  variant?: SectionVariant;
  /** Fließtext-Typografie für den Inhalt (Absätze, Listen). */
  prose?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}) {
  const hasHeader = eyebrow || title || intro;
  return (
    <section
      id={id}
      data-section=""
      aria-labelledby={title && titleId ? titleId : undefined}
      className={`w-full max-w-6xl mx-auto mb-10 sm:mb-14 ${SURFACE[variant]} ${className}`}
    >
      {hasHeader && (
        <header className={children ? "mb-5 sm:mb-6" : ""}>
          {eyebrow && (
            <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-3">
              {EyebrowIcon && <EyebrowIcon size={13} aria-hidden="true" />}
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              id={titleId}
              className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] leading-tight"
            >
              {title}
            </h2>
          )}
          {intro && (
            <p className="mt-2 text-sm sm:text-base text-black/70 leading-relaxed max-w-3xl">{intro}</p>
          )}
        </header>
      )}
      {children && (
        <div
          className={`${prose ? "text-sm sm:text-base text-black/75 leading-relaxed space-y-4" : ""} ${bodyClassName}`}
        >
          {children}
        </div>
      )}
    </section>
  );
}
