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
for (const file of pages) {
  const html = await readFile(new URL(file, root), "utf8");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  assert.ok(html.includes("/ElpidaLabs/"), `${file}: project path`);
  assert.match(html, /styles\.css\?v=[a-f0-9]{12}/, `${file}: cache version`);
  assert.match(html, /experience\.css\?v=[a-f0-9]{12}/);
  assert.match(html, /<meta\s+name="description"/);
  assert.match(html, /<link\s+rel="canonical"/);
  const schema = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(schema, `${file}: structured data`);
  JSON.parse(schema[1]);
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
