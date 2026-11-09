import { readFileSync, readdirSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import MarkdownIt from "markdown-it";

const root = new URL("../", import.meta.url);
export const escapeText = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function mediaPath(value) {
  if (!value) return "";
  const path = String(value).replace(/^\//, "");
  assert.match(
    path,
    /^assets\/uploads\/[a-zA-Z0-9][a-zA-Z0-9._ /()-]*\.(?:png|jpe?g|webp|avif)$/i,
    "Use a PNG, JPEG, WebP or AVIF image uploaded through the media library.",
  );
  assert.ok(
    !path.split("/").includes("..") && !path.includes("//"),
    "Invalid media path.",
  );
  assert.ok(
    existsSync(new URL(path, root)),
    "The uploaded image must exist: " + path,
  );
  const bytes = readFileSync(new URL(path, root));
  assert.ok(bytes.length <= 3000000, "Uploaded images must be at most 3 MB.");
  const valid = /\.png$/i.test(path)
    ? bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : /\.jpe?g$/i.test(path)
      ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : /\.webp$/i.test(path)
        ? bytes.toString("ascii", 0, 4) === "RIFF" &&
          bytes.toString("ascii", 8, 12) === "WEBP"
        : bytes.toString("ascii", 4, 8) === "ftyp" &&
          /avif|avis/.test(bytes.toString("ascii", 8, 32));
  assert.ok(valid, "The image contents must match its file extension.");
  return path;
}
const text = (value, name, max = 500) => {
  assert.ok(
    typeof value === "string" && value.trim() && value.length <= max,
    `${name} must be 1–${max} characters.`,
  );
  return value.trim();
};
const readCollection = (folder) =>
  readdirSync(new URL(`content/${folder}/`, root))
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => ({
      ...JSON.parse(
        readFileSync(new URL(`content/${folder}/${file}`, root), "utf8"),
      ),
      slug: file.slice(0, -5),
    }));
const reserved = new Set([
  "index",
  "about",
  "team",
  "journal",
  "contact",
  "elpida",
  "chaos-engine",
  "404",
  "admin",
]);
export function validateArticle(item) {
  assert.match(
    item.slug,
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Article slug must contain lowercase letters, digits and hyphens.",
  );
  assert.ok(
    !reserved.has(item.slug),
    "Article slug conflicts with a site page.",
  );
  for (const [field, max] of [
    ["title", 140],
    ["summary", 300],
    ["intro", 500],
    ["category", 80],
    ["categoryLabel", 100],
    ["takeaway", 300],
    ["productLabel", 100],
    ["body", 100000],
  ])
    text(item[field], field, max);
  assert.ok(
    ["elpida", "systems", "engineering"].includes(item.tag),
    "Choose a supported article category.",
  );
  assert.ok(
    ["elpida", "chaos", "screen", "code"].includes(item.art),
    "Choose supported card artwork.",
  );
  assert.ok(
    ["elpida.html", "chaos-engine.html", "about.html", "index.html"].includes(
      item.product,
    ),
    "Choose a supported related product.",
  );
  assert.ok(
    Number.isInteger(item.order) && item.order >= 0 && item.order <= 9999,
    "Article order must be 0–9999.",
  );
  assert.equal(
    typeof item.published,
    "boolean",
    "Published must be true or false.",
  );
  mediaPath(item.cover);
  if (item.cover) text(item.coverAlt, "Cover image description", 200);
  return { ...item, file: item.slug + ".html" };
}
export function validatePerson(item) {
  assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid person ID.");
  text(item.name, "Name", 100);
  text(item.bio, "Biography", 3000);
  assert.ok(
    ["Founder", "Co-founder", "Collaborator"].includes(item.role),
    "Choose a supported role.",
  );
  assert.equal(
    typeof item.published,
    "boolean",
    "Published must be true or false.",
  );
  assert.ok(
    Number.isInteger(item.order) && item.order >= 0 && item.order <= 9999,
    "Profile order must be 0–9999.",
  );
  mediaPath(item.photo);
  if (item.photo) text(item.photoAlt, "Portrait description", 200);
  assert.ok(
    Array.isArray(item.links) && item.links.length <= 10,
    "Use up to ten public links.",
  );
  for (const link of item.links) {
    text(link.label, "Link label", 80);
    const url = new URL(link.url);
    assert.ok(
      url.protocol === "https:" && !url.username && !url.password,
      "Public profile links must use HTTPS without credentials.",
    );
  }
  return item;
}
export const articleRecords = readCollection("articles").map(validateArticle);
export const articles = articleRecords
  .filter((item) => item.published)
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
export const people = readCollection("people")
  .map(validatePerson)
  .filter((item) => item.published)
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
// Images remain local to the repository; arbitrary remote embeds are not loaded.
md.renderer.rules.image = (tokens, index) => {
  const token = tokens[index],
    src = mediaPath(token.attrGet("src"));
  return `<img src="${escapeText(src)}" alt="${escapeText(token.content)}" loading="lazy" decoding="async" class="article-upload"/>`;
};
export function renderContentArticleBody(body) {
  const tokens = md.parse(body, {}),
    sections = [];
  assert.ok(
    tokens[0]?.type === "heading_open" && tokens[0]?.tag === "h2",
    "Start the article body with a level-two heading (##).",
  );
  for (let i = 0; i < tokens.length; ) {
    assert.ok(
      tokens[i]?.type === "heading_open" && tokens[i]?.tag === "h2",
      "Each article section begins with ##.",
    );
    const heading = tokens[i + 1].content;
    i += 3;
    const start = i;
    while (
      i < tokens.length &&
      !(tokens[i].type === "heading_open" && tokens[i].tag === "h2")
    )
      i++;
    sections.push({
      heading,
      html: md.renderer.render(tokens.slice(start, i), md.options, {}),
    });
  }
  assert.ok(sections.length <= 40, "Use up to forty article sections.");
  return sections;
}
export function renderPeople(members) {
  return `<section class="section wrap profiles"><p class="eyebrow">MEET THE COLLECTIVE</p>${members.map((member, i) => `<details class="profile"><summary><span class="profile-icon" aria-hidden="true">${member.photo ? `<img src="${escapeText(mediaPath(member.photo))}" width="64" height="64" alt="" loading="lazy"/>` : String(i + 1).padStart(2, "0")}</span><span><span class="eyebrow">${escapeText(member.role)}</span><span class="profile-title">${escapeText(member.name)}</span></span><span class="profile-state">Read profile</span><span class="expand" aria-hidden="true">+</span></summary><div class="profile-body">${member.photo ? `<img class="profile-portrait" src="${escapeText(mediaPath(member.photo))}" width="240" height="240" alt="${escapeText(member.photoAlt)}" loading="lazy"/>` : ""}<p>${escapeText(member.bio).replace(/\n/g, "<br/>")}</p>${member.links.map((link) => `<a class="text-link" href="${escapeText(link.url)}">${escapeText(link.label)}</a>`).join("")}</div></details>`).join("")}</section>`;
}
