import type { DatabaseSync } from "node:sqlite";
import { SEED_INGREDIENTS, SEED_RECIPES } from "./seed-data";

/** Remplit la base au premier lancement (ingrédients + recettes). Idempotent. */
export function seedIfEmpty(sqlite: DatabaseSync) {
  sqlite.prepare("INSERT OR IGNORE INTO settings (id) VALUES (1)").run();

  const count = sqlite.prepare("SELECT COUNT(*) AS c FROM ingredients").get() as { c: number };
  if (count.c > 0) return;

  sqlite.exec("BEGIN");
  try {
    const insIng = sqlite.prepare(
      `INSERT INTO ingredients (id, name, category, unit, grams_per_piece, kcal, protein, carbs, fat, is_pantry)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const ids = new Map<string, string>();
    for (const i of SEED_INGREDIENTS) {
      const id = crypto.randomUUID();
      ids.set(i.name, id);
      insIng.run(id, i.name, i.category, i.unit, i.gramsPerPiece ?? null, ...i.n, i.pantry ? 1 : 0);
    }

    const insRecipe = sqlite.prepare(
      `INSERT INTO recipes (id, title, description, prep_time, cook_time, instructions, tags, seasons, is_batchable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const insRI = sqlite.prepare(
      `INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity, note, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
    for (const r of SEED_RECIPES) {
      const rid = crypto.randomUUID();
      insRecipe.run(
        rid, r.title, r.description, r.prep, r.cook, r.steps.join("\n"), r.tags, r.seasons ?? "", r.batch ? 1 : 0,
      );
      r.ingredients.forEach(([name, qty, note], idx) => {
        const iid = ids.get(name);
        if (!iid) throw new Error(`Ingrédient inconnu dans le seed : ${name}`);
        insRI.run(crypto.randomUUID(), rid, iid, qty, note ?? "", idx);
      });
    }
    sqlite.exec("COMMIT");
  } catch (e) {
    sqlite.exec("ROLLBACK");
    throw e;
  }
}
