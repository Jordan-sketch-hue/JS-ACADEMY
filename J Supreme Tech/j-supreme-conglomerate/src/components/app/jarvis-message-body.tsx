"use client";

import { Fragment } from "react";

/** Renders `**like this**` as bold; splits on blank lines for airy paragraphs. */
function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function JarvisMessageBody({ text }: { text: string }) {
  if (!text.trim()) return null;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3.5 text-[0.9375rem] leading-[1.68] tracking-[0.012em]">
      {paragraphs.map((block, i) => (
        <p key={i} className="font-jarvis whitespace-pre-wrap break-words text-foreground/[0.94]">
          {renderWithBold(block)}
        </p>
      ))}
    </div>
  );
}
