/**
 * Phone photos are often 4–12 MB. Shrinking them in the browser before upload
 * makes publishing from mobile data fast and keeps them under Cloudinary's
 * 10 MB limit. Formats the browser can't decode (HEIC outside Safari) are sent
 * as they are — Cloudinary converts those itself.
 */
const MAX_EDGE = 2400;
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024;

export async function prepareImage(file: File): Promise<Blob> {
  if (file.size < SKIP_BELOW_BYTES || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    // PNG stays PNG (infographics with text and flat colours compress badly as JPEG).
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.9));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export interface UploadResult {
  public_id: string;
  version: number;
  width: number;
  height: number;
}

/** POST to Cloudinary with progress (fetch can't report upload progress). */
export function uploadWithProgress(url: string, form: FormData, onProgress: (p: number) => void) {
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) return resolve(data as unknown as UploadResult);
      const err = data.error as { message?: string } | undefined;
      reject(new Error(err?.message || `Upload fehlgeschlagen (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Netzwerkfehler beim Upload."));
    xhr.send(form);
  });
}

/** Signed fields from our API + the file → Cloudinary. */
export async function uploadSigned(
  signed: { uploadUrl: string; fields: Record<string, string | number> },
  file: File,
  onProgress: (p: number) => void
): Promise<UploadResult> {
  const form = new FormData();
  for (const [k, v] of Object.entries(signed.fields)) form.append(k, String(v));
  const blob = await prepareImage(file);
  form.append("file", blob, file.name);
  return uploadWithProgress(signed.uploadUrl, form, onProgress);
}
