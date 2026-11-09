import { readFile, readdir, stat } from "node:fs/promises";
import assert from "node:assert/strict";
const root = new URL("../", import.meta.url);
const size = async (files) =>
  (await Promise.all(files.map((file) => stat(new URL(file, root))))).reduce(
    (total, file) => total + file.size,
    0,
  );
const js = await size(["script.js", "enhancements.js", "demo-model.js"]);
const css = await size(["styles.css", "experience.css"]);
assert.ok(
  (await size(["assets/fonts/manrope-latin.woff2"])) < 50000,
  "Font budget exceeded",
);
for (const file of [
  "social-card.png",
  "social-elpida.png",
  "social-chaos.png",
]) {
  const image = await readFile(new URL("assets/" + file, root));
  assert.equal(image.readUInt32BE(16), 1200, `${file}: social width`);
  assert.equal(image.readUInt32BE(20), 630, `${file}: social height`);
  assert.ok(image.length < 200000, `${file}: image budget`);
}
assert.ok(js < 35000, `Browser JavaScript budget exceeded: ${js}`);
assert.ok(css < 100000, `Stylesheet budget exceeded: ${css}`);
const pages = (await readdir(root)).filter((file) => file.endsWith(".html"));
const favicon = await readFile(new URL("assets/favicon-96.png", root));
assert.equal(favicon.readUInt32BE(16), 96);
assert.equal(favicon.readUInt32BE(20), 96);
const { key } = JSON.parse(
  await readFile(new URL("content/indexnow.json", root), "utf8"),
);
assert.match(key, /^[a-f0-9]{32}$/);
assert.equal((await readFile(new URL(key + ".txt", root), "utf8")).trim(), key);
const manifest = JSON.parse(
  await readFile(new URL("indexnow-manifest.json", root), "utf8"),
);
assert.equal(Object.keys(manifest.pages).length, pages.length - 1);
assert.ok(
  !Object.keys(manifest.pages).some(
    (url) => url.includes("admin") || url.includes("404"),
  ),
);
const titles = new Set();
const descriptions = new Set();
for (const file of pages) {
  const html = await readFile(new URL(file, root), "utf8");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  const canonical = `https://elpidalabs.xyz/${file === "index.html" ? "" : file}`;
  assert.ok(
    html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1] === canonical,
    `${file}: production canonical on both hosts`,
  );
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/name="description"\s+content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `${file}: unique title`);
  assert.ok(
    description && !descriptions.has(description),
    `${file}: unique description`,
  );
  titles.add(title);
  descriptions.add(description);
  assert.ok(
    !html.includes("↗"),
    `${file}: arrows must not depend on emoji fonts`,
  );
  assert.match(html, /favicon-96\.png/);
  assert.match(html, /apple-touch-icon/);
  assert.match(html, /name="twitter:image"/);
  assert.match(html, /property="og:site_name"/);
  assert.equal(
    (html.match(/name="robots"/g) || []).length,
    1,
    `${file}: one robots directive`,
  );
  assert.ok(
    html.includes(
      file === "404.html"
        ? "noindex, follow"
        : "index, follow, max-image-preview:large",
    ),
  );
  assert.match(html, /styles\.css\?v=[a-f0-9]{12}/, `${file}: cache version`);
  assert.match(html, /experience\.css\?v=[a-f0-9]{12}/);
  assert.match(html, /<meta\s+name="description"/);
  assert.match(html, /<link\s+rel="canonical"/);
  const schema = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(schema, `${file}: structured data`);
  const graph = JSON.parse(schema[1])["@graph"];
  assert.ok(
    graph.some((item) => item["@type"] === "WebSite"),
    `${file}: website identity`,
  );
  if (file !== "index.html" && file !== "404.html") {
    assert.ok(
      graph.some((item) => item["@type"] === "BreadcrumbList"),
      `${file}: breadcrumbs schema`,
    );
    assert.ok(
      html.includes('aria-label="Breadcrumb"'),
      `${file}: visible breadcrumbs`,
    );
  }
  assert.ok(
    !html.includes("hello@elpidalabs.xyz"),
    `${file}: no unconfigured mailbox`,
  );
  const required = {
    "index.html": "data-orbit-explorer",
    "elpida.html": "data-elpida-demo",
    "chaos-engine.html": "data-chaos-demo",
    "journal.html": "data-journal-filter",
    "contact.html": "mailto:elpidalabs@gmail.com",
  };
  if (required[file])
    assert.ok(
      html.includes(required[file]),
      `${file}: experience is generated`,
    );
}
console.log(
  `PASS: ${pages.length} static pages; metadata, structured data, unique IDs, base path and asset versions. Browser JS ${(js / 1024).toFixed(1)} KB; CSS ${(css / 1024).toFixed(1)} KB (uncompressed).`,
);
