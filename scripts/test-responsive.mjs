import { chromium, firefox, webkit, devices } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { serve } from "./serve.mjs";

const pages = [
  "index.html",
  "elpida.html",
  "chaos-engine.html",
  "about.html",
  "team.html",
  "journal.html",
  "building-elpida.html",
  "designing-for-failure.html",
  "404.html",
];
const viewports = [
  [280, 653],
  [320, 568],
  [360, 800],
  [375, 667],
  [390, 844],
  [414, 896],
  [430, 932],
  [540, 720],
  [600, 960],
  [601, 960],
  [768, 1024],
  [820, 1180],
  [900, 1000],
  [901, 1000],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
  [667, 375],
  [844, 390],
  [932, 430],
];
const names = (process.env.TEST_BROWSERS || "chrome").split(",");
const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/ElpidaLabs/`;
const failures = [];
const report = [];
await mkdir("test-results/responsive", { recursive: true });

// Check actual text line boxes, not just document width: clipped or overlapping
// content can otherwise pass a simple horizontal-scroll assertion.
async function checkLayout(page, label) {
  const issues = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1)
      issues.push("document overflow");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (
        !node.textContent.trim() ||
        !el ||
        el.closest("script,style,.skip-link,[aria-hidden=true],[role=img]")
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width && (rect.left < -1 || rect.right > innerWidth + 1)) {
          issues.push(
            `text outside screen: ${node.textContent.trim().slice(0, 70)}`,
          );
          break;
        }
      }
    }
    const footer = document.querySelector(".site-footer");
    const footerRect = footer.getBoundingClientRect();
    for (const el of footer.querySelectorAll("a,p,h2,.footer-bottom>span")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height)
        issues.push(`hidden footer content: ${el.textContent}`);
      if (parseFloat(getComputedStyle(el).fontSize) < 12)
        issues.push(`small footer text: ${el.textContent}`);
      if (el.tagName === "A" && r.height < 43.5)
        issues.push(`small footer touch target: ${el.textContent}`);
      if (el.scrollWidth > el.clientWidth + 1)
        issues.push(`footer content overflow: ${el.textContent}`);
      if (r.top < footerRect.top - 1 || r.bottom > footerRect.bottom + 1)
        issues.push(`footer content outside its height: ${el.textContent}`);
    }
    const boxes = [
      ...footer.querySelectorAll(
        ".footer-brand,.footer-nav,.footer-bottom>span,.footer-bottom>a",
      ),
    ].map((el) => ({
      name: el.className || el.tagName,
      r: el.getBoundingClientRect(),
    }));
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].r,
          b = boxes[j].r;
        if (
          Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
        )
          issues.push(`footer overlap: ${boxes[i].name} / ${boxes[j].name}`);
      }
    return [...new Set(issues)];
  });
  if (issues.length) failures.push({ label, issues });
}

try {
  for (const name of names) {
    const engine = { webkit, firefox }[name] || chromium;
    const browser = await engine.launch(
      ["chrome", "msedge"].includes(name) ? { channel: name } : {},
    );
    try {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      page.on("pageerror", (error) =>
        failures.push({ label: name, issues: [error.message] }),
      );
      for (const [width, height] of viewports) {
        await page.setViewportSize({ width, height });
        for (const file of pages) {
          await page.goto(base + file);
          await checkLayout(page, `${name} ${file} ${width}×${height}`);
        }
      }
      // Readable footer and complete link layout in portrait, tablet and landscape.
      for (const [width, height] of [
        [320, 568],
        [390, 844],
        [601, 960],
        [768, 1024],
        [844, 390],
        [1440, 900],
      ]) {
        await page.setViewportSize({ width, height });
        await page.goto(base);
        const footerHeight = await page
          .locator(".site-footer")
          .evaluate((el) => el.getBoundingClientRect().height);
        // Avoid a sticky-header overlap in a crop taller than the free viewport.
        if (height < footerHeight + 100)
          await page.setViewportSize({
            width,
            height: Math.ceil(footerHeight + 100),
          });
        await page.locator(".site-footer").screenshot({
          path: `test-results/responsive/footer-${name}-${width}.png`,
        });
      }
      for (const [file, width] of [
        ["index.html", 390],
        ["chaos-engine.html", 820],
        ["building-elpida.html", 1440],
      ]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(base + file);
        await page.screenshot({
          path: `test-results/responsive/${name}-${file.replace(".html", "")}-${width}.png`,
          fullPage: true,
        });
      }
      // 640 CSS pixels models a 1280-pixel browser at 200% zoom. Also apply
      // WCAG text-spacing overrides to expose rigid heights and clipped labels.
      for (const width of [320, 640, 1024]) {
        await page.setViewportSize({ width, height: 900 });
        for (const file of pages) {
          await page.goto(base + file);
          await page.addStyleTag({
            content:
              "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}",
          });
          await checkLayout(page, `${name} text spacing ${file} ${width}`);
        }
      }
      await context.close();
      // Touch profiles exercise the actual mobile viewport meta tag and menu.
      for (const device of ["iPhone SE", "iPhone 13", "Pixel 7", "iPad Mini"]) {
        const options = { ...devices[device], reducedMotion: "reduce" };
        if (name === "firefox") delete options.isMobile;
        const touchContext = await browser.newContext(options);
        const touchPage = await touchContext.newPage();
        for (const landscape of [false, true]) {
          if (landscape)
            await touchPage.setViewportSize({
              width: options.viewport.height,
              height: options.viewport.width,
            });
          await touchPage.goto(base);
          await checkLayout(
            touchPage,
            `${name} ${device} ${landscape ? "landscape" : "portrait"}`,
          );
          const toggle = touchPage.locator(".menu-toggle");
          if (await toggle.isVisible()) {
            await toggle.tap();
            assert.equal(await toggle.getAttribute("aria-expanded"), "true");
            await touchPage.locator('#primary-nav a[href="team.html"]').tap();
            await touchPage.waitForURL("**/team.html");
            assert.equal(await toggle.getAttribute("aria-expanded"), "false");
          }
        }
        await touchContext.close();
      }
      report.push({
        browser: name,
        pages: pages.length,
        viewports: viewports.length,
        textSpacingWidths: 3,
        touchProfiles: 4,
      });
      console.log(
        `${name}: completed layout, footer, text spacing, zoom reflow and touch-profile checks.`,
      );
      await writeFile(
        `test-results/responsive/report-${name}.json`,
        JSON.stringify(
          {
            report: report.at(-1),
            failures: failures.filter((f) => f.label.startsWith(name)),
          },
          null,
          2,
        ),
      );
    } finally {
      await browser.close();
    }
  }
  await writeFile(
    "test-results/responsive/report.json",
    JSON.stringify({ report, failures }, null, 2),
  );
  assert.deepEqual(
    failures,
    [],
    "Responsive layout regressions (see test-results/responsive/report.json)",
  );
  console.log(
    `PASS: ${names.join(", ")}; ${pages.length} pages × ${viewports.length} viewports per browser, 3 text-spacing widths, and 4 touch profiles in both orientations.`,
  );
} finally {
  await new Promise((resolve) => server.close(resolve));
}
