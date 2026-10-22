import React from "react";

/**
 * Minimal markdown → React nodes for blog bodies (headings, lists, links, paragraphs).
 * Avoids adding a heavy markdown dependency.
 */
export default function MarkdownBody({ content }) {
  if (!content) return null;

  const lines = String(content).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  const renderInline = (text, keyPrefix) => {
    const parts = [];
    const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
    let last = 0;
    let match;
    let idx = 0;
    while ((match = re.exec(text)) !== null) {
      if (match.index > last) {
        parts.push(text.slice(last, match.index));
      }
      if (match[1]) {
        const href = match[3];
        const isInternal = href.startsWith("/");
        parts.push(
          <a
            key={`${keyPrefix}-a-${idx++}`}
            href={href}
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            {...(isInternal ? {} : { target: "_blank", rel: "noreferrer" })}
          >
            {match[2]}
          </a>
        );
      } else if (match[4]) {
        parts.push(
          <strong key={`${keyPrefix}-b-${idx++}`} className="text-slate-100 font-semibold">
            {match[5]}
          </strong>
        );
      } else if (match[6]) {
        parts.push(
          <code
            key={`${keyPrefix}-c-${idx++}`}
            className="px-1.5 py-0.5 rounded bg-white/5 text-sky-200 text-[0.9em]"
          >
            {match[7]}
          </code>
        );
      }
      last = match.index + match[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length ? parts : text;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${i}`} className="text-lg font-bold text-slate-50 mt-8 mb-3">
          {renderInline(line.slice(4), `h3-${i}`)}
        </h3>
      );
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${i}`} className="text-2xl font-black text-white mt-10 mb-4 tracking-tight">
          {renderInline(line.slice(3), `h2-${i}`)}
        </h2>
      );
      i += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(
        <h2 key={`h1-${i}`} className="text-2xl font-black text-white mt-10 mb-4 tracking-tight">
          {renderInline(line.slice(2), `h1-${i}`)}
        </h2>
      );
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(
          <li key={`li-${i}`} className="leading-relaxed">
            {renderInline(lines[i].replace(/^[-*]\s+/, ""), `li-${i}`)}
          </li>
        );
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-2 text-slate-300 my-4">
          {items}
        </ul>
      );
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !/^[-*]\s+/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`p-${i}`} className="text-slate-300 leading-relaxed my-4">
        {renderInline(para.join(" "), `p-${i}`)}
      </p>
    );
  }

  return <div className="blog-markdown">{blocks}</div>;
}
