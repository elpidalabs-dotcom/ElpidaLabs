import { readFileSync } from "node:fs";

const site = JSON.parse(
  readFileSync(new URL("../content/site.json", import.meta.url), "utf8"),
);
export const target = process.env.SITE_TARGET || "github";
if (!["github", "vercel"].includes(target))
  throw new Error(`Unknown SITE_TARGET: ${target}`);
export const basePath = target === "vercel" ? "/" : "/ElpidaLabs/";
export const origin =
  target === "vercel"
    ? new URL("/", site.websiteUrl).href
    : "https://elpidalabs-dotcom.github.io/ElpidaLabs/";
if (new URL(origin).protocol !== "https:")
  throw new Error("The public website URL must use HTTPS.");
export const output = new URL(
  target === "vercel" ? "../dist/" : "../",
  import.meta.url,
);
