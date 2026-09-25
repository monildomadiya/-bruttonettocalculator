"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  ImagePlus,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  countWords,
  GOOD_BODY_WORDS,
  MIN_BODY_WORDS,
  POST_CATEGORIES,
  POST_LIMITS,
  postImagePath,
  slugify,
  type Post,
  type PostCategory,
  type PostFact,
} from "@/lib/posts";

/** Shared with /admin/stories, so one login covers both pages. */
const PW_KEY = "bnc_stories_pw";

interface CalculatorOption {
  href: string;
  label: string;
  group: string;
}

interface Draft {
  mode: "create" | "edit";
  slug: string;
  slugTouched: boolean;
  title: string;
  description: string;
  category: PostCategory;
  body: string;
  facts: PostFact[];
  calculator: string;
  alt: string;
  image: Post["image"] | null;
  file: File | null;
}

const emptyDraft = (): Draft => ({
  mode: "create",
  slug: "",
  slugTouched: false,
  title: "",
  description: "",
  category: POST_CATEGORIES[0],
  body: "",
  facts: [{ label: "", value: "" }],
  calculator: "",
  alt: "",
  image: null,
  file: null,
});

const inputClass =
  "w-full rounded-xl border border-[#E4E7EB] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none transition focus:border-[#E60A1C] focus:ring-2 focus:ring-[#E60A1C]/15 disabled:bg-[#F4F5F7] disabled:text-black/50";
const labelClass = "mb-1.5 flex items-baseline justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-black/60";

function Counter({ n, max, min = 0, ideal }: { n: number; max: number; min?: number; ideal?: number }) {
  const bad = n > max || (min > 0 && n > 0 && n < min);
  const warn = ideal !== undefined && n > ideal;
  return (
    <span className={`normal-case tracking-normal ${bad ? "text-[#B5081A]" : warn ? "text-amber-600" : "text-black/40"}`}>
      {n}/{max}
    </span>
  );
}

/** Upload with progress, resolving to Cloudinary's JSON response. */
function upload(url: string, form: FormData, onProgress: (p: number) => void) {
  return new Promise<{ public_id: string; version: number; width: number; height: number }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) return resolve(data as never);
      const err = data.error as { message?: string } | undefined;
      reject(new Error(err?.message || `Upload fehlgeschlagen (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Netzwerkfehler beim Upload."));
    xhr.send(form);
  });
}

export default function PostsAdmin({ calculators }: { calculators: CalculatorOption[] }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const api = useCallback(
    async (method: string, body?: unknown, query = "", pw = password) => {
      const res = await fetch(`/api/posts/admin${query}`, {
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
      setPosts(data.posts);
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

  // Image preview: a newly picked file, else the stored image.
  useEffect(() => {
    if (draft?.file) {
      const url = URL.createObjectURL(draft.file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(draft?.image ? postImagePath({ slug: draft.slug || "vorschau", image: draft.image }, "full") : "");
  }, [draft?.file, draft?.image, draft?.slug]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const setTitle = (title: string) =>
    setDraft((d) => (d ? { ...d, title, slug: d.mode === "create" && !d.slugTouched ? slugify(title) : d.slug } : d));

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

  const edit = (p: Post) => {
    setError("");
    setNotice("");
    setDraft({
      mode: "edit",
      slug: p.slug,
      slugTouched: true,
      title: p.title,
      description: p.description,
      category: p.category,
      body: p.body,
      facts: p.facts.length ? p.facts : [{ label: "", value: "" }],
      calculator: p.calculator,
      alt: p.image.alt,
      image: p.image,
      file: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const words = draft ? countWords(draft.body) : 0;
  const checks = useMemo(() => {
    if (!draft) return [];
    return [
      { ok: Boolean(draft.file || draft.image), label: "Bild ausgewählt (ideal 1080 × 1350, Hochformat 4:5)" },
      { ok: draft.title.length >= 10 && draft.title.length <= POST_LIMITS.titleIdeal, label: `Titel 10–${POST_LIMITS.titleIdeal} Zeichen, Hauptkeyword vorne` },
      { ok: draft.description.length >= 120 && draft.description.length <= POST_LIMITS.description, label: "Beschreibung 120–160 Zeichen" },
      { ok: draft.alt.length >= 20, label: "Alt-Text beschreibt das Bild (für Google Bilder)" },
      { ok: words >= GOOD_BODY_WORDS, label: `Text ab ${GOOD_BODY_WORDS} Wörtern (Pflicht: ${MIN_BODY_WORDS})` },
      { ok: /^## /m.test(draft.body), label: "Mindestens eine Zwischenüberschrift (## …)" },
      { ok: draft.facts.some((f) => f.label && f.value), label: "Mindestens ein Kernfakt" },
      { ok: Boolean(draft.calculator), label: "Passender Rechner verlinkt (mehr Seitenaufrufe)" },
    ];
  }, [draft, words]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setError("");
    setNotice("");
    if (!draft.file && !draft.image) return setError("Bitte ein Bild auswählen.");
    if (draft.file && draft.file.size > POST_LIMITS.fileBytes) return setError("Bild ist größer als 10 MB.");
    if (words < MIN_BODY_WORDS) {
      return setError(`Der Text braucht mindestens ${MIN_BODY_WORDS} Wörter (aktuell ${words}).`);
    }

    setBusy(true);
    try {
      let image = draft.image;
      if (draft.file) {
        const signed = await api("POST", { action: "sign-image" });
        const form = new FormData();
        for (const [k, v] of Object.entries(signed.fields)) form.append(k, String(v));
        form.append("file", draft.file);
        setProgress(0);
        const up = await upload(signed.uploadUrl, form, setProgress);
        image = { id: up.public_id, version: up.version, width: up.width, height: up.height, alt: draft.alt };
      }
      const { post } = await api("POST", {
        action: "save",
        mode: draft.mode,
        slug: draft.slug,
        title: draft.title,
        description: draft.description,
        category: draft.category,
        body: draft.body,
        facts: draft.facts,
        calculator: draft.calculator,
        image: { ...image, alt: draft.alt },
      });
      await load();
      setDraft(null);
      setNotice(`Veröffentlicht: /infografiken/${post.slug}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const remove = async (p: Post) => {
    if (!confirm(`„${p.title}“ endgültig löschen? Die URL liefert danach 404.`)) return;
    setError("");
    try {
      await api("DELETE", undefined, `?slug=${encodeURIComponent(p.slug)}`);
      setPosts((list) => list.filter((x) => x.slug !== p.slug));
      if (draft?.slug === p.slug) setDraft(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl shadow-black/5">
          <h1 className="font-display text-2xl font-bold text-[#16181D]">Infografiken verwalten</h1>
          <p className="mt-1 text-sm text-black/55">Gleiches Passwort wie für die Stories.</p>
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

  const calcGroups = Array.from(
    calculators.reduce((m, c) => m.set(c.group, [...(m.get(c.group) ?? []), c]), new Map<string, CalculatorOption[]>())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#16181D]">Infografiken</h1>
          <p className="mt-1 text-sm text-black/55">
            Bild-Beiträge mit eigener Seite unter{" "}
            <Link href="/infografiken" target="_blank" className="font-semibold text-[#E60A1C] hover:underline">
              /infografiken
            </Link>{" "}
            — indexierbar, in der Sitemap, mit Rechner-Link.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/stories" className="rounded-xl px-3 py-2 text-sm font-semibold text-black/60 hover:bg-white">
            Stories →
          </Link>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(PW_KEY);
              setPassword("");
              setAuthed(false);
            }}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-black/60 hover:bg-white"
          >
            <LogOut size={16} /> Abmelden
          </button>
        </div>
      </div>

      {error && <p className="mt-6 rounded-xl bg-[#E60A1C]/10 px-3 py-2 text-sm text-[#B5081A]">{error}</p>}
      {notice && (
        <p className="mt-6 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}{" "}
          <a href={notice.slice(notice.indexOf("/"))} target="_blank" rel="noreferrer" className="font-semibold underline">
            ansehen
          </a>
        </p>
      )}

      {!draft && (
        <button
          type="button"
          onClick={() => {
            setError("");
            setNotice("");
            setDraft(emptyDraft());
          }}
          className="mt-8 flex items-center gap-2 rounded-xl bg-[#E60A1C] px-5 py-3 font-semibold text-white transition hover:bg-[#B5081A]"
        >
          <Plus size={18} /> Neue Infografik
        </button>
      )}

      {draft && (
        <form onSubmit={save} className="mt-8 rounded-3xl bg-white p-5 shadow-xl shadow-black/5 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#16181D]">
              {draft.mode === "create" ? "Neue Infografik" : "Infografik bearbeiten"}
            </h2>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Abbrechen"
              className="rounded-full p-2 text-black/50 hover:bg-black/5"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr_260px]">
            {/* Image */}
            <div className="space-y-3">
              <label className="relative flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#E4E7EB] bg-[#F4F5F7] text-center text-sm text-black/50 transition hover:border-[#E60A1C]">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Vorschau" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <>
                    <ImagePlus size={32} className="mb-2 text-[#E60A1C]" />
                    Bild wählen
                    <span className="mt-1 px-4 text-xs">1080 × 1350 px ideal · max. 10 MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => set("file", e.target.files?.[0] ?? null)}
                />
              </label>
              {preview && <p className="text-center text-xs text-black/50">Klicken zum Ersetzen</p>}
              <div>
                <label className={labelClass} htmlFor="p-alt">
                  Alt-Text <Counter n={draft.alt.length} max={POST_LIMITS.alt} />
                </label>
                <textarea
                  id="p-alt"
                  className={`${inputClass} min-h-[70px]`}
                  value={draft.alt}
                  maxLength={POST_LIMITS.alt}
                  onChange={(e) => set("alt", e.target.value)}
                  placeholder="Was zeigt das Bild? z. B. Balkendiagramm: Netto bei 3.000 € brutto in allen Steuerklassen"
                  required
                />
              </div>
            </div>

            {/* Text */}
            <div className="min-w-0 space-y-4">
              <div>
                <label className={labelClass} htmlFor="p-title">
                  Titel (H1 &amp; Google-Titel) <Counter n={draft.title.length} max={POST_LIMITS.title} ideal={POST_LIMITS.titleIdeal} />
                </label>
                <input
                  id="p-title"
                  className={inputClass}
                  value={draft.title}
                  maxLength={POST_LIMITS.title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z. B. 3.000 € brutto in netto: alle Steuerklassen 2026"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="p-slug">
                  URL <span className="normal-case tracking-normal text-black/40">/infografiken/…</span>
                </label>
                <input
                  id="p-slug"
                  className={inputClass}
                  value={draft.slug}
                  disabled={draft.mode === "edit"}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, slug: slugify(e.target.value), slugTouched: true } : d))
                  }
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="p-desc">
                  Beschreibung (Google-Snippet){" "}
                  <Counter n={draft.description.length} max={POST_LIMITS.description} min={POST_LIMITS.descriptionMin} />
                </label>
                <textarea
                  id="p-desc"
                  className={`${inputClass} min-h-[70px]`}
                  value={draft.description}
                  maxLength={POST_LIMITS.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Ein bis zwei Sätze: Was erfährt man, welche Zahl steht im Mittelpunkt?"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="p-cat">Kategorie</label>
                  <select
                    id="p-cat"
                    className={inputClass}
                    value={draft.category}
                    onChange={(e) => set("category", e.target.value as PostCategory)}
                  >
                    {POST_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="p-calc">Passender Rechner</label>
                  <select
                    id="p-calc"
                    className={inputClass}
                    value={draft.calculator}
                    onChange={(e) => set("calculator", e.target.value)}
                  >
                    <option value="">— keiner —</option>
                    {calcGroups.map(([group, items]) => (
                      <optgroup key={group} label={group}>
                        {items.map((c) => (
                          <option key={c.href} value={c.href}>
                            {c.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className={labelClass}>
                  Kernfakten <span className="normal-case tracking-normal text-black/40">(max. {POST_LIMITS.facts})</span>
                </p>
                <div className="space-y-2">
                  {draft.facts.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className={inputClass}
                        value={f.label}
                        maxLength={POST_LIMITS.factText}
                        placeholder="z. B. Netto in Steuerklasse 1"
                        onChange={(e) =>
                          set("facts", draft.facts.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                        }
                      />
                      <input
                        className={`${inputClass} sm:max-w-[160px]`}
                        value={f.value}
                        maxLength={POST_LIMITS.factText}
                        placeholder="2.024 €"
                        onChange={(e) =>
                          set("facts", draft.facts.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                        }
                      />
                      <button
                        type="button"
                        aria-label="Fakt entfernen"
                        onClick={() => set("facts", draft.facts.filter((_, j) => j !== i))}
                        className="flex-shrink-0 rounded-xl px-2 text-black/40 hover:bg-black/5 hover:text-[#B5081A]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {draft.facts.length < POST_LIMITS.facts && (
                  <button
                    type="button"
                    onClick={() => set("facts", [...draft.facts, { label: "", value: "" }])}
                    className="mt-2 text-sm font-semibold text-[#E60A1C] hover:underline"
                  >
                    + Fakt hinzufügen
                  </button>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="p-body">
                  Text zur Grafik
                  <span
                    className={`normal-case tracking-normal ${
                      words < MIN_BODY_WORDS ? "text-[#B5081A]" : words < GOOD_BODY_WORDS ? "text-amber-600" : "text-emerald-600"
                    }`}
                  >
                    {words} Wörter
                  </span>
                </label>
                <textarea
                  id="p-body"
                  className={`${inputClass} min-h-[260px] font-mono text-[13px] leading-relaxed`}
                  value={draft.body}
                  maxLength={POST_LIMITS.body}
                  onChange={(e) => set("body", e.target.value)}
                  placeholder={"Erklären Sie die Grafik in eigenen Worten.\n\n## Zwischenüberschrift\n\nLeerzeile = neuer Absatz.\n- Aufzählung mit Bindestrich\n- **fett** mit zwei Sternchen"}
                  required
                />
              </div>
            </div>

            {/* SEO */}
            <aside className="space-y-5">
              <div>
                <p className={labelClass}>Google-Vorschau</p>
                <div className="rounded-2xl border border-black/[0.08] p-3">
                  <p className="truncate text-xs text-black/55">
                    bruttonettocalculator.com › infografiken › {draft.slug || "…"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[17px] leading-snug text-[#1a0dab]">
                    {draft.title || "Titel der Infografik"}
                  </p>
                  <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-black/70">
                    {draft.description || "Beschreibung erscheint hier."}
                  </p>
                </div>
              </div>
              <div>
                <p className={labelClass}>SEO-Check</p>
                <ul className="space-y-2">
                  {checks.map((c) => (
                    <li key={c.label} className="flex gap-2 text-[13px] leading-snug">
                      {c.ok ? (
                        <CheckCircle2 size={16} className="mt-px flex-shrink-0 text-emerald-600" />
                      ) : (
                        <Circle size={16} className="mt-px flex-shrink-0 text-black/25" />
                      )}
                      <span className={c.ok ? "text-black/70" : "text-black/50"}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#E60A1C] py-3 font-semibold text-white transition hover:bg-[#B5081A] disabled:opacity-70"
              >
                {progress !== null && (
                  <span className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${progress * 100}%` }} />
                )}
                {busy && <Loader2 size={18} className="animate-spin" />}
                {progress !== null
                  ? `Bild lädt … ${Math.round(progress * 100)} %`
                  : draft.mode === "create"
                    ? "Veröffentlichen"
                    : "Änderungen speichern"}
              </button>
            </aside>
          </div>
        </form>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-[#16181D]">Veröffentlicht ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="mt-3 text-sm text-black/55">Noch keine Infografiken.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((p) => (
              <li key={p.slug} className="overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5">
                <div className="relative aspect-square bg-[#ECEEF1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={postImagePath(p, "thumb")} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-[#16181D]">{p.title}</p>
                  <p className="mt-1 text-xs text-black/50">
                    {p.category} · {countWords(p.body)} Wörter
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => edit(p)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-black/60 hover:bg-black/5"
                    >
                      <Pencil size={13} /> Bearbeiten
                    </button>
                    <a
                      href={`/infografiken/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Ansehen"
                      className="rounded-lg p-1.5 text-black/50 hover:bg-black/5"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      aria-label={`${p.title} löschen`}
                      className="ml-auto rounded-lg p-1.5 text-black/40 hover:bg-[#E60A1C]/10 hover:text-[#B5081A]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
