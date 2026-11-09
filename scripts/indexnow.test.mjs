import test from "node:test";
import assert from "node:assert/strict";
import { changedUrls, validateManifest, notify } from "./indexnow.mjs";
const a = "a".repeat(64),
  b = "b".repeat(64);
const home = "https://elpidalabs.xyz/",
  product = "https://elpidalabs.xyz/elpida.html";
test("notify only additions, edits and removals", () => {
  assert.deepEqual(
    changedUrls(
      { pages: { [home]: a, [product]: a } },
      { pages: { [home]: a } },
    ),
    [product],
  );
  assert.deepEqual(
    changedUrls(
      { pages: { [home]: a } },
      { pages: { [home]: b, [product]: a } },
    ),
    [home, product],
  );
  assert.deepEqual(
    changedUrls({ pages: { [home]: a } }, { pages: { [home]: a } }),
    [],
  );
});
test("reject foreign hosts, admin, query strings and invalid hashes", () => {
  for (const url of [
    "https://example.com/",
    "https://elpidalabs.xyz/admin/",
    home + "?x=1",
    "https://elpidalabs.xyz/404.html",
  ])
    assert.throws(() => validateManifest({ pages: { [url]: a } }));
  assert.throws(() => validateManifest({ pages: { [home]: "bad" } }));
});

test("accept 200/202 and surface rate limiting without live requests", async () => {
  for (const status of [200, 202])
    await notify(
      [home],
      "a".repeat(32),
      home + "a".repeat(32) + ".txt",
      async (url, options) => {
        assert.equal(url, "https://api.indexnow.org/indexnow");
        assert.equal(options.method, "POST");
        const payload = JSON.parse(options.body);
        assert.deepEqual(payload.urlList, [home]);
        assert.equal(payload.host, "elpidalabs.xyz");
        return { status };
      },
    );
  await assert.rejects(
    notify([home], "a".repeat(32), home, async () => ({ status: 429 })),
    /HTTP 429/,
  );
});
