/** Accès aux données (lecture) côté serveur. */
import { and, asc, gte, inArray, lt, lte } from "drizzle-orm";
import { db, schema } from "@/db";
import { addDays } from "./dates";
import type { Household, IngredientLite, MealLite, PlannerSettings } from "./planner";

export type RecipeWithIngredients = typeof schema.recipes.$inferSelect & {
  ingredients: { ingredient: IngredientLite; quantity: number; note: string }[];
};

const { settings, members, presenceRules, presenceOverrides, recipes, recipeIngredients, ingredients, meals } = schema;

export async function getSettings() {
  const row = await db.select().from(settings).get();
  if (row) return row;
  await db.insert(settings).values({ id: 1 }).onConflictDoNothing();
  return (await db.select().from(settings).get())!;
}

export function plannerSettings(s: Awaited<ReturnType<typeof getSettings>>): PlannerSettings {
  return {
    weekdayMaxTime: s.weekdayMaxTime,
    weekendMaxTime: s.weekendMaxTime,
    noRepeatWeeks: s.noRepeatWeeks,
    leftoverStrategy: s.leftoverStrategy,
    nutritionEnabled: s.nutritionEnabled,
    kcalTarget: s.kcalTarget,
    extraKcal: s.extraKcal,
  };
}

export async function getMembers() {
  return db.select().from(members).orderBy(asc(members.sortOrder), asc(members.name)).all();
}

export async function getHousehold(from?: string, to?: string): Promise<Household> {
  const [m, rules, overrides] = await Promise.all([
    getMembers(),
    db.select().from(presenceRules).all(),
    from && to
      ? db
          .select()
          .from(presenceOverrides)
          .where(and(gte(presenceOverrides.date, from), lte(presenceOverrides.date, to)))
          .all()
      : db.select().from(presenceOverrides).all(),
  ]);
  return { members: m, rules, overrides };
}

export async function getIngredients() {
  return db.select().from(ingredients).orderBy(asc(ingredients.name)).all();
}

/** Recettes complètes (avec ingrédients). */
export async function getRecipes(ids?: string[]): Promise<RecipeWithIngredients[]> {
  const rs = ids
    ? ids.length
      ? await db.select().from(recipes).where(inArray(recipes.id, ids)).all()
      : []
    : await db.select().from(recipes).orderBy(asc(recipes.title)).all();
  if (!rs.length) return [];
  const [ris, ings] = await Promise.all([
    db
      .select()
      .from(recipeIngredients)
      .where(inArray(recipeIngredients.recipeId, rs.map((r) => r.id)))
      .orderBy(asc(recipeIngredients.sortOrder))
      .all(),
    getIngredients(),
  ]);
  const ingById = new Map(ings.map((i) => [i.id, i]));
  return rs.map((r) => ({
    ...r,
    ingredients: ris
      .filter((ri) => ri.recipeId === r.id && ingById.has(ri.ingredientId))
      .map((ri) => ({ ingredient: ingById.get(ri.ingredientId)!, quantity: ri.quantity, note: ri.note })),
  }));
}

export async function getRecipe(id: string): Promise<RecipeWithIngredients | undefined> {
  const [r] = await getRecipes([id]);
  return r;
}

/** Repas entre deux dates incluses. */
export async function getMeals(from: string, to: string): Promise<MealLite[]> {
  return db
    .select()
    .from(meals)
    .where(and(gte(meals.date, from), lte(meals.date, to)))
    .orderBy(asc(meals.date))
    .all();
}

/** Historique des recettes servies avant une date (pour éviter les répétitions). */
export async function getHistory(before: string, weeks: number) {
  const rows = await db
    .select({ recipeId: meals.recipeId, date: meals.date })
    .from(meals)
    .where(and(gte(meals.date, addDays(before, -weeks * 7)), lt(meals.date, before)))
    .all();
  return rows.filter((r): r is { recipeId: string; date: string } => !!r.recipeId);
}
