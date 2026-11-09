import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname, sep } from "node:path";
export const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
export function serve(
  port = 8000,
  { directory = root, basePath = "/ElpidaLabs/" } = {},
) {
  const contentRoot = resolve(directory);
  if (!basePath.startsWith("/") || !basePath.endsWith("/"))
    throw new Error("A preview base path must start and end with /.");
  const server = createServer(async (req, res) => {
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (path === "/" && basePath !== "/") {
      res.writeHead(302, { Location: basePath }).end();
      return;
    }
    if (!path.startsWith(basePath)) {
      res.writeHead(404).end();
      return;
    }
    const target = resolve(
      contentRoot,
      (path.slice(basePath.length) || "") +
        (path.endsWith("/") ? "index.html" : ""),
    );
    if (!target.startsWith(contentRoot + sep) || path.includes("/.")) {
      res.writeHead(403).end();
      return;
    }
    const types = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css",
      ".js": "text/javascript",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".xml": "application/xml",
      ".woff2": "font/woff2",
      ".json": "application/json",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".avif": "image/avif",
    };
    try {
      const data = await readFile(target);
      res
        .writeHead(200, {
          "Content-Type": types[extname(target)] || "application/octet-stream",
        })
        .end(data);
    } catch {
      res
        .writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        .end(await readFile(resolve(contentRoot, "404.html")));
    }
  });
  return new Promise((resolveReady) =>
    server.listen(port, "127.0.0.1", () => resolveReady(server)),
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const vercel = process.argv.includes("--vercel");
  const basePath = vercel ? "/" : "/ElpidaLabs/";
  await serve(8000, {
    directory: vercel ? resolve(root, "dist") : root,
    basePath,
  });
  console.log(`Preview: http://127.0.0.1:8000${basePath}`);
}
