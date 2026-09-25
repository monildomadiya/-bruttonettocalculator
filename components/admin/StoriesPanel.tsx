"use client";

import { useState } from "react";
import { Clock, Eye, Images, Pencil, Plus, Trash2 } from "lucide-react";
import { postImagePath } from "@/lib/posts";
import { storyImageSrc, storyShortId } from "@/lib/stories";
import { expiresSoon, expiryLabel, useAdmin, type AdminStory } from "./context";
import { Button, Sheet, useToast } from "./ui";

export default function StoriesPanel() {
  const { stories, posts, api, reload, openStory } = useAdmin();
  const toast = useToast();
  const [view, setView] = useState<"active" | "expired">("active");
  const [busy, setBusy] = useState("");
  const [picking, setPicking] = useState(false);

  const active = stories.filter((s) => !s.expired);
  const expired = stories.filter((s) => s.expired);
  const list = view === "active" ? active : expired;

  const run = async (id: string, fn: () => Promise<unknown>, ok: string) => {
    setBusy(id);
    try {
      await fn();
      await reload();
      toast("ok", ok);
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const extend = (s: AdminStory) =>
    run(s.id, () => api("/api/stories/admin", { method: "POST", body: { action: "update", id: s.id, extendHours: 168 } }), s.expired ? "Wieder aktiv für 7 Tage." : "Um 7 Tage verlängert.");

  const remove = (s: AdminStory) => {
    if (!confirm(`Story „${s.title}“ endgültig löschen?`)) return;
    run(s.id, () => api(`/api/stories/admin?id=${encodeURIComponent(s.id)}`, { method: "DELETE" }), "Story gelöscht.");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl bg-black/[0.05] p-1">
          {(["active", "expired"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`min-h-[36px] rounded-lg px-3.5 text-sm font-semibold transition ${
                view === v ? "bg-white text-[#16181D] shadow-sm" : "text-black/55"
              }`}
            >
              {v === "active" ? `Aktiv (${active.length})` : `Abgelaufen (${expired.length})`}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          {posts.length > 0 && (
            <Button variant="soft" onClick={() => setPicking(true)}>
              <Images size={16} /> <span className="hidden sm:inline">Aus Infografik</span>
            </Button>
          )}
          <Button onClick={() => openStory({ mode: "create" })}>
            <Plus size={16} /> Neue Story
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-black/50">
          {view === "active" ? "Keine aktive Story. Neue Story oder aus einer Infografik erstellen." : "Keine abgelaufenen Stories."}
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((s) => (
            <li key={s.id} className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5">
              <div className="relative aspect-[9/16] bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={storyImageSrc(s, "full")}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full object-cover ${s.expired ? "opacity-60 grayscale" : ""}`}
                />
                <span
                  className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                    s.expired
                      ? "bg-black/60 text-white"
                      : expiresSoon(s)
                        ? "bg-amber-400 text-black"
                        : "bg-white/90 text-[#16181D]"
                  }`}
                >
                  <Clock size={11} /> {expiryLabel(s.expiresAt)}
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10">
                  <p className="truncate text-sm font-semibold text-white">{s.title}</p>
                  {s.link && <p className="truncate text-[11px] text-white/75">→ {s.link}</p>}
                </div>
              </div>
              <div className="flex items-center gap-0.5 p-1.5">
                <IconBtn label="Bearbeiten" onClick={() => openStory({ mode: "edit", story: s })}>
                  <Pencil size={16} />
                </IconBtn>
                {!s.expired && (
                  <a
                    href={`/?story=${storyShortId(s.id)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Auf der Website ansehen"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-black/55 hover:bg-black/5"
                  >
                    <Eye size={16} />
                  </a>
                )}
                {s.expiresAt && (
                  <button
                    type="button"
                    onClick={() => extend(s)}
                    disabled={busy === s.id}
                    className="h-10 whitespace-nowrap rounded-xl px-2 text-xs font-bold text-[#E60A1C] hover:bg-[#E60A1C]/10 disabled:opacity-50"
                  >
                    +7 T.
                  </button>
                )}
                <IconBtn label="Löschen" onClick={() => remove(s)} danger>
                  <Trash2 size={16} />
                </IconBtn>
              </div>
            </li>
          ))}
        </ul>
      )}

      {picking && (
        <Sheet title="Infografik als Story" onClose={() => setPicking(false)}>
          <p className="mb-4 text-sm text-black/60">
            Bild und Link werden übernommen — kein Upload nötig. Wählen Sie eine Infografik:
          </p>
          <ul className="grid grid-cols-3 gap-2">
            {posts.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setPicking(false);
                    openStory({ mode: "from-post", post: p });
                  }}
                  className="block w-full text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={postImagePath(p, "thumb")} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  <span className="mt-1 line-clamp-2 block text-xs font-medium text-black/70">{p.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
        danger ? "ml-auto text-black/40 hover:bg-[#E60A1C]/10 hover:text-[#B5081A]" : "text-black/55 hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}
