import { writeFileSync, mkdirSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";

mkdirSync("reports", { recursive: true });

const load = async (rel) => {
  const p = path.resolve(rel);
  return import(pathToFileURL(p).href + "?t=" + Date.now());
};

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const cv = (await load("src/data/cvProjects.js")).cvProjects;
const ai = (await load("src/data/aiProjects.js")).aiProjects;
const pcb = (await load("src/data/pcbProjects.js")).pcbProjects;
const all = [...cv, ...ai, ...pcb];

const headers = [
  "project_id",
  "url",
  "name",
  "category",
  "status",
  "description_quality",
  "demo_destination",
  "media",
  "tech_details",
  "evidence",
  "claims_to_verify",
  "recommended_action",
  "indexable",
];
const rows = [headers.join(",")];
for (const p of all) {
  const descLen = (p.full_description || "").length;
  const quality = descLen > 280 ? "good" : descLen > 120 ? "adequate" : "thin";
  const demo = p.preview_video || p.model_3d || "";
  const media = [p.thumbnail_image, p.preview_video, p.model_3d, p.pdf_document]
    .filter(Boolean)
    .join(" | ");
  const tech = (p.technologies || []).join("; ");
  const claims =
    p.status === "Completed"
      ? "status may overstate production"
      : "labeled as demo/prototype-friendly";
  const action =
    !p.preview_video && !p.model_3d
      ? "IMPROVE_MEDIA"
      : quality === "thin"
        ? "IMPROVE_COPY"
        : "KEEP";
  rows.push(
    [
      esc(p.id),
      esc(`https://aeromek.com/projects/${p.id}`),
      esc(p.title),
      esc(p.category),
      esc(p.status),
      esc(quality),
      esc(demo),
      esc(media),
      esc(tech),
      esc("public demo media only — no customer deployment certificates in repo"),
      esc(claims),
      esc(action),
      esc("yes"),
    ].join(",")
  );
}
writeFileSync("reports/AEROMEK_PORTFOLIO_AUDIT.csv", rows.join("\n"));
console.log("portfolio rows", all.length);

let blogs = [];
try {
  const res = await fetch("https://aeromek.com/api/blog/?limit=100");
  blogs = await res.json();
} catch (e) {
  console.log("blog fetch failed", e.message);
}

const bHeaders = [
  "url",
  "title",
  "published",
  "modified",
  "search_intent",
  "theme",
  "content_length",
  "heading_structure",
  "internal_links",
  "external_refs",
  "technical_claims",
  "overlap_risk",
  "quality_problems",
  "recommended_action",
];
const brows = [bHeaders.join(",")];
for (const b of Array.isArray(blogs) ? blogs : []) {
  const excerpt = b.excerpt || "";
  const contentLen = (b.content || "").length || excerpt.length;
  const theme = b.category || (b.keywords || [])[0] || "unknown";
  const overlap =
    /warehouse collision|textile|drone (building|roof)|PPE|fire and smoke/i.test(
      b.title || ""
    )
      ? "high_topic_cluster"
      : "normal";
  const problems =
    !b.content && contentLen < 200
      ? "list_payload_excerpt_only"
      : contentLen < 80
        ? "possibly_thin"
        : "none_flagged_from_list";
  const action =
    overlap === "high_topic_cluster" ? "HUMAN_REVIEW_CLUSTER" : "KEEP";
  brows.push(
    [
      esc(`https://aeromek.com/blog/${b.slug}`),
      esc(b.title),
      esc(b.created_at || ""),
      esc(b.updated_at || ""),
      esc("informational_B2B"),
      esc(theme),
      esc(contentLen),
      esc("unknown_until_detail_fetch"),
      esc("generator_prompts_include_service_links"),
      esc("unverified"),
      esc("AI-generated — verify before citing as measured results"),
      esc(overlap),
      esc(problems),
      esc(action),
    ].join(",")
  );
}
writeFileSync("reports/AEROMEK_BLOG_AUDIT.csv", brows.join("\n"));
console.log("blog rows", Array.isArray(blogs) ? blogs.length : 0);
