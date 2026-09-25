"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera } from "lucide-react";
import { postImagePath } from "@/lib/posts";
import { DEFAULT_STORY_HOURS, normalizeStoryLink, STORY_DURATIONS, STORY_LIMITS, storyImageSrc } from "@/lib/stories";
import { expiryLabel, useAdmin, type StoryEditorState } from "./context";
import { uploadSigned } from "./imageTools";
import { Button, Counter, Field, inputClass, Sheet, useToast } from "./ui";

const CUSTOM = "__custom__";
const KEEP = -1;

export default function StoryEditor({ state, onClose }: { state: StoryEditorState; onClose: () => void }) {
  const { api, reload, linkOptions } = useAdmin();
  const toast = useToast();

  const story = state.mode === "edit" ? state.story : null;
  const fromPost = state.mode === "from-post" ? state.post : null;
  const initialLink = story?.link ?? (fromPost ? `/infografiken/${fromPost.slug}` : "");
  const known = linkOptions.some((o) => o.href === initialLink);

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [title, setTitle] = useState(story?.title ?? fromPost?.title.slice(0, STORY_LIMITS.title) ?? "");
  const [caption, setCaption] = useState(story?.caption ?? fromPost?.description.slice(0, STORY_LIMITS.caption) ?? "");
  const [linkChoice, setLinkChoice] = useState(initialLink && !known ? CUSTOM : initialLink);
  const [customLink, setCustomLink] = useState(initialLink && !known ? initialLink : "");
  const [linkLabel, setLinkLabel] = useState(story?.linkLabel ?? "");
  const [hours, setHours] = useState<number>(story ? KEEP : DEFAULT_STORY_HOURS);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!file) return setFilePreview("");
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const preview =
    filePreview ||
    (story ? storyImageSrc(story, "full") : fromPost ? postImagePath(fromPost, "full") : "");

  const groups = useMemo(() => {
    const map = new Map<string, typeof linkOptions>();
    for (const o of linkOptions) map.set(o.group, [...(map.get(o.group) ?? []), o]);
    return Array.from(map);
  }, [linkOptions]);

  const link = linkChoice === CUSTOM ? customLink : linkChoice;

  const save = async () => {
    if (!title.trim()) return toast("error", "Bitte einen Titel eingeben.");
    if (normalizeStoryLink(link) === null) return toast("error", "Link muss mit / beginnen oder mit https://.");
    if (state.mode === "create" && !file) return toast("error", "Bitte ein Bild auswählen.");

    const fields = { title, caption, link, linkLabel, durationHours: hours };
    setBusy(true);
    try {
      if (state.mode === "edit") {
        await api("/api/stories/admin", { method: "POST", body: { action: "update", id: state.story.id, ...fields } });
        toast("ok", "Story gespeichert.");
      } else if (state.mode === "from-post") {
        await api("/api/stories/admin", { method: "POST", body: { action: "from-post", slug: state.post.slug, ...fields } });
        toast("ok", "Story aus der Infografik ist live.");
      } else {
        const signed = await api<{ uploadUrl: string; fields: Record<string, string> }>("/api/stories/admin", {
          method: "POST",
          body: { action: "sign", ...fields },
        });
        setProgress(0);
        await uploadSigned(signed, file as File, setProgress);
        await api("/api/stories/admin", { method: "POST", body: { action: "published" } });
        toast("ok", "Story ist live — auf allen Seiten.");
      }
      await reload();
      onClose();
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const heading =
    state.mode === "edit" ? "Story bearbeiten" : state.mode === "from-post" ? "Story aus Infografik" : "Neue Story";

  return (
    <Sheet
      title={heading}
      onClose={onClose}
      footer={
        <Button onClick={save} busy={busy} className="relative w-full overflow-hidden">
          {progress !== null && (
            <span className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${progress * 100}%` }} />
          )}
          {progress !== null
            ? `Lädt hoch … ${Math.round(progress * 100)} %`
            : state.mode === "edit"
              ? "Speichern"
              : "Story veröffentlichen"}
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[180px_1fr]">
        {/* 9:16 image */}
        <div className="mx-auto w-40 sm:w-full">
          {state.mode === "create" ? (
            <label className="relative flex aspect-[9/16] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-white text-center text-sm text-black/50 transition hover:border-[#E60A1C]">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Vorschau" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <Camera size={30} className="mb-2 text-[#E60A1C]" />
                  Foto wählen
                  <span className="mt-1 px-3 text-xs">Hochformat 9:16</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : (
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          )}
          {story && <p className="mt-2 text-center text-xs text-black/50">Läuft: {expiryLabel(story.expiresAt)}</p>}
        </div>

        <div className="space-y-4">
          <Field label="Titel unter dem Ring" htmlFor="s-title" aside={<Counter n={title.length} max={STORY_LIMITS.title} />}>
            <input
              id="s-title"
              className={inputClass}
              value={title}
              maxLength={STORY_LIMITS.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Mindestlohn 2027"
            />
          </Field>

          <Field label="Text auf der Story" htmlFor="s-caption" aside={<Counter n={caption.length} max={STORY_LIMITS.caption} />}>
            <textarea
              id="s-caption"
              className={`${inputClass} min-h-[84px]`}
              value={caption}
              maxLength={STORY_LIMITS.caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional — z. B. So viel bleibt netto."
            />
          </Field>

          <Field label="Link-Karte unten" htmlFor="s-link">
            <select
              id="s-link"
              className={inputClass}
              value={linkChoice}
              onChange={(e) => {
                setLinkChoice(e.target.value);
                setLinkLabel("");
              }}
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
                inputMode="url"
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="/pfad oder https://…"
              />
            )}
          </Field>

          {link && (
            <Field label="Text der Link-Karte" htmlFor="s-label" hint="Leer lassen = Titel der verlinkten Seite.">
              <input
                id="s-label"
                className={inputClass}
                value={linkLabel}
                maxLength={STORY_LIMITS.linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
              />
            </Field>
          )}

          <Field label="Sichtbar für" htmlFor="s-hours">
            <select id="s-hours" className={inputClass} value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {story && <option value={KEEP}>Laufzeit beibehalten ({expiryLabel(story.expiresAt)})</option>}
              {STORY_DURATIONS.map((d) => (
                <option key={d.hours} value={d.hours}>
                  {story ? `Neu: ${d.label} ab jetzt` : d.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </Sheet>
  );
}
