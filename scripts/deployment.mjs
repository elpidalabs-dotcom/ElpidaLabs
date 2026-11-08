import { readFileSync } from "node:fs";

const site = JSON.parse(
  readFileSync(new URL("../content/site.json", import.meta.url), "utf8"),
);
export const target = process.env.SITE_TARGET || "github";
if (!["github", "vercel"].includes(target))
  throw new Error(`Unknown SITE_TARGET: ${target}`);
export const basePath = target === "vercel" ? "/" : "/ElpidaLabs/";
// Both hosting targets identify the custom domain as the authoritative site.
// Relative navigation and basePath still preserve GitHub Pages compatibility.
export const origin = new URL("/", site.websiteUrl).href;
if (new URL(origin).protocol !== "https:")
  throw new Error("The public website URL must use HTTPS.");
export const output = new URL(
  target === "vercel" ? "../dist/" : "../",
  import.meta.url,
);
