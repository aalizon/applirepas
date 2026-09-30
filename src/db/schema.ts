import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

/** Réglages globaux du foyer (une seule ligne, id = 1). */
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey(),
  onboarded: integer("onboarded", { mode: "boolean" }).notNull().default(false),
  // Préférences du moteur de proposition
  /** Durée totale max (préparation + cuisson) en minutes, en semaine et le week-end */
  weekdayMaxTime: integer("weekday_max_time").notNull().default(45),
  weekendMaxTime: integer("weekend_max_time").notNull().default(180),
  noRepeatWeeks: integer("no_repeat_weeks").notNull().default(3),
  /** "office" : restes uniquement si quelqu'un emporte sa gamelle ; "always" : dès qu'on déjeune à la maison ; "never" */
  leftoverStrategy: text("leftover_strategy").notNull().default("office"),
  // Rééquilibrage alimentaire (utilisateur principal)
  nutritionEnabled: integer("nutrition_enabled", { mode: "boolean" }).notNull().default(false),
  kcalTarget: integer("kcal_target"),
  proteinTarget: integer("protein_target"),
  carbsTarget: integer("carbs_target"),
  fatTarget: integer("fat_target"),
  /** Forfait petit-déjeuner + collations (non planifiés) ajouté à la jauge */
  extraKcal: integer("extra_kcal").notNull().default(0),
  /** Version des données de départ déjà installées (mise à jour automatique au démarrage) */
  seedVersion: integer("seed_version").notNull().default(0),
});

export const members = sqliteTable("members", {
  id: id(),
  name: text("name").notNull(),
  /** Adulte = 1.0, Ado = 1.2, Enfant = 0.5–0.7 */
  multiplier: real("multiplier").notNull().default(1),
  isMainUser: integer("is_main_user", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  /** Mots-clés d'ingrédients exclus, séparés par des virgules (ex : "champignon, poivron") */
  dislikes: text("dislikes").notNull().default(""),
  /** Allergies : codes séparés par des virgules (gluten, lait, oeufs…) — exclusion stricte */
  allergies: text("allergies").notNull().default(""),
  /** Régime : "" | sans-porc | pescetarien | vegetarien | vegan — exclusion stricte */
  diet: text("diet").notNull().default(""),
  /** Préférences positives (mots-clés : poisson, épicé, pâtes…) — favorisées dans les propositions */
  likes: text("likes").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * Planning type « Qui mange quand ? ».
 * status : HOME (mange à la maison) | OFFICE (emporte une gamelle = restes) | AWAY (cantine, resto, absent)
 */
export const presenceRules = sqliteTable(
  "presence_rules",
  {
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(), // 1 = lundi … 7 = dimanche
    mealType: text("meal_type").notNull(), // LUNCH | DINNER
    status: text("status").notNull(),
  },
  (t) => [primaryKey({ columns: [t.memberId, t.weekday, t.mealType] })],
);

/** Exception ponctuelle au planning type (congés, sortie…). */
export const presenceOverrides = sqliteTable(
  "presence_overrides",
  {
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // YYYY-MM-DD
    mealType: text("meal_type").notNull(),
    status: text("status").notNull(),
  },
  (t) => [primaryKey({ columns: [t.memberId, t.date, t.mealType] })],
);

export const ingredients = sqliteTable(
  "ingredients",
  {
    id: id(),
    name: text("name").notNull(),
    category: text("category").notNull().default("Divers"),
    /** Unité de référence : g | ml | piece */
    unit: text("unit").notNull().default("g"),
    /** Poids moyen d'une pièce (pour les calculs nutritionnels et conversions) */
    gramsPerPiece: real("grams_per_piece"),
    // Valeurs nutritionnelles pour 100 g (source : table Ciqual ANSES, valeurs arrondies)
    kcal: real("kcal"),
    protein: real("protein"),
    carbs: real("carbs"),
    fat: real("fat"),
    /** Produit du placard (sel, huile…) : pas ajouté automatiquement à la liste de courses */
    isPantry: integer("is_pantry", { mode: "boolean" }).notNull().default(false),
    /** Allergènes (codes UE séparés par des virgules) */
    allergens: text("allergens").notNull().default(""),
    /** Origine animale : volaille | boeuf | porc | viande | poisson | crustace | mollusque | animal | "" */
    animal: text("animal").notNull().default(""),
  },
  (t) => [uniqueIndex("ingredients_name_idx").on(t.name)],
);

export const recipes = sqliteTable("recipes", {
  id: id(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  prepTime: integer("prep_time").notNull().default(20), // minutes actives
  cookTime: integer("cook_time").notNull().default(0),
  /** Étapes séparées par des retours à la ligne */
  instructions: text("instructions").notNull().default(""),
  /** Tags séparés par des virgules : poulet, boeuf, porc, poisson, vege, oeuf, rapide, famille… */
  tags: text("tags").notNull().default(""),
  /** Saisons séparées par des virgules : printemps, ete, automne, hiver (vide = toute l'année) */
  seasons: text("seasons").notNull().default(""),
  isBatchable: integer("is_batchable", { mode: "boolean" }).notNull().default(true),
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
  /** Exclue des propositions automatiques */
  isExcluded: integer("is_excluded", { mode: "boolean" }).notNull().default(false),
  rating: integer("rating"), // 1–5
  sourceUrl: text("source_url"),
  imageUrl: text("image_url"),
  /** Crédit de la photo (auteur, licence) */
  imageCredit: text("image_credit"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const recipeIngredients = sqliteTable("recipe_ingredients", {
  id: id(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id),
  /** Quantité pour 1 portion adulte (multiplier 1.0), dans l'unité de l'ingrédient */
  quantity: real("quantity").notNull(),
  note: text("note").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const meals = sqliteTable(
  "meals",
  {
    id: id(),
    date: text("date").notNull(), // YYYY-MM-DD
    type: text("type").notNull(), // LUNCH | DINNER
    recipeId: text("recipe_id").references(() => recipes.id, { onDelete: "set null" }),
    /** Si renseigné : ce repas est le reste du repas source (rien à cuisiner ni à acheter) */
    sourceMealId: text("source_meal_id"),
    isLocked: integer("is_locked", { mode: "boolean" }).notNull().default(false),
    /** Portion de l'utilisateur principal pour ce repas (sinon son coefficient) */
    mainUserPortion: real("main_user_portion"),
  },
  (t) => [uniqueIndex("meals_date_type_idx").on(t.date, t.type)],
);

/** Cases cochées de la liste de courses générée (clé = id ingrédient). */
export const shoppingChecks = sqliteTable(
  "shopping_checks",
  {
    weekStart: text("week_start").notNull(),
    key: text("key").notNull(),
  },
  (t) => [primaryKey({ columns: [t.weekStart, t.key] })],
);

/** Articles ajoutés à la main (lessive, pain…). */
export const shoppingManual = sqliteTable("shopping_manual", {
  id: id(),
  weekStart: text("week_start").notNull(),
  label: text("label").notNull(),
  category: text("category").notNull().default("Divers"),
  checked: integer("checked", { mode: "boolean" }).notNull().default(false),
});

export type Settings = typeof settings.$inferSelect;
export type Member = typeof members.$inferSelect;
export type PresenceRule = typeof presenceRules.$inferSelect;
export type PresenceOverride = typeof presenceOverrides.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type Meal = typeof meals.$inferSelect;
