/**
 * Logique métier pure (sans base de données) : présence, portions, restes,
 * nutrition, liste de courses et moteur de proposition. Testée dans planner.test.ts.
 */
import { conflictsFor, likesScore } from "./allergens";
import { addDays, isWeekend, seasonOf, weekday } from "./dates";

export type MealType = "LUNCH" | "DINNER";
export type PresenceStatus = "HOME" | "OFFICE" | "AWAY";
export const MEAL_TYPES: MealType[] = ["LUNCH", "DINNER"];

export type MemberLite = {
  id: string;
  name: string;
  multiplier: number;
  isMainUser: boolean;
  isActive: boolean;
  dislikes: string;
  /** Codes allergènes séparés par des virgules (optionnel pour la compatibilité) */
  allergies?: string;
  diet?: string;
  likes?: string;
};

export type Rule = { memberId: string; weekday: number; mealType: string; status: string };
export type Override = { memberId: string; date: string; mealType: string; status: string };

export type IngredientLite = {
  id: string;
  name: string;
  category: string;
  unit: string;
  gramsPerPiece: number | null;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  isPantry: boolean;
  allergens?: string;
  animal?: string;
};

export type RecipeFull = {
  id: string;
  title: string;
  prepTime: number;
  cookTime: number;
  tags: string;
  seasons: string;
  isBatchable: boolean;
  isFavorite: boolean;
  isExcluded: boolean;
  rating: number | null;
  ingredients: { ingredient: IngredientLite; quantity: number; note: string }[];
};

export type MealLite = {
  id: string;
  date: string;
  type: string;
  recipeId: string | null;
  sourceMealId: string | null;
  isLocked: boolean;
  mainUserPortion: number | null;
};

export type Household = { members: MemberLite[]; rules: Rule[]; overrides: Override[] };

// ---------------------------------------------------------------------------
// Présence : « Qui mange quand ? »
// ---------------------------------------------------------------------------

export function presenceOf(h: Household, memberId: string, date: string, mealType: string): PresenceStatus {
  const m = h.members.find((x) => x.id === memberId);
  if (!m || !m.isActive) return "AWAY";
  const o = h.overrides.find((x) => x.memberId === memberId && x.date === date && x.mealType === mealType);
  if (o) return o.status as PresenceStatus;
  const r = h.rules.find((x) => x.memberId === memberId && x.weekday === weekday(date) && x.mealType === mealType);
  return (r?.status as PresenceStatus) ?? "HOME";
}

/** Membres qui mangent ce repas. Le midi, ceux « au bureau » emportent leur gamelle. */
export function eatersOf(h: Household, date: string, mealType: string): MemberLite[] {
  return h.members.filter((m) => {
    const s = presenceOf(h, m.id, date, mealType);
    return s === "HOME" || (mealType === "LUNCH" && s === "OFFICE");
  });
}

export function officeEatersOf(h: Household, date: string): MemberLite[] {
  return h.members.filter((m) => presenceOf(h, m.id, date, "LUNCH") === "OFFICE");
}

// ---------------------------------------------------------------------------
// Portions
// ---------------------------------------------------------------------------

function portionOf(member: MemberLite, meal: MealLite) {
  if (member.isMainUser && meal.mainUserPortion != null) return meal.mainUserPortion;
  return member.multiplier;
}

/** Nombre de portions consommées à ce repas (somme des coefficients des convives). */
export function eatenPortions(h: Household, meal: MealLite): number {
  return eatersOf(h, meal.date, meal.type).reduce((s, m) => s + portionOf(m, meal), 0);
}

/**
 * Portions à cuisiner : celles du repas + celles de tous les repas « restes » qui en dépendent
 * (Cook once, eat twice). Un repas « reste » ne se cuisine pas : 0.
 */
export function cookPortions(h: Household, meal: MealLite, allMeals: MealLite[]): number {
  if (meal.sourceMealId) return 0;
  const leftovers = allMeals.filter((m) => m.sourceMealId === meal.id);
  return eatenPortions(h, meal) + leftovers.reduce((s, l) => s + eatenPortions(h, l), 0);
}

/**
 * Arrondi « de cuisine » : grammes/ml à 5 ou 10 près ; pièces au quart en cuisine,
 * à l'unité supérieure pour les courses (on n'achète pas ½ avocat).
 */
export function roundQuantity(qty: number, unit: string, forShopping = false): number {
  if (qty <= 0) return 0;
  const eps = 1e-6; // évite qu'un 2,0000001 devienne 3
  if (unit === "piece") {
    if (forShopping || qty >= 1.5) return Math.ceil(qty - eps);
    return Math.ceil(qty * 4 - eps) / 4;
  }
  if (qty < 20) return Math.ceil(qty - eps);
  if (qty < 200) return Math.ceil(qty / 5 - eps) * 5;
  return Math.ceil(qty / 10 - eps) * 10;
}

export function formatQuantity(qty: number, unit: string, forShopping = false): string {
  const q = roundQuantity(qty, unit, forShopping);
  const fr = (n: number, d = 2) => n.toLocaleString("fr-FR", { maximumFractionDigits: d });
  if (unit === "piece") {
    const whole = Math.floor(q);
    const frac = { 0.25: "¼", 0.5: "½", 0.75: "¾" }[q - whole] ?? "";
    return whole ? `${whole}${frac ? ` ${frac}` : ""}` : frac || "0";
  }
  if (unit === "g") return q >= 1000 ? `${fr(q / 1000)} kg` : `${fr(q)} g`;
  if (unit === "ml") return q >= 1000 ? `${fr(q / 1000)} L` : q >= 100 ? `${fr(q / 10)} cl` : `${fr(q)} ml`;
  return `${fr(q)} ${unit}`;
}

/** Quantités d'une recette pour N portions. */
export function scaleRecipe(recipe: RecipeFull, portions: number) {
  return recipe.ingredients.map((ri) => ({
    ...ri,
    total: ri.quantity * portions,
    label: formatQuantity(ri.quantity * portions, ri.ingredient.unit),
  }));
}

// ---------------------------------------------------------------------------
// Nutrition
// ---------------------------------------------------------------------------

export type Macros = { kcal: number; protein: number; carbs: number; fat: number };
export const ZERO_MACROS: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

export function gramsOf(ing: IngredientLite, qty: number): number {
  if (ing.unit === "piece") return qty * (ing.gramsPerPiece ?? 0);
  return qty; // g, ou ml (densité ≈ 1)
}

/** Macros d'une portion standard (coefficient 1.0), calculées depuis les ingrédients. */
export function recipeMacros(recipe: RecipeFull): Macros {
  const out = { ...ZERO_MACROS };
  for (const { ingredient: i, quantity } of recipe.ingredients) {
    const f = gramsOf(i, quantity) / 100;
    out.kcal += (i.kcal ?? 0) * f;
    out.protein += (i.protein ?? 0) * f;
    out.carbs += (i.carbs ?? 0) * f;
    out.fat += (i.fat ?? 0) * f;
  }
  return out;
}

export function addMacros(a: Macros, b: Macros, factor = 1): Macros {
  return {
    kcal: a.kcal + b.kcal * factor,
    protein: a.protein + b.protein * factor,
    carbs: a.carbs + b.carbs * factor,
    fat: a.fat + b.fat * factor,
  };
}

/**
 * Apports de l'utilisateur principal pour une journée : uniquement les repas qu'il mange,
 * × sa portion (son coefficient ou la portion ajustée du repas). Le mode famille n'influence pas ce calcul.
 */
export function mainUserDay(
  h: Household,
  date: string,
  meals: MealLite[],
  recipes: Map<string, RecipeFull>,
  extraKcal = 0,
): Macros {
  const main = h.members.find((m) => m.isMainUser);
  let total: Macros = { ...ZERO_MACROS, kcal: extraKcal };
  if (!main) return total;
  for (const meal of meals.filter((m) => m.date === date)) {
    const recipe = meal.recipeId ? recipes.get(meal.recipeId) : undefined;
    if (!recipe) continue;
    if (!eatersOf(h, date, meal.type).some((m) => m.id === main.id)) continue;
    total = addMacros(total, recipeMacros(recipe), portionOf(main, meal));
  }
  return total;
}

// ---------------------------------------------------------------------------
// Liste de courses
// ---------------------------------------------------------------------------

export type ShoppingLine = {
  ingredient: IngredientLite;
  quantity: number;
  label: string;
  recipes: string[];
};

/** Agrège les ingrédients des repas cuisinés sur la période, groupés par rayon. */
export function buildShoppingList(
  h: Household,
  mealsInRange: MealLite[],
  allMeals: MealLite[],
  recipes: Map<string, RecipeFull>,
) {
  const lines = new Map<string, ShoppingLine>();
  for (const meal of mealsInRange) {
    if (meal.sourceMealId || !meal.recipeId) continue;
    const recipe = recipes.get(meal.recipeId);
    if (!recipe) continue;
    const portions = cookPortions(h, meal, allMeals);
    if (portions <= 0) continue;
    for (const ri of recipe.ingredients) {
      const line = lines.get(ri.ingredient.id) ?? { ingredient: ri.ingredient, quantity: 0, label: "", recipes: [] };
      line.quantity += ri.quantity * portions;
      if (!line.recipes.includes(recipe.title)) line.recipes.push(recipe.title);
      lines.set(ri.ingredient.id, line);
    }
  }
  const all = [...lines.values()].map((l) => ({ ...l, label: formatQuantity(l.quantity, l.ingredient.unit, true) }));
  all.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name, "fr"));
  const toBuy = all.filter((l) => !l.ingredient.isPantry);
  const pantry = all.filter((l) => l.ingredient.isPantry);
  const byCategory = new Map<string, ShoppingLine[]>();
  for (const l of toBuy) {
    const list = byCategory.get(l.ingredient.category) ?? [];
    list.push(l);
    byCategory.set(l.ingredient.category, list);
  }
  return { byCategory, pantry, count: toBuy.length };
}

// ---------------------------------------------------------------------------
// Moteur de proposition
// ---------------------------------------------------------------------------

export type PlannerSettings = {
  weekdayMaxTime: number;
  weekendMaxTime: number;
  noRepeatWeeks: number;
  leftoverStrategy: string; // office | always | never
  nutritionEnabled: boolean;
  kcalTarget: number | null;
  extraKcal: number;
};

export type PlannerInput = {
  dates: string[];
  household: Household;
  recipes: RecipeFull[];
  /** Repas existants (la période + la veille, pour les restes du lundi midi) */
  existing: MealLite[];
  /** Historique des recettes servies avant la période : date par recette */
  history: { recipeId: string; date: string }[];
  settings: PlannerSettings;
  random?: () => number;
};

const PROTEIN_TAGS = ["poulet", "volaille", "boeuf", "porc", "poisson", "oeuf", "vege"];

export function tagsOf(r: { tags: string }) {
  return r.tags.split(",").map((t) => t.trim()).filter(Boolean);
}

function mainProtein(r: RecipeFull) {
  const tags = tagsOf(r);
  return PROTEIN_TAGS.find((t) => tags.includes(t)) ?? "autre";
}

export function totalTime(r: { prepTime: number; cookTime: number }) {
  return r.prepTime + r.cookTime;
}

export type SlotContext = {
  date: string;
  type: MealType;
  eaters: MemberLite[];
  /** Convives supplémentaires à protéger (ceux qui mangeront les restes le lendemain) */
  alsoFor?: MemberLite[];
  needsLeftover: boolean;
  previousRecipe?: RecipeFull;
  usedThisPeriod: Set<string>;
  lastUsed: Map<string, string>;
  exclude?: Set<string>;
};

/** Note une recette pour un créneau (plus c'est haut, mieux c'est). -Infinity = interdit. */
export function scoreRecipe(recipe: RecipeFull, ctx: SlotContext, s: PlannerSettings, rnd: () => number) {
  if (recipe.isExcluded || ctx.exclude?.has(recipe.id)) return -Infinity;
  if (!recipe.ingredients.length) return -Infinity;
  const maxTime = isWeekend(ctx.date) ? s.weekendMaxTime : s.weekdayMaxTime;
  const lunchMax = Math.min(maxTime, 35);
  if (totalTime(recipe) > (ctx.type === "LUNCH" ? lunchMax : maxTime)) return -Infinity;
  // Allergies, régimes et aliments refusés : exclusion stricte (convives du repas et des restes)
  if (conflictsFor(recipe, [...ctx.eaters, ...(ctx.alsoFor ?? [])]).length) return -Infinity;

  let score = rnd() * 3;
  if (recipe.isFavorite) score += 2.5;
  score += Math.min(3, likesScore(recipe, ctx.eaters) * 1.5);
  if (recipe.rating) score += (recipe.rating - 3) * 1.2;

  const seasons = recipe.seasons.split(",").map((x) => x.trim()).filter(Boolean);
  if (seasons.length) score += seasons.includes(seasonOf(ctx.date)) ? 1.5 : -5;

  if (ctx.usedThisPeriod.has(recipe.id)) score -= 12;
  const last = ctx.lastUsed.get(recipe.id);
  if (last) {
    const days = (Date.parse(ctx.date) - Date.parse(last)) / 86_400_000;
    const window = s.noRepeatWeeks * 7;
    if (days < window) score -= 8 * (1 - days / window) + 2;
  }

  if (ctx.needsLeftover && !recipe.isBatchable) score -= 20;
  if (ctx.previousRecipe && mainProtein(ctx.previousRecipe) === mainProtein(recipe)) score -= 2.5;
  if (ctx.type === "LUNCH" && tagsOf(recipe).includes("rapide")) score += 1;

  const main = ctx.eaters.find((m) => m.isMainUser);
  if (s.nutritionEnabled && s.kcalTarget && main) {
    const target = (s.kcalTarget - s.extraKcal) * (ctx.type === "DINNER" ? 0.45 : 0.4);
    const kcal = recipeMacros(recipe).kcal * main.multiplier;
    score -= Math.abs(kcal - target) / 150;
  }
  return score;
}

export function pickRecipe(recipes: RecipeFull[], ctx: SlotContext, s: PlannerSettings, rnd: () => number) {
  let best: RecipeFull | undefined;
  let bestScore = -Infinity;
  for (const r of recipes) {
    const sc = scoreRecipe(r, ctx, s, rnd);
    if (sc > bestScore) {
      bestScore = sc;
      best = r;
    }
  }
  return best;
}

/** Le déjeuner de `date` doit-il être le reste du dîner de la veille ? */
export function lunchUsesLeftover(h: Household, date: string, s: PlannerSettings) {
  if (s.leftoverStrategy === "never") return false;
  const eaters = eatersOf(h, date, "LUNCH");
  if (!eaters.length) return false;
  if (s.leftoverStrategy === "always") return true;
  return officeEatersOf(h, date).length > 0;
}

/**
 * Propose les repas de la période. Les repas verrouillés sont conservés.
 * Retourne l'état complet des repas de la période (ids existants réutilisés).
 */
export function generatePlan(input: PlannerInput): MealLite[] {
  const { dates, household: h, recipes, settings: s } = input;
  const rnd = input.random ?? Math.random;
  const byId = new Map(recipes.map((r) => [r.id, r]));
  const key = (d: string, t: string) => `${d}|${t}`;
  const existing = new Map(input.existing.map((m) => [key(m.date, m.type), m]));

  const lastUsed = new Map<string, string>();
  for (const e of input.history) {
    const prev = lastUsed.get(e.recipeId);
    if (!prev || prev < e.date) lastUsed.set(e.recipeId, e.date);
  }
  const used = new Set<string>();
  for (const m of input.existing) if (m.isLocked && m.recipeId && dates.includes(m.date)) used.add(m.recipeId);

  const result = new Map<string, MealLite>();
  const dayBefore = addDays(dates[0], -1);
  const prevDinner = existing.get(key(dayBefore, "DINNER"));
  let previousDinner: MealLite | undefined = prevDinner?.recipeId ? prevDinner : undefined;

  for (const date of dates) {
    // --- Déjeuner (dépend du dîner de la veille)
    const lunchKey = key(date, "LUNCH");
    const lunchExisting = existing.get(lunchKey);
    const lunchEaters = eatersOf(h, date, "LUNCH");
    let lunch: MealLite | undefined;
    if (lunchExisting?.isLocked) {
      lunch = lunchExisting;
    } else if (lunchEaters.length) {
      const base: MealLite = {
        id: lunchExisting?.id ?? crypto.randomUUID(),
        date,
        type: "LUNCH",
        recipeId: null,
        sourceMealId: null,
        isLocked: false,
        mainUserPortion: lunchExisting?.mainUserPortion ?? null,
      };
      const prevRecipe = previousDinner?.recipeId ? byId.get(previousDinner.recipeId) : undefined;
      if (
        previousDinner && prevRecipe?.isBatchable && lunchUsesLeftover(h, date, s) && !previousDinner.sourceMealId &&
        !conflictsFor(prevRecipe, lunchEaters).length
      ) {
        lunch = { ...base, recipeId: previousDinner.recipeId, sourceMealId: previousDinner.id };
      } else {
        const r = pickRecipe(
          recipes,
          { date, type: "LUNCH", eaters: lunchEaters, needsLeftover: false, previousRecipe: prevRecipe, usedThisPeriod: used, lastUsed },
          s, rnd,
        );
        if (r) {
          used.add(r.id);
          lunch = { ...base, recipeId: r.id };
        }
      }
    }
    if (lunch) result.set(lunchKey, lunch);

    // --- Dîner
    const dinnerKey = key(date, "DINNER");
    const dinnerExisting = existing.get(dinnerKey);
    const dinnerEaters = eatersOf(h, date, "DINNER");
    let dinner: MealLite | undefined;
    if (dinnerExisting?.isLocked) {
      dinner = dinnerExisting;
    } else if (dinnerEaters.length) {
      const next = addDays(date, 1);
      const nextLunch = existing.get(key(next, "LUNCH"));
      const needsLeftover = lunchUsesLeftover(h, next, s) && !(nextLunch?.isLocked && !nextLunch.sourceMealId);
      const lunchRecipe = lunch?.recipeId ? byId.get(lunch.recipeId) : undefined;
      const r = pickRecipe(
        recipes,
        {
          date, type: "DINNER", eaters: dinnerEaters, needsLeftover, previousRecipe: lunchRecipe, usedThisPeriod: used, lastUsed,
          alsoFor: needsLeftover ? eatersOf(h, next, "LUNCH") : [],
        },
        s, rnd,
      );
      if (r) {
        used.add(r.id);
        dinner = {
          id: dinnerExisting?.id ?? crypto.randomUUID(),
          date,
          type: "DINNER",
          recipeId: r.id,
          sourceMealId: null,
          isLocked: false,
          mainUserPortion: dinnerExisting?.mainUserPortion ?? null,
        };
      }
    }
    if (dinner) result.set(dinnerKey, dinner);
    previousDinner = dinner?.recipeId ? dinner : undefined;
  }

  // Un reste verrouillé dont la source a disparu devient un repas normal
  const ids = new Set([...result.values()].map((m) => m.id));
  if (prevDinner) ids.add(prevDinner.id);
  for (const m of result.values()) if (m.sourceMealId && !ids.has(m.sourceMealId)) m.sourceMealId = null;

  return [...result.values()];
}

/** Liste des dépendances : si le dîner change de recette, ses restes suivent. */
export function dependentsOf(mealId: string, meals: MealLite[]) {
  return meals.filter((m) => m.sourceMealId === mealId);
}
