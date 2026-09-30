import { redirect } from "next/navigation";
import { addDays, formatDay, isValidDate, today, weekDates, weekStart } from "@/lib/dates";
import { getHousehold, getMeals, getRecipes, getSettings } from "@/lib/data";
import { conflictsFor } from "@/lib/allergens";
import {
  cookPortions,
  eatenPortions,
  eatersOf,
  mainUserDay,
  presenceOf,
  recipeMacros,
  totalTime,
  type MealType,
} from "@/lib/planner";
import { WeekView, type DayView } from "@/components/week-view";

export const dynamic = "force-dynamic";

export default async function Planning({ searchParams }: PageProps<"/">) {
  const settings = await getSettings();
  if (!settings.onboarded) redirect("/bienvenue");

  const sp = await searchParams;
  const requested = typeof sp.semaine === "string" && isValidDate(sp.semaine) ? sp.semaine : today();
  const start = weekStart(requested);
  const dates = weekDates(start);
  const [household, allMeals, recipes] = await Promise.all([
    getHousehold(addDays(start, -1), addDays(start, 7)),
    getMeals(addDays(start, -1), addDays(start, 7)),
    getRecipes(),
  ]);
  const byId = new Map(recipes.map((r) => [r.id, r]));
  const main = household.members.find((m) => m.isMainUser);
  const active = household.members.filter((m) => m.isActive);
  const colorIndex = new Map(household.members.map((m, i) => [m.id, i]));

  const days: DayView[] = dates.map((date) => {
    const slots = (["LUNCH", "DINNER"] as MealType[]).map((type) => {
      const meal = allMeals.find((m) => m.date === date && m.type === type);
      const recipe = meal?.recipeId ? byId.get(meal.recipeId) : undefined;
      const prevDinner = allMeals.find((m) => m.date === addDays(date, -1) && m.type === "DINNER");
      const hasLeftovers = !!meal && allMeals.some((m) => m.sourceMealId === meal.id);
      const eaters = eatersOf(household, date, type);
      return {
        type,
        mealId: meal?.id ?? null,
        isLocked: meal?.isLocked ?? false,
        isLeftover: !!meal?.sourceMealId,
        canUseLeftover: type === "LUNCH" && !!prevDinner?.recipeId && !prevDinner.sourceMealId,
        hasLeftovers,
        recipe: recipe
          ? {
              id: recipe.id,
              title: recipe.title,
              imageUrl: recipe.imageUrl,
              time: totalTime(recipe),
              kcal: Math.round(recipeMacros(recipe).kcal),
            }
          : null,
        conflicts: recipe ? conflictsFor(recipe, eaters) : [],
        members: active.map((m) => ({
          id: m.id,
          name: m.name,
          color: colorIndex.get(m.id) ?? 0,
          status: presenceOf(household, m.id, date, type),
          overridden: household.overrides.some((o) => o.memberId === m.id && o.date === date && o.mealType === type),
        })),
        portions: meal ? eatenPortions(household, meal) : 0,
        cookPortions: meal && !meal.sourceMealId ? cookPortions(household, meal, allMeals) : 0,
        mainPortion: meal?.mainUserPortion ?? null,
      };
    });
    const nutrition =
      settings.nutritionEnabled && main
        ? { ...mainUserDay(household, date, allMeals, byId, settings.extraKcal), target: settings.kcalTarget }
        : null;
    return { date, label: formatDay(date), isToday: date === today(), slots, nutrition };
  });

  return (
    <WeekView
      start={start}
      prev={addDays(start, -7)}
      next={addDays(start, 7)}
      days={days}
      mainUser={main ? { id: main.id, name: main.name, multiplier: main.multiplier } : null}
      recipes={recipes
        .filter((r) => !r.isExcluded)
        .map((r) => ({
          id: r.id,
          title: r.title,
          imageUrl: r.imageUrl,
          time: totalTime(r),
          tags: r.tags,
          isFavorite: r.isFavorite,
          blockedFor: [...new Set(conflictsFor(r, active).filter((c) => c.kind !== "gout").map((c) => c.member))],
        }))}
    />
  );
}
