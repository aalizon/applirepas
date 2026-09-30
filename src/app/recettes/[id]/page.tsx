import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ExternalLink, Pencil, Recycle } from "lucide-react";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { addDays, formatDay } from "@/lib/dates";
import { getHousehold, getMeals, getRecipe, getSettings } from "@/lib/data";
import { cookPortions, eatersOf, recipeMacros, tagsOf } from "@/lib/planner";
import { RecipeDetail } from "@/components/recipe-detail";

export const dynamic = "force-dynamic";

export default async function RecettePage({ params, searchParams }: PageProps<"/recettes/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  const settings = await getSettings();

  // Portions : celles du repas planifié (restes inclus) ou, par défaut, un dîner avec tout le foyer
  let portions: number;
  let context: string;
  const mealId = typeof sp.repas === "string" ? sp.repas : null;
  const meal = mealId ? await db.select().from(schema.meals).where(eq(schema.meals.id, mealId)).get() : undefined;
  if (meal) {
    const [h, around] = await Promise.all([
      getHousehold(meal.date, addDays(meal.date, 1)),
      getMeals(meal.date, addDays(meal.date, 1)),
    ]);
    if (meal.sourceMealId) {
      const source = await db.select().from(schema.meals).where(eq(schema.meals.id, meal.sourceMealId)).get();
      portions = source ? cookPortions(h, source, [...around, source]) : 0;
      context = `Restes du dîner de la veille${source ? ` (${formatDay(source.date)})` : ""} : rien à cuisiner.`;
    } else {
      portions = cookPortions(h, meal, around);
      const eaters = eatersOf(h, meal.date, meal.type);
      const hasLeftovers = around.some((m) => m.sourceMealId === meal.id);
      context = `${meal.type === "LUNCH" ? "Déjeuner" : "Dîner"} du ${formatDay(meal.date)} · ${eaters.map((e) => e.name).join(", ")}${
        hasLeftovers ? " + restes pour le lendemain midi" : ""
      }`;
    }
  } else {
    const h = await getHousehold();
    portions = h.members.filter((m) => m.isActive).reduce((s, m) => s + m.multiplier, 0) || 1;
    context = "Quantités pour tout le foyer";
  }

  const macros = recipeMacros(recipe);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center gap-2">
        <Link href={meal ? `/?semaine=${meal.date}` : "/recettes"} className="btn-icon" aria-label="Retour">
          <ArrowLeft size={18} />
        </Link>
        <Link href={`/recettes/${recipe.id}/modifier`} className="btn-ghost ml-auto">
          <Pencil size={16} /> Modifier
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {recipe.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={recipe.imageUrl} alt="" className="h-48 w-full rounded-2xl object-cover sm:h-40 sm:w-56" />
        )}
        <div className="flex-1 space-y-2">
          <h1 className="h1">{recipe.title}</h1>
          {recipe.description && <p className="text-muted">{recipe.description}</p>}
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="chip bg-surface-2 text-ink">
              <Clock size={12} /> Préparation {recipe.prepTime} min
              {recipe.cookTime ? ` · cuisson ${recipe.cookTime} min` : ""}
            </span>
            {recipe.isBatchable && (
              <span className="chip bg-info-soft text-info">
                <Recycle size={12} /> Se réchauffe bien
              </span>
            )}
            {tagsOf(recipe).map((t) => (
              <span key={t} className="chip bg-brand-soft text-brand">
                {t}
              </span>
            ))}
          </div>
          {recipe.sourceUrl && (
            <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-info underline">
              <ExternalLink size={14} /> Recette d&apos;origine
            </a>
          )}
        </div>
      </div>

      <RecipeDetail
        recipe={{
          id: recipe.id,
          title: recipe.title,
          isFavorite: recipe.isFavorite,
          rating: recipe.rating,
          steps: recipe.instructions.split("\n").map((s) => s.trim()).filter(Boolean),
          ingredients: recipe.ingredients.map((i) => ({
            name: i.ingredient.name,
            unit: i.ingredient.unit,
            quantity: i.quantity,
            note: i.note,
            isPantry: i.ingredient.isPantry,
          })),
        }}
        initialPortions={portions}
        context={context}
        macros={macros}
        showNutrition={settings.nutritionEnabled}
        missingNutrition={recipe.ingredients.filter((i) => i.ingredient.kcal == null).map((i) => i.ingredient.name)}
      />
    </div>
  );
}
