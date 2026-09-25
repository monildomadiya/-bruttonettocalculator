"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Share2, X } from "lucide-react";
import { storyImageSrc, storyShortId, trackStory, type Story } from "@/lib/stories";

/** How long one story stays on screen. */
const STORY_MS = 6500;
/** Holding longer than this pauses instead of skipping. */
const HOLD_MS = 220;
/** Dragging down further than this closes the viewer. */
const SWIPE_CLOSE_PX = 90;

/** Desktop arrows sit just outside the 9:16 frame (height min(92vh, 860px)). */
const ARROW_OFFSET = "max(1rem, calc(50% - min(46vh, 430px) * 9 / 16 - 4.5rem))";

const KICKER: Record<Story["linkKind"], string> = {
  article: "Artikel lesen",
  tool: "Jetzt berechnen",
  page: "Jetzt ansehen",
  external: "Mehr erfahren",
};

function timeAgo(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  return days === 1 ? "vor 1 Tag" : `vor ${days} Tagen`;
}

interface Props {
  stories: Story[];
  startIndex: number;
  onSeen: (id: string) => void;
  onClose: () => void;
}

/**
 * Full-screen story player: progress bars, auto-advance, tap left/right,
 * hold to pause, swipe down or Esc to close, arrow keys on desktop — and a
 * link card at the bottom that takes the reader to the related post.
 */
export default function StoryViewer({ stories, startIndex, onSeen, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [shareNote, setShareNote] = useState("");

  const story = stories[index];
  const elapsed = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const press = useRef<{ x: number; y: number; timer: number; held: boolean } | null>(null);

  const close = useCallback(
    (reason: string) => {
      trackStory("story_close", { story_id: story.id, position: index + 1, reason });
      onClose();
    },
    [index, onClose, story.id]
  );

  const goTo = useCallback(
    (i: number) => {
      if (i < 0) {
        elapsed.current = 0;
        setProgress(0);
      } else if (i >= stories.length) {
        close("completed");
      } else {
        setIndex(i);
      }
    },
    [close, stories.length]
  );

  // The rAF loop reads these through refs so it isn't restarted every frame.
  const goToRef = useRef(goTo);
  goToRef.current = goTo;
  const indexRef = useRef(index);
  indexRef.current = index;

  // New story: reset the clock, record the view, preload the next image.
  useEffect(() => {
    elapsed.current = 0;
    setProgress(0);
    setLoaded(Boolean(imgRef.current?.complete && imgRef.current.naturalWidth));
    setShareNote("");
    onSeen(story.id);
    trackStory("story_view", { story_id: story.id, position: index + 1 });
    const next = stories[index + 1];
    if (next) new Image().src = storyImageSrc(next, "full");
  }, [index, onSeen, stories, story.id]);

  // Playback clock.
  useEffect(() => {
    if (paused || !loaded) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      elapsed.current += t - last;
      last = t;
      const p = Math.min(1, elapsed.current / STORY_MS);
      setProgress(p);
      if (p >= 1) goToRef.current(indexRef.current + 1);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, loaded, index]);

  // Keyboard, background-tab pause, scroll lock, focus handling.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("escape");
      else if (e.key === "ArrowRight") goToRef.current(indexRef.current + 1);
      else if (e.key === "ArrowLeft") goToRef.current(indexRef.current - 1);
      else if (e.key === " " && (e.target as HTMLElement)?.tagName !== "BUTTON") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
    // Mount/unmount only — `close` changes with every story.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Touch / mouse on the image: tap = next/prev, hold = pause, drag down = close ── */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const timer = window.setTimeout(() => {
      if (press.current) press.current.held = true;
      setPaused(true);
    }, HOLD_MS);
    press.current = { x: e.clientX, y: e.clientY, timer, held: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!press.current) return;
    const dy = e.clientY - press.current.y;
    if (dy > 10) {
      window.clearTimeout(press.current.timer);
      press.current.held = true;
      setPaused(true);
      setDragY(dy);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    window.clearTimeout(p.timer);
    const dy = e.clientY - p.y;
    setDragY(0);
    if (dy > SWIPE_CLOSE_PX) return close("swipe");
    if (p.held) return setPaused(false);
    const rect = e.currentTarget.getBoundingClientRect();
    goTo(e.clientX - rect.left < rect.width / 3 ? index - 1 : index + 1);
  };

  const onPointerCancel = () => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
    setDragY(0);
    setPaused(false);
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("story", storyShortId(story.id));
    const data = { title: story.title, text: story.caption || story.title, url: url.toString() };
    trackStory("story_share", { story_id: story.id });
    try {
      if (navigator.share) {
        setPaused(true);
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
        setShareNote("Link kopiert");
      }
    } catch {
      /* share sheet dismissed */
    } finally {
      setPaused(false);
    }
  };

  const onLinkClick = () => {
    trackStory("story_cta_click", { story_id: story.id, link: story.link, position: index + 1 });
    onClose();
  };

  const external = story.linkKind === "external";
  const linkCard = story.link && (
    <>
      {story.linkImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.linkImage}
          alt=""
          className="h-14 w-20 flex-shrink-0 rounded-xl object-cover bg-[#ECEEF1]"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-[#E60A1C]">
          {KICKER[story.linkKind]}
        </span>
        <span className="text-sm font-semibold leading-snug text-[#16181D] line-clamp-2">
          {story.linkLabel || story.link}
        </span>
        {story.linkExcerpt && (
          <span className="mt-0.5 text-xs leading-snug text-black/55 line-clamp-1">
            {story.linkExcerpt}
          </span>
        )}
      </span>
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E60A1C] text-white transition-transform group-hover:translate-x-0.5">
        <ArrowRight size={18} />
      </span>
    </>
  );
  const linkClass =
    "group flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pr-3 shadow-lg shadow-black/30 backdrop-blur transition hover:bg-white";

  // Portalled to <body>: the tray is its own stacking context (z-30), which
  // would otherwise keep the viewer beneath the sticky header (z-40).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Story: ${story.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      style={{ opacity: dragY ? Math.max(0.4, 1 - dragY / 400) : 1 }}
      onClick={(e) => e.target === e.currentTarget && close("backdrop")}
    >
      {/* Desktop arrows outside the frame */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Vorherige Story"
        style={{ left: ARROW_OFFSET }}
        className="absolute hidden h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:flex disabled:opacity-0"
        disabled={index === 0}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Nächste Story"
        style={{ right: ARROW_OFFSET }}
        className="absolute hidden h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:flex"
      >
        <ChevronRight size={24} />
      </button>

      <div
        className="relative h-full w-full overflow-hidden bg-neutral-900 sm:h-[min(92vh,860px)] sm:w-auto sm:aspect-[9/16] sm:rounded-2xl"
        style={{ transform: dragY ? `translateY(${dragY}px) scale(${1 - dragY / 2000})` : undefined }}
      >
        {/* Blurred fill so any aspect ratio looks intentional */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`bg-${story.id}`}
          src={storyImageSrc(story, "full")}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={story.id}
          ref={imgRef}
          src={storyImageSrc(story, "full")}
          alt={story.caption || story.title}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        {/* Tap / hold / swipe surface — below the header and link card */}
        <div
          className="absolute inset-0 z-10 cursor-pointer touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Header: progress + meta + controls */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 to-transparent px-3 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex gap-1" aria-hidden="true">
            {stories.map((s, i) => (
              <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
                <span
                  className="block h-full rounded-full bg-white"
                  style={{ width: `${i < index ? 100 : i === index ? progress * 100 : 0}%` }}
                />
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/favicon.png?v=7"
              alt=""
              className="h-8 w-8 rounded-full bg-white object-contain p-0.5"
            />
            <div className="min-w-0 flex-1 text-white">
              <p className="truncate text-sm font-semibold leading-tight">{story.title}</p>
              <p className="text-[11px] leading-tight text-white/70">
                {shareNote || timeAgo(story.createdAt)}
              </p>
            </div>
            <div className="pointer-events-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Abspielen" : "Pausieren"}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15"
              >
                {paused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                type="button"
                onClick={share}
                aria-label="Story teilen"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15"
              >
                <Share2 size={18} />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={() => close("button")}
                aria-label="Story schließen"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15"
              >
                <X size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Caption + the related post */}
        {(story.caption || story.link) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16">
            {story.caption && (
              <p className="mb-3 whitespace-pre-line text-[15px] font-medium leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                {story.caption}
              </p>
            )}
            {story.link &&
              (external ? (
                <a
                  href={story.link}
                  target="_blank"
                  rel="noopener"
                  onClick={onLinkClick}
                  className={`pointer-events-auto ${linkClass}`}
                >
                  {linkCard}
                </a>
              ) : (
                <Link href={story.link} onClick={onLinkClick} className={`pointer-events-auto ${linkClass}`}>
                  {linkCard}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
