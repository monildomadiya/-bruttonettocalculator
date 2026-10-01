"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { postImagePath, type Post } from "@/lib/posts";

type GridPost = Pick<Post, "slug" | "title" | "category" | "image">;

/**
 * Infografik cards (4:5, like the uploads) with category chips. Every tile is in the server HTML
 * (crawlable links); the chips only hide tiles in the browser.
 */
export default function PostGrid({ posts, filter = true }: { posts: GridPost[]; filter?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const visible = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <div>
      {filter && categories.length > 1 && (
        <div className="stories-scroll -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "alle"}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={`flex-shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                active === c
                  ? "border-[#16181D] bg-[#16181D] text-white"
                  : "border-black/10 bg-white text-black/70 hover:border-black/30"
              }`}
            >
              {c ?? "Alle"}
              <span className={`ml-1.5 text-xs ${active === c ? "text-white/60" : "text-black/40"}`}>
                {c ? posts.filter((p) => p.category === c).length : posts.length}
              </span>
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {visible.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/infografiken/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E60A1C]/30 hover:shadow-xl hover:shadow-black/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E60A1C]"
            >
              <span className="relative block aspect-[4/5] overflow-hidden bg-[#ECEEF1]">
                {/* eslint-disable-next-line @next/next/no-img-element -- resized by Cloudinary */}
                <img
                  src={postImagePath(p, "tile")}
                  alt={p.image.alt}
                  width={600}
                  height={750}
                  loading={i < 6 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </span>
              <span className="flex flex-1 flex-col gap-1 border-t border-black/[0.06] p-3 sm:p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E60A1C] sm:text-[11px]">
                  {p.category}
                </span>
                <span className="line-clamp-2 text-sm font-bold leading-snug text-[#16181D] sm:text-base">
                  {p.title}
                </span>
                <span className="mt-auto hidden items-center gap-1 pt-2 text-xs font-semibold text-black/50 transition-colors group-hover:text-[#E60A1C] sm:inline-flex">
                  Ansehen <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
