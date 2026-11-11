// Génère les images sources de @capacitor/assets (icônes et écrans de démarrage)
// à partir du logo de l'appli (public/icon.svg), avec sharp (fourni par @capacitor/assets).
import fs from "node:fs";
import sharp from "sharp";

const ORANGE = "#d9572b";
const GLYPH = `<g fill="none" stroke="#fff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"><path d="M176 128v96a48 48 0 0 0 48 48v112M176 128v80M224 128v80M272 128v96a48 48 0 0 1-48 48"/><path d="M352 384V128c-40 24-56 72-56 120h56"/></g>`;
const svg = (size, body) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">${body}</svg>`);

const out = new URL("../assets/", import.meta.url);
fs.mkdirSync(out, { recursive: true });
const png = (name, buf) => sharp(buf).png().toFile(new URL(name, out).pathname);

// Icône carrée pleine (iOS, anciennes versions d'Android)
await png("icon-only.png", svg(1024, `<rect width="512" height="512" fill="${ORANGE}"/>${GLYPH}`));
// Icône adaptative Android : fond + pictogramme réduit dans la zone de sécurité (66 %)
await png("icon-background.png", svg(1024, `<rect width="512" height="512" fill="${ORANGE}"/>`));
await png("icon-foreground.png", svg(1024, `<g transform="translate(256 256) scale(0.62) translate(-256 -256)">${GLYPH}</g>`));
// Écrans de démarrage : logo arrondi centré
const splash = (bg) =>
  sharp({ create: { width: 2732, height: 2732, channels: 4, background: bg } })
    .composite([{ input: svg(560, `<rect width="512" height="512" rx="112" fill="${ORANGE}"/>${GLYPH}`), gravity: "center" }]);
await splash("#faf7f2").png().toFile(new URL("splash.png", out).pathname);
await splash("#1c1917").png().toFile(new URL("splash-dark.png", out).pathname);
console.log("Images sources générées dans mobile/assets/");
