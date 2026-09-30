"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, Settings, ShoppingCart, UtensilsCrossed } from "lucide-react";

const LINKS = [
  { href: "/", label: "Planning", icon: CalendarDays },
  { href: "/recettes", label: "Recettes", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: ShoppingCart },
  { href: "/reglages", label: "Réglages", icon: Settings },
];

export function NavBar() {
  const path = usePathname();
  if (path.startsWith("/connexion") || path.startsWith("/bienvenue")) return null;
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-ink">
              <UtensilsCrossed size={18} />
            </span>
            AppliRepas
          </Link>
          <nav className="ml-auto hidden gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                  active(l.href) ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <l.icon size={16} /> {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
              active(l.href) ? "text-brand" : "text-muted"
            }`}
          >
            <l.icon size={20} />
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
