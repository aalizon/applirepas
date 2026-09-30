import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { getRecipes } from "@/lib/data";
import { recipeMacros, tagsOf, totalTime } from "@/lib/planner";
import { RecipeList } from "@/components/recipe-list";

export const dynamic = "force-dynamic";

export default async function Recettes() {
  const recipes = await getRecipes();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="h1 mr-auto">Recettes ({recipes.length})</h1>
        <Link href="/recettes/importer" className="btn-ghost">
          <Download size={16} /> Importer depuis un site
        </Link>
        <Link href="/recettes/nouvelle" className="btn-primary">
          <Plus size={16} /> Nouvelle recette
        </Link>
      </div>
      <RecipeList
        recipes={recipes.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          time: totalTime(r),
          tags: tagsOf(r),
          seasons: r.seasons,
          isFavorite: r.isFavorite,
          isExcluded: r.isExcluded,
          isBatchable: r.isBatchable,
          rating: r.rating,
          kcal: Math.round(recipeMacros(r).kcal),
          imageUrl: r.imageUrl,
          missingNutrition: r.ingredients.some((i) => i.ingredient.kcal == null),
        }))}
      />
    </div>
  );
}
