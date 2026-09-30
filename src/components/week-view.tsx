"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dices,
  Lock,
  LockOpen,
  MoreHorizontal,
  Plus,
  Recycle,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
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
import type { Conflict } from "@/lib/allergens";
import type { MealType, PresenceStatus } from "@/lib/planner";
import { Avatar } from "./avatar";
import { RecipeImage } from "./recipe-image";

type SlotView = {
  type: MealType;
  mealId: string | null;
  isLocked: boolean;
  isLeftover: boolean;
  canUseLeftover: boolean;
  hasLeftovers: boolean;
  recipe: { id: string; title: string; imageUrl: string | null; time: number; kcal: number } | null;
  conflicts: Conflict[];
  members: { id: string; name: string; color: number; status: PresenceStatus; overridden: boolean }[];
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

type RecipeOption = {
  id: string;
  title: string;
  imageUrl: string | null;
  time: number;
  tags: string;
  isFavorite: boolean;
  blockedFor: string[];
};

type MainUser = { id: string; name: string; multiplier: number } | null;
type Run = (fn: () => Promise<unknown>) => void;

const fr = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const MEAL_LABEL: Record<MealType, string> = { LUNCH: "Midi", DINNER: "Soir" };

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
  mainUser: MainUser;
}) {
  const [pending, startTransition] = useTransition();
  const [picker, setPicker] = useState<{ date: string; type: MealType } | null>(null);
  const [dragFrom, setDragFrom] = useState<{ date: string; type: MealType } | null>(null);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const run: Run = (fn) => startTransition(async () => void (await fn()));

  const empty = days.every((d) => d.slots.every((s) => !s.recipe));
  const today = days.find((d) => d.isToday);
  const tonight = today?.slots.find((s) => s.type === "DINNER" && s.recipe);

  return (
    <div className={`space-y-6 ${pending ? "cursor-progress opacity-90" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto">
          <p className="text-sm font-semibold text-muted">Menus de la semaine</p>
          <h1 className="h1">Semaine du {formatShort(start)}</h1>
        </div>
        <div className="flex items-center gap-1 rounded-2xl border border-line bg-surface p-1">
          <Link className="btn-icon" href={`/?semaine=${prev}`} aria-label="Semaine précédente">
            <ChevronLeft size={18} />
          </Link>
          <Link className="rounded-lg px-2 py-1 text-sm font-semibold hover:bg-surface-2" href="/">
            Aujourd&apos;hui
          </Link>
          <Link className="btn-icon" href={`/?semaine=${next}`} aria-label="Semaine suivante">
            <ChevronRight size={18} />
          </Link>
        </div>
        {confirmRegen ? (
          <div className="flex items-center gap-2 rounded-2xl bg-warn-soft px-3 py-1.5 text-sm text-warn">
            Remplacer les repas non verrouillés ?
            <button className="font-bold underline" onClick={() => (setConfirmRegen(false), run(() => generateWeek(start)))}>
              Oui
            </button>
            <button className="font-bold" onClick={() => setConfirmRegen(false)}>
              Non
            </button>
          </div>
        ) : (
          <button
            className="btn-primary"
            disabled={pending}
            onClick={() => (empty ? run(() => generateWeek(start)) : setConfirmRegen(true))}
          >
            <Sparkles size={16} /> {pending ? "Un instant…" : empty ? "Proposer mes menus" : "Nouvelles idées"}
          </button>
        )}
        <Link className="btn-ghost hidden sm:inline-flex" href={`/courses?semaine=${start}`}>
          <ShoppingCart size={16} /> Courses
        </Link>
      </div>

      {tonight?.recipe && today && <Tonight day={today} slot={tonight} run={run} />}

      {empty && (
        <div className="card flex flex-col items-center gap-3 p-8 text-center">
          <Sparkles className="text-brand" size={32} />
          <p className="max-w-md text-muted">
            Aucun repas prévu cette semaine. AppliRepas vous propose des menus adaptés à votre foyer, à vos allergies et à
            votre emploi du temps.
          </p>
          <button className="btn-primary" onClick={() => run(() => generateWeek(start))}>
            <Sparkles size={16} /> Proposer mes menus
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {days.map((day) => (
          <section key={day.date} className={`card overflow-hidden ${day.isToday ? "ring-2 ring-brand" : ""}`}>
            <header className="flex items-center gap-2 px-4 pb-1 pt-3">
              <h2 className="text-base font-extrabold first-letter:uppercase">{day.label}</h2>
              {day.isToday && <span className="chip bg-brand text-brand-ink">Aujourd&apos;hui</span>}
            </header>
            {day.nutrition && <NutritionBar n={day.nutrition} />}
            <div className="divide-y divide-line">
              {day.slots.map((slot) => (
                <MealRow
                  key={slot.type}
                  date={day.date}
                  slot={slot}
                  mainUser={day.nutrition ? mainUser : null}
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

function Tonight({ day, slot, run }: { day: DayView; slot: SlotView; run: Run }) {
  const r = slot.recipe!;
  const eaters = slot.members.filter((m) => m.status === "HOME");
  return (
    <section className="card grid overflow-hidden md:grid-cols-[1.2fr_1fr]">
      <Link href={`/recettes/${r.id}?repas=${slot.mealId}`} className="relative block aspect-[16/9] md:aspect-auto md:min-h-64">
        <RecipeImage src={r.imageUrl} title={r.title} rounded="" className="absolute inset-0 h-full w-full" />
      </Link>
      <div className="flex flex-col justify-center gap-3 p-5 md:p-7">
        <p className="text-sm font-bold uppercase tracking-wider text-brand">Ce soir</p>
        <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">{r.title}</h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {r.time} min
          </span>
          <span>
            {eaters.length} personne{eaters.length > 1 ? "s" : ""}
            {slot.cookPortions > slot.portions + 0.01 && (
              <b className="text-info"> · cuisiner {fr(slot.cookPortions)} portions (restes pour demain)</b>
            )}
          </span>
        </div>
        <div className="flex -space-x-2">
          {eaters.map((m) => (
            <span key={m.id} title={m.name} className="rounded-full ring-2 ring-surface">
              <Avatar name={m.name} index={m.color} size={34} />
            </span>
          ))}
        </div>
        {slot.conflicts.length > 0 && <ConflictNote conflicts={slot.conflicts} />}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href={`/recettes/${r.id}?repas=${slot.mealId}`} className="btn-primary">
            Voir la recette
          </Link>
          <button className="btn-ghost" onClick={() => run(() => rerollMeal(day.date, "DINNER"))}>
            <Dices size={16} /> Autre idée
          </button>
        </div>
      </div>
    </section>
  );
}

function NutritionBar({ n }: { n: NonNullable<DayView["nutrition"]> }) {
  const pct = n.target ? Math.min(100, (n.kcal / n.target) * 100) : 0;
  const over = n.target ? n.kcal > n.target * 1.05 : false;
  return (
    <div className="px-4 pb-2" title={`Protéines ${fr(n.protein)} g · Glucides ${fr(n.carbs)} g · Lipides ${fr(n.fat)} g`}>
      <div className="flex justify-between text-[11px] font-semibold text-muted">
        <span>
          {Math.round(n.kcal)}
          {n.target ? ` / ${n.target}` : ""} kcal
        </span>
        <span>
          P {Math.round(n.protein)} · G {Math.round(n.carbs)} · L {Math.round(n.fat)}
        </span>
      </div>
      {n.target ? (
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
          <div className={`h-full rounded-full ${over ? "bg-warn" : "bg-ok"}`} style={{ width: `${pct}%` }} />
        </div>
      ) : null}
    </div>
  );
}

function ConflictNote({ conflicts }: { conflicts: Conflict[] }) {
  return (
    <p className="flex items-start gap-1.5 rounded-xl bg-bad-soft px-2.5 py-1.5 text-xs font-semibold text-bad">
      <AlertTriangle size={14} className="mt-px flex-none" />
      <span>{conflicts.map((c) => `${c.member} : ${c.kind === "allergie" ? `allergie ${c.label}` : c.label}`).join(" · ")}</span>
    </p>
  );
}

const STATUS_CYCLE: Record<MealType, PresenceStatus[]> = {
  LUNCH: ["HOME", "OFFICE", "AWAY"],
  DINNER: ["HOME", "AWAY"],
};
const STATUS_TEXT: Record<PresenceStatus, string> = { HOME: "à la maison", OFFICE: "gamelle (restes)", AWAY: "absent" };

function MealRow({
  date,
  slot,
  mainUser,
  run,
  onPick,
  onDragStart,
  onDrop,
}: {
  date: string;
  slot: SlotView;
  mainUser: MainUser;
  run: Run;
  onPick: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}) {
  const [over, setOver] = useState(false);
  const [menu, setMenu] = useState(false);
  const eaters = slot.members.filter((m) => m.status === "HOME" || (slot.type === "LUNCH" && m.status === "OFFICE"));
  const r = slot.recipe;
  const href = r ? `/recettes/${r.id}${slot.mealId ? `?repas=${slot.mealId}` : ""}` : "";

  const cycle = (m: SlotView["members"][number]) => {
    const order = STATUS_CYCLE[slot.type];
    const nextStatus = order[(order.indexOf(m.status) + 1) % order.length];
    run(() => setPresenceOverride(m.id, date, slot.type, nextStatus));
  };

  return (
    <div
      className={`relative flex gap-3 px-4 py-3 transition ${over ? "bg-brand-soft" : ""}`}
      draggable={!!r}
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
      {r ? (
        <Link href={href} className="relative flex-none">
          <RecipeImage src={r.imageUrl} title={r.title} className="h-20 w-20" />
          {slot.isLeftover && (
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-info text-white ring-2 ring-surface" title="Restes d'hier soir">
              <Recycle size={13} />
            </span>
          )}
        </Link>
      ) : (
        <button
          onClick={onPick}
          className="grid h-20 w-20 flex-none place-items-center rounded-2xl border-2 border-dashed border-line text-muted hover:border-brand hover:text-brand"
          aria-label="Choisir une recette"
        >
          <Plus size={22} />
        </button>
      )}

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
          {MEAL_LABEL[slot.type]}
          {slot.isLeftover && <span className="normal-case tracking-normal text-info">· restes d&apos;hier soir</span>}
          {slot.isLocked && <Lock size={11} className="text-warn" aria-label="Verrouillé" />}
        </div>
        {r ? (
          <Link href={href} className="line-clamp-2 font-bold leading-snug hover:text-brand">
            {r.title}
          </Link>
        ) : (
          <p className="text-sm text-muted">{eaters.length ? "Rien de prévu" : "Personne à la maison"}</p>
        )}
        {r && (
          <p className="flex flex-wrap gap-x-2 text-xs text-muted">
            {!slot.isLeftover && <span>{r.time} min</span>}
            {slot.hasLeftovers && slot.cookPortions > slot.portions + 0.01 && (
              <b className="text-info">cuisiner {fr(slot.cookPortions)} portions</b>
            )}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1">
          {slot.members.map((m) => (
            <button
              key={m.id}
              onClick={() => cycle(m)}
              onContextMenu={(e) => {
                if (!m.overridden) return;
                e.preventDefault();
                run(() => setPresenceOverride(m.id, date, slot.type, null));
              }}
              title={`${m.name} : ${STATUS_TEXT[m.status]}${m.overridden ? " (exception ce jour-là, clic droit pour annuler)" : ""} — toucher pour changer`}
              className={`relative rounded-full ${m.overridden ? "ring-2 ring-warn ring-offset-1 ring-offset-surface" : ""}`}
            >
              <Avatar name={m.name} index={m.color} size={26} dim={m.status === "AWAY"} />
              {m.status === "OFFICE" && (
                <span className="absolute -bottom-1 -right-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-info text-white">
                  <Briefcase size={8} />
                </span>
              )}
            </button>
          ))}
        </div>
        {slot.conflicts.length > 0 && <ConflictNote conflicts={slot.conflicts} />}
      </div>

      <div className="flex flex-none flex-col items-center gap-1">
        {eaters.length > 0 && (
          <button className="btn-icon" title="Autre idée" onClick={() => run(() => rerollMeal(date, slot.type))}>
            <Dices size={17} />
          </button>
        )}
        <button className="btn-icon" title="Plus d'options" onClick={() => setMenu((v) => !v)} aria-expanded={menu}>
          <MoreHorizontal size={17} />
        </button>
      </div>

      {menu && (
        <>
          <button className="fixed inset-0 z-30 cursor-default" aria-label="Fermer le menu" onClick={() => setMenu(false)} />
          <div className="absolute right-3 top-14 z-40 w-64 space-y-0.5 rounded-2xl border border-line bg-surface p-1.5 text-sm shadow-xl">
            <MenuItem icon={<Search size={16} />} onClick={() => (setMenu(false), onPick())}>
              Choisir une recette
            </MenuItem>
            {slot.mealId && (
              <MenuItem
                icon={slot.isLocked ? <LockOpen size={16} /> : <Lock size={16} />}
                onClick={() => (setMenu(false), run(() => toggleLock(slot.mealId!)))}
              >
                {slot.isLocked ? "Déverrouiller" : "Garder ce repas (verrouiller)"}
              </MenuItem>
            )}
            {slot.type === "LUNCH" && slot.canUseLeftover && (
              <MenuItem icon={<Recycle size={16} />} onClick={() => (setMenu(false), run(() => setLeftover(date, !slot.isLeftover)))}>
                {slot.isLeftover ? "Ne plus manger les restes" : "Manger les restes d'hier soir"}
              </MenuItem>
            )}
            {mainUser && r && slot.mealId && eaters.some((m) => m.id === mainUser.id) && (
              <div className="px-3 py-2">
                <p className="mb-1 text-xs font-semibold text-muted">Ma portion (≈ {Math.round(r.kcal * (slot.mainPortion ?? mainUser.multiplier))} kcal)</p>
                <div className="flex gap-1">
                  {[null, 0.5, 0.75, 1.25].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => run(() => setMainPortion(slot.mealId!, v))}
                      className={`flex-1 rounded-lg py-1 text-xs font-bold ${
                        (slot.mainPortion ?? null) === v ? "bg-brand text-brand-ink" : "bg-surface-2"
                      }`}
                    >
                      {v == null ? "Normale" : `×${v}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {slot.mealId && (
              <MenuItem icon={<Trash2 size={16} />} onClick={() => (setMenu(false), run(() => setMealRecipe(date, slot.type, null)))}>
                Retirer ce repas
              </MenuItem>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ icon, onClick, children }: { icon: React.ReactNode; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-semibold hover:bg-surface-2">
      <span className="text-muted">{icon}</span>
      {children}
    </button>
  );
}

function Legend() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
      <span>Touchez un prénom pour dire qui mange ce repas-là (à la maison → gamelle → absent).</span>
      <span className="inline-flex items-center gap-1">
        <Briefcase size={12} className="text-info" /> gamelle = mange les restes
      </span>
      <span className="hidden md:inline">Glissez un repas sur un autre pour les échanger.</span>
    </p>
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
      .sort(
        (a, b) =>
          a.blockedFor.length - b.blockedFor.length ||
          Number(b.isFavorite) - Number(a.isFavorite) ||
          a.title.localeCompare(b.title, "fr"),
      );
  }, [q, recipes]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-t-3xl bg-surface shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line p-4">
          <Search size={18} className="text-muted" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-base outline-none"
            placeholder="Rechercher une recette…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-icon" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3">
          {list.map((r) => (
            <li key={r.id}>
              <button className="group w-full text-left" onClick={() => onPick(r.id)}>
                <div className="relative">
                  <RecipeImage src={r.imageUrl} title={r.title} className="aspect-[4/3] w-full transition group-hover:brightness-95" />
                  {r.isFavorite && (
                    <Star size={18} className="absolute right-2 top-2 text-warn drop-shadow" fill="currentColor" />
                  )}
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug">{r.title}</p>
                <p className="text-xs text-muted">{r.time} min</p>
                {r.blockedFor.length > 0 && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-bad">
                    <AlertTriangle size={12} /> Pas pour {r.blockedFor.join(", ")}
                  </p>
                )}
              </button>
            </li>
          ))}
          {!list.length && <li className="col-span-full p-6 text-center text-sm text-muted">Aucune recette</li>}
        </ul>
      </div>
    </div>
  );
}
