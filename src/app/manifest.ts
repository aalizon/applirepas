import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AppliRepas",
    short_name: "Repas",
    description: "Menus de la semaine et liste de courses familiale",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#d9572b",
    lang: "fr",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
