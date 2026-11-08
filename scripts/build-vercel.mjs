import { mkdir, cp, rm, lstat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
// Only remove this checkout's generated dist directory, never a symlink target.
assert.equal(dirname(dist), resolve(root));
assert.equal(dist, resolve(root, "dist"));
const existing = await lstat(dist).catch((error) => {
  if (error.code !== "ENOENT") throw error;
  return null;
});
assert.ok(
  !existing?.isSymbolicLink(),
  "Refusing to replace a symlinked dist directory.",
);
console.log(`Preparing generated output: ${dist}`);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const env = { ...process.env, SITE_TARGET: "vercel" };
execFileSync(process.execPath, ["scripts/build.mjs"], {
  cwd: root,
  env,
  stdio: "inherit",
});
execFileSync(process.execPath, ["scripts/format-pages.mjs"], {
  cwd: root,
  env,
  stdio: "inherit",
});
for (const file of [
  "styles.css",
  "experience.css",
  "script.js",
  "enhancements.js",
  "demo-model.js",
]) {
  await cp(resolve(root, file), resolve(dist, file));
}
await cp(resolve(root, "assets"), resolve(dist, "assets"), { recursive: true });
console.log(
  "Vercel artifact ready in dist/. Repository sources and GitHub Pages output were preserved.",
);
