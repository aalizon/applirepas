"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dices,
  Home,
  Lock,
  LockOpen,
  Recycle,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import {
  generateWeek,
  rerollMeal,
  setLeftover,
  setMainPortion,
  setMealRecipe,
  setPresenceOverride,
  swapMeals,
  toggleLock,
} from "@/app/actions";
import { formatShort } from "@/lib/dates";
import type { MealType, PresenceStatus } from "@/lib/planner";

type SlotView = {
  type: MealType;
  mealId: string | null;
  isLocked: boolean;
  isLeftover: boolean;
  canUseLeftover: boolean;
  leftoverFor: string[];
  recipe: { id: string; title: string; time: number; isBatchable: boolean; kcal: number } | null;
  members: { id: string; name: string; status: PresenceStatus; overridden: boolean }[];
  portions: number;
  cookPortions: number;
  mainPortion: number | null;
};

export type DayView = {
  date: string;
  label: string;
  isToday: boolean;
  slots: SlotView[];
  nutrition: { kcal: number; protein: number; carbs: number; fat: number; target: number | null } | null;
};

type RecipeOption = { id: string; title: string; time: number; tags: string; isFavorite: boolean };

const fr = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

export function WeekView({
  start,
  prev,
  next,
  days,
  recipes,
  mainUser,
}: {
  start: string;
  prev: string;
  next: string;
  days: DayView[];
  recipes: RecipeOption[];
  mainUser: { id: string; name: string; multiplier: number } | null;
}) {
  const [pending, startTransition] = useTransition();
  const [picker, setPicker] = useState<{ date: string; type: MealType } | null>(null);
  const [dragFrom, setDragFrom] = useState<{ date: string; type: MealType } | null>(null);
  const run = (fn: () => Promise<unknown>) => startTransition(async () => void (await fn()));

  const empty = days.every((d) => d.slots.every((s) => !s.recipe));

  return (
    <div className={`space-y-4 ${pending ? "cursor-progress" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="h1 mr-auto">Semaine du {formatShort(start)}</h1>
        <Link className="btn-ghost px-3" href={`/?semaine=${prev}`} aria-label="Semaine précédente">
          <ChevronLeft size={16} />
        </Link>
        <Link className="btn-ghost" href="/">
          Aujourd&apos;hui
        </Link>
        <Link className="btn-ghost px-3" href={`/?semaine=${next}`} aria-label="Semaine suivante">
          <ChevronRight size={16} />
        </Link>
        <button
          className="btn-primary"
          disabled={pending}
          onClick={() => {
            if (empty || confirm("Remplacer tous les repas non verrouillés 🔒 de la semaine par de nouvelles propositions ?"))
              run(() => generateWeek(start));
          }}
        >
          <Sparkles size={16} /> {pending ? "Un instant…" : empty ? "Proposer la semaine" : "Nouvelles propositions"}
        </button>
        <Link className="btn-ghost" href={`/courses?semaine=${start}`}>
          <ShoppingCart size={16} /> Courses
        </Link>
      </div>

      {empty && (
        <div className="card p-6 text-center text-muted">
          Aucun repas prévu cette semaine. Cliquez sur <b>Proposer la semaine</b> pour générer des menus adaptés à votre foyer.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {days.map((day) => (
          <section key={day.date} className={`card flex flex-col overflow-hidden ${day.isToday ? "ring-2 ring-brand" : ""}`}>
            <header className="border-b border-line bg-surface-2 px-4 py-2">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold first-letter:uppercase">{day.label}</h2>
                {day.isToday && <span className="chip bg-brand text-brand-ink">Aujourd&apos;hui</span>}
              </div>
              {day.nutrition && <NutritionBar n={day.nutrition} />}
            </header>
            <div className="flex flex-1 flex-col divide-y divide-line">
              {day.slots.map((slot) => (
                <Slot
                  key={slot.type}
                  date={day.date}
                  slot={slot}
                  nutrition={!!day.nutrition}
                  mainUser={mainUser}
                  run={run}
                  onPick={() => setPicker({ date: day.date, type: slot.type })}
                  onDragStart={() => setDragFrom({ date: day.date, type: slot.type })}
                  onDrop={() => {
                    if (dragFrom && (dragFrom.date !== day.date || dragFrom.type !== slot.type)) {
                      const from = dragFrom;
                      run(() => swapMeals(from, { date: day.date, type: slot.type }));
                    }
                    setDragFrom(null);
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Legend />

      {picker && (
        <RecipePicker
          recipes={recipes}
          onClose={() => setPicker(null)}
          onPick={(id) => {
            const p = picker;
            setPicker(null);
            run(() => setMealRecipe(p.date, p.type, id));
          }}
        />
      )}
    </div>
  );
}

function NutritionBar({ n }: { n: NonNullable<DayView["nutrition"]> }) {
  const pct = n.target ? Math.min(100, (n.kcal / n.target) * 100) : 0;
  const over = n.target ? n.kcal > n.target * 1.05 : false;
  return (
    <div className="mt-1" title={`Protéines ${fr(n.protein)} g · Glucides ${fr(n.carbs)} g · Lipides ${fr(n.fat)} g`}>
      <div className="flex justify-between text-[11px] text-muted">
        <span>
          {Math.round(n.kcal)} {n.target ? `/ ${n.target}` : ""} kcal
        </span>
        <span>P {Math.round(n.protein)} · G {Math.round(n.carbs)} · L {Math.round(n.fat)}</span>
      </div>
      {n.target ? (
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
          <div className={`h-full rounded-full ${over ? "bg-warn" : "bg-ok"}`} style={{ width: `${pct}%` }} />
        </div>
      ) : null}
    </div>
  );
}

const STATUS_CYCLE: Record<MealType, PresenceStatus[]> = {
  LUNCH: ["HOME", "OFFICE", "AWAY"],
  DINNER: ["HOME", "AWAY"],
};

function Slot({
  date,
  slot,
  nutrition,
  mainUser,
  run,
  onPick,
  onDragStart,
  onDrop,
}: {
  date: string;
  slot: SlotView;
  nutrition: boolean;
  mainUser: { id: string; name: string; multiplier: number } | null;
  run: (fn: () => Promise<unknown>) => void;
  onPick: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}) {
  const [over, setOver] = useState(false);
  const eaters = slot.members.filter((m) => m.status === "HOME" || (slot.type === "LUNCH" && m.status === "OFFICE"));
  const label = slot.type === "LUNCH" ? "Midi" : "Soir";

  const cycle = (m: SlotView["members"][number]) => {
    const order = STATUS_CYCLE[slot.type];
    const nextStatus = order[(order.indexOf(m.status) + 1) % order.length];
    run(() => setPresenceOverride(m.id, date, slot.type, nextStatus));
  };

  return (
    <div
      className={`space-y-2 px-4 py-3 ${over ? "bg-brand-soft" : ""}`}
      draggable={!!slot.recipe}
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onDrop();
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
        {slot.isLeftover && (
          <span className="chip bg-info-soft text-info">
            <Recycle size={12} /> Restes d&apos;hier soir
          </span>
        )}
        {slot.isLocked && <Lock size={12} className="text-warn" />}
      </div>

      {slot.recipe ? (
        <div>
          <Link
            href={`/recettes/${slot.recipe.id}${slot.mealId ? `?repas=${slot.mealId}` : ""}`}
            className="font-bold leading-tight hover:text-brand"
          >
            {slot.recipe.title}
          </Link>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            {!slot.isLeftover && (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {slot.recipe.time} min
              </span>
            )}
            <span>
              {eaters.length} pers.
              {!slot.isLeftover && slot.cookPortions > slot.portions && (
                <b className="text-info"> · cuisiner {fr(slot.cookPortions)} portions</b>
              )}
            </span>
            {slot.leftoverFor.length > 0 && <span className="text-info">→ restes pour demain midi</span>}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">{eaters.length ? "Aucun repas prévu" : "Personne ne mange à la maison"}</p>
      )}

      <div className="flex flex-wrap gap-1">
        {slot.members.map((m) => (
          <button
            key={m.id}
            onClick={() => cycle(m)}
            onContextMenu={(e) => {
              if (!m.overridden) return;
              e.preventDefault();
              run(() => setPresenceOverride(m.id, date, slot.type, null));
            }}
            title={`${m.name} : ${m.status === "HOME" ? "à la maison" : m.status === "OFFICE" ? "gamelle" : "absent"}${
              m.overridden ? " (exception — clic droit pour revenir au planning type)" : ""
            }`}
            className={`chip ${
              m.status === "HOME"
                ? "bg-ok-soft text-ok"
                : m.status === "OFFICE"
                  ? "bg-info-soft text-info"
                  : "bg-surface-2 text-muted line-through"
            } ${m.overridden ? "ring-1 ring-warn" : ""}`}
          >
            {m.status === "HOME" ? <Home size={11} /> : m.status === "OFFICE" ? <Briefcase size={11} /> : <X size={11} />}
            {m.name}
          </button>
        ))}
      </div>

      {nutrition && mainUser && slot.recipe && eaters.some((m) => m.id === mainUser.id) && (
        <label className="flex items-center gap-2 text-xs text-muted">
          Ma portion
          <select
            className="rounded-md border border-line bg-surface px-1 py-0.5"
            value={slot.mainPortion ?? ""}
            onChange={(e) => slot.mealId && run(() => setMainPortion(slot.mealId!, e.target.value ? Number(e.target.value) : null))}
          >
            <option value="">×{mainUser.multiplier} (habituelle)</option>
            {[0.5, 0.75, 1, 1.25, 1.5].map((v) => (
              <option key={v} value={v}>
                ×{v}
              </option>
            ))}
          </select>
          <span>≈ {Math.round(slot.recipe.kcal * (slot.mainPortion ?? mainUser.multiplier))} kcal</span>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-1">
        {eaters.length > 0 && (
          <button className="btn-icon" title="Proposer une autre recette" onClick={() => run(() => rerollMeal(date, slot.type))}>
            <Dices size={16} />
          </button>
        )}
        <button className="btn-icon" title="Choisir une recette" onClick={onPick}>
          <Search size={16} />
        </button>
        {slot.mealId && (
          <button
            className="btn-icon"
            title={slot.isLocked ? "Déverrouiller" : "Verrouiller (conservé lors des nouvelles propositions)"}
            onClick={() => run(() => toggleLock(slot.mealId!))}
          >
            {slot.isLocked ? <Lock size={16} /> : <LockOpen size={16} />}
          </button>
        )}
        {slot.type === "LUNCH" && slot.canUseLeftover && (
          <button
            className={`btn-icon ${slot.isLeftover ? "text-info" : ""}`}
            title={slot.isLeftover ? "Ne plus utiliser les restes" : "Utiliser les restes du dîner d'hier"}
            onClick={() => run(() => setLeftover(date, !slot.isLeftover))}
          >
            <Recycle size={16} />
          </button>
        )}
        {slot.mealId && (
          <button className="btn-icon ml-auto" title="Retirer ce repas" onClick={() => run(() => setMealRecipe(date, slot.type, null))}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
      <span className="chip bg-ok-soft text-ok">
        <Home size={11} /> à la maison
      </span>
      <span className="chip bg-info-soft text-info">
        <Briefcase size={11} /> gamelle (restes)
      </span>
      <span className="chip bg-surface-2 text-muted line-through">
        <X size={11} /> absent
      </span>
      <span>Touchez un prénom pour changer ponctuellement · Glissez un repas sur un autre pour les échanger.</span>
    </div>
  );
}

function RecipePicker({
  recipes,
  onPick,
  onClose,
}: {
  recipes: RecipeOption[];
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const n = q.toLowerCase();
    return recipes
      .filter((r) => !n || r.title.toLowerCase().includes(n) || r.tags.includes(n))
      .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite) || a.title.localeCompare(b.title, "fr"));
  }, [q, recipes]);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="card flex max-h-[85vh] w-full max-w-lg flex-col rounded-b-none sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-line p-3">
          <Search size={16} className="text-muted" />
          <input autoFocus className="flex-1 bg-transparent outline-none" placeholder="Rechercher une recette…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <ul className="overflow-y-auto p-2">
          {list.map((r) => (
            <li key={r.id}>
              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-surface-2" onClick={() => onPick(r.id)}>
                {r.isFavorite ? <Star size={14} className="text-warn" fill="currentColor" /> : <Utensils size={14} className="text-muted" />}
                <span className="flex-1 font-semibold">{r.title}</span>
                <span className="text-xs text-muted">{r.time} min</span>
              </button>
            </li>
          ))}
          {!list.length && <li className="p-4 text-center text-sm text-muted">Aucune recette</li>}
        </ul>
      </div>
    </div>
  );
}
