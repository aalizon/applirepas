"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { deleteRecipe, saveRecipe, type RecipeInput } from "@/app/actions";
import { RecipeImage } from "./recipe-image";

type KnownIngredient = { name: string; unit: string };
const UNIT_LABEL: Record<string, string> = { g: "g", ml: "ml", piece: "pièce(s)" };
const SEASONS = [
  ["printemps", "Printemps"],
  ["ete", "Été"],
  ["automne", "Automne"],
  ["hiver", "Hiver"],
];

export function RecipeEditor({ initial, known }: { initial: RecipeInput; known: KnownIngredient[] }) {
  const router = useRouter();
  const [r, setR] = useState(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const set = (patch: Partial<RecipeInput>) => setR((x) => ({ ...x, ...patch }));
  const unitOf = (name: string) => known.find((k) => k.name === name.trim().toLowerCase())?.unit;
  const seasons = r.seasons.split(",").filter(Boolean);

  const save = () =>
    start(async () => {
      const res = await saveRecipe(r);
      if ("error" in res) setError(res.error ?? "Erreur");
      else router.push(`/recettes/${res.id}`);
    });

  return (
    <div className="space-y-5">
      <section className="card grid gap-4 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Titre</label>
          <input className="input" value={r.title} onChange={(e) => set({ title: e.target.value })} />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <RecipeImage src={r.imageUrl} title={r.title || "?"} className="h-16 w-20 flex-none" />
          <div className="flex-1">
            <label className="label">Photo (adresse d&apos;une image)</label>
            <input
              className="input"
              value={r.imageUrl ?? ""}
              placeholder="https://… ou laisser vide"
              onChange={(e) => set({ imageUrl: e.target.value.trim() || null })}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <input className="input" value={r.description} onChange={(e) => set({ description: e.target.value })} />
        </div>
        <div>
          <label className="label">Préparation (min)</label>
          <input className="input" type="number" value={r.prepTime} onChange={(e) => set({ prepTime: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label">Cuisson (min)</label>
          <input className="input" type="number" value={r.cookTime} onChange={(e) => set({ cookTime: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label">Tags (séparés par des virgules)</label>
          <input className="input" value={r.tags} placeholder="poulet, rapide, famille" onChange={(e) => set({ tags: e.target.value })} />
          <p className="mt-1 text-xs text-muted">Protéine : poulet, volaille, boeuf, porc, poisson, oeuf, vege · autres : rapide, leger, famille…</p>
        </div>
        <div>
          <label className="label">Saisons (aucune = toute l&apos;année)</label>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map(([k, l]) => (
              <label key={k} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={seasons.includes(k)}
                  onChange={(e) =>
                    set({ seasons: (e.target.checked ? [...seasons, k] : seasons.filter((s) => s !== k)).join(",") })
                  }
                />
                {l}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={r.isBatchable} onChange={(e) => set({ isBatchable: e.target.checked })} />
            Se réchauffe bien (restes / gamelle)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={r.isFavorite} onChange={(e) => set({ isFavorite: e.target.checked })} />
            Favori
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={r.isExcluded} onChange={(e) => set({ isExcluded: e.target.checked })} />
            Ne jamais proposer automatiquement
          </label>
        </div>
      </section>

      <section className="card space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="h2 mr-auto">Ingrédients</h2>
          <label className="text-sm text-muted">Quantités pour</label>
          <input
            className="input w-20"
            type="number"
            min={1}
            value={r.servings}
            onChange={(e) => set({ servings: Math.max(1, Number(e.target.value) || 1) })}
          />
          <span className="text-sm text-muted">portions adultes</span>
        </div>
        <datalist id="known-ingredients">
          {known.map((k) => (
            <option key={k.name} value={k.name} />
          ))}
        </datalist>
        <div className="space-y-2">
          {r.ingredients.map((line, i) => {
            const unit = unitOf(line.name);
            return (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <input
                  className="input w-24"
                  type="number"
                  step="any"
                  value={line.quantity}
                  onChange={(e) =>
                    set({ ingredients: r.ingredients.map((l, j) => (j === i ? { ...l, quantity: Number(e.target.value) } : l)) })
                  }
                />
                <span className="w-16 text-xs text-muted">{unit ? UNIT_LABEL[unit] : line.name ? "nouveau (g)" : ""}</span>
                <input
                  className="input min-w-40 flex-1"
                  list="known-ingredients"
                  placeholder="ingrédient"
                  value={line.name}
                  onChange={(e) =>
                    set({ ingredients: r.ingredients.map((l, j) => (j === i ? { ...l, name: e.target.value } : l)) })
                  }
                />
                <input
                  className="input min-w-32 flex-1"
                  placeholder="précision (émincé…)"
                  value={line.note}
                  onChange={(e) =>
                    set({ ingredients: r.ingredients.map((l, j) => (j === i ? { ...l, note: e.target.value } : l)) })
                  }
                />
                <button className="btn-icon" onClick={() => set({ ingredients: r.ingredients.filter((_, j) => j !== i) })}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
        <button className="btn-ghost" onClick={() => set({ ingredients: [...r.ingredients, { name: "", quantity: 0, note: "" }] })}>
          <Plus size={16} /> Ajouter un ingrédient
        </button>
      </section>

      <section className="card space-y-2 p-4">
        <h2 className="h2">Étapes (une par ligne)</h2>
        <textarea className="input min-h-48" value={r.instructions} onChange={(e) => set({ instructions: e.target.value })} />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {r.id && (
          <button
            className="btn-ghost text-warn"
            onClick={() => confirm("Supprimer définitivement cette recette ?") && start(() => deleteRecipe(r.id!))}
          >
            <Trash2 size={16} /> Supprimer
          </button>
        )}
        {error && <span className="text-sm text-warn">{error}</span>}
        <button className="btn-primary ml-auto" disabled={pending} onClick={save}>
          <Check size={16} /> {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
