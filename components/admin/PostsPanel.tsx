"use client";

import { useMemo, useState } from "react";
import { Copy, Eye, Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { formatPostDate, POST_CATEGORIES, postImagePath, postSeoScore, type Post } from "@/lib/posts";
import { useAdmin } from "./context";
import { Button, inputClass, useToast } from "./ui";

type Sort = "new" | "old" | "seo";

export default function PostsPanel() {
  const { posts, api, reload, openPost, openStory } = useAdmin();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<Sort>("new");
  const [busy, setBusy] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts
      .filter((p) => !category || p.category === category)
      .filter((p) => !q || `${p.title} ${p.description} ${p.slug}`.toLowerCase().includes(q))
      .map((p) => ({ post: p, ...postSeoScore(p) }));
    if (sort === "old") list.reverse();
    if (sort === "seo") list.sort((a, b) => a.score - b.score);
    return list;
  }, [posts, query, category, sort]);

  const remove = async (p: Post) => {
    if (!confirm(`„${p.title}“ endgültig löschen? Die URL liefert danach 404.`)) return;
    setBusy(p.slug);
    try {
      await api(`/api/posts/admin?slug=${encodeURIComponent(p.slug)}`, { method: "DELETE" });
      await reload();
      toast("ok", "Infografik gelöscht.");
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const used = POST_CATEGORIES.filter((c) => posts.some((p) => p.category === c));

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen …"
            aria-label="Infografiken durchsuchen"
            className={`${inputClass} pl-10`}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Kategorie"
            className={`${inputClass} min-w-0 flex-1 sm:w-44 sm:flex-none`}
          >
            <option value="">Alle Kategorien</option>
            {used.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sortierung"
            className={`${inputClass} min-w-0 flex-1 sm:w-36 sm:flex-none`}
          >
            <option value="new">Neueste</option>
            <option value="old">Älteste</option>
            <option value="seo">SEO-Score ↑</option>
          </select>
          <Button onClick={() => openPost({ mode: "create" })} className="flex-none">
            <Plus size={16} /> <span className="hidden sm:inline">Neu</span>
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-center text-sm text-black/50">
          {posts.length ? "Keine Treffer." : "Noch keine Infografiken — legen Sie die erste an."}
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map(({ post: p, score, missing }) => (
            <li key={p.slug} className="rounded-2xl bg-white p-3 shadow-sm shadow-black/5">
              <div className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={postImagePath(p, "thumb")} alt="" loading="lazy" className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#16181D]">{p.title}</p>
                  <p className="mt-1 truncate text-xs text-black/50">
                    {p.category} · {formatPostDate(p.publishedAt)}
                  </p>
                  <p
                    title={missing.join("\n")}
                    className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      score >= 88
                        ? "bg-emerald-50 text-emerald-700"
                        : score >= 60
                          ? "bg-amber-50 text-amber-700"
                          : "bg-[#E60A1C]/10 text-[#B5081A]"
                    }`}
                  >
                    SEO {score}%
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-0.5 border-t border-black/[0.06] pt-1.5">
                <Action label="Bearbeiten" onClick={() => openPost({ mode: "edit", post: p })}>
                  <Pencil size={16} />
                </Action>
                <a
                  href={`/infografiken/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ansehen"
                  title="Ansehen"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-black/55 hover:bg-black/5"
                >
                  <Eye size={16} />
                </a>
                <Action label="Als Story teilen" onClick={() => openStory({ mode: "from-post", post: p })}>
                  <Sparkles size={16} />
                </Action>
                <Action label="Duplizieren (als Vorlage)" onClick={() => openPost({ mode: "duplicate", post: p })}>
                  <Copy size={16} />
                </Action>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  disabled={busy === p.slug}
                  aria-label="Löschen"
                  title="Löschen"
                  className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-black/40 hover:bg-[#E60A1C]/10 hover:text-[#B5081A] disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Action({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-black/55 hover:bg-black/5 hover:text-[#16181D]"
    >
      {children}
    </button>
  );
}
