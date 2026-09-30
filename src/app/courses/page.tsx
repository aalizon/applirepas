import Link from "next/link";
import { eq } from "drizzle-orm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db, schema } from "@/db";
import { CATEGORIES } from "@/db/seed-data";
import { addDays, formatShort, isValidDate, today, weekStart } from "@/lib/dates";
import { getHousehold, getMeals, getRecipes } from "@/lib/data";
import { buildShoppingList } from "@/lib/planner";
import { ShoppingView } from "@/components/shopping-view";

export const dynamic = "force-dynamic";

export default async function Courses({ searchParams }: PageProps<"/courses">) {
  const sp = await searchParams;
  const start = weekStart(typeof sp.semaine === "string" && isValidDate(sp.semaine) ? sp.semaine : today());
  const end = addDays(start, 6);
  const [household, allMeals, recipes, checks, manual] = await Promise.all([
    getHousehold(start, addDays(end, 1)),
    getMeals(start, addDays(end, 1)),
    getRecipes(),
    db.select().from(schema.shoppingChecks).where(eq(schema.shoppingChecks.weekStart, start)).all(),
    db.select().from(schema.shoppingManual).where(eq(schema.shoppingManual.weekStart, start)).all(),
  ]);
  const inRange = allMeals.filter((m) => m.date >= start && m.date <= end);
  const list = buildShoppingList(household, inRange, allMeals, new Map(recipes.map((r) => [r.id, r])));
  const order = (c: string) => {
    const i = (CATEGORIES as readonly string[]).indexOf(c);
    return i === -1 ? 99 : i;
  };
  const categories = [...list.byCategory.entries()]
    .sort((a, b) => order(a[0]) - order(b[0]))
    .map(([name, lines]) => ({
      name,
      items: lines.map((l) => ({ key: l.ingredient.id, name: l.ingredient.name, qty: l.label, recipes: l.recipes })),
    }));

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="h1 mr-auto">Courses · semaine du {formatShort(start)}</h1>
        <Link className="btn-ghost px-3" href={`/courses?semaine=${addDays(start, -7)}`} aria-label="Semaine précédente">
          <ChevronLeft size={16} />
        </Link>
        <Link className="btn-ghost px-3" href={`/courses?semaine=${addDays(start, 7)}`} aria-label="Semaine suivante">
          <ChevronRight size={16} />
        </Link>
      </div>
      <ShoppingView
        week={start}
        categories={categories}
        pantry={list.pantry.map((l) => ({ key: l.ingredient.id, name: l.ingredient.name, qty: l.label }))}
        checked={checks.map((c) => c.key)}
        manual={manual}
        allCategories={[...CATEGORIES]}
        mealsCount={inRange.filter((m) => !m.sourceMealId && m.recipeId).length}
        menu={inRange
          .filter((m) => !m.sourceMealId && m.recipeId)
          .map((m) => {
            const r = recipes.find((x) => x.id === m.recipeId)!;
            return { id: m.id, recipeId: r.id, title: r.title, imageUrl: r.imageUrl, label: `${formatShort(m.date)} · ${m.type === "LUNCH" ? "midi" : "soir"}` };
          })}
      />
    </div>
  );
}
