import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Applications Android / iOS d'AppliRepas.
 *
 * L'appli a besoin de son serveur (base SQLite, Server Actions) : l'application mobile est une
 * coquille native qui ouvre l'instance en ligne (o2switch, Docker…) indiquée par APP_URL,
 * par ex. APP_URL=https://repas.mondomaine.fr npm run android:apk
 */
const url = process.env.APP_URL?.trim().replace(/\/+$/, "");

const config: CapacitorConfig = {
  appId: process.env.APP_ID || "fr.applirepas.app",
  appName: "AppliRepas",
  webDir: "www",
  backgroundColor: "#faf7f2",
  server: url
    ? {
        url,
        cleartext: url.startsWith("http://"), // http seulement pour un serveur local (NAS, Raspberry Pi…)
        errorPath: "hors-ligne.html", // page affichée si le serveur est injoignable
      }
    : undefined,
  android: {
    appendUserAgent: "AppliRepasAndroid",
  },
  ios: {
    appendUserAgent: "AppliRepasIOS",
    contentInset: "never",
  },
};

export default config;
