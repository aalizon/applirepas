"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, Ban, Clock, Flame, Recycle, Search, Star } from "lucide-react";
import { RecipeImage } from "./recipe-image";

type Item = {
  id: string;
  title: string;
  description: string;
  time: number;
  tags: string[];
  isFavorite: boolean;
  isExcluded: boolean;
  isBatchable: boolean;
  kcal: number;
  imageUrl: string | null;
  allergens: string[];
  blockedFor: string[];
};

const FILTERS: { key: string; label: string; test: (r: Item) => boolean }[] = [
  { key: "foyer", label: "Pour tout le foyer", test: (r) => !r.blockedFor.length },
  { key: "fav", label: "Favoris", test: (r) => r.isFavorite },
  { key: "rapide", label: "Moins de 30 min", test: (r) => r.time <= 30 },
  { key: "vege", label: "Végétarien", test: (r) => r.tags.includes("vege") },
  { key: "poisson", label: "Poisson", test: (r) => r.tags.includes("poisson") },
  { key: "viande", label: "Viande", test: (r) => ["poulet", "volaille", "boeuf", "porc", "viande"].some((t) => r.tags.includes(t)) },
  { key: "leger", label: "Léger", test: (r) => r.tags.includes("leger") },
  { key: "sans-gluten", label: "Sans gluten", test: (r) => !r.allergens.includes("gluten") },
  { key: "sans-lactose", label: "Sans lait", test: (r) => !r.allergens.includes("lait") },
  { key: "batch", label: "Restes OK", test: (r) => r.isBatchable },
];

export function RecipeList({ recipes }: { recipes: Item[] }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const list = useMemo(() => {
    const n = q.toLowerCase();
    const tests = FILTERS.filter((f) => active.includes(f.key));
    return recipes.filter(
      (r) => (!n || r.title.toLowerCase().includes(n) || r.description.toLowerCase().includes(n)) && tests.every((f) => f.test(r)),
    );
  }, [q, active, recipes]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 shadow-[var(--shadow)]">
        <Search size={18} className="text-muted" />
        <input
          className="w-full bg-transparent py-3 text-base outline-none"
          placeholder="Un plat, un ingrédient…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => {
          const on = active.includes(f.key);
          return (
            <button
              key={f.key}
              onClick={() => setActive((a) => (on ? a.filter((k) => k !== f.key) : [...a, f.key]))}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                on ? "bg-brand text-brand-ink" : "border border-line bg-surface text-ink hover:bg-surface-2"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list.map((r) => (
          <Link key={r.id} href={`/recettes/${r.id}`} className={`group ${r.isExcluded ? "opacity-60" : ""}`}>
            <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow)]">
              <RecipeImage
                src={r.imageUrl}
                title={r.title}
                rounded="rounded-3xl"
                className="aspect-[4/3] w-full transition duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute left-2 top-2 flex gap-1">
                {r.isFavorite && (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-surface/90 text-warn">
                    <Star size={15} fill="currentColor" />
                  </span>
                )}
                {r.isExcluded && (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-surface/90 text-muted" title="Jamais proposée">
                    <Ban size={15} />
                  </span>
                )}
              </div>
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-xs font-bold">
                <Clock size={12} /> {r.time} min
              </span>
            </div>
            <h2 className="mt-2 line-clamp-2 font-bold leading-snug group-hover:text-brand">{r.title}</h2>
            <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Flame size={12} /> {r.kcal} kcal
              </span>
              {r.isBatchable && (
                <span className="inline-flex items-center gap-1 text-info">
                  <Recycle size={12} /> restes
                </span>
              )}
            </p>
            {r.blockedFor.length > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-bad">
                <AlertTriangle size={12} /> Pas pour {r.blockedFor.join(", ")}
              </p>
            )}
          </Link>
        ))}
      </div>
      {!list.length && <p className="py-10 text-center text-muted">Aucune recette ne correspond.</p>}
    </div>
  );
}
