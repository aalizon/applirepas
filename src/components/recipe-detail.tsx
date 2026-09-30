"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChefHat, ChevronLeft, ChevronRight, Minus, Plus, Star, X } from "lucide-react";
import { setRating, toggleFavorite } from "@/app/actions";
import { formatQuantity, type Macros } from "@/lib/planner";

type Props = {
  recipe: {
    id: string;
    title: string;
    isFavorite: boolean;
    rating: number | null;
    steps: string[];
    ingredients: { name: string; unit: string; quantity: number; note: string; isPantry: boolean }[];
  };
  initialPortions: number;
  context: string;
  macros: Macros;
  showNutrition: boolean;
  missingNutrition: string[];
};

const fr = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

export function RecipeDetail({ recipe, initialPortions, context, macros, showNutrition, missingNutrition }: Props) {
  const [portions, setPortions] = useState(initialPortions);
  const [cooking, setCooking] = useState(false);
  const [, start] = useTransition();

  const lines = recipe.ingredients.map((i) => ({ ...i, label: formatQuantity(i.quantity * portions, i.unit) }));

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" onClick={() => setCooking(true)}>
          <ChefHat size={16} /> Mode cuisine
        </button>
        <button className="btn-ghost" onClick={() => start(() => toggleFavorite(recipe.id))}>
          <Star size={16} className="text-warn" fill={recipe.isFavorite ? "currentColor" : "none"} />
          {recipe.isFavorite ? "Favori" : "Ajouter aux favoris"}
        </button>
        <div className="flex items-center gap-1" title="Votre note (influence les propositions)">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => start(() => setRating(recipe.id, recipe.rating === n ? null : n))} aria-label={`${n} étoiles`}>
              <Star size={20} className={n <= (recipe.rating ?? 0) ? "text-warn" : "text-line"} fill="currentColor" />
            </button>
          ))}
        </div>
      </div>

      <section className="card p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="h2 mr-auto">Ingrédients</h2>
          <div className="flex items-center gap-1 rounded-xl border border-line p-1">
            <button className="btn-icon" onClick={() => setPortions((p) => Math.max(0.5, p - 0.5))} aria-label="Moins">
              <Minus size={14} />
            </button>
            <span className="min-w-24 text-center text-sm font-bold">{fr(portions)} portion{portions > 1 ? "s" : ""}</span>
            <button className="btn-icon" onClick={() => setPortions((p) => p + 0.5)} aria-label="Plus">
              <Plus size={14} />
            </button>
          </div>
        </div>
        <p className="mb-3 text-xs text-muted">{context} · 1 portion = 1 adulte</p>
        <ul className="grid gap-x-6 sm:grid-cols-2">
          {lines.map((l, i) => (
            <li key={i} className="flex gap-2 border-b border-line py-1.5 text-sm last:border-0">
              <span className="w-20 flex-none text-right font-bold">{l.label}</span>
              <span className={l.isPantry ? "text-muted" : ""}>
                {l.name}
                {l.note && <span className="text-muted"> — {l.note}</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-4">
        <h2 className="h2 mb-3">Préparation</h2>
        <ol className="space-y-3">
          {recipe.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">{i + 1}</span>
              <p className="pt-0.5">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      {showNutrition && (
        <section className="card p-4">
          <h2 className="h2 mb-2">Valeurs nutritionnelles (1 portion adulte)</h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              ["kcal", macros.kcal],
              ["Protéines", macros.protein],
              ["Glucides", macros.carbs],
              ["Lipides", macros.fat],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl bg-surface-2 p-2">
                <div className="text-lg font-extrabold">{Math.round(v as number)}</div>
                <div className="text-xs text-muted">{k === "kcal" ? "kcal" : `${k} (g)`}</div>
              </div>
            ))}
          </div>
          {missingNutrition.length > 0 && (
            <p className="mt-2 text-xs text-warn">
              Valeurs manquantes pour : {missingNutrition.join(", ")} (à compléter dans Réglages → Ingrédients).
            </p>
          )}
        </section>
      )}

      {cooking && <CookingMode title={recipe.title} steps={recipe.steps} lines={lines} onClose={() => setCooking(false)} />}
    </>
  );
}

/** Mode cuisine : grand texte, étape par étape, écran maintenu allumé (Wake Lock API). */
function CookingMode({
  title,
  steps,
  lines,
  onClose,
}: {
  title: string;
  steps: string[];
  lines: { name: string; label: string; note: string }[];
  onClose: () => void;
}) {
  const [step, setStep] = useState(-1); // -1 = ingrédients
  const [wake, setWake] = useState<"on" | "off" | "unsupported">("off");
  const lock = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    let cancelled = false;
    const request = async () => {
      if (!("wakeLock" in navigator)) return setWake("unsupported");
      try {
        lock.current = await navigator.wakeLock.request("screen");
        if (!cancelled) setWake("on");
        lock.current.addEventListener("release", () => !cancelled && setWake("off"));
      } catch {
        setWake("off");
      }
    };
    request();
    const onVisible = () => document.visibilityState === "visible" && request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock.current?.release().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <ChefHat className="text-brand" />
        <h2 className="flex-1 truncate font-extrabold">{title}</h2>
        <span className="text-xs text-muted">
          {wake === "on" ? "Écran maintenu allumé" : wake === "unsupported" ? "Veille non bloquée (navigateur)" : ""}
        </span>
        <button className="btn-icon" onClick={onClose} aria-label="Fermer">
          <X />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {step === -1 ? (
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-4 text-2xl font-extrabold">Ingrédients</h3>
            <ul className="space-y-2 text-xl">
              {lines.map((l, i) => (
                <li key={i}>
                  <b>{l.label}</b> {l.name}
                  {l.note && <span className="text-muted"> — {l.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">
              Étape {step + 1} / {steps.length}
            </p>
            <p className="text-3xl font-semibold leading-snug">{steps[step]}</p>
          </div>
        )}
      </div>
      <footer className="flex gap-3 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button className="btn-ghost flex-1 py-4 text-base" disabled={step === -1} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft /> Précédent
        </button>
        {step < steps.length - 1 ? (
          <button className="btn-primary flex-1 py-4 text-base" onClick={() => setStep((s) => s + 1)}>
            {step === -1 ? "Commencer" : "Suivant"} <ChevronRight />
          </button>
        ) : (
          <button className="btn-primary flex-1 py-4 text-base" onClick={onClose}>
            Bon appétit !
          </button>
        )}
      </footer>
    </div>
  );
}
