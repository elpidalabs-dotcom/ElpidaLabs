import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { serve } from "./serve.mjs";
const config = JSON.parse(
  await readFile(new URL("../admin/config.json", import.meta.url), "utf8"),
);
assert.equal(config.backend.repo, "elpidalabs-dotcom/ElpidaLabs");
assert.equal(config.backend.auth_endpoint, "api/cms-auth");
assert.equal(config.publish_mode, "editorial_workflow");
assert.ok(
  !config.local_backend,
  "Production must not enable an unauthenticated proxy.",
);
const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}/ElpidaLabs/`;
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHANNEL
    ? { channel: process.env.PLAYWRIGHT_CHANNEL }
    : {},
);
await mkdir("test-results/admin", { recursive: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const editorErrors = [];
  page.on("pageerror", (error) => editorErrors.push(error.message));
  for (const width of [1440, 390, 280]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + "admin/");
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.locator('meta[name="robots"]').getAttribute("content"),
      "noindex,nofollow",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      "Admin studio must reflow.",
    );
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
    await page.screenshot({
      path: `test-results/admin/studio-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "admin/editor.html?demo=1");
  try {
    await page
      .getByRole("button", { name: /login/i })
      .waitFor({ timeout: 20000 });
  } catch (error) {
    console.log(
      "Editor diagnostics:",
      editorErrors,
      await page.locator("body").innerText(),
    );
    await page.screenshot({
      path: "test-results/admin/editor-error.png",
      fullPage: true,
    });
    throw error;
  }
  await page.getByRole("button", { name: /login/i }).click();
  await page
    .getByRole("link", { name: "People", exact: true })
    .waitFor({ timeout: 30000 });
  assert.ok(
    await page
      .getByRole("link", { name: "Project articles", exact: true })
      .count(),
  );
  await page.screenshot({
    path: "test-results/admin/editor-demo.png",
    fullPage: true,
  });
  await page.getByText(/Person$/).click();
  await page
    .getByLabel("Full name", { exact: true })
    .fill("Synthetic preview fixture");
  await page
    .getByLabel("Biography", { exact: true })
    .fill(
      "Synthetic test content for a local-only preview. This is not a real team member.",
    );
  await page.screenshot({
    path: "test-results/admin/person-editor-demo.png",
    fullPage: true,
  });
  assert.deepEqual(
    editorErrors,
    [],
    "The CMS and custom preview must not raise JavaScript errors.",
  );
  console.log(
    "PASS: responsive admin studio, accessibility, production config, and CMS local demo login. No remote content was changed.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
