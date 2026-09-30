import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ExternalLink, Pencil, Recycle } from "lucide-react";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { addDays, formatDay } from "@/lib/dates";
import { getHousehold, getMeals, getRecipe, getSettings } from "@/lib/data";
import { cookPortions, eatersOf, recipeMacros, tagsOf } from "@/lib/planner";
import { ALLERGEN_LABELS, conflictsFor, recipeAllergens } from "@/lib/allergens";
import { Avatar } from "@/components/avatar";
import { RecipeImage } from "@/components/recipe-image";
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
  const household = await getHousehold();
  const active = household.members.filter((m) => m.isActive);
  const colorIndex = new Map(household.members.map((m, i) => [m.id, i]));
  const allergens = [...recipeAllergens(recipe)];
  const back = meal ? `/?semaine=${meal.date}` : "/recettes";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-3xl">
        <RecipeImage src={recipe.imageUrl} title={recipe.title} rounded="" className="aspect-[16/10] w-full sm:aspect-[21/9]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-5 pt-16 text-white">
          <h1 className="text-2xl font-extrabold leading-tight drop-shadow sm:text-4xl">{recipe.title}</h1>
          {recipe.description && <p className="mt-1 max-w-2xl text-sm text-white/90 sm:text-base">{recipe.description}</p>}
        </div>
        <Link href={back} className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink shadow" aria-label="Retour">
          <ArrowLeft size={18} />
        </Link>
        <Link href={`/recettes/${recipe.id}/modifier`} className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-2 text-sm font-bold text-ink shadow">
          <Pencil size={14} /> Modifier
        </Link>
      </div>
      {recipe.imageCredit && <PhotoCredit credit={recipe.imageCredit} />}

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="chip bg-surface-2 px-3 py-1 text-ink">
          <Clock size={13} /> Préparation {recipe.prepTime} min{recipe.cookTime ? ` · cuisson ${recipe.cookTime} min` : ""}
        </span>
        {recipe.isBatchable && (
          <span className="chip bg-info-soft px-3 py-1 text-info">
            <Recycle size={13} /> Se réchauffe bien
          </span>
        )}
        {tagsOf(recipe).map((t) => (
          <span key={t} className="chip bg-brand-soft px-3 py-1 text-brand">
            {t}
          </span>
        ))}
        {recipe.sourceUrl && (
          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="chip bg-surface-2 px-3 py-1 text-info underline">
            <ExternalLink size={13} /> Recette d&apos;origine
          </a>
        )}
      </div>

      <section className="card space-y-3 p-4">
        <h2 className="h2">Qui peut en manger ?</h2>
        <ul className="flex flex-wrap gap-2">
          {active.map((m) => {
            const c = conflictsFor(recipe, [m]);
            return (
              <li
                key={m.id}
                className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-semibold ${c.length ? "bg-bad-soft text-bad" : "bg-ok-soft text-ok"}`}
              >
                <Avatar name={m.name} index={colorIndex.get(m.id) ?? 0} size={26} />
                {m.name}
                {c.length ? <span className="font-normal">· {c.map((x) => (x.kind === "allergie" ? `allergie ${x.label}` : x.label)).join(", ")}</span> : " ✓"}
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted">
          Allergènes : {allergens.length ? allergens.map((a) => ALLERGEN_LABELS[a] ?? a).join(", ") : "aucun allergène majeur repéré"}.
          Indicatif : vérifiez toujours les étiquettes des produits.
        </p>
      </section>

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

/** « Auteur · Licence · Source · https://… » → texte avec lien vers la page d'origine. */
function PhotoCredit({ credit }: { credit: string }) {
  const parts = credit.split(" · ");
  const url = parts.at(-1)?.startsWith("http") ? parts.pop() : undefined;
  return (
    <p className="-mt-4 text-right text-[11px] text-muted">
      Photo :{" "}
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="underline">
          {parts.join(" · ")}
        </a>
      ) : (
        parts.join(" · ")
      )}
    </p>
  );
}
