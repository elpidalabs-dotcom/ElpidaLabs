import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { chromium, webkit, firefox } from "playwright";
import { serve, root } from "./serve.mjs";

const pages = (await readdir(root)).filter((file) => file.endsWith(".html"));
async function sourceHashes() {
  return Promise.all(
    pages.map(async (file) => [
      file,
      createHash("sha256")
        .update(await readFile(new URL("../" + file, import.meta.url)))
        .digest("hex"),
    ]),
  );
}
const before = await sourceHashes();
execFileSync(process.execPath, ["scripts/build-vercel.mjs"], {
  cwd: root,
  stdio: "inherit",
});
assert.deepEqual(
  await sourceHashes(),
  before,
  "The production build must preserve GitHub Pages output.",
);
const dist = new URL("../dist/", import.meta.url);
const contents = await readdir(dist);
for (const file of [
  ".git",
  "node_modules",
  "scripts",
  "content",
  "test-results",
  "package.json",
  "vercel.json",
])
  assert.ok(!contents.includes(file), `${file} must not be published`);
for (const file of pages) {
  const html = await readFile(new URL(file, dist), "utf8");
  assert.ok(
    html.includes("https://elpidalabs.xyz/"),
    `${file}: production origin`,
  );
  assert.ok(
    !html.includes("https://elpidalabs-dotcom.github.io/ElpidaLabs/"),
    `${file}: old canonical URL removed`,
  );
  if (file === "404.html")
    assert.ok(/<base\s+href="\/"/.test(html), "Root domain 404 base");
}
const sitemap = await readFile(new URL("sitemap.xml", dist), "utf8");
assert.ok(sitemap.includes("https://elpidalabs.xyz/"));
assert.ok(!sitemap.includes("github.io"));
const robots = await readFile(new URL("robots.txt", dist), "utf8");
assert.match(robots, /Sitemap: https:\/\/elpidalabs\.xyz\/sitemap.xml/);
const ownership = JSON.parse(
  await readFile(new URL("../content/indexnow.json", import.meta.url), "utf8"),
);
assert.equal(
  (await readFile(new URL(ownership.key + ".txt", dist), "utf8")).trim(),
  ownership.key,
);
const manifest = JSON.parse(
  await readFile(new URL("indexnow-manifest.json", dist), "utf8"),
);
assert.ok(
  Object.keys(manifest.pages).every((url) => !url.endsWith(".html")),
  "IndexNow uses canonical clean URLs",
);
assert.ok(!sitemap.includes(".html"), "Sitemap uses clean URLs");
const server = await serve(0, {
  directory: fileURLToPath(dist),
  basePath: "/",
});
const base = `http://127.0.0.1:${server.address().port}/`;
try {
  for (const slug of ["about", "elpida", "building-elpida", "team"]) {
    const old = await fetch(base + slug + ".html?from=old", {
      redirect: "manual",
    });
    assert.equal(old.status, 308);
    assert.equal(old.headers.get("location"), "/" + slug + "?from=old");
    assert.equal((await fetch(base + slug)).status, 200);
  }
  assert.equal(
    (await fetch(base + "admin/index.html")).status,
    200,
    "Admin route stays available",
  );
  assert.equal((await fetch(base + "not-a-real-page")).status, 404);
  for (const name of (process.env.TEST_BROWSERS || "chrome,webkit").split(
    ",",
  )) {
    const browser = await ({ webkit, firefox }[name] || chromium).launch(
      ["chrome", "msedge"].includes(name) ? { channel: name } : {},
    );
    try {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const file of pages) {
        const response = await page.goto(
          base + (file === "index.html" ? "" : file),
        );
        assert.equal(response.status(), 200, `${file}: static route`);
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(
          !new URL(page.url()).pathname.endsWith(".html"),
          "Public browser URL is clean",
        );
        assert.ok(
          await page
            .locator("link[rel=canonical]")
            .getAttribute("href")
            .then((href) => href.startsWith("https://elpidalabs.xyz/")),
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `${file}: phone layout`,
        );
        const resources = await page
          .locator("a[href],link[href],img[src],script[src]")
          .evaluateAll((els) =>
            els.map((el) => el.href || el.src).filter(Boolean),
          );
        for (const href of new Set(resources))
          if (href.startsWith(base)) {
            assert.equal(
              (await page.request.get(href)).status(),
              200,
              `Root-domain resource ${href}`,
            );
          }
      }
      await page.goto(base + "missing/nested/page");
      assert.equal(
        await page
          .locator(".brand img")
          .first()
          .evaluate((el) => el.complete && el.naturalWidth > 0),
        true,
        "Nested root-domain 404 logo",
      );
      assert.equal(await page.locator("a.button").getAttribute("href"), "/");
      await page.locator("a.button").click();
      await page.waitForURL(base);
      await page.goto(base + "elpida.html");
      await page.locator('[data-demo-next="1"]').click();
      assert.equal(await page.locator("#review-panel").isVisible(), true);
      await page.goto(base + "chaos-engine.html");
      await page.waitForFunction(
        () =>
          document.querySelector("[data-chaos-demo]").dataset.ready === "true",
      );
      await page.locator("#run-scenario").click();
      assert.equal(
        await page.locator("#scenario-state").textContent(),
        "Updated illustration",
      );
      await page.goto(base + "about");
      assert.equal(
        await page.locator("svg.asterisk").count(),
        0,
        "Old starbursts removed",
      );
      const mark = page.locator(".manifesto-star .elpida-spinner");
      assert.equal(
        await mark.evaluate((el) => getComputedStyle(el).animationName),
        "none",
        "Reduced motion stops brand rotation",
      );
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.waitForFunction(
        () => !document.querySelector(".decorative-motion").hidden,
      );
      assert.equal(
        await mark.evaluate((el) => getComputedStyle(el).animationName),
        "brand-turn",
      );
      await page.locator(".decorative-motion").click();
      assert.equal(
        await mark.evaluate((el) => getComputedStyle(el).animationPlayState),
        "paused",
      );
      assert.ok(
        await mark.evaluate((el) => el.getBoundingClientRect().width <= 64),
        "Brand mark stays miniature",
      );
      await page.locator("#main").focus();
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: "test-results/updated-about-mobile.png",
        fullPage: true,
      });
      assert.deepEqual(errors, [], `${name}: production script errors`);
      await context.close();
      console.log(
        `${name}: root-domain pages, local assets/links, nested 404 and product demonstrations passed.`,
      );
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}
console.log(
  `PASS: ${pages.length} Vercel pages, production metadata/sitemap/robots, deploy artifact boundaries and preserved GitHub Pages output.`,
);
