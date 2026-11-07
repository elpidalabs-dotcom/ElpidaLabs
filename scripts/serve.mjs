import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname, sep } from "node:path";
export const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
export function serve(port = 8000) {
  const server = createServer(async (req, res) => {
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (path === "/") {
      res.writeHead(302, { Location: "/ElpidaLabs/" }).end();
      return;
    }
    if (!path.startsWith("/ElpidaLabs/")) {
      res.writeHead(404).end();
      return;
    }
    const target = resolve(
      root,
      path.slice("/ElpidaLabs/".length) || "index.html",
    );
    if (!target.startsWith(root + sep) || path.includes("/.")) {
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
        .end(await readFile(resolve(root, "404.html")));
    }
  });
  return new Promise((resolveReady) =>
    server.listen(port, "127.0.0.1", () => resolveReady(server)),
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await serve();
  console.log("Preview: http://127.0.0.1:8000/ElpidaLabs/");
}
