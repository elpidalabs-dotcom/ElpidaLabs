import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
const snapshot = async () =>
  Object.fromEntries(
    await Promise.all(
      (await readdir(new URL("../", import.meta.url)))
        .filter(
          (file) =>
            file.endsWith(".html") ||
            ["sitemap.xml", "robots.txt"].includes(file),
        )
        .sort()
        .map(async (file) => [
          file,
          createHash("sha256")
            .update(await readFile(new URL("../" + file, import.meta.url)))
            .digest("hex"),
        ]),
    ),
  );
const before = await snapshot();
execFileSync(process.execPath, ["scripts/build.mjs"], { stdio: "inherit" });
execFileSync(process.execPath, ["scripts/format-pages.mjs"], {
  stdio: "inherit",
});
assert.deepEqual(
  await snapshot(),
  before,
  "Content builds must be deterministic.",
);
console.log(
  "PASS: content produces identical HTML, sitemap and robots on repeated builds.",
);
