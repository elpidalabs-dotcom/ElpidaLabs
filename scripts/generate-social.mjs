import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const logo = readFileSync(new URL("assets/elpida-mark.png", root)).toString(
  "base64",
);
const cards = [
  [
    "social-card.png",
    "#c3fa71",
    "INDEPENDENT MINDS. SHARED MOMENTUM.",
    "Curiosity into code.",
    "Code into impact.",
    "AI / WEB3 / SYSTEMS",
  ],
  [
    "social-elpida.png",
    "#c3fa71",
    "ELPIDA / PRODUCT IN DEVELOPMENT",
    "A new starting point",
    "for onchain ideas.",
    "PRODUCT DIRECTION / INTERFACE STUDY",
  ],
  [
    "social-chaos.png",
    "#a8e0df",
    "CHAOS ENGINE / RESEARCH &amp; EXPLORATION",
    "Understand the failure.",
    "Design the recovery.",
    "SYSTEMS RESEARCH / CONCEPT EXPLAINER",
  ],
];
for (const [file, accent, kicker, line1, line2, foot] of cards) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><radialGradient id="halo"><stop stop-color="${accent}" stop-opacity=".14"/><stop offset="1" stop-color="#0b0e0c"/></radialGradient></defs><rect width="1200" height="630" fill="#0b0e0c"/><circle cx="1030" cy="300" r="360" fill="url(#halo)"/><g fill="none" stroke="${accent}" stroke-opacity=".25"><ellipse cx="1000" cy="300" rx="250" ry="100" transform="rotate(-40 1000 300)"/><ellipse cx="1000" cy="300" rx="250" ry="100" transform="rotate(40 1000 300)"/><circle cx="1000" cy="300" r="180"/></g><image x="70" y="50" width="46" height="46" href="data:image/png;base64,${logo}"/><text x="131" y="82" fill="#f0f2e9" font-size="30" font-family="Arial,Helvetica,sans-serif">elpida labs.</text><text x="73" y="181" fill="${accent}" font-size="17" letter-spacing="2" font-family="Arial,Helvetica,sans-serif">${kicker}</text><text x="70" y="304" fill="#f0f2e9" font-family="Arial,Helvetica,sans-serif" font-size="67" letter-spacing="-3">${line1}</text><text x="70" y="389" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="67" letter-spacing="-3">${line2}</text><path d="M73 473h1054" stroke="#35402f"/><text x="73" y="528" fill="#a0aaa0" font-size="15" letter-spacing="1.6" font-family="Arial,Helvetica,sans-serif">${foot}</text><text x="73" y="573" fill="#a0aaa0" font-size="16" font-family="Arial,Helvetica,sans-serif">ELPIDA LABS / IDEAS DESERVE TO BE BUILT</text></svg>`;
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL("assets/" + file, root)));
}
console.log("Generated three 1200 × 630 social images.");
