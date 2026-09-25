"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, Clock, ExternalLink, Images, ImagePlus, Plus, Sparkles, Trash2 } from "lucide-react";
import { postImagePath, postSeoScore } from "@/lib/posts";
import { storyImageSrc } from "@/lib/stories";
import { expiresSoon, expiryLabel, useAdmin } from "./context";
import { Button, useToast } from "./ui";

export default function Dashboard() {
  const { stories, posts, setTab, openStory, openPost, api, reload } = useAdmin();
  const toast = useToast();
  const [busy, setBusy] = useState("");

  const active = stories.filter((s) => !s.expired);
  const expired = stories.filter((s) => s.expired);
  const soon = active.filter(expiresSoon);
  const scored = posts.map((p) => ({ post: p, ...postSeoScore(p) }));
  const avgScore = scored.length ? Math.round(scored.reduce((a, s) => a + s.score, 0) / scored.length) : 0;
  const weak = scored.filter((s) => s.score < 100).sort((a, b) => a.score - b.score).slice(0, 5);
  const week = Date.now() - 7 * 864e5;
  const postsThisWeek = posts.filter((p) => Date.parse(p.publishedAt) > week).length;

  const extend = async (id: string) => {
    setBusy(id);
    try {
      await api("/api/stories/admin", { method: "POST", body: { action: "update", id, extendHours: 168 } });
      await reload();
      toast("ok", "Um 7 Tage verlängert.");
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const cleanUp = async () => {
    if (!confirm(`${expired.length} abgelaufene Stories endgültig löschen?`)) return;
    setBusy("cleanup");
    try {
      for (const s of expired) {
        await api(`/api/stories/admin?id=${encodeURIComponent(s.id)}`, { method: "DELETE" });
      }
      await reload();
      toast("ok", "Abgelaufene Stories gelöscht.");
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const stats = [
    { label: "Aktive Stories", value: active.length, sub: soon.length ? `${soon.length} laufen < 24 h ab` : "alles im grünen Bereich", tab: "stories" as const },
    { label: "Infografiken", value: posts.length, sub: `${postsThisWeek} diese Woche`, tab: "posts" as const },
    { label: "Ø SEO-Score", value: posts.length ? `${avgScore}%` : "–", sub: weak.length ? `${weak.length} mit Verbesserungen` : "alle vollständig", tab: "posts" as const },
    { label: "Abgelaufen", value: expired.length, sub: expired.length ? "können gelöscht werden" : "nichts aufzuräumen", tab: "stories" as const },
  ];

  const empty = stories.length === 0 && posts.length === 0;

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => openStory({ mode: "create" })}
          className="flex min-h-[88px] flex-col items-start justify-between rounded-2xl p-4 text-left text-white shadow-lg shadow-[#E60A1C]/20 transition active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #E60A1C, #FF6A00)" }}
        >
          <Plus size={22} />
          <span className="font-semibold">Neue Story</span>
        </button>
        <button
          type="button"
          onClick={() => openPost({ mode: "create" })}
          className="flex min-h-[88px] flex-col items-start justify-between rounded-2xl bg-[#16181D] p-4 text-left text-white shadow-lg shadow-black/10 transition active:scale-[0.98]"
        >
          <ImagePlus size={22} />
          <span className="font-semibold">Neue Infografik</span>
        </button>
      </div>

      {empty && (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-5 text-sm text-black/65">
          <p className="flex items-center gap-2 font-semibold text-[#16181D]">
            <Sparkles size={16} className="text-[#E60A1C]" /> Los geht’s
          </p>
          <p className="mt-1.5">
            Starten Sie mit einer Infografik zu einem Thema mit hohem Suchinteresse (z. B. Nettogehalt, PKV, Rente) —
            und machen Sie daraus mit einem Tipp eine Story, die auf jeder Seite erscheint.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setTab(s.tab)}
            className="rounded-2xl bg-white p-4 text-left shadow-sm shadow-black/5 transition hover:shadow-md"
          >
            <p className="text-xs font-medium text-black/55">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-[#16181D]">{s.value}</p>
            <p className="mt-1 truncate text-xs text-black/45">{s.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Needs attention */}
        <section className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5 sm:p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-[#16181D]">
            <AlertTriangle size={17} className="text-amber-500" /> Braucht Aufmerksamkeit
          </h2>
          {soon.length === 0 && weak.length === 0 && expired.length === 0 ? (
            <p className="mt-3 text-sm text-black/55">Nichts zu tun — alles aktuell. 👍</p>
          ) : (
            <ul className="mt-3 divide-y divide-black/[0.06]">
              {soon.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={storyImageSrc(s, "thumb")} alt="" className="h-11 w-11 flex-shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#16181D]">{s.title}</p>
                    <p className="flex items-center gap-1 text-xs text-amber-600">
                      <Clock size={12} /> Story {expiryLabel(s.expiresAt)}
                    </p>
                  </div>
                  <Button variant="soft" busy={busy === s.id} onClick={() => extend(s.id)} className="flex-shrink-0 !px-3">
                    +7 Tage
                  </Button>
                </li>
              ))}
              {weak.map(({ post, score, missing }) => (
                <li key={post.slug} className="flex items-center gap-3 py-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={postImagePath(post, "thumb")} alt="" className="h-11 w-11 flex-shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#16181D]">{post.title}</p>
                    <p className="truncate text-xs text-black/50">
                      SEO {score}% · fehlt: {missing[0]}
                    </p>
                  </div>
                  <Button variant="soft" onClick={() => openPost({ mode: "edit", post })} className="flex-shrink-0 !px-3">
                    Verbessern
                  </Button>
                </li>
              ))}
              {expired.length > 0 && (
                <li className="flex items-center gap-3 py-2.5">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-black/40">
                    <Trash2 size={18} />
                  </span>
                  <p className="min-w-0 flex-1 text-sm text-black/65">{expired.length} abgelaufene Stories</p>
                  <Button variant="soft" busy={busy === "cleanup"} onClick={cleanUp} className="flex-shrink-0 !px-3">
                    Aufräumen
                  </Button>
                </li>
              )}
            </ul>
          )}
        </section>

        {/* Latest content */}
        <section className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-[#16181D]">
              <Images size={17} className="text-[#E60A1C]" /> Neueste Infografiken
            </h2>
            <button type="button" onClick={() => setTab("posts")} className="flex items-center gap-1 text-sm font-semibold text-[#E60A1C]">
              Alle <ArrowRight size={14} />
            </button>
          </div>
          {posts.length === 0 ? (
            <p className="mt-3 text-sm text-black/55">Noch keine Infografiken.</p>
          ) : (
            <ul className="mt-3 grid grid-cols-3 gap-2">
              {posts.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/infografiken/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-xl bg-black/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={postImagePath(p, "thumb")} alt={p.title} className="h-full w-full object-cover" />
                    <ExternalLink size={14} className="absolute right-1.5 top-1.5 text-white opacity-0 drop-shadow group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
