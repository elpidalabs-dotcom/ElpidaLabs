import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, readdir } from "node:fs/promises";
import { serve } from "./serve.mjs";
const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/ElpidaLabs/`;
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHANNEL
    ? { channel: process.env.PLAYWRIGHT_CHANNEL }
    : {},
);
const pages = (await readdir(new URL("../", import.meta.url))).filter(
  (file) => file.endsWith(".html") && file !== "404.html",
);
const errors = [];
await mkdir("test-results", { recursive: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const file of pages) {
      await page.goto(base + file);
      for (const img of await page
        .locator('img[loading="lazy"]:visible')
        .all()) {
        await img.scrollIntoViewIfNeeded();
        await page.waitForFunction(
          (el) => el.complete && el.naturalWidth > 0,
          await img.elementHandle(),
        );
      }
      await page.evaluate(() => scrollTo(0, 0));
      assert.equal(await page.locator("h1").count(), 1, `${file}: one h1`);
      assert.ok(await page.title(), `${file}: title`);
      assert.ok(
        await page.locator('meta[name="description"]').getAttribute("content"),
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `${file}: overflow at ${width}`,
      );
      assert.equal(
        await page
          .locator("img:visible")
          .evaluateAll((imgs) =>
            imgs.every((img) => img.complete && img.naturalWidth > 0),
          ),
        true,
        `${file}: images load`,
      );
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        [],
        `${file}: accessibility at ${width}`,
      );
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `test-results/${file.replace(".html", "")}-${width}.png`,
          fullPage: true,
        });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .locator(".skip-link")
      .evaluate((el) => el === document.activeElement),
    true,
    "skip link first",
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator("#main").evaluate((el) => el === document.activeElement),
    true,
    "skip link focus",
  );
  await page.locator(".menu-toggle").click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  assert.equal(await page.locator("#primary-nav").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#primary-nav").isVisible(), false);
  assert.equal(
    await page
      .locator(".menu-toggle")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.goto(base + "team.html");
  for (const profile of await page.locator(".profile").all()) {
    await profile.locator("summary").click();
    assert.equal(await profile.getAttribute("open"), "");
  }
  await page.goto(base);
  await page.locator(".motion-toggle").click();
  assert.equal(
    await page.locator(".motion-toggle").getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    await page
      .locator(".orbit-path")
      .first()
      .evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.locator(".motion-toggle").getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    await page
      .locator(".orbit-path")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForFunction(
    () =>
      document.querySelector(".motion-toggle").getAttribute("aria-pressed") ===
      "false",
  );
  await page.locator(".orbital").scrollIntoViewIfNeeded();
  const orbitBox = await page.locator(".orbital").boundingBox();
  await page.mouse.move(
    orbitBox.x + orbitBox.width * 0.75,
    orbitBox.y + orbitBox.height * 0.4,
  );
  await page.waitForFunction(
    () =>
      Math.abs(
        parseFloat(
          document.querySelector(".orbital").style.getPropertyValue("--ry"),
        ),
      ) > 0.1,
  );
  assert.notEqual(
    await page
      .locator(".orbital")
      .evaluate((el) => el.style.getPropertyValue("--ry")),
    "0deg",
    "pointer orbit response",
  );
  const checked = new Set();
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    document.querySelector(".orbital").classList.contains("motion-idle"),
  );
  assert.equal(
    await page
      .locator(".field-arc")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
    "offscreen artwork stops animating",
  );
  await page.locator(".orbital").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => !document.querySelector(".orbital").classList.contains("motion-idle"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const selector of [".field-arc", ".core img"]) {
    assert.equal(
      await page
        .locator(selector)
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
      `${selector}: reduced motion`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const icon of await page
    .locator(".hero-copy .actions .arrow-icon")
    .all()) {
    assert.equal(
      await icon.evaluate((el) => el.tagName.toLowerCase()),
      "svg",
      "mobile action arrows are vectors",
    );
    assert.equal(await icon.getAttribute("aria-hidden"), "true");
    const box = await icon.boundingBox();
    assert.ok(
      box.width >= 12 && box.width <= 32 && box.height >= 12,
      "mobile arrow has stable dimensions",
    );
  }
  for (const file of pages) {
    await page.goto(base + file);
    const links = await page
      .locator("a[href],link[href],script[src],img[src]")
      .evaluateAll((els) => els.map((el) => el.href || el.src).filter(Boolean));
    for (const href of links) {
      if (!href.startsWith(base) || checked.has(href)) continue;
      checked.add(href);
      const url = new URL(href);
      const response = await page.request.get(url.href);
      assert.equal(response.status(), 200, `Local resource ${href}`);
      if (url.hash) {
        await page.goto(url.href);
        assert.equal(await page.locator(url.hash).count(), 1, `Anchor ${href}`);
      }
    }
  }
  assert.deepEqual(errors, [], "No JS errors or failed assets");
  const fallback = await browser.newPage();
  await fallback.goto(base + "missing/nested/page");
  assert.match(
    (await fallback.locator("h1").textContent()).replace(/\s+/g, " "),
    /A little outside\s*the orbit\./,
  );
  assert.equal(
    await fallback
      .locator(".brand img")
      .first()
      .evaluate((el) => el.complete && el.naturalWidth > 0),
    true,
    "nested 404 asset",
  );
  assert.equal(
    await fallback.locator("a.button").getAttribute("href"),
    "/ElpidaLabs/",
  );
  const staticContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(base);
  assert.equal(
    await staticPage.locator("#primary-nav").isVisible(),
    true,
    "navigation without JavaScript",
  );
  assert.equal(
    await staticPage.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "no-JS mobile layout",
  );
  await staticContext.close();
  console.log(
    `PASS: ${pages.length} pages × 4 viewports; WCAG A/AA scans; assets, anchors, navigation, profiles, motion, keyboard and nested 404. ${checked.size} local URLs checked.`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
