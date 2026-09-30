import type { DatabaseSync } from "node:sqlite";
import { SEED_ALLERGENS, SEED_ANIMAL, SEED_INGREDIENTS, SEED_RECIPES } from "./seed-data";
import { SEED_PHOTOS } from "./seed-photos";

/**
 * Version des données de départ. L'augmenter quand on ajoute recettes, ingrédients ou photos :
 * les bases existantes sont complétées au prochain démarrage, sans toucher aux modifications
 * de l'utilisateur (recettes supprimées exceptées : elles reviennent si leur titre a disparu).
 */
export const SEED_VERSION = 2;

/** Installe ou complète les données de départ. Idempotent. */
export function seedIfEmpty(sqlite: DatabaseSync) {
  sqlite.prepare("INSERT OR IGNORE INTO settings (id) VALUES (1)").run();
  const { seed_version: current } = sqlite.prepare("SELECT seed_version FROM settings WHERE id = 1").get() as {
    seed_version: number;
  };
  if (current >= SEED_VERSION) return;

  sqlite.exec("BEGIN");
  try {
    // Ingrédients : ajout des nouveaux, allergènes / origine animale pour ceux qui n'en ont pas
    const insIng = sqlite.prepare(
      `INSERT OR IGNORE INTO ingredients (id, name, category, unit, grams_per_piece, kcal, protein, carbs, fat, is_pantry, allergens, animal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const tagIng = sqlite.prepare(
      "UPDATE ingredients SET allergens = ?, animal = ? WHERE name = ? AND allergens = '' AND animal = ''",
    );
    for (const i of SEED_INGREDIENTS) {
      const allergens = SEED_ALLERGENS[i.name] ?? "";
      const animal = SEED_ANIMAL[i.name] ?? "";
      insIng.run(
        crypto.randomUUID(), i.name, i.category, i.unit, i.gramsPerPiece ?? null, ...i.n, i.pantry ? 1 : 0, allergens, animal,
      );
      tagIng.run(allergens, animal, i.name);
    }
    const ids = new Map(
      (sqlite.prepare("SELECT id, name FROM ingredients").all() as { id: string; name: string }[]).map((r) => [r.name, r.id]),
    );

    // Recettes : ajout de celles dont le titre n'existe pas encore
    const exists = sqlite.prepare("SELECT id, image_url FROM recipes WHERE title = ?");
    const insRecipe = sqlite.prepare(
      `INSERT INTO recipes (id, title, description, prep_time, cook_time, instructions, tags, seasons, is_batchable, image_url, image_credit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const setPhoto = sqlite.prepare("UPDATE recipes SET image_url = ?, image_credit = ? WHERE id = ?");
    const insRI = sqlite.prepare(
      `INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity, note, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
    for (const r of SEED_RECIPES) {
      const photo = SEED_PHOTOS[r.title];
      const found = exists.get(r.title) as { id: string; image_url: string | null } | undefined;
      if (found) {
        if (!found.image_url && photo) setPhoto.run(photo.src, photo.credit, found.id);
        continue;
      }
      const rid = crypto.randomUUID();
      insRecipe.run(
        rid, r.title, r.description, r.prep, r.cook, r.steps.join("\n"), r.tags, r.seasons ?? "", r.batch ? 1 : 0,
        photo?.src ?? null, photo?.credit ?? null,
      );
      r.ingredients.forEach(([name, qty, note], idx) => {
        const iid = ids.get(name);
        if (!iid) throw new Error(`Ingrédient inconnu dans le seed : ${name}`);
        insRI.run(crypto.randomUUID(), rid, iid, qty, note ?? "", idx);
      });
    }
    sqlite.prepare("UPDATE settings SET seed_version = ? WHERE id = 1").run(SEED_VERSION);
    sqlite.exec("COMMIT");
  } catch (e) {
    sqlite.exec("ROLLBACK");
    throw e;
  }
}
