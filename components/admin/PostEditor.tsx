"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, ImagePlus, X } from "lucide-react";
import {
  countWords,
  GOOD_BODY_WORDS,
  MIN_BODY_WORDS,
  POST_CATEGORIES,
  POST_LIMITS,
  postImagePath,
  postSeoChecks,
  slugify,
  type Post,
  type PostCategory,
  type PostFact,
} from "@/lib/posts";
import { useAdmin, type PostEditorState } from "./context";
import { uploadSigned } from "./imageTools";
import { Button, Counter, Field, inputClass, Sheet, useToast } from "./ui";

/** Unsent new-post drafts survive a closed tab or a phone call (this browser only). */
const DRAFT_KEY = "bnc_post_draft";

interface Draft {
  slug: string;
  slugTouched: boolean;
  title: string;
  description: string;
  category: PostCategory;
  body: string;
  facts: PostFact[];
  calculator: string;
  alt: string;
}

function initialDraft(state: PostEditorState): Draft {
  if (state.mode === "create") {
    const blank: Draft = {
      slug: "",
      slugTouched: false,
      title: "",
      description: "",
      category: POST_CATEGORIES[0],
      body: "",
      facts: [{ label: "", value: "" }],
      calculator: "",
      alt: "",
    };
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved && typeof saved === "object") {
        const merged = { ...blank, ...saved };
        return Array.isArray(merged.facts) ? merged : { ...merged, facts: blank.facts };
      }
    } catch {}
    return blank;
  }
  const p = state.post;
  const copy = state.mode === "duplicate";
  return {
    slug: copy ? "" : p.slug,
    slugTouched: !copy,
    title: copy ? `${p.title} (Kopie)` : p.title,
    description: p.description,
    category: p.category,
    body: p.body,
    facts: p.facts.length ? p.facts : [{ label: "", value: "" }],
    calculator: p.calculator,
    alt: copy ? "" : p.image.alt,
  };
}

export default function PostEditor({ state, onClose }: { state: PostEditorState; onClose: () => void }) {
  const { api, reload, calculators } = useAdmin();
  const toast = useToast();
  const editing = state.mode === "edit" ? state.post : null;

  const [d, setD] = useState<Draft>(() => initialDraft(state));
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const restored = useRef(state.mode === "create" && Boolean(d.title || d.body));

  useEffect(() => {
    if (restored.current) toast("ok", "Entwurf wiederhergestellt.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.mode !== "create") return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {}
  }, [d, state.mode]);

  useEffect(() => {
    if (!file) return setFilePreview("");
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((x) => ({ ...x, [key]: value }));
  const preview = filePreview || (editing ? postImagePath(editing, "full") : "");
  const words = countWords(d.body);
  const checks = postSeoChecks({ ...d, hasImage: Boolean(file || editing) });
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  const calcGroups = useMemo(() => {
    const map = new Map<string, typeof calculators>();
    for (const c of calculators) map.set(c.group, [...(map.get(c.group) ?? []), c]);
    return Array.from(map);
  }, [calculators]);

  const save = async () => {
    if (!file && !editing) return toast("error", "Bitte ein Bild auswählen.");
    if (file && file.size > 25 * 1024 * 1024) return toast("error", "Bild ist zu groß (max. 25 MB).");
    if (words < MIN_BODY_WORDS) return toast("error", `Der Text braucht mindestens ${MIN_BODY_WORDS} Wörter (jetzt ${words}).`);

    setBusy(true);
    try {
      let image: Post["image"] | undefined = editing?.image;
      if (file) {
        const signed = await api<{ uploadUrl: string; fields: Record<string, string> }>("/api/posts/admin", {
          method: "POST",
          body: { action: "sign-image" },
        });
        setProgress(0);
        const up = await uploadSigned(signed, file, setProgress);
        image = { id: up.public_id, version: up.version, width: up.width, height: up.height, alt: d.alt };
      }
      const { post } = await api<{ post: Post }>("/api/posts/admin", {
        method: "POST",
        body: {
          action: "save",
          mode: editing ? "edit" : "create",
          slug: d.slug,
          title: d.title,
          description: d.description,
          category: d.category,
          body: d.body,
          facts: d.facts,
          calculator: d.calculator,
          image: { ...image, alt: d.alt },
        },
      });
      if (state.mode === "create") {
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
      }
      toast("ok", editing ? "Änderungen sind live." : `Veröffentlicht: /infografiken/${post.slug}`);
      await reload();
      onClose();
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const discardDraft = () => {
    if (!confirm("Entwurf verwerfen?")) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    onClose();
  };

  const title = editing ? "Infografik bearbeiten" : state.mode === "duplicate" ? "Infografik duplizieren" : "Neue Infografik";

  return (
    <Sheet
      title={title}
      wide
      onClose={onClose}
      footer={
        <div className="flex items-center gap-3">
          <div className="hidden text-sm sm:block">
            <span className={`font-bold ${score >= 88 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-[#B5081A]"}`}>
              SEO {score}%
            </span>
            <span className="ml-2 text-black/50">{words} Wörter</span>
          </div>
          {state.mode === "create" && (d.title || d.body) && (
            <Button variant="ghost" onClick={discardDraft}>
              Verwerfen
            </Button>
          )}
          <Button onClick={save} busy={busy} className="relative flex-1 overflow-hidden sm:ml-auto sm:flex-none sm:px-8">
            {progress !== null && (
              <span className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${progress * 100}%` }} />
            )}
            {progress !== null
              ? `Bild lädt … ${Math.round(progress * 100)} %`
              : editing
                ? "Änderungen speichern"
                : "Veröffentlichen"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left: image + Google preview + SEO check */}
        <div className="space-y-5">
          <label className="relative mx-auto flex aspect-[4/5] w-full max-w-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-white text-center text-sm text-black/50 transition hover:border-[#E60A1C]">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Vorschau" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <ImagePlus size={32} className="mb-2 text-[#E60A1C]" />
                Bild wählen
                <span className="mt-1 px-4 text-xs">1080 × 1350 px ideal · große Fotos werden automatisch verkleinert</span>
              </>
            )}
            {preview && (
              <span className="absolute inset-x-0 bottom-0 bg-black/55 py-2 text-xs font-semibold text-white">
                Tippen zum Ersetzen
              </span>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>

          <Field label="Alt-Text" htmlFor="p-alt" aside={<Counter n={d.alt.length} max={POST_LIMITS.alt} />}>
            <textarea
              id="p-alt"
              className={`${inputClass} min-h-[70px]`}
              value={d.alt}
              maxLength={POST_LIMITS.alt}
              onChange={(e) => set("alt", e.target.value)}
              placeholder="Was zeigt das Bild? z. B. Balkendiagramm: Netto bei 3.000 € brutto in allen Steuerklassen"
            />
          </Field>

          <div className="hidden space-y-5 lg:block">
            <SeoPanel d={d} checks={checks} score={score} />
          </div>
        </div>

        {/* Right: text fields */}
        <div className="min-w-0 space-y-4">
          <Field
            label="Titel (H1 & Google-Titel)"
            htmlFor="p-title"
            aside={<Counter n={d.title.length} max={POST_LIMITS.title} ideal={POST_LIMITS.titleIdeal} />}
          >
            <input
              id="p-title"
              className={inputClass}
              value={d.title}
              maxLength={POST_LIMITS.title}
              onChange={(e) =>
                setD((x) => ({ ...x, title: e.target.value, slug: !editing && !x.slugTouched ? slugify(e.target.value) : x.slug }))
              }
              placeholder="z. B. 3.000 € brutto in netto: alle Steuerklassen 2026"
            />
          </Field>

          <Field label="URL" htmlFor="p-slug" aside={<span className="text-black/40">/infografiken/…</span>}>
            <input
              id="p-slug"
              className={inputClass}
              value={d.slug}
              disabled={Boolean(editing)}
              autoCapitalize="none"
              onChange={(e) => setD((x) => ({ ...x, slug: slugify(e.target.value), slugTouched: true }))}
            />
          </Field>

          <Field
            label="Beschreibung (Google-Snippet)"
            htmlFor="p-desc"
            aside={<Counter n={d.description.length} max={POST_LIMITS.description} min={POST_LIMITS.descriptionMin} />}
          >
            <textarea
              id="p-desc"
              className={`${inputClass} min-h-[80px]`}
              value={d.description}
              maxLength={POST_LIMITS.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Ein bis zwei Sätze: Was erfährt man, welche Zahl steht im Mittelpunkt?"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Kategorie" htmlFor="p-cat">
              <select id="p-cat" className={inputClass} value={d.category} onChange={(e) => set("category", e.target.value as PostCategory)}>
                {POST_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Passender Rechner" htmlFor="p-calc">
              <select id="p-calc" className={inputClass} value={d.calculator} onChange={(e) => set("calculator", e.target.value)}>
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
            </Field>
          </div>

          <Field label="Kernfakten" aside={<span className="text-black/40">max. {POST_LIMITS.facts}</span>}>
            <div className="space-y-2">
              {d.facts.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputClass}
                    value={f.label}
                    maxLength={POST_LIMITS.factText}
                    placeholder="Netto in Steuerklasse 1"
                    aria-label={`Fakt ${i + 1}: Bezeichnung`}
                    onChange={(e) => set("facts", d.facts.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  />
                  <input
                    className={`${inputClass} max-w-[120px] sm:max-w-[160px]`}
                    value={f.value}
                    maxLength={POST_LIMITS.factText}
                    placeholder="2.024 €"
                    aria-label={`Fakt ${i + 1}: Wert`}
                    onChange={(e) => set("facts", d.facts.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  />
                  <button
                    type="button"
                    aria-label="Fakt entfernen"
                    onClick={() => set("facts", d.facts.filter((_, j) => j !== i))}
                    className="flex w-11 flex-shrink-0 items-center justify-center rounded-xl text-black/40 hover:bg-black/5 hover:text-[#B5081A]"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            {d.facts.length < POST_LIMITS.facts && (
              <button
                type="button"
                onClick={() => set("facts", [...d.facts, { label: "", value: "" }])}
                className="mt-2 min-h-[40px] text-sm font-semibold text-[#E60A1C]"
              >
                + Fakt hinzufügen
              </button>
            )}
          </Field>

          <Field
            label="Text zur Grafik"
            htmlFor="p-body"
            aside={
              <span className={words < MIN_BODY_WORDS ? "text-[#B5081A]" : words < GOOD_BODY_WORDS ? "text-amber-600" : "text-emerald-600"}>
                {words} Wörter
              </span>
            }
            hint="Leerzeile = neuer Absatz · „## “ = Zwischenüberschrift · „- “ = Aufzählung · **fett**"
          >
            <textarea
              id="p-body"
              className={`${inputClass} min-h-[280px] leading-relaxed`}
              value={d.body}
              maxLength={POST_LIMITS.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"Erklären Sie die Grafik in eigenen Worten.\n\n## Zwischenüberschrift\n\n- Aufzählung\n- **fett**"}
            />
          </Field>

          <div className="space-y-5 lg:hidden">
            <SeoPanel d={d} checks={checks} score={score} />
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function SeoPanel({ d, checks, score }: { d: Draft; checks: { ok: boolean; label: string }[]; score: number }) {
  return (
    <>
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-black/60">Google-Vorschau</p>
        <div className="rounded-2xl border border-black/[0.08] bg-white p-3">
          <p className="truncate text-xs text-black/55">bruttonettocalculator.com › infografiken › {d.slug || "…"}</p>
          <p className="mt-1 line-clamp-2 text-[17px] leading-snug text-[#1a0dab]">{d.title || "Titel der Infografik"}</p>
          <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-black/70">{d.description || "Beschreibung erscheint hier."}</p>
        </div>
      </div>
      <div>
        <p className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-black/60">
          SEO-Check
          <span className={`normal-case tracking-normal ${score >= 88 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-[#B5081A]"}`}>
            {score}%
          </span>
        </p>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
          <div
            className={`h-full rounded-full ${score >= 88 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-[#E60A1C]"}`}
            style={{ width: `${score}%` }}
          />
        </div>
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
    </>
  );
}
