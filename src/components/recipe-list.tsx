"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Ban, Clock, Flame, Recycle, Search, Star } from "lucide-react";

type Item = {
  id: string;
  title: string;
  description: string;
  time: number;
  tags: string[];
  seasons: string;
  isFavorite: boolean;
  isExcluded: boolean;
  isBatchable: boolean;
  rating: number | null;
  kcal: number;
  imageUrl: string | null;
  missingNutrition: boolean;
};

const FILTERS = [
  { key: "fav", label: "★ Favoris" },
  { key: "rapide", label: "Rapide" },
  { key: "vege", label: "Végé" },
  { key: "poisson", label: "Poisson" },
  { key: "poulet", label: "Poulet" },
  { key: "boeuf", label: "Bœuf" },
  { key: "porc", label: "Porc" },
  { key: "leger", label: "Léger" },
  { key: "batch", label: "Restes OK" },
];

export function RecipeList({ recipes }: { recipes: Item[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const list = useMemo(() => {
    const n = q.toLowerCase();
    return recipes.filter((r) => {
      if (n && !r.title.toLowerCase().includes(n) && !r.description.toLowerCase().includes(n)) return false;
      if (filter === "fav") return r.isFavorite;
      if (filter === "batch") return r.isBatchable;
      if (filter === "rapide") return r.time <= 30 || r.tags.includes("rapide");
      if (filter) return r.tags.includes(filter);
      return true;
    });
  }, [q, filter, recipes]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
        <Search size={16} className="text-muted" />
        <input className="w-full bg-transparent py-2 outline-none" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(filter === f.key ? null : f.key)}
            className={`chip px-3 py-1 text-sm ${filter === f.key ? "bg-brand text-brand-ink" : "bg-surface-2 text-ink"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <Link key={r.id} href={`/recettes/${r.id}`} className={`card flex gap-3 p-3 hover:border-brand ${r.isExcluded ? "opacity-60" : ""}`}>
            {r.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.imageUrl} alt="" className="h-20 w-20 flex-none rounded-xl object-cover" />
            ) : (
              <div className="grid h-20 w-20 flex-none place-items-center rounded-xl bg-brand-soft text-2xl font-extrabold text-brand">
                {r.title[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-1">
                <h2 className="flex-1 font-bold leading-tight">{r.title}</h2>
                {r.isFavorite && <Star size={14} className="mt-0.5 flex-none text-warn" fill="currentColor" />}
                {r.isExcluded && <Ban size={14} className="mt-0.5 flex-none text-muted" />}
              </div>
              <p className="line-clamp-2 text-xs text-muted">{r.description}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} /> {r.time} min
                </span>
                <span className="inline-flex items-center gap-1" title="Pour une portion adulte">
                  <Flame size={12} /> {r.missingNutrition ? "≥ " : ""}
                  {r.kcal} kcal
                </span>
                {r.isBatchable && (
                  <span className="inline-flex items-center gap-1 text-info">
                    <Recycle size={12} /> restes
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!list.length && <p className="text-center text-muted">Aucune recette ne correspond.</p>}
    </div>
  );
}
