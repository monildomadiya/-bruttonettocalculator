"use client";

import { useState } from "react";
import Link from "next/link";
import { postImagePath, type Post } from "@/lib/posts";

type GridPost = Pick<Post, "slug" | "title" | "category" | "image">;

/**
 * Instagram-profile grid with category chips. Every tile is in the server HTML
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
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-3 gap-1 sm:gap-3">
        {visible.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/infografiken/${p.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-sm bg-[#E4E7EB] sm:rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- resized by Cloudinary */}
              <img
                src={postImagePath(p, "thumb")}
                alt={p.image.alt}
                width={600}
                height={600}
                loading={i < 9 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-2 opacity-100 transition-opacity sm:p-3 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                <span className="hidden text-[10px] font-bold uppercase tracking-widest text-white/80 sm:block">
                  {p.category}
                </span>
                <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-white sm:text-sm">
                  {p.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
