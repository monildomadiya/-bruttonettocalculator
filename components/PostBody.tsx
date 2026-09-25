import { Fragment } from "react";
import { parsePostBody } from "@/lib/posts";

/** `**bold**` → <strong>. Everything else stays plain text — no HTML is interpreted. */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-semibold text-[#16181D]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

export default function PostBody({ body }: { body: string }) {
  return (
    <div className="space-y-4 text-[17px] leading-relaxed text-black/75">
      {parsePostBody(body).map((b, i) => {
        if (b.type === "h2") {
          return (
            <h2 key={i} className="pt-3 font-display text-xl font-bold text-[#16181D] sm:text-2xl">
              {inline(b.text)}
            </h2>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-[#E60A1C]">
              {b.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(b.text)}</p>;
      })}
    </div>
  );
}
