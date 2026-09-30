"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Search } from "lucide-react";
import { saveIngredient } from "@/app/actions";
import type { Ingredient } from "@/db/schema";
import { ALLERGEN_LABELS, list } from "@/lib/allergens";

const ANIMALS: [string, string][] = [
  ["", "Végétal"], ["volaille", "Volaille"], ["boeuf", "Bœuf"], ["porc", "Porc"], ["viande", "Autre viande"],
  ["poisson", "Poisson"], ["crustace", "Crustacé"], ["mollusque", "Mollusque"], ["animal", "Autre produit animal"],
];

export function IngredientTable({ ingredients, categories }: { ingredients: Ingredient[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);
  const list = useMemo(
    () =>
      ingredients.filter(
        (i) => i.name.includes(q.toLowerCase()) && (!onlyIncomplete || i.kcal == null || i.category === "Divers"),
      ),
    [q, onlyIncomplete, ingredients],
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3">
          <Search size={16} className="text-muted" />
          <input className="w-full bg-transparent py-2 outline-none" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyIncomplete} onChange={(e) => setOnlyIncomplete(e.target.checked)} /> À compléter
        </label>
      </div>
      <div className="space-y-2">
        {list.map((i) => (
          <Row key={i.id} i={i} categories={categories} />
        ))}
      </div>
    </div>
  );
}

function Row({ i, categories }: { i: Ingredient; categories: string[] }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const num = (v: number | null) => (v == null ? "" : String(v));
  return (
    <form
      action={(fd) =>
        start(async () => {
          await saveIngredient(fd);
          setSaved(true);
        })
      }
      onChange={() => setSaved(false)}
      className={`card grid grid-cols-2 items-end gap-2 p-3 sm:grid-cols-12 ${i.kcal == null ? "border-warn" : ""}`}
    >
      <input type="hidden" name="id" value={i.id} />
      <div className="col-span-2 sm:col-span-3">
        <label className="label">Nom</label>
        <input className="input" name="name" defaultValue={i.name} />
      </div>
      <div className="col-span-2 sm:col-span-2">
        <label className="label">Rayon</label>
        <select className="input" name="category" defaultValue={i.category}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Unité</label>
        <select className="input" name="unit" defaultValue={i.unit}>
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="piece">pièce</option>
        </select>
      </div>
      <div>
        <label className="label">g/pièce</label>
        <input className="input" name="gramsPerPiece" inputMode="decimal" defaultValue={num(i.gramsPerPiece)} />
      </div>
      <div>
        <label className="label">kcal</label>
        <input className="input" name="kcal" inputMode="decimal" defaultValue={num(i.kcal)} />
      </div>
      <div>
        <label className="label">Prot.</label>
        <input className="input" name="protein" inputMode="decimal" defaultValue={num(i.protein)} />
      </div>
      <div>
        <label className="label">Gluc.</label>
        <input className="input" name="carbs" inputMode="decimal" defaultValue={num(i.carbs)} />
      </div>
      <div>
        <label className="label">Lip.</label>
        <input className="input" name="fat" inputMode="decimal" defaultValue={num(i.fat)} />
      </div>
      <div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:flex-col sm:items-start">
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" name="isPantry" defaultChecked={i.isPantry} /> Placard
        </label>
        <button className="btn-ghost px-3 py-1" disabled={pending} title="Enregistrer">
          <Check size={14} className={saved ? "text-ok" : ""} />
        </button>
      </div>
      <div className="col-span-2 flex flex-wrap items-center gap-1.5 sm:col-span-12">
        <select className="input w-auto py-1 text-xs" name="animal" defaultValue={i.animal} aria-label="Origine">
          {ANIMALS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        {Object.entries(ALLERGEN_LABELS).map(([code, label]) => (
          <label key={code} className="cursor-pointer">
            <input type="checkbox" name="allergens" value={code} defaultChecked={list(i.allergens).includes(code)} className="peer sr-only" />
            <span className="inline-block rounded-full border border-line px-2 py-0.5 text-[11px] font-semibold text-muted peer-checked:border-bad peer-checked:bg-bad peer-checked:text-white">
              {label}
            </span>
          </label>
        ))}
      </div>
    </form>
  );
}
