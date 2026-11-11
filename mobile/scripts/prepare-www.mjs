// Écrit www/config.js avec l'adresse du serveur (APP_URL) pour les pages locales
// (accueil sans serveur configuré, page « hors ligne » avec bouton Réessayer).
import fs from "node:fs";

const url = (process.env.APP_URL ?? "").trim().replace(/\/+$/, "");
fs.writeFileSync(
  new URL("../www/config.js", import.meta.url),
  `window.APPLIREPAS_URL = ${JSON.stringify(url)};\n`,
);
console.log(url ? `Serveur AppliRepas : ${url}` : "⚠ APP_URL non défini : l'appli affichera la page d'aide.");
