import { chromium, firefox, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { serve } from "./serve.mjs";

const names = (process.env.TEST_BROWSERS || "chrome").split(",");
const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/ElpidaLabs/`;
await mkdir("test-results/experiences", { recursive: true });
async function axe(page, label) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
    label,
  );
}
try {
  for (const name of names) {
    const browser = await ({ firefox, webkit }[name] || chromium).launch(
      ["chrome", "msedge"].includes(name) ? { channel: name } : {},
    );
    try {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      await context.addInitScript(() =>
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (text) => {
              window.__copiedText = text;
            },
          },
        }),
      );
      const page = await context.newPage();
      const errors = [],
        external = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("request", (r) => {
        if (!r.url().startsWith(base)) external.push(r.url());
      });
      await page.goto(base);
      await page.locator('[data-orbit-focus="ai"][aria-pressed]').click();
      assert.match(
        await page.locator("[data-orbit-heading]").textContent(),
        /Human judgment/,
      );
      assert.equal(
        await page.locator("[data-orbit-link]").getAttribute("href"),
        "about.html#ai-approach",
      );
      await page.keyboard.press("ArrowRight");
      assert.match(
        await page.locator("[data-orbit-heading]").textContent(),
        /Ideas, onchain/,
      );
      await page.keyboard.press("End");
      assert.match(
        await page.locator("[data-orbit-heading]").textContent(),
        /unexpected/,
      );
      assert.equal(
        await page.locator("[data-orbit-link]").getAttribute("href"),
        "chaos-engine.html",
      );

      await page.goto(base + "elpida.html");
      assert.equal(await page.locator("[data-demo-panel]:visible").count(), 1);
      const example = "<img src=x onerror=alert(1)> & Sample";
      await page.locator("#sample-name").fill(example);
      await page
        .locator("#sample-purpose")
        .fill("An illustrative project description edited in this browser.");
      await page.locator('[data-demo-next="1"]').click();
      assert.equal(
        await page.locator("#review-panel [data-sample-name]").textContent(),
        example,
      );
      assert.equal(await page.locator('#review-panel img[src="x"]').count(), 0);
      assert.equal(
        await page
          .locator("#review-panel h3")
          .evaluate((el) => el === document.activeElement),
        true,
        "step change focus",
      );
      await axe(page, `${name} Elpida review panel`);
      await page.locator('[data-demo-next="2"]').click();
      assert.equal(
        await page.locator("#discover-panel [data-sample-name]").textContent(),
        example,
      );
      await axe(page, `${name} Elpida discovery panel`);
      await page.screenshot({
        path: `test-results/experiences/${name}-elpida-discovery.png`,
        fullPage: true,
      });
      await page.locator('[data-demo-next="0"]').click();
      assert.equal(await page.locator("#sample-name").inputValue(), example);

      await page.goto(base + "chaos-engine.html");
      await page.waitForFunction(
        () =>
          document.querySelector("[data-chaos-demo]").dataset.ready === "true",
      );
      const initial = await page.locator("#scenario-line").getAttribute("d");
      await page.locator("#latency").evaluate((el) => {
        el.value = "600";
        el.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await page.locator("#run-scenario").click();
      assert.notEqual(
        await page.locator("#scenario-line").getAttribute("d"),
        initial,
      );
      assert.match(
        await page.locator("#scenario-explanation").textContent(),
        /600 ms/,
      );
      await page.locator("#failure-mode").selectOption("outage");
      assert.equal(await page.locator("#latency").isDisabled(), true);
      await page.locator("#recovery-mode").selectOption("fallback");
      await page.locator("#run-scenario").click();
      assert.match(
        await page.locator("#scenario-result").textContent(),
        /fallback/,
      );
      assert.match(
        await page.locator("#scenario-chart-description").textContent(),
        /not live telemetry/,
      );
      await axe(page, `${name} scenario output`);
      await page.locator("#reset-scenario").click();
      assert.equal(
        await page.locator("#scenario-line").getAttribute("d"),
        initial,
      );
      assert.equal(await page.locator("#latency").isDisabled(), false);

      await page.goto(base + "journal.html");
      await page.locator('[data-journal-filter="engineering"]').click();
      assert.equal(await page.locator(".editorial-card:visible").count(), 2);
      await page.locator('[data-journal-filter="elpida"]').click();
      assert.equal(await page.locator(".editorial-card:visible").count(), 1);
      assert.match(
        await page.locator(".filter-status").textContent(),
        /Showing 1 note$/,
      );
      await page.locator('[data-journal-filter="all"]').click();
      assert.equal(await page.locator(".editorial-card:visible").count(), 4);

      await page.goto(base + "contact.html");
      await page.locator("[data-copy-email]").click();
      assert.equal(
        await page.evaluate(() => window.__copiedText),
        "hello@elpida.fun",
      );
      await page.locator("#enquiry-form button[type=submit]").click();
      assert.equal(
        await page.locator("#enquiry-preview").isVisible(),
        false,
        "blank enquiry blocked",
      );
      await page
        .locator("#enquiry-subject")
        .fill("A collaboration & a question");
      const message =
        "A real enquiry with <script>text</script>, an ampersand &, and enough context to review.";
      await page.locator("#enquiry-body").fill(message);
      await page.locator("#enquiry-form button[type=submit]").click();
      assert.equal(await page.locator("#enquiry-preview").isVisible(), true);
      const destination = new URL(
        await page.locator("#enquiry-mailto").getAttribute("href"),
      );
      assert.equal(destination.protocol, "mailto:");
      assert.equal(destination.pathname, "hello@elpida.fun");
      assert.equal(destination.searchParams.get("body"), message);
      assert.match(
        destination.searchParams.get("subject"),
        /Collaboration.*A collaboration & a question/,
      );
      assert.equal(
        await page.locator("#enquiry-text script").count(),
        0,
        "draft is plain text",
      );
      await page.locator("#copy-enquiry").click();
      assert.match(
        await page.evaluate(() => window.__copiedText),
        /To: hello@elpida.fun/,
      );
      await axe(page, `${name} email draft`);
      await page.screenshot({
        path: `test-results/experiences/${name}-enquiry.png`,
        fullPage: true,
      });
      await page.locator("#enquiry-subject").fill("Updated subject");
      assert.equal(
        await page.locator("#enquiry-preview").isVisible(),
        false,
        "edited draft must be reviewed again",
      );
      const longMessage = "A longer project enquiry. ".repeat(100);
      await page.locator("#enquiry-body").fill(longMessage);
      await page.locator("#enquiry-form button[type=submit]").click();
      assert.match(
        await page.locator("#enquiry-status").textContent(),
        /Long draft: copy it/,
      );
      assert.equal(
        new URL(
          await page.locator("#enquiry-mailto").getAttribute("href"),
        ).searchParams.has("body"),
        false,
        "avoid truncating long drafts in email handlers",
      );
      assert.ok(
        (await page.locator("#enquiry-text").textContent()).includes(
          longMessage.trim(),
        ),
      );
      await page.evaluate(() =>
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: undefined,
        }),
      );
      await page.locator("[data-copy-email]").click();
      assert.match(
        await page.locator(".copy-status").textContent(),
        /Copy is unavailable/,
      );

      await page.goto(base + "why-we-build-static.html");
      assert.equal(await page.locator(".reading-progress").count(), 1);
      await page.locator("#section-3").scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () =>
          document.querySelector(".reading-progress span").style.transform !==
          "scaleX(0)",
      );
      assert.equal(await page.locator(".related-grid a").count(), 2);
      assert.deepEqual(errors, [], `${name}: no runtime errors`);
      assert.deepEqual(
        external,
        [],
        `${name}: all demonstration and form requests remain local`,
      );

      const staticContext = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 390, height: 844 },
      });
      const staticPage = await staticContext.newPage();
      await staticPage.goto(base + "elpida.html");
      assert.equal(
        await staticPage.locator("[data-demo-panel]:visible").count(),
        3,
        "all concept steps readable without JS",
      );
      await staticPage.goto(base + "journal.html");
      assert.equal(
        await staticPage.locator(".editorial-card:visible").count(),
        4,
      );
      await staticPage.goto(base + "contact.html");
      assert.equal(
        await staticPage.locator("#enquiry-form").getAttribute("action"),
        "mailto:hello@elpida.fun",
      );
      await staticContext.close();
      await context.close();
      console.log(
        `${name}: orbit, local demonstrations, journal filters, email drafts, clipboard fallback, reading progress, active-state accessibility and no-JS checks passed.`,
      );
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}
