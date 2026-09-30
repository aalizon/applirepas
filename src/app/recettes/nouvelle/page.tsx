import { getIngredients } from "@/lib/data";
import { RecipeEditor } from "@/components/recipe-editor";

export const dynamic = "force-dynamic";

export default async function Nouvelle() {
  const known = await getIngredients();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="h1">Nouvelle recette</h1>
      <RecipeEditor
        known={known.map((k) => ({ name: k.name, unit: k.unit }))}
        initial={{
          title: "", description: "", prepTime: 20, cookTime: 20, tags: "", seasons: "", isBatchable: true,
          isFavorite: false, isExcluded: false, rating: null, instructions: "", servings: 4,
          ingredients: [{ name: "", quantity: 0, note: "" }],
        }}
      />
    </div>
  );
}
