/**
 * Import de recettes depuis une URL.
 * La plupart des sites de cuisine (Marmiton, 750g, Cuisine AZ, Jow, Ricardo, BBC Good Food…)
 * publient leurs recettes au format structuré schema.org/Recipe (JSON-LD) pour Google :
 * on lit ces données plutôt que de « scraper » la mise en page.
 */

export type ParsedRecipe = {
  title: string;
  description: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  ingredientLines: string[];
  steps: string[];
  imageUrl: string | null;
  sourceUrl: string;
};

type Json = Record<string, unknown>;

/** Durée ISO 8601 (PT1H30M) → minutes */
export function parseDuration(v: unknown): number {
  if (typeof v !== "string") return 0;
  const m = v.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 1440 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

function text(v: unknown): string {
  if (typeof v === "string") return decodeEntities(v).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (Array.isArray(v)) return text(v[0]);
  return "";
}

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function isRecipe(o: Json) {
  const t = o["@type"];
  return t === "Recipe" || (Array.isArray(t) && t.includes("Recipe"));
}

function findRecipe(node: unknown): Json | undefined {
  if (!node || typeof node !== "object") return undefined;
  if (Array.isArray(node)) {
    for (const n of node) {
      const r = findRecipe(n);
      if (r) return r;
    }
    return undefined;
  }
  const o = node as Json;
  if (isRecipe(o)) return o;
  if (o["@graph"]) return findRecipe(o["@graph"]);
  if (o.mainEntity) return findRecipe(o.mainEntity);
  return undefined;
}

function steps(v: unknown): string[] {
  if (typeof v === "string") {
    return v.split(/\n|(?<=\.)\s+(?=[A-ZÉÈÀ])/).map(text).filter(Boolean);
  }
  if (Array.isArray(v)) {
    return v.flatMap((s) => {
      if (typeof s === "string") return [text(s)];
      const o = s as Json;
      if (o["@type"] === "HowToSection") return steps(o.itemListElement);
      return [text(o.text ?? o.name)];
    }).filter(Boolean);
  }
  return [];
}

function servings(v: unknown): number {
  const s = Array.isArray(v) ? v.map(String).join(" ") : String(v ?? "");
  const n = s.match(/\d+/);
  return n ? Math.max(1, Math.min(50, Number(n[0]))) : 4;
}

function image(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return image(v[0]);
  if (v && typeof v === "object") return image((v as Json).url);
  return null;
}

export function extractRecipe(html: string, sourceUrl: string): ParsedRecipe | undefined {
  const blocks = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const [, raw] of blocks) {
    let data: unknown;
    try {
      data = JSON.parse(raw.trim());
    } catch {
      continue;
    }
    const r = findRecipe(data);
    if (!r) continue;
    return {
      title: text(r.name) || "Recette importée",
      description: text(r.description).slice(0, 300),
      servings: servings(r.recipeYield),
      prepTime: parseDuration(r.prepTime),
      cookTime: parseDuration(r.cookTime) || Math.max(0, parseDuration(r.totalTime) - parseDuration(r.prepTime)),
      ingredientLines: (Array.isArray(r.recipeIngredient) ? r.recipeIngredient : []).map(text).filter(Boolean),
      steps: steps(r.recipeInstructions),
      imageUrl: image(r.image),
      sourceUrl,
    };
  }
  return undefined;
}

export async function fetchRecipe(url: string): Promise<ParsedRecipe> {
  const u = new URL(url);
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("URL invalide");
  const res = await fetch(u, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "fr-FR,fr;q=0.9",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Le site a répondu ${res.status}`);
  const html = await res.text();
  const recipe = extractRecipe(html, url);
  if (!recipe) throw new Error("Aucune recette structurée (schema.org) trouvée sur cette page.");
  return recipe;
}

// ---------------------------------------------------------------------------
// Analyse d'une ligne d'ingrédient en français : « 200 g de farine », « 2 oignons »…
// ---------------------------------------------------------------------------

export type ParsedLine = { quantity: number; unit: "g" | "ml" | "piece" | null; name: string; raw: string };

const FRACTIONS: Record<string, number> = { "½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3 };

const UNITS: [RegExp, "g" | "ml" | "piece", number][] = [
  [/^(kg|kilos?|kilogrammes?)\b/i, "g", 1000],
  [/^(mg)\b/i, "g", 0.001],
  [/^(g|gr|grammes?)\b\.?/i, "g", 1],
  [/^(l|litres?)\b/i, "ml", 1000],
  [/^(dl|décilitres?)\b/i, "ml", 100],
  [/^(cl|centilitres?)\b/i, "ml", 10],
  [/^(ml|millilitres?)\b/i, "ml", 1],
  [/^(c\.?\s?à\.?\s?s\.?|càs|cs|cuill(?:e|è)res?\s+à\s+soupe|c\.\s?s\.)(?=\s|$)/i, "ml", 15],
  [/^(c\.?\s?à\.?\s?c\.?|càc|cc|cuill(?:e|è)res?\s+à\s+café|c\.\s?c\.)(?=\s|$)/i, "ml", 5],
  [/^(verres?)\b/i, "ml", 200],
  [/^(filets?|traits?)\b/i, "ml", 5],
  [/^(noix)(?=\s+de\s)/i, "g", 10],
  [/^(tasses?)\b/i, "ml", 250],
  [/^(pincées?)\b/i, "g", 1],
  [/^(gousses?)\b/i, "piece", 1],
  [/^(tranches?|sachets?|boîtes?|brins?|feuilles?|morceaux?|bottes?)\b/i, "piece", 1],
];

export function parseIngredientLine(raw: string): ParsedLine {
  let s = raw.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  let quantity = 0;
  // « 1 1/2 », « 1/2 », « 1½ », « 1,5 », « 200 »
  const q = s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)|^(\d+(?:[.,]\d+)?)?\s*([½¼¾⅓⅔])|^(\d+(?:[.,]\d+)?)/);
  if (q) {
    if (q[2]) quantity = Number(q[1] ?? 0) + Number(q[2]) / Number(q[3]);
    else if (q[5]) quantity = Number((q[4] ?? "0").replace(",", ".")) + FRACTIONS[q[5]];
    else quantity = Number(q[6].replace(",", "."));
    s = s.slice(q[0].length).trim();
  }
  let unit: ParsedLine["unit"] = null;
  for (const [re, u, factor] of UNITS) {
    const m = s.match(re);
    if (m) {
      unit = u;
      quantity = (quantity || 1) * factor;
      s = s.slice(m[0].length).trim();
      if (/^gousses?/i.test(m[0])) s = `ail ${s}`;
      break;
    }
  }
  s = s.replace(/^(de |d'|d’|des |du )/i, "").trim();
  // « beurre pour le moule », « crème à fouetter très froide » → nom seul
  s = s.split(/,| pour | à fouetter| en poudre| du moulin| de \d/i)[0].trim();
  if (!unit && quantity) unit = "piece";
  return { quantity, unit, name: s, raw };
}

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => (w.length > 3 ? w.replace(/(s|x)$/, "") : w))
    .join(" ");
}

const FILLERS = new Set(["petit", "petite", "gro", "grosse", "grand", "grande", "beau", "bel", "belle", "bio", "frai", "fraiche", "rouge", "jaune", "blanc", "blanche", "vert", "verte", "bien", "mur", "mure"]);

/**
 * Associe un nom d'ingrédient importé à un ingrédient connu.
 * Le nom connu doit être contenu dans le nom importé ET en représenter l'essentiel
 * (« petit oignon rouge » → oignon, mais « pâte sablée » ≠ pâtes).
 */
export function matchIngredient<T extends { name: string }>(name: string, known: T[]): T | undefined {
  const core = normalize(name)
    .split(" ")
    .filter((w) => !FILLERS.has(w))
    .join(" ");
  const n = ` ${core} `;
  let best: T | undefined;
  let bestLen = 0;
  for (const k of known) {
    const kn = normalize(k.name);
    if (!kn || !n.includes(` ${kn} `)) continue;
    if (kn.length / core.length < 0.6) continue;
    if (kn.length > bestLen) {
      best = k;
      bestLen = kn.length;
    }
  }
  return best;
}
