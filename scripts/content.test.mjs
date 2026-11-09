import test from "node:test";
import assert from "node:assert/strict";
import {
  articles,
  people,
  validateArticle,
  validatePerson,
  mediaPath,
  renderContentArticleBody,
  renderPeople,
} from "./content.mjs";

test("existing articles keep their established routes and remain publishable", () => {
  assert.equal(articles.length >= 4, true);
  for (const file of [
    "building-elpida.html",
    "designing-for-failure.html",
    "building-for-every-screen.html",
    "why-we-build-static.html",
  ])
    assert.ok(articles.some((item) => item.file === file));
  for (const item of articles)
    assert.ok(renderContentArticleBody(item.body).length);
  assert.ok(Array.isArray(people));
});
test("article routes, destination links and visibility are validated", () => {
  const item = { ...articles[0] };
  assert.throws(() => validateArticle({ ...item, slug: "../index" }));
  assert.throws(() => validateArticle({ ...item, slug: "contact" }));
  assert.throws(() => validateArticle({ ...item, published: "false" }));
  assert.throws(() =>
    validateArticle({ ...item, product: "javascript:alert(1)" }),
  );
  assert.throws(() => validateArticle({ ...item, tag: "unrecognized" }));
});
test("Markdown preserves formatting while blocking executable markup and URLs", () => {
  const [section] = renderContentArticleBody(
    "## Heading\n\n<script>alert(1)</script>\n\n[Unsafe](javascript:alert(1))\n\n**Bold** and [safe](https://elpida.fun).",
  );
  assert.ok(section.html.includes("&lt;script&gt;"));
  assert.ok(!section.html.includes("<script>"));
  assert.ok(!section.html.includes('href="javascript:'));
  assert.ok(section.html.includes("<strong>Bold</strong>"));
  assert.ok(section.html.includes('href="https://elpida.fun"'));
  assert.throws(() => renderContentArticleBody("Missing a level-two heading"));
  assert.throws(() =>
    renderContentArticleBody(
      "## Heading\n\n![Unsafe](https://example.com/tracker.png)",
    ),
  );
});
test("portrait and cover paths cannot escape uploads or execute SVG", () => {
  assert.equal(mediaPath(""), "");
  for (const value of [
    "assets/uploads/../secret.png",
    "https://example.com/a.png",
    "assets/uploads/a.svg",
    "assets/uploads/missing.png",
  ])
    assert.throws(() => mediaPath(value));
});
test("team entries are escaped and require approved HTTPS links", () => {
  const person = {
    slug: "synthetic-test",
    name: 'Synthetic <img onerror="alert(1)">',
    role: "Founder",
    bio: "Test fixture only.\nSecond paragraph.",
    published: true,
    order: 0,
    photo: "",
    photoAlt: "",
    links: [{ label: "Public profile", url: "https://example.com/" }],
  };
  const html = renderPeople([validatePerson(person)]);
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<img onerror"));
  assert.ok(html.includes("<br/>"));
  assert.throws(() =>
    validatePerson({
      ...person,
      links: [{ label: "Unsafe", url: "javascript:alert(1)" }],
    }),
  );
  assert.throws(() =>
    validatePerson({
      ...person,
      links: [{ label: "Credential", url: "https://user:pass@example.com/" }],
    }),
  );
});
