import { notFound } from "next/navigation";
import { getIngredients, getRecipe } from "@/lib/data";
import { RecipeEditor } from "@/components/recipe-editor";

export const dynamic = "force-dynamic";

const SERVINGS = 4;

export default async function Modifier({ params, searchParams }: PageProps<"/recettes/[id]/modifier">) {
  const { id } = await params;
  const sp = await searchParams;
  const [recipe, known] = await Promise.all([getRecipe(id), getIngredients()]);
  if (!recipe) notFound();
  const nouveaux = typeof sp.nouveaux === "string" ? sp.nouveaux.split(",").filter(Boolean) : [];
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="h1">{sp.importe ? "Vérifier la recette importée" : "Modifier la recette"}</h1>
      {sp.importe && (
        <div className="card border-info bg-info-soft p-4 text-sm text-info">
          Recette importée ! Vérifiez les quantités (converties pour {SERVINGS} portions adultes) et les tags.
          {nouveaux.length > 0 && (
            <>
              {" "}
              Nouveaux ingrédients créés : <b>{nouveaux.join(", ")}</b> — pensez à compléter leur rayon et leurs valeurs
              nutritionnelles dans Réglages → Ingrédients.
            </>
          )}
        </div>
      )}
      <RecipeEditor
        known={known.map((k) => ({ name: k.name, unit: k.unit }))}
        initial={{
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          tags: recipe.tags,
          seasons: recipe.seasons,
          isBatchable: recipe.isBatchable,
          isFavorite: recipe.isFavorite,
          isExcluded: recipe.isExcluded,
          rating: recipe.rating,
          instructions: recipe.instructions,
          sourceUrl: recipe.sourceUrl,
          imageUrl: recipe.imageUrl,
          servings: SERVINGS,
          ingredients: recipe.ingredients.map((i) => ({
            name: i.ingredient.name,
            quantity: Math.round(i.quantity * SERVINGS * 10) / 10,
            note: i.note,
          })),
        }}
      />
    </div>
  );
}
