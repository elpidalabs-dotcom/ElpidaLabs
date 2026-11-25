import assert from "node:assert/strict";

const origin = "https://elpidalabs.xyz";
const revision = process.env.GITHUB_SHA || "manual";
let failure;
for (let attempt = 1; attempt <= 10; attempt++) {
  try {
    const request = (path) =>
      fetch(
        origin +
          path +
          (path.includes("?") ? "&" : "?") +
          "revision=" +
          encodeURIComponent(revision),
        {
          redirect: "manual",
          headers: { "Cache-Control": "no-cache" },
          signal: AbortSignal.timeout(15000),
        },
      );
    const about = await request("/about");
    assert.equal(about.status, 200, "Clean public route must be available.");
    assert.ok(
      (await about.text()).includes('href="https://elpidalabs.xyz/about"'),
      "Clean canonical URL must be present.",
    );
    const legacy = await request("/about.html");
    assert.equal(
      legacy.status,
      308,
      "Legacy HTML route must permanently redirect.",
    );
    assert.equal(
      new URL(legacy.headers.get("location"), origin).pathname,
      "/about",
    );
    const studio = await request("/admin/index.html");
    assert.equal(studio.status, 200, "Studio must be available.");
    assert.ok(
      (await studio.text()).includes("CONTENT STUDIO"),
      "Expected the content studio document.",
    );
    const auth = await request("/api/cms-auth");
    assert.equal(auth.status, 302, "Sign-in must redirect to GitHub.");
    const destination = new URL(auth.headers.get("location"));
    assert.equal(destination.origin, "https://github.com");
    assert.equal(destination.pathname, "/login/oauth/authorize");
    const callback = await request(
      "/api/cms-callback?state=invalid&code=invalid",
    );
    assert.equal(callback.status, 403, "Invalid callbacks must be rejected.");
    console.log(
      "PASS: production studio, GitHub sign-in redirect, and callback rejection.",
    );
    process.exit(0);
  } catch (error) {
    failure = error;
    console.log(`Production routes not ready yet (attempt ${attempt}/10).`);
    if (attempt < 10) await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
throw failure;
