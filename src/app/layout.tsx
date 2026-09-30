import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { NavBar } from "@/components/nav";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppliRepas",
  description: "Menus de la semaine, restes pour le midi et liste de courses pour toute la famille.",
  appleWebApp: { capable: true, title: "AppliRepas", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#d9572b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <NavBar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:pb-10">{children}</main>
        <ServiceWorker />
      </body>
    </html>
  );
}
