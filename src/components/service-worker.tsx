"use client";

import { useEffect } from "react";

/** Enregistre le service worker : la liste de courses reste consultable hors ligne au magasin. */
export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
