import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/db/seed-data";
import { getIngredients } from "@/lib/data";
import { IngredientTable } from "@/components/ingredient-table";

export const dynamic = "force-dynamic";

export default async function Ingredients() {
  const ingredients = await getIngredients();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/reglages" className="btn-icon" aria-label="Retour">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="h1">Ingrédients & rayons ({ingredients.length})</h1>
      </div>
      <p className="text-sm text-muted">
        Rayon (ordre de la liste de courses), unité de référence et valeurs nutritionnelles pour 100 g. Source conseillée :{" "}
        <a className="text-info underline" href="https://ciqual.anses.fr/" target="_blank" rel="noreferrer">
          table Ciqual de l&apos;ANSES
        </a>
        . Les produits « placard » ne sont pas ajoutés automatiquement aux courses.
      </p>
      <IngredientTable ingredients={ingredients} categories={[...CATEGORIES]} />
    </div>
  );
}
