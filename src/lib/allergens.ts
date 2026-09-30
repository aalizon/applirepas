/**
 * Allergies, régimes et préférences : règles pures, testées dans planner.test.ts.
 * Les allergies et régimes sont des exclusions STRICTES ; les préférences favorisent une recette.
 */

export const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "Gluten",
  crustaces: "Crustacés",
  oeufs: "Œufs",
  poissons: "Poissons",
  arachides: "Arachides",
  soja: "Soja",
  lait: "Lait",
  "fruits-a-coque": "Fruits à coque",
  celeri: "Céleri",
  moutarde: "Moutarde",
  sesame: "Sésame",
  sulfites: "Sulfites",
  lupin: "Lupin",
  mollusques: "Mollusques",
};

export const DIET_LABELS: Record<string, string> = {
  "": "Mange de tout",
  "sans-porc": "Sans porc",
  pescetarien: "Pescétarien",
  vegetarien: "Végétarien",
  vegan: "Végétalien",
};

export const list = (s: string | null | undefined) =>
  (s ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

type Ing = { name: string; allergens?: string; animal?: string };
type RecipeLike = { title?: string; tags?: string; ingredients: { ingredient: Ing }[] };
type MemberLike = { id?: string; name: string; allergies?: string; diet?: string; dislikes?: string; likes?: string };

export function recipeAllergens(r: RecipeLike): Set<string> {
  return new Set(r.ingredients.flatMap((i) => list(i.ingredient.allergens)));
}

export function recipeAnimals(r: RecipeLike): Set<string> {
  return new Set(r.ingredients.map((i) => i.ingredient.animal ?? "").filter(Boolean));
}

const MEAT = ["volaille", "boeuf", "porc", "viande"];
const SEAFOOD = ["poisson", "crustace", "mollusque"];

/** Raison pour laquelle un régime interdit cette recette, sinon null. */
export function dietConflict(diet: string | undefined, r: RecipeLike): string | null {
  if (!diet) return null;
  const animals = recipeAnimals(r);
  const has = (xs: string[]) => xs.find((x) => animals.has(x));
  if (diet === "sans-porc") return animals.has("porc") ? "porc" : null;
  if (diet === "pescetarien") return has(MEAT) ? "viande" : null;
  if (diet === "vegetarien") return has(MEAT) ? "viande" : has(SEAFOOD) ? "poisson / fruits de mer" : null;
  if (diet === "vegan") {
    if (has(MEAT)) return "viande";
    if (has(SEAFOOD)) return "poisson / fruits de mer";
    if (animals.has("animal")) return "produit animal";
    const al = recipeAllergens(r);
    if (al.has("lait")) return "produit laitier";
    if (al.has("oeufs")) return "œufs";
  }
  return null;
}

export type Conflict = { member: string; kind: "allergie" | "regime" | "gout"; label: string };

/** Tout ce qui empêche un convive de manger cette recette. */
export function conflictsFor(r: RecipeLike, members: MemberLike[]): Conflict[] {
  const allergens = recipeAllergens(r);
  const out: Conflict[] = [];
  for (const m of members) {
    for (const a of list(m.allergies)) {
      if (allergens.has(a)) out.push({ member: m.name, kind: "allergie", label: ALLERGEN_LABELS[a] ?? a });
    }
    const d = dietConflict(m.diet, r);
    if (d) out.push({ member: m.name, kind: "regime", label: `${DIET_LABELS[m.diet ?? ""] ?? m.diet} (${d})` });
    const words = list(m.dislikes);
    const hit = r.ingredients.find((i) => words.some((w) => i.ingredient.name.toLowerCase().includes(w)));
    if (hit) out.push({ member: m.name, kind: "gout", label: `n'aime pas : ${hit.ingredient.name}` });
  }
  return out;
}

/** Bonus de préférence : nombre de convives dont un mot-clé « aime » correspond (titre, tags, ingrédients). */
export function likesScore(r: RecipeLike, members: MemberLike[]): number {
  const text = [r.title ?? "", r.tags ?? "", ...r.ingredients.map((i) => i.ingredient.name)].join(" ").toLowerCase();
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hay = norm(text);
  return members.filter((m) => list(m.likes).some((w) => hay.includes(norm(w)))).length;
}

// ---------------------------------------------------------------------------
// Déduction pour les ingrédients créés par import ou saisie (à vérifier par l'utilisateur)
// ---------------------------------------------------------------------------

// Début de mot compatible avec les lettres accentuées (\b ne gère que l'ASCII)
const w = (src: string) => new RegExp(`(?<![a-zà-ÿœæ])(?:${src})`, "i");

const ALLERGEN_WORDS: [RegExp, string][] = [
  [w("farine(?! de (?:sarrasin|riz|ma[iï]s|pois|coco|ch[aâ]taigne))|pains?(?![a-z])|p[aâ]tes?(?! de curry)(?![a-z])|spaghetti|lasagne|nouilles?(?! de riz)|semoule|boulgour|bl[eé](?![a-z])|orge|seigle|chapelure|biscuit|brioche|tortilla|gnocchi|couscous|pizza"), "gluten"],
  [w("lait(?!ue)|cr[eè]me|beurre(?! de cacahu)|fromage|yaourt|yogourt|mozzarella|parmesan|gruy[eè]re|emmental|comt[eé]|ch[eè]vre|feta|ricotta|mascarpone|reblochon|camembert|cheddar|raclette"), "lait"],
  [w("oeufs?|œufs?|jaunes? d|blancs? d|mayonnaise"), "oeufs"],
  [w("poisson|saumon|thon|cabillaud|colin|merlu|sardine|maquereau|truite|anchois|lieu(?![a-z])|sole(?![a-z])|dorade|bar(?![a-z])|nuoc"), "poissons"],
  [w("crevette|gambas|crabe|homard|langoustine|[eé]crevisse|surimi"), "crustaces"],
  [w("moules?(?![a-z])|hu[iî]tre|calamar|seiche|poulpe|coquilles? saint|p[eé]toncle|bulot"), "mollusques"],
  [w("cacahu[eè]te|arachide"), "arachides"],
  [w("noix(?! de coco)|amande|noisette|cajou|pistache|p[eé]can|macadamia"), "fruits-a-coque"],
  [w("soja|tofu|edamame|miso"), "soja"],
  [w("s[eé]same|tahin"), "sesame"],
  [w("moutarde"), "moutarde"],
  [w("c[eé]leri"), "celeri"],
  [w("vins?(?![a-z])|vinaigre|porto|cidre"), "sulfites"],
  [w("lupin"), "lupin"],
];

const ANIMAL_WORDS: [RegExp, string][] = [
  [w("porc|jambon|lardons?|bacon|saucisses?|saucisson|chorizo|chipolata|pancetta|coppa|rillettes"), "porc"],
  [w("poulet|dinde|canard|pintade|volaille|caille"), "volaille"],
  [w("b[oœ]uf|steak|entrec[oô]te|bavette|rumsteck"), "boeuf"],
  [w("veau|agneau|mouton|lapin|gibier|cerf|chevreuil|merguez"), "viande"],
  [w("poisson|saumon|thon|cabillaud|colin|merlu|sardine|maquereau|truite|anchois|dorade|nuoc"), "poisson"],
  [w("crevette|gambas|crabe|homard|langoustine|[eé]crevisse|surimi"), "crustace"],
  [w("moules?(?![a-z])|hu[iî]tre|calamar|seiche|poulpe|coquilles? saint|p[eé]toncle|bulot"), "mollusque"],
  [w("miel|g[eé]latine"), "animal"],
];

export function guessAllergens(name: string): string {
  return [...new Set(ALLERGEN_WORDS.filter(([re]) => re.test(name)).map(([, a]) => a))].join(",");
}

export function guessAnimal(name: string): string {
  return ANIMAL_WORDS.find(([re]) => re.test(name))?.[1] ?? "";
}
