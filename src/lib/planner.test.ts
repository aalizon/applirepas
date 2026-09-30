import { describe, expect, it } from "vitest";
import { weekDates, weekday, weekStart } from "./dates";
import {
  buildShoppingList,
  cookPortions,
  eatersOf,
  formatQuantity,
  generatePlan,
  mainUserDay,
  recipeMacros,
  type Household,
  type IngredientLite,
  type MealLite,
  type PlannerSettings,
  type RecipeFull,
} from "./planner";

const ing = (id: string, over: Partial<IngredientLite> = {}): IngredientLite => ({
  id, name: id, category: "Fruits & légumes", unit: "g", gramsPerPiece: null,
  kcal: 100, protein: 10, carbs: 10, fat: 1, isPantry: false, ...over,
});
const egg = ing("œuf", { unit: "piece", gramsPerPiece: 60, kcal: 140, category: "Crèmerie & œufs" });
const rice = ing("riz", { kcal: 350 });
const oil = ing("huile", { unit: "ml", isPantry: true, kcal: 900 });

const recipe = (id: string, over: Partial<RecipeFull> = {}): RecipeFull => ({
  id, title: id, prepTime: 10, cookTime: 10, tags: "", seasons: "", isBatchable: true,
  isFavorite: false, isExcluded: false, rating: null,
  ingredients: [
    { ingredient: rice, quantity: 100, note: "" },
    { ingredient: egg, quantity: 0.75, note: "" },
    { ingredient: oil, quantity: 10, note: "" },
  ],
  ...over,
});

// Foyer : Moi (principal, bureau mardi/jeudi), Isabelle, Louis & Manon (cantine en semaine sauf mercredi)
const household = (): Household => {
  const members = [
    { id: "me", name: "Moi", multiplier: 1, isMainUser: true, isActive: true, dislikes: "" },
    { id: "isa", name: "Isabelle", multiplier: 1, isMainUser: false, isActive: true, dislikes: "" },
    { id: "louis", name: "Louis", multiplier: 0.5, isMainUser: false, isActive: true, dislikes: "" },
    { id: "manon", name: "Manon", multiplier: 0.5, isMainUser: false, isActive: true, dislikes: "champignon" },
  ];
  const rules = [
    { memberId: "me", weekday: 2, mealType: "LUNCH", status: "OFFICE" },
    { memberId: "me", weekday: 4, mealType: "LUNCH", status: "OFFICE" },
    ...["louis", "manon"].flatMap((id) =>
      [1, 2, 4, 5].map((d) => ({ memberId: id, weekday: d, mealType: "LUNCH", status: "AWAY" })),
    ),
  ];
  return { members, rules, overrides: [] };
};

const settings: PlannerSettings = {
  weekdayMaxTime: 45, weekendMaxTime: 180, noRepeatWeeks: 3, leftoverStrategy: "office",
  nutritionEnabled: false, kcalTarget: null, extraKcal: 0,
};

const MONDAY = "2026-10-05";

describe("dates", () => {
  it("calcule le jour de la semaine et le lundi", () => {
    expect(weekday(MONDAY)).toBe(1);
    expect(weekday("2026-10-11")).toBe(7);
    expect(weekStart("2026-10-08")).toBe(MONDAY);
    expect(weekDates(MONDAY)).toHaveLength(7);
  });
});

describe("présence", () => {
  it("applique le planning type et les exceptions", () => {
    const h = household();
    // Mardi midi : les enfants à la cantine, moi au bureau (gamelle), Isabelle à la maison
    expect(eatersOf(h, "2026-10-06", "LUNCH").map((m) => m.id)).toEqual(["me", "isa"]);
    // Mercredi midi : tout le monde
    expect(eatersOf(h, "2026-10-07", "LUNCH")).toHaveLength(4);
    h.overrides.push({ memberId: "isa", date: "2026-10-07", mealType: "LUNCH", status: "AWAY" });
    expect(eatersOf(h, "2026-10-07", "LUNCH")).toHaveLength(3);
  });
});

describe("portions et restes", () => {
  it("cuisine le soir la portion des restes du lendemain", () => {
    const h = household();
    const dinner: MealLite = { id: "d", date: MONDAY, type: "DINNER", recipeId: "r", sourceMealId: null, isLocked: false, mainUserPortion: null };
    const lunch: MealLite = { id: "l", date: "2026-10-06", type: "LUNCH", recipeId: "r", sourceMealId: "d", isLocked: false, mainUserPortion: null };
    // Dîner : 1 + 1 + 0.5 + 0.5 = 3 ; midi mardi : moi (gamelle) + Isabelle = 2
    expect(cookPortions(h, dinner, [dinner, lunch])).toBe(5);
    expect(cookPortions(h, lunch, [dinner, lunch])).toBe(0);
  });

  it("arrondit les pièces à l'unité supérieure pour les courses", () => {
    expect(formatQuantity(2.25, "piece", true)).toBe("3");
    expect(formatQuantity(0.5, "piece")).toBe("½");
    expect(formatQuantity(1250, "g")).toBe("1,25 kg");
    expect(formatQuantity(3, "piece", true)).toBe("3");
  });
});

describe("liste de courses", () => {
  it("agrège, exclut le placard et groupe par rayon", () => {
    const h = household();
    const r = recipe("r");
    const recipes = new Map([["r", r]]);
    const meals: MealLite[] = [
      { id: "d1", date: MONDAY, type: "DINNER", recipeId: "r", sourceMealId: null, isLocked: false, mainUserPortion: null },
      { id: "d2", date: "2026-10-07", type: "DINNER", recipeId: "r", sourceMealId: null, isLocked: false, mainUserPortion: null },
    ];
    const list = buildShoppingList(h, meals, meals, recipes);
    const fl = list.byCategory.get("Fruits & légumes")!;
    expect(fl[0].quantity).toBe(600); // 100 g × 3 portions × 2 repas
    const eggs = list.byCategory.get("Crèmerie & œufs")![0];
    expect(eggs.quantity).toBeCloseTo(4.5);
    expect(eggs.label).toBe("5");
    expect(list.pantry.map((p) => p.ingredient.id)).toEqual(["huile"]);
  });
});

describe("nutrition", () => {
  it("compte uniquement la part de l'utilisateur principal", () => {
    const h = household();
    const r = recipe("r");
    const kcal = recipeMacros(r).kcal; // 350 + 0.75×60×1.4 + 90 = 503
    expect(Math.round(kcal)).toBe(503);
    const meals: MealLite[] = [
      { id: "d", date: MONDAY, type: "DINNER", recipeId: "r", sourceMealId: null, isLocked: false, mainUserPortion: 0.8 },
    ];
    const day = mainUserDay(h, MONDAY, meals, new Map([["r", r]]), 400);
    expect(Math.round(day.kcal)).toBe(Math.round(400 + kcal * 0.8));
  });
});

describe("moteur de proposition", () => {
  const recipes = [
    recipe("chili", { tags: "boeuf", isBatchable: true }),
    recipe("curry", { tags: "poulet", isBatchable: true }),
    recipe("dahl", { tags: "vege", isBatchable: true }),
    recipe("croque", { tags: "porc,rapide", isBatchable: false }),
    recipe("wok", { tags: "boeuf,rapide", isBatchable: false }),
    recipe("risotto", { tags: "vege", isBatchable: false, ingredients: [{ ingredient: ing("champignon de Paris"), quantity: 100, note: "" }] }),
    recipe("bourguignon", { tags: "boeuf", cookTime: 150 }),
    recipe("quiche", { tags: "oeuf", isBatchable: true }),
    recipe("salade", { tags: "poisson,rapide", isBatchable: true }),
  ];
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  it("respecte présences, restes, durée et dégoûts", () => {
    const h = household();
    const plan = generatePlan({
      dates: weekDates(MONDAY), household: h, recipes, existing: [], history: [], settings, random: rnd,
    });
    const get = (d: string, t: string) => plan.find((m) => m.date === d && m.type === t);

    // 7 dîners
    expect(plan.filter((m) => m.type === "DINNER")).toHaveLength(7);
    // Mardi midi (bureau) = reste du dîner de lundi, qui doit être « batchable »
    const monDinner = get(MONDAY, "DINNER")!;
    const tueLunch = get("2026-10-06", "LUNCH")!;
    expect(tueLunch.sourceMealId).toBe(monDinner.id);
    expect(tueLunch.recipeId).toBe(monDinner.recipeId);
    expect(recipes.find((r) => r.id === monDinner.recipeId)!.isBatchable).toBe(true);
    // Lundi midi (personne au bureau) : une recette, pas un reste
    expect(get(MONDAY, "LUNCH")!.sourceMealId).toBeNull();
    // Pas de bourguignon en semaine (150 min), pas de risotto (Manon n'aime pas les champignons)
    for (const m of plan) {
      if (["2026-10-10", "2026-10-11"].includes(m.date)) continue;
      expect(m.recipeId).not.toBe("bourguignon");
    }
    expect(plan.some((m) => m.recipeId === "risotto")).toBe(false);
  });

  it("conserve les repas verrouillés", () => {
    const h = household();
    const locked: MealLite = { id: "x", date: "2026-10-07", type: "DINNER", recipeId: "croque", sourceMealId: null, isLocked: true, mainUserPortion: null };
    const plan = generatePlan({
      dates: weekDates(MONDAY), household: h, recipes, existing: [locked], history: [], settings, random: rnd,
    });
    expect(plan.find((m) => m.id === "x")).toEqual(locked);
  });

  it("ne propose pas de repas quand personne ne mange", () => {
    const h = household();
    for (const m of h.members) h.overrides.push({ memberId: m.id, date: MONDAY, mealType: "DINNER", status: "AWAY" });
    const plan = generatePlan({
      dates: [MONDAY], household: h, recipes, existing: [], history: [], settings, random: rnd,
    });
    expect(plan.find((m) => m.type === "DINNER")).toBeUndefined();
  });
});

describe("import de recettes", async () => {
  const { extractRecipe, parseIngredientLine, matchIngredient, parseDuration } = await import("./recipe-import");
  const known = [{ name: "oignon" }, { name: "pâtes" }, { name: "beurre" }, { name: "huile d'olive" }, { name: "œuf" }];

  it("lit le JSON-LD schema.org", () => {
    const html = `<script type="application/ld+json">{"@graph":[{"@type":"WebPage"},{"@type":"Recipe","name":"Gratin","recipeYield":"6 personnes","prepTime":"PT20M","cookTime":"PT1H","recipeIngredient":["1 kg de pommes de terre"],"recipeInstructions":[{"@type":"HowToStep","text":"Éplucher."},{"@type":"HowToStep","text":"Cuire."}]}]}</script>`;
    const r = extractRecipe(html, "https://ex.fr")!;
    expect(r).toMatchObject({ title: "Gratin", servings: 6, prepTime: 20, cookTime: 60, steps: ["Éplucher.", "Cuire."] });
    expect(parseDuration("PT1H30M")).toBe(90);
  });

  it("analyse les lignes d'ingrédients en français", () => {
    expect(parseIngredientLine("200 g de farine")).toMatchObject({ quantity: 200, unit: "g", name: "farine" });
    expect(parseIngredientLine("25 cl de lait")).toMatchObject({ quantity: 250, unit: "ml", name: "lait" });
    expect(parseIngredientLine("2 cuillères à soupe d'huile d'olive")).toMatchObject({ quantity: 30, unit: "ml", name: "huile d'olive" });
    expect(parseIngredientLine("1/2 oignon")).toMatchObject({ quantity: 0.5, unit: "piece" });
    expect(parseIngredientLine("beurre pour le moule").name).toBe("beurre");
  });

  it("relie aux ingrédients connus sans faux positifs", () => {
    expect(matchIngredient("petit oignon rouge", known)?.name).toBe("oignon");
    expect(matchIngredient("oignons", known)?.name).toBe("oignon");
    expect(matchIngredient("pâte sablée", known)).toBeUndefined();
    expect(matchIngredient("huile d'olive vierge", known)?.name).toBe("huile d'olive");
  });
});
