import { readdir, readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { output as root } from "./deployment.mjs";
for (const file of (await readdir(root)).filter((file) =>
  file.endsWith(".html"),
)) {
  const url = new URL(file, root);
  await writeFile(
    url,
    await format(await readFile(url, "utf8"), { parser: "html" }),
  );
}
