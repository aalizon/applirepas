import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { getHousehold, getRecipes } from "@/lib/data";
import { conflictsFor, recipeAllergens } from "@/lib/allergens";
import { recipeMacros, tagsOf, totalTime } from "@/lib/planner";
import { RecipeList } from "@/components/recipe-list";

export const dynamic = "force-dynamic";

export default async function Recettes() {
  const [recipes, household] = await Promise.all([getRecipes(), getHousehold()]);
  const active = household.members.filter((m) => m.isActive);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto">
          <p className="text-sm font-semibold text-muted">{recipes.length} recettes</p>
          <h1 className="h1">Recettes</h1>
        </div>
        <Link href="/recettes/importer" className="btn-ghost">
          <Download size={16} /> Importer d&apos;un site
        </Link>
        <Link href="/recettes/nouvelle" className="btn-primary">
          <Plus size={16} /> Nouvelle
        </Link>
      </div>
      <RecipeList
        recipes={recipes.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          time: totalTime(r),
          tags: tagsOf(r),
          isFavorite: r.isFavorite,
          isExcluded: r.isExcluded,
          isBatchable: r.isBatchable,
          kcal: Math.round(recipeMacros(r).kcal),
          imageUrl: r.imageUrl,
          allergens: [...recipeAllergens(r)],
          blockedFor: [...new Set(conflictsFor(r, active).filter((c) => c.kind !== "gout").map((c) => c.member))],
        }))}
      />
    </div>
  );
}
