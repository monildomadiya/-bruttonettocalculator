"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, LogOut, Trash2, Upload } from "lucide-react";
import type { StoryLinkOption } from "@/lib/storyLinks";
import {
  DEFAULT_STORY_HOURS,
  normalizeStoryLink,
  STORY_DURATIONS,
  STORY_LIMITS,
  storyImageSrc,
} from "@/lib/stories";

const PW_KEY = "bnc_stories_pw";
const CUSTOM = "__custom__";

interface AdminStory {
  id: string;
  version: number;
  title: string;
  caption: string;
  link: string;
  linkLabel: string;
  createdAt: string;
  expiresAt: string | null;
  expired: boolean;
}

const inputClass =
  "w-full rounded-xl border border-[#E4E7EB] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none transition focus:border-[#E60A1C] focus:ring-2 focus:ring-[#E60A1C]/15";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black/60";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
}

/** Upload with progress — fetch() can't report upload progress. */
function uploadWithProgress(url: string, form: FormData, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = `Upload fehlgeschlagen (${xhr.status})`;
      try {
        msg = JSON.parse(xhr.responseText).error.message || msg;
      } catch {}
      reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error("Netzwerkfehler beim Upload."));
    xhr.send(form);
  });
}

export default function StoriesAdmin({ linkOptions }: { linkOptions: StoryLinkOption[] }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Form
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [linkChoice, setLinkChoice] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [hours, setHours] = useState<number>(DEFAULT_STORY_HOURS);
  const [progress, setProgress] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const groups = useMemo(() => {
    const map = new Map<string, StoryLinkOption[]>();
    for (const o of linkOptions) map.set(o.group, [...(map.get(o.group) ?? []), o]);
    return Array.from(map);
  }, [linkOptions]);

  const api = useCallback(
    async (method: string, body?: unknown, query = "", pw = password) => {
      const res = await fetch(`/api/stories/admin${query}`, {
        method,
        headers: { "x-stories-password": pw, ...(body ? { "Content-Type": "application/json" } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        sessionStorage.removeItem(PW_KEY);
        setAuthed(false);
      }
      if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
      return data;
    },
    [password]
  );

  const load = useCallback(
    async (pw = password) => {
      const data = await api("GET", undefined, "", pw);
      setStories(data.stories);
      setAuthed(true);
    },
    [api, password]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPassword(saved);
      load(saved).catch((e) => setError(e.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await load(password);
      sessionStorage.setItem(PW_KEY, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(PW_KEY);
    setPassword("");
    setAuthed(false);
  };

  const chooseLink = (value: string) => {
    setLinkChoice(value);
    const option = linkOptions.find((o) => o.href === value);
    setLinkLabel(option ? option.label.slice(0, STORY_LIMITS.linkLabel) : "");
  };

  const link = linkChoice === CUSTOM ? customLink : linkChoice;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!file) return setError("Bitte ein Bild auswählen.");
    if (file.size > STORY_LIMITS.fileBytes) return setError("Bild ist größer als 10 MB.");
    if (normalizeStoryLink(link) === null) {
      return setError("Link muss mit / beginnen oder eine https-Adresse sein.");
    }

    setBusy(true);
    try {
      const signed = await api("POST", {
        action: "sign",
        title,
        caption,
        link,
        linkLabel,
        durationHours: hours,
      });
      const form = new FormData();
      for (const [k, v] of Object.entries(signed.fields)) form.append(k, String(v));
      form.append("file", file);
      setProgress(0);
      await uploadWithProgress(signed.uploadUrl, form, setProgress);
      await api("POST", { action: "published" });
      await load();
      setFile(null);
      setTitle("");
      setCaption("");
      setLinkChoice("");
      setCustomLink("");
      setLinkLabel("");
      setNotice("Story ist live — sie erscheint jetzt auf allen Seiten.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const remove = async (s: AdminStory) => {
    if (!confirm(`Story „${s.title}“ endgültig löschen?`)) return;
    setError("");
    try {
      await api("DELETE", undefined, `?id=${encodeURIComponent(s.id)}`);
      setStories((list) => list.filter((x) => x.id !== s.id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl shadow-black/5">
          <h1 className="font-display text-2xl font-bold text-[#16181D]">Stories verwalten</h1>
          <p className="mt-1 text-sm text-black/55">Admin-Passwort aus STORIES_ADMIN_PASSWORD.</p>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} mt-5`}
            placeholder="Passwort"
            required
          />
          {error && <p className="mt-3 text-sm text-[#B5081A]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60A1C] py-2.5 font-semibold text-white transition hover:bg-[#B5081A] disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />} Anmelden
          </button>
        </form>
      </div>
    );
  }

  const active = stories.filter((s) => !s.expired);
  const expired = stories.filter((s) => s.expired);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#16181D]">Stories</h1>
          <p className="mt-1 text-sm text-black/55">
            Bild hochladen, Beitrag verknüpfen — die Story erscheint als Ring unter dem Menü auf jeder Seite.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/posts" className="rounded-xl px-3 py-2 text-sm font-semibold text-black/60 transition hover:bg-white">
            Infografiken →
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-black/60 transition hover:bg-white"
          >
            <LogOut size={16} /> Abmelden
          </button>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 grid gap-6 rounded-3xl bg-white p-5 shadow-xl shadow-black/5 sm:p-7 md:grid-cols-[220px_1fr]"
      >
        {/* Image picker with 9:16 preview */}
        <label className="relative flex aspect-[9/16] w-full max-w-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#E4E7EB] bg-[#F4F5F7] text-center text-sm text-black/50 transition hover:border-[#E60A1C]">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Vorschau" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <>
              <ImagePlus size={32} className="mb-2 text-[#E60A1C]" />
              Bild wählen
              <span className="mt-1 text-xs">Hochformat 9:16 ideal · max. 10 MB</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="st-title">
              Titel unter dem Ring <span className="normal-case tracking-normal text-black/40">({title.length}/{STORY_LIMITS.title})</span>
            </label>
            <input
              id="st-title"
              className={inputClass}
              value={title}
              maxLength={STORY_LIMITS.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Mindestlohn 2027"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="st-caption">
              Text auf der Story <span className="normal-case tracking-normal text-black/40">({caption.length}/{STORY_LIMITS.caption}, optional)</span>
            </label>
            <textarea
              id="st-caption"
              className={`${inputClass} min-h-[80px]`}
              value={caption}
              maxLength={STORY_LIMITS.caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="z. B. Ab Januar steigt der Mindestlohn — so viel bleibt netto."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="st-link">Verknüpfter Beitrag (Karte unten in der Story)</label>
            <select
              id="st-link"
              className={inputClass}
              value={linkChoice}
              onChange={(e) => chooseLink(e.target.value)}
            >
              <option value="">— kein Link —</option>
              {groups.map(([group, options]) => (
                <optgroup key={group} label={group}>
                  {options.map((o) => (
                    <option key={o.href} value={o.href}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value={CUSTOM}>Eigene URL …</option>
            </select>
            {linkChoice === CUSTOM && (
              <input
                className={`${inputClass} mt-2`}
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="/pfad oder https://…"
                required
              />
            )}
          </div>

          {link && (
            <div>
              <label className={labelClass} htmlFor="st-label">Text der Link-Karte</label>
              <input
                id="st-label"
                className={inputClass}
                value={linkLabel}
                maxLength={STORY_LIMITS.linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                placeholder="Leer = Titel des Beitrags"
              />
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="st-hours">Sichtbar für</label>
            <select
              id="st-hours"
              className={inputClass}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            >
              {STORY_DURATIONS.map((d) => (
                <option key={d.hours} value={d.hours}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="rounded-xl bg-[#E60A1C]/10 px-3 py-2 text-sm text-[#B5081A]">{error}</p>}
          {notice && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#E60A1C] py-3 font-semibold text-white transition hover:bg-[#B5081A] disabled:opacity-70"
          >
            {progress !== null && (
              <span className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${progress * 100}%` }} />
            )}
            {busy ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {progress !== null ? `Lädt hoch … ${Math.round(progress * 100)} %` : "Story veröffentlichen"}
          </button>
        </div>
      </form>

      {[
        { heading: `Aktiv (${active.length})`, list: active },
        { heading: `Abgelaufen (${expired.length})`, list: expired },
      ].map(({ heading, list }) =>
        list.length ? (
          <section key={heading} className="mt-10">
            <h2 className="font-display text-lg font-bold text-[#16181D]">{heading}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((s) => (
                <li key={s.id} className="overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5">
                  <div className="relative aspect-[9/16] bg-[#ECEEF1]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={storyImageSrc(s, "full")}
                      alt=""
                      loading="lazy"
                      className={`h-full w-full object-cover ${s.expired ? "opacity-50 grayscale" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(s)}
                      aria-label={`Story ${s.title} löschen`}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#E60A1C]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-3 text-xs text-black/60">
                    <p className="truncate text-sm font-semibold text-[#16181D]">{s.title}</p>
                    {s.link && <p className="mt-0.5 truncate">→ {s.link}</p>}
                    <p className="mt-1">
                      {s.expiresAt
                        ? `${s.expired ? "Abgelaufen" : "Bis"} ${formatDate(s.expiresAt)}`
                        : "Unbegrenzt"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}
    </div>
  );
}
