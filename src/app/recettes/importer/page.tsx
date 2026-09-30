"use client";

import { useActionState } from "react";
import { Download } from "lucide-react";
import { importRecipe } from "@/app/actions";

const SITES = ["Marmiton", "750g", "Cuisine AZ", "Journal des Femmes Cuisine", "Ricardo", "Jow", "Cuisine Actuelle", "Chefclub"];

export default function Importer() {
  const [state, action, pending] = useActionState(importRecipe, null);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="h1">Importer une recette</h1>
      <p className="text-muted">
        Collez l&apos;adresse d&apos;une recette trouvée sur le web. AppliRepas lit les données structurées (schema.org) que la
        plupart des sites publient pour Google : titre, ingrédients, étapes, temps et nombre de parts. Les quantités sont
        ramenées à une portion adulte et les ingrédients reliés à votre base.
      </p>
      <form action={action} className="card space-y-3 p-4">
        <label className="label" htmlFor="url">
          Adresse de la recette
        </label>
        <input id="url" name="url" type="url" required className="input" placeholder="https://www.marmiton.org/recettes/..." />
        {state?.error && <p className="text-sm text-warn">{state.error}</p>}
        <button className="btn-primary" disabled={pending}>
          <Download size={16} /> {pending ? "Import en cours…" : "Importer"}
        </button>
      </form>
      <p className="text-xs text-muted">Compatible notamment avec : {SITES.join(", ")}… Usage personnel uniquement.</p>
    </div>
  );
}
