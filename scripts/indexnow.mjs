import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const origin = "https://elpidalabs.xyz/";
const endpoint = "https://api.indexnow.org/indexnow";
export function validateManifest(manifest) {
  if (!manifest || !manifest.pages || Array.isArray(manifest.pages))
    throw new Error("Invalid IndexNow manifest");
  for (const [url, hash] of Object.entries(manifest.pages)) {
    const parsed = new URL(url);
    if (
      parsed.origin !== new URL(origin).origin ||
      parsed.search ||
      parsed.hash ||
      !(
        parsed.pathname === "/" || /^\/[a-z0-9-]+\.html$/.test(parsed.pathname)
      ) ||
      parsed.pathname === "/404.html" ||
      !/^[a-f0-9]{64}$/.test(hash)
    )
      throw new Error("Invalid public page in IndexNow manifest");
  }
  return manifest;
}
export function changedUrls(previous, current) {
  validateManifest(previous);
  validateManifest(current);
  return [
    ...new Set([...Object.keys(previous.pages), ...Object.keys(current.pages)]),
  ].filter((url) => previous.pages[url] !== current.pages[url]);
}
async function request(url, options = {}) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(30000) });
}
export async function main(mode) {
  if (mode === "--snapshot") {
    const response = await request(origin + "indexnow-manifest.json", {
      cache: "no-store",
    });
    const previous =
      response.status === 404
        ? { pages: {} }
        : response.ok
          ? validateManifest(await response.json())
          : (() => {
              throw new Error(`Manifest fetch failed: HTTP ${response.status}`);
            })();
    await writeFile("indexnow-previous.json", JSON.stringify(previous));
    console.log(
      `Saved previous production manifest (${Object.keys(previous.pages).length} pages).`,
    );
    return;
  }
  if (mode !== "--submit")
    throw new Error(
      "Use --snapshot before deployment or --submit after production verification.",
    );
  const previous = JSON.parse(await readFile("indexnow-previous.json", "utf8"));
  const current = validateManifest(
    JSON.parse(await readFile("dist/indexnow-manifest.json", "utf8")),
  );
  const liveResponse = await request(origin + "indexnow-manifest.json", {
    cache: "no-store",
  });
  if (!liveResponse.ok)
    throw new Error(`Live manifest unavailable: HTTP ${liveResponse.status}`);
  const live = validateManifest(await liveResponse.json());
  if (JSON.stringify(live.pages) !== JSON.stringify(current.pages))
    throw new Error(
      "Production manifest does not match the deployed artifact; refusing notification.",
    );
  const urls = changedUrls(previous, current);
  if (!urls.length) {
    console.log("No public page changes to notify.");
    return;
  }
  const { key } = JSON.parse(await readFile("content/indexnow.json", "utf8"));
  if (!/^[a-f0-9]{32}$/.test(key)) throw new Error("Invalid ownership key");
  const keyLocation = origin + key + ".txt";
  const proof = await request(keyLocation);
  if (!proof.ok || (await proof.text()).trim() !== key)
    throw new Error("Production ownership proof is unavailable.");
  await notify(urls, key, keyLocation);
}
export async function notify(urls, key, keyLocation, send = request) {
  const response = await send(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(origin).host,
      key,
      keyLocation,
      urlList: urls,
    }),
  });
  if (![200, 202].includes(response.status))
    throw new Error(`IndexNow notification failed: HTTP ${response.status}`);
  console.log(
    `IndexNow received ${urls.length} changed/removed URLs (HTTP ${response.status}). Indexing is not guaranteed.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await main(process.argv[2]);
