import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { serve, root } from "./serve.mjs";

const pages = (await readdir(root)).filter((file) => file.endsWith(".html"));
const names = (process.env.TEST_BROWSERS || "chrome").split(",");
const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/ElpidaLabs/`;
try {
  for (const name of names) {
    const browser = await ({ firefox, webkit }[name] || chromium).launch(
      ["chrome", "msedge"].includes(name) ? { channel: name } : {},
    );
    try {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      for (const [width, height] of [
        [390, 844],
        [844, 390],
      ]) {
        await page.setViewportSize({ width, height });
        for (const file of pages) {
          await page.goto(base + file);
          // Playwright device descriptors do not expose a real display cutout.
          // Override the same tokens used by CSS env() to stress both insets.
          await page.addStyleTag({
            content:
              ":root{--safe-top:47px;--safe-bottom:34px;--safe-left:44px;--safe-right:44px}",
          });
          const label = `${name} ${file} ${width}×${height}`;
          const layout = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth > innerWidth,
            headerInset: parseFloat(
              getComputedStyle(document.querySelector(".site-header"))
                .paddingTop,
            ),
            footerInset: parseFloat(
              getComputedStyle(document.querySelector(".site-footer"))
                .paddingBottom,
            ),
            shell: document
              .querySelector(".nav-shell")
              .getBoundingClientRect()
              .toJSON(),
            footer: document
              .querySelector(".site-footer > .wrap")
              .getBoundingClientRect()
              .toJSON(),
          }));
          assert.equal(layout.overflow, false, label + " overflow");
          assert.equal(layout.headerInset, 47, label + " header safe inset");
          assert.ok(layout.footerInset >= 34, label + " footer safe inset");
          assert.ok(
            layout.shell.left >= 44 && layout.shell.right <= width - 44,
            label + " header side insets",
          );
          assert.ok(
            layout.footer.left >= 44 && layout.footer.right <= width - 44,
            label + " footer side insets",
          );
          await page.locator(".menu-toggle").click();
          const menu = await page.locator("#primary-nav").boundingBox();
          const header = await page.locator(".site-header").boundingBox();
          assert.ok(
            menu.y >= header.y + header.height - 1,
            label + " menu clears the header",
          );
          assert.ok(
            menu.y + menu.height <= height + 1,
            label + " menu fits available height",
          );
          // The last internal destination must be reachable even in landscape.
          await page.locator('#primary-nav a[href="team.html"]').click();
          await page.waitForURL("**/team.html");
          assert.equal(
            await page.locator(".menu-toggle").getAttribute("aria-expanded"),
            "false",
          );
        }
      }
      await context.close();
      console.log(`${name}: safe-area and short-landscape menu checks passed.`);
    } finally {
      await browser.close();
    }
  }
  console.log(
    `PASS: ${pages.length} pages × 2 simulated notch orientations × ${names.length} browsers.`,
  );
} finally {
  await new Promise((resolve) => server.close(resolve));
}
