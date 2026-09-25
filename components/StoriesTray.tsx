"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import StoryViewer from "@/components/StoryViewer";
import { isEmbedRoute, langFromPath } from "@/components/SupportButton";
import { storyImageSrc, storyShortId, trackStory, type Story } from "@/lib/stories";

const SEEN_KEY = "bnc_seen_stories";

function readSeen(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function writeSeen(seen: Set<string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen).slice(-200)));
  } catch {
    /* private mode / storage blocked — rings just stay "unseen" */
  }
}

const UNSEEN_RING = "conic-gradient(from 210deg, #E60A1C, #FF6A00, #FFC400, #FF6A00, #E60A1C)";
const SEEN_RING = "#D3D7DD";

export default function StoriesTray({ stories }: { stories: Story[] }) {
  const pathname = usePathname() || "/";
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [openAt, setOpenAt] = useState<number | null>(null);

  useEffect(() => {
    setSeen(readSeen());
    // Shared links: /any-page?story=<id> opens that story straight away.
    const shared = new URLSearchParams(window.location.search).get("story");
    const i = shared ? stories.findIndex((s) => storyShortId(s.id) === shared) : -1;
    if (i >= 0) {
      setOpenAt(i);
      trackStory("story_open", { story_id: stories[i].id, source: "shared_link" });
    }
  }, [stories]);

  const markSeen = useCallback((id: string) => {
    setSeen((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      writeSeen(next);
      return next;
    });
  }, []);

  // German-only content: not in the embed widget, the admin, or the EN/PL pages.
  if (isEmbedRoute(pathname) || pathname.startsWith("/admin") || langFromPath(pathname) !== "de") {
    return null;
  }

  return (
    <section aria-label="Stories" className="stories-tray relative z-30 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-3">
      <div className="stories-scroll flex gap-3 sm:gap-4 overflow-x-auto snap-x px-1 py-1">
        {stories.map((s, i) => {
          const isSeen = seen.has(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setOpenAt(i);
                trackStory("story_open", { story_id: s.id, source: "tray", position: i + 1 });
              }}
              aria-label={`Story ansehen: ${s.title}`}
              className="group snap-start flex-shrink-0 w-[70px] sm:w-[78px] flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <span
                className="relative rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-95 group-focus-visible:ring-2 group-focus-visible:ring-[#E60A1C] group-focus-visible:ring-offset-2"
                style={{ background: isSeen ? SEEN_RING : UNSEEN_RING }}
              >
                <span className="block rounded-full bg-[#F4F5F7] p-[2.5px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- already resized by Cloudinary */}
                  <img
                    src={storyImageSrc(s, "thumb")}
                    alt=""
                    width={66}
                    height={66}
                    loading={i < 6 ? "eager" : "lazy"}
                    decoding="async"
                    className="block h-[58px] w-[58px] sm:h-[66px] sm:w-[66px] rounded-full object-cover bg-[#E4E7EB]"
                  />
                </span>
                {s.isNew && !isSeen && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-md bg-[#E60A1C] px-1.5 py-px text-[9px] font-bold leading-tight tracking-wide text-white ring-2 ring-[#F4F5F7]">
                    NEU
                  </span>
                )}
              </span>
              <span
                className={`w-full truncate text-center text-[11px] sm:text-xs leading-tight ${
                  isSeen ? "text-black/50" : "font-semibold text-black/80"
                }`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {openAt !== null && (
        <StoryViewer
          stories={stories}
          startIndex={openAt}
          onSeen={markSeen}
          onClose={() => setOpenAt(null)}
        />
      )}
    </section>
  );
}
