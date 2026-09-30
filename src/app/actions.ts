"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { checkPassword, isValidSession, SESSION_COOKIE, sessionToken } from "@/lib/auth";
import { addDays, isValidDate, today, weekDates, weekStart } from "@/lib/dates";
import {
  eatersOf,
  generatePlan,
  lunchUsesLeftover,
  pickRecipe,
  type MealType,
  type PresenceStatus,
} from "@/lib/planner";
import { getHistory, getHousehold, getIngredients, getMeals, getRecipes, getSettings, plannerSettings } from "@/lib/data";
import { fetchRecipe, matchIngredient, parseIngredientLine } from "@/lib/recipe-import";
import { CATEGORIES } from "@/db/seed-data";
import { ALLERGEN_LABELS, DIET_LABELS, guessAllergens, guessAnimal, list } from "@/lib/allergens";

const {
  settings, members, presenceRules, presenceOverrides, meals, recipes, recipeIngredients, ingredients,
  shoppingChecks, shoppingManual,
} = schema;

async function assertAuth() {
  const jar = await cookies();
  if (!isValidSession(jar.get(SESSION_COOKIE)?.value)) throw new Error("Non autorisé");
}

const STATUSES: PresenceStatus[] = ["HOME", "OFFICE", "AWAY"];
const MEAL_TYPES: MealType[] = ["LUNCH", "DINNER"];
const num = (v: FormDataEntryValue | null, def: number) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) && String(v ?? "").trim() !== "" ? n : def;
};
const optInt = (v: FormDataEntryValue | null) => {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : null;
};

/** Les repas « restes » suivent la recette de leur repas source. */
async function syncLeftovers() {
  await db.run(sql`UPDATE meals SET source_meal_id = NULL
    WHERE source_meal_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM meals s WHERE s.id = meals.source_meal_id AND s.recipe_id IS NOT NULL)`);
  await db.run(sql`UPDATE meals SET recipe_id = (SELECT s.recipe_id FROM meals s WHERE s.id = meals.source_meal_id)
    WHERE source_meal_id IS NOT NULL`);
}

function refresh() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Connexion
// ---------------------------------------------------------------------------

export async function login(_: unknown, formData: FormData) {
  if (!checkPassword(String(formData.get("password") ?? ""))) return { error: "Mot de passe incorrect" };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/",
  });
  const next = String(formData.get("next") ?? "/");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/connexion");
}

// ---------------------------------------------------------------------------
// Foyer & « Qui mange quand ? »
// ---------------------------------------------------------------------------

export type MemberInput = {
  id?: string;
  name: string;
  multiplier: number;
  isMainUser: boolean;
  isActive: boolean;
  dislikes: string;
  allergies: string;
  diet: string;
  likes: string;
  /** clé `${weekday}-${mealType}` → statut */
  presence: Record<string, PresenceStatus>;
};

export async function saveHousehold(input: MemberInput[]) {
  await assertAuth();
  const clean = input
    .filter((m) => m.name.trim())
    .map((m, i) => ({
      id: m.id || crypto.randomUUID(),
      name: m.name.trim().slice(0, 40),
      multiplier: Math.min(3, Math.max(0.1, Number(m.multiplier) || 1)),
      isMainUser: !!m.isMainUser,
      isActive: m.isActive !== false,
      dislikes: (m.dislikes ?? "").slice(0, 300),
      allergies: list(m.allergies).filter((a) => a in ALLERGEN_LABELS).join(","),
      diet: m.diet && m.diet in DIET_LABELS ? m.diet : "",
      likes: (m.likes ?? "").slice(0, 300),
      sortOrder: i,
      presence: m.presence ?? {},
    }));
  if (!clean.length) return { error: "Ajoutez au moins une personne." };
  // Un seul utilisateur principal (le premier coché)
  let mainSeen = false;
  for (const m of clean) {
    if (m.isMainUser && !mainSeen) mainSeen = true;
    else m.isMainUser = false;
  }

  const existing = await db.select({ id: members.id }).from(members).all();
  const keep = new Set(clean.map((m) => m.id));
  const removed = existing.map((e) => e.id).filter((id) => !keep.has(id));

  const ops = [];
  if (removed.length) ops.push(db.delete(members).where(inArray(members.id, removed)));
  for (const { presence, ...m } of clean) {
    ops.push(
      db.insert(members).values(m).onConflictDoUpdate({
        target: members.id,
        set: {
          name: m.name, multiplier: m.multiplier, isMainUser: m.isMainUser, isActive: m.isActive, dislikes: m.dislikes,
          allergies: m.allergies, diet: m.diet, likes: m.likes, sortOrder: m.sortOrder,
        },
      }),
    );
    ops.push(db.delete(presenceRules).where(eq(presenceRules.memberId, m.id)));
    for (let d = 1; d <= 7; d++) {
      for (const t of MEAL_TYPES) {
        let status = presence[`${d}-${t}`] ?? "HOME";
        if (!STATUSES.includes(status)) status = "HOME";
        if (t === "DINNER" && status === "OFFICE") status = "AWAY";
        if (status !== "HOME") ops.push(db.insert(presenceRules).values({ memberId: m.id, weekday: d, mealType: t, status }));
      }
    }
  }
  await db.batch(ops as never);
  refresh();
  return { ok: true };
}

export async function savePreferences(formData: FormData) {
  await assertAuth();
  const strategy = String(formData.get("leftoverStrategy") ?? "office");
  await db
    .update(settings)
    .set({
      weekdayMaxTime: Math.max(10, num(formData.get("weekdayMaxTime"), 45)),
      weekendMaxTime: Math.max(10, num(formData.get("weekendMaxTime"), 180)),
      noRepeatWeeks: Math.min(12, Math.max(0, num(formData.get("noRepeatWeeks"), 3))),
      leftoverStrategy: ["office", "always", "never"].includes(strategy) ? strategy : "office",
    })
    .where(eq(settings.id, 1));
  refresh();
}

export async function saveNutrition(formData: FormData) {
  await assertAuth();
  await db
    .update(settings)
    .set({
      nutritionEnabled: formData.get("nutritionEnabled") === "on",
      kcalTarget: optInt(formData.get("kcalTarget")),
      proteinTarget: optInt(formData.get("proteinTarget")),
      carbsTarget: optInt(formData.get("carbsTarget")),
      fatTarget: optInt(formData.get("fatTarget")),
      extraKcal: optInt(formData.get("extraKcal")) ?? 0,
    })
    .where(eq(settings.id, 1));
  refresh();
}

export async function finishOnboarding() {
  await assertAuth();
  await db.update(settings).set({ onboarded: true }).where(eq(settings.id, 1));
  await generateWeek(weekStart(today()));
  redirect("/");
}

/** Exception ponctuelle : qui mange à ce repas précis. `status = null` → retour au planning type. */
export async function setPresenceOverride(memberId: string, date: string, mealType: string, status: PresenceStatus | null) {
  await assertAuth();
  if (!isValidDate(date) || !MEAL_TYPES.includes(mealType as MealType)) return;
  await db
    .delete(presenceOverrides)
    .where(and(eq(presenceOverrides.memberId, memberId), eq(presenceOverrides.date, date), eq(presenceOverrides.mealType, mealType)));
  if (status && STATUSES.includes(status)) {
    await db.insert(presenceOverrides).values({ memberId, date, mealType, status });
  }
  refresh();
}

// ---------------------------------------------------------------------------
// Planning
// ---------------------------------------------------------------------------

export async function generateWeek(start: string) {
  await assertAuth();
  if (!isValidDate(start)) return;
  const dates = weekDates(start);
  const end = dates[6];
  const s = await getSettings();
  const [household, recipesAll, existing, history] = await Promise.all([
    getHousehold(addDays(start, -1), end),
    getRecipes(),
    getMeals(addDays(start, -1), end),
    getHistory(start, s.noRepeatWeeks),
  ]);
  const plan = generatePlan({
    dates, household, recipes: recipesAll, existing, history, settings: plannerSettings(s),
  });
  const planIds = new Set(plan.map((m) => m.id));
  const toDelete = existing.filter((m) => dates.includes(m.date) && !planIds.has(m.id)).map((m) => m.id);

  const ops = [];
  if (toDelete.length) ops.push(db.delete(meals).where(inArray(meals.id, toDelete)));
  for (const m of plan) {
    ops.push(
      db.insert(meals).values(m).onConflictDoUpdate({
        target: meals.id,
        set: { recipeId: m.recipeId, sourceMealId: m.sourceMealId, isLocked: m.isLocked, mainUserPortion: m.mainUserPortion },
      }),
    );
  }
  if (ops.length) await db.batch(ops as never);
  await syncLeftovers();
  refresh();
}

async function slotContext(date: string, type: MealType, excludeRecipe?: string | null) {
  const start = weekStart(date);
  const s = await getSettings();
  const [household, recipesAll, weekMeals, history] = await Promise.all([
    getHousehold(addDays(date, -1), addDays(date, 1)),
    getRecipes(),
    getMeals(addDays(start, -1), addDays(start, 7)),
    getHistory(start, s.noRepeatWeeks),
  ]);
  const lastUsed = new Map<string, string>();
  for (const e of history) if (!lastUsed.has(e.recipeId) || lastUsed.get(e.recipeId)! < e.date) lastUsed.set(e.recipeId, e.date);
  const used = new Set(weekMeals.filter((m) => m.recipeId && !m.sourceMealId).map((m) => m.recipeId!));
  const current = weekMeals.find((m) => m.date === date && m.type === type);
  const ps = plannerSettings(s);
  const needsLeftover =
    type === "DINNER" &&
    (weekMeals.some((m) => current && m.sourceMealId === current.id) || lunchUsesLeftover(household, addDays(date, 1), ps));
  const byId = new Map(recipesAll.map((r) => [r.id, r]));
  const prev = weekMeals.find((m) => m.date === (type === "DINNER" ? date : addDays(date, -1)) && m.type === (type === "DINNER" ? "LUNCH" : "DINNER"));
  return {
    recipesAll, household, ps, current,
    ctx: {
      date, type, eaters: eatersOf(household, date, type), needsLeftover,
      previousRecipe: prev?.recipeId ? byId.get(prev.recipeId) : undefined,
      usedThisPeriod: used, lastUsed,
      exclude: new Set(excludeRecipe ? [excludeRecipe] : []),
    },
  };
}

/** Propose une autre recette pour un créneau. */
export async function rerollMeal(date: string, type: MealType) {
  await assertAuth();
  if (!isValidDate(date) || !MEAL_TYPES.includes(type)) return;
  const current = await db.select().from(meals).where(and(eq(meals.date, date), eq(meals.type, type))).get();
  const { recipesAll, ps, ctx } = await slotContext(date, type, current?.recipeId);
  const r = pickRecipe(recipesAll, ctx, ps, Math.random);
  if (!r) return;
  if (current) {
    await db.update(meals).set({ recipeId: r.id, sourceMealId: null }).where(eq(meals.id, current.id));
  } else {
    await db.insert(meals).values({ date, type, recipeId: r.id });
  }
  await syncLeftovers();
  refresh();
}

/** Choix manuel d'une recette (le repas est alors verrouillé). `recipeId = null` → pas de repas. */
export async function setMealRecipe(date: string, type: MealType, recipeId: string | null) {
  await assertAuth();
  if (!isValidDate(date) || !MEAL_TYPES.includes(type)) return;
  const current = await db.select().from(meals).where(and(eq(meals.date, date), eq(meals.type, type))).get();
  if (!recipeId) {
    if (current) await db.delete(meals).where(eq(meals.id, current.id));
  } else if (current) {
    await db.update(meals).set({ recipeId, sourceMealId: null, isLocked: true }).where(eq(meals.id, current.id));
  } else {
    await db.insert(meals).values({ date, type, recipeId, isLocked: true });
  }
  await syncLeftovers();
  refresh();
}

export async function toggleLock(mealId: string) {
  await assertAuth();
  const m = await db.select().from(meals).where(eq(meals.id, mealId)).get();
  if (!m) return;
  await db.update(meals).set({ isLocked: !m.isLocked }).where(eq(meals.id, mealId));
  refresh();
}

/** Le déjeuner devient le reste du dîner de la veille (ou redevient un repas à part). */
export async function setLeftover(date: string, useLeftover: boolean) {
  await assertAuth();
  if (!isValidDate(date)) return;
  const lunch = await db.select().from(meals).where(and(eq(meals.date, date), eq(meals.type, "LUNCH"))).get();
  if (!useLeftover) {
    if (lunch) await db.update(meals).set({ sourceMealId: null }).where(eq(meals.id, lunch.id));
    refresh();
    return;
  }
  const dinner = await db
    .select()
    .from(meals)
    .where(and(eq(meals.date, addDays(date, -1)), eq(meals.type, "DINNER")))
    .get();
  if (!dinner?.recipeId || dinner.sourceMealId) return;
  if (lunch) {
    await db.update(meals).set({ sourceMealId: dinner.id, recipeId: dinner.recipeId }).where(eq(meals.id, lunch.id));
  } else {
    await db.insert(meals).values({ date, type: "LUNCH", recipeId: dinner.recipeId, sourceMealId: dinner.id });
  }
  refresh();
}

export async function setMainPortion(mealId: string, portion: number | null) {
  await assertAuth();
  const p = portion == null || !Number.isFinite(portion) ? null : Math.min(3, Math.max(0.1, portion));
  await db.update(meals).set({ mainUserPortion: p }).where(eq(meals.id, mealId));
  refresh();
}

// ---------------------------------------------------------------------------
// Recettes
// ---------------------------------------------------------------------------

export type RecipeInput = {
  id?: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  tags: string;
  seasons: string;
  isBatchable: boolean;
  isFavorite: boolean;
  isExcluded: boolean;
  rating: number | null;
  instructions: string;
  sourceUrl?: string | null;
  imageUrl?: string | null;
  /** Les quantités saisies correspondent à ce nombre de portions adultes */
  servings: number;
  ingredients: { name: string; quantity: number; note: string }[];
};

async function ensureIngredient(name: string, unitHint: "g" | "ml" | "piece" | null) {
  const clean = name.trim().toLowerCase().slice(0, 80);
  const found = await db.select().from(ingredients).where(eq(ingredients.name, clean)).get();
  if (found) return found;
  const [created] = await db
    .insert(ingredients)
    .values({ name: clean, unit: unitHint ?? "g", category: "Divers", allergens: guessAllergens(clean), animal: guessAnimal(clean) })
    .returning();
  return created;
}

export async function saveRecipe(input: RecipeInput) {
  await assertAuth();
  if (!input.title.trim()) return { error: "Le titre est obligatoire." };
  const servings = Math.max(1, Number(input.servings) || 1);
  const values = {
    title: input.title.trim().slice(0, 150),
    description: (input.description ?? "").slice(0, 500),
    prepTime: Math.max(0, Math.round(Number(input.prepTime) || 0)),
    cookTime: Math.max(0, Math.round(Number(input.cookTime) || 0)),
    tags: input.tags ?? "",
    seasons: input.seasons ?? "",
    isBatchable: !!input.isBatchable,
    isFavorite: !!input.isFavorite,
    isExcluded: !!input.isExcluded,
    rating: input.rating ? Math.min(5, Math.max(1, Math.round(input.rating))) : null,
    instructions: input.instructions ?? "",
    sourceUrl: input.sourceUrl ?? null,
    imageUrl: input.imageUrl && /^(https?:\/\/|\/photos\/)/.test(input.imageUrl) ? input.imageUrl.slice(0, 500) : null,
  };
  let id = input.id;
  if (id) {
    const before = await db.select({ imageUrl: recipes.imageUrl }).from(recipes).where(eq(recipes.id, id)).get();
    // Nouvelle photo : l'ancien crédit ne s'applique plus
    const credit = before?.imageUrl === values.imageUrl ? {} : { imageCredit: null };
    await db.update(recipes).set({ ...values, ...credit }).where(eq(recipes.id, id));
  } else {
    const [r] = await db.insert(recipes).values(values).returning({ id: recipes.id });
    id = r.id;
  }
  const lines = [];
  for (const [i, line] of input.ingredients.entries()) {
    if (!line.name.trim()) continue;
    const ing = await ensureIngredient(line.name, null);
    lines.push({
      recipeId: id, ingredientId: ing.id, quantity: Math.max(0, Number(line.quantity) || 0) / servings,
      note: (line.note ?? "").slice(0, 100), sortOrder: i,
    });
  }
  await db.batch([
    db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id)),
    ...lines.map((l) => db.insert(recipeIngredients).values(l)),
  ] as never);
  refresh();
  return { id };
}

export async function deleteRecipe(id: string) {
  await assertAuth();
  await db.delete(recipes).where(eq(recipes.id, id));
  await syncLeftovers();
  refresh();
  redirect("/recettes");
}

export async function toggleFavorite(id: string) {
  await assertAuth();
  await db.run(sql`UPDATE recipes SET is_favorite = NOT is_favorite WHERE id = ${id}`);
  refresh();
}

export async function setRating(id: string, rating: number | null) {
  await assertAuth();
  const r = rating ? Math.min(5, Math.max(1, Math.round(rating))) : null;
  await db.update(recipes).set({ rating: r }).where(eq(recipes.id, id));
  refresh();
}

export async function importRecipe(_: unknown, formData: FormData) {
  await assertAuth();
  const url = String(formData.get("url") ?? "").trim();
  let parsed;
  try {
    parsed = await fetchRecipe(url);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Import impossible" };
  }
  const known = await getIngredients();
  const unmatched: string[] = [];
  const lines = [];
  for (const raw of parsed.ingredientLines) {
    const p = parseIngredientLine(raw);
    if (!p.name) continue;
    let ing = matchIngredient(p.name, known);
    if (!ing) {
      ing = await ensureIngredient(p.name, p.unit);
      known.push(ing);
      unmatched.push(ing.name);
    }
    // Conversion vers l'unité de l'ingrédient
    let qty = p.quantity || (ing.unit === "piece" ? 1 : 0);
    if (p.unit === "piece" && ing.unit !== "piece" && ing.gramsPerPiece) qty *= ing.gramsPerPiece;
    else if (p.unit && p.unit !== "piece" && ing.unit === "piece" && ing.gramsPerPiece) qty /= ing.gramsPerPiece;
    lines.push({ name: ing.name, quantity: qty, note: p.unit && p.unit !== ing.unit ? p.raw.slice(0, 100) : "" });
  }
  const res = await saveRecipe({
    title: parsed.title,
    description: parsed.description,
    prepTime: parsed.prepTime || 20,
    cookTime: parsed.cookTime,
    tags: "",
    seasons: "",
    isBatchable: true,
    isFavorite: false,
    isExcluded: false,
    rating: null,
    instructions: parsed.steps.join("\n"),
    sourceUrl: parsed.sourceUrl,
    imageUrl: parsed.imageUrl,
    servings: parsed.servings,
    ingredients: lines,
  });
  if ("error" in res) return { error: res.error };
  redirect(`/recettes/${res.id}/modifier?importe=1${unmatched.length ? `&nouveaux=${encodeURIComponent(unmatched.join(","))}` : ""}`);
}

// ---------------------------------------------------------------------------
// Ingrédients
// ---------------------------------------------------------------------------

export async function saveIngredient(formData: FormData) {
  await assertAuth();
  const id = String(formData.get("id") ?? "");
  const unit = String(formData.get("unit") ?? "g");
  const category = String(formData.get("category") ?? "Divers");
  const f = (k: string) => {
    const v = String(formData.get(k) ?? "").replace(",", ".").trim();
    return v === "" ? null : Number(v);
  };
  await db
    .update(ingredients)
    .set({
      name: String(formData.get("name") ?? "").trim().toLowerCase() || undefined,
      category: (CATEGORIES as readonly string[]).includes(category) ? category : "Divers",
      unit: ["g", "ml", "piece"].includes(unit) ? unit : "g",
      gramsPerPiece: f("gramsPerPiece"),
      kcal: f("kcal"),
      protein: f("protein"),
      carbs: f("carbs"),
      fat: f("fat"),
      isPantry: formData.get("isPantry") === "on",
      allergens: formData.getAll("allergens").map(String).filter((a) => a in ALLERGEN_LABELS).join(","),
      animal: ["volaille", "boeuf", "porc", "viande", "poisson", "crustace", "mollusque", "animal"].includes(String(formData.get("animal")))
        ? String(formData.get("animal"))
        : "",
    })
    .where(eq(ingredients.id, id));
  refresh();
}

// ---------------------------------------------------------------------------
// Liste de courses
// ---------------------------------------------------------------------------

export async function toggleShoppingCheck(week: string, key: string, checked: boolean) {
  await assertAuth();
  if (checked) await db.insert(shoppingChecks).values({ weekStart: week, key }).onConflictDoNothing();
  else await db.delete(shoppingChecks).where(and(eq(shoppingChecks.weekStart, week), eq(shoppingChecks.key, key)));
  refresh();
}

export async function addManualItem(week: string, formData: FormData) {
  await assertAuth();
  const label = String(formData.get("label") ?? "").trim().slice(0, 100);
  const category = String(formData.get("category") ?? "Divers");
  if (!label || !isValidDate(week)) return;
  await db.insert(shoppingManual).values({ weekStart: week, label, category });
  refresh();
}

export async function toggleManualItem(id: string, checked: boolean) {
  await assertAuth();
  await db.update(shoppingManual).set({ checked }).where(eq(shoppingManual.id, id));
  refresh();
}

export async function deleteManualItem(id: string) {
  await assertAuth();
  await db.delete(shoppingManual).where(eq(shoppingManual.id, id));
  refresh();
}

export async function resetShopping(week: string) {
  await assertAuth();
  await db.batch([
    db.delete(shoppingChecks).where(eq(shoppingChecks.weekStart, week)),
    db.update(shoppingManual).set({ checked: false }).where(eq(shoppingManual.weekStart, week)),
  ] as never);
  refresh();
}

/** Glisser-déposer : échange les recettes de deux créneaux (qui deviennent verrouillés). */
export async function swapMeals(a: { date: string; type: MealType }, b: { date: string; type: MealType }) {
  await assertAuth();
  if (![a, b].every((x) => isValidDate(x.date) && MEAL_TYPES.includes(x.type))) return;
  const find = (x: typeof a) => db.select().from(meals).where(and(eq(meals.date, x.date), eq(meals.type, x.type))).get();
  const [ma, mb] = await Promise.all([find(a), find(b)]);
  const ra = ma?.recipeId ?? null;
  const rb = mb?.recipeId ?? null;
  const put = async (slot: typeof a, current: typeof ma, recipeId: string | null) => {
    if (current && recipeId) await db.update(meals).set({ recipeId, sourceMealId: null, isLocked: true }).where(eq(meals.id, current.id));
    else if (current) await db.delete(meals).where(eq(meals.id, current.id));
    else if (recipeId) await db.insert(meals).values({ ...slot, recipeId, isLocked: true });
  };
  await put(a, ma, rb);
  await put(b, mb, ra);
  await syncLeftovers();
  refresh();
}
