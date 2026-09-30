"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { saveNutrition, savePreferences } from "@/app/actions";
import type { Settings } from "@/db/schema";

function SaveButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button className="btn-primary" disabled={pending}>
      <Check size={16} /> {pending ? "Enregistrement…" : label}
    </button>
  );
}

export function PreferencesForm({ s, onSaved, submitLabel = "Enregistrer" }: { s: Settings; onSaved?: () => void; submitLabel?: string }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  return (
    <form
      action={(fd) =>
        start(async () => {
          await savePreferences(fd);
          setDone(true);
          onSaved?.();
        })
      }
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Temps max en semaine (min)</label>
          <input className="input" name="weekdayMaxTime" type="number" min={10} defaultValue={s.weekdayMaxTime} />
          <p className="mt-1 text-xs text-muted">Préparation + cuisson</p>
        </div>
        <div>
          <label className="label">Temps max le week-end (min)</label>
          <input className="input" name="weekendMaxTime" type="number" min={10} defaultValue={s.weekendMaxTime} />
        </div>
        <div>
          <label className="label">Ne pas répéter avant (semaines)</label>
          <input className="input" name="noRepeatWeeks" type="number" min={0} max={12} defaultValue={s.noRepeatWeeks} />
        </div>
      </div>
      <div>
        <label className="label">Restes du dîner pour le déjeuner du lendemain</label>
        <select className="input" name="leftoverStrategy" defaultValue={s.leftoverStrategy}>
          <option value="office">Seulement quand quelqu&apos;un emporte sa gamelle</option>
          <option value="always">Dès que quelqu&apos;un déjeune (maison ou gamelle)</option>
          <option value="never">Jamais</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <SaveButton pending={pending} label={submitLabel} />
        {done && !onSaved && <span className="text-sm text-muted">Enregistré ✓</span>}
      </div>
    </form>
  );
}

export function NutritionForm({ s, onSaved, submitLabel = "Enregistrer" }: { s: Settings; onSaved?: () => void; submitLabel?: string }) {
  const [enabled, setEnabled] = useState(s.nutritionEnabled);
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  return (
    <form
      action={(fd) =>
        start(async () => {
          await saveNutrition(fd);
          setDone(true);
          onSaved?.();
        })
      }
      className="space-y-4"
    >
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="nutritionEnabled"
          className="h-5 w-5 accent-[var(--brand)]"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="font-semibold">Activer le rééquilibrage alimentaire</span>
      </label>
      <p className="text-sm text-muted">
        Calcule vos apports (utilisateur principal uniquement) et affiche une jauge par jour. Le reste de la famille n&apos;est
        pas concerné. Valeurs estimées d&apos;après la table Ciqual (ANSES).
      </p>
      {enabled && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Objectif kcal / jour</label>
            <input className="input" name="kcalTarget" type="number" placeholder="1800" defaultValue={s.kcalTarget ?? ""} />
          </div>
          <div>
            <label className="label">Petit-déj + collations (kcal)</label>
            <input className="input" name="extraKcal" type="number" placeholder="400" defaultValue={s.extraKcal || ""} />
            <p className="mt-1 text-xs text-muted">Forfait ajouté chaque jour à la jauge</p>
          </div>
          <div>
            <label className="label">Protéines (g)</label>
            <input className="input" name="proteinTarget" type="number" defaultValue={s.proteinTarget ?? ""} />
          </div>
          <div>
            <label className="label">Glucides (g)</label>
            <input className="input" name="carbsTarget" type="number" defaultValue={s.carbsTarget ?? ""} />
          </div>
          <div>
            <label className="label">Lipides (g)</label>
            <input className="input" name="fatTarget" type="number" defaultValue={s.fatTarget ?? ""} />
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <SaveButton pending={pending} label={submitLabel} />
        {done && !onSaved && <span className="text-sm text-muted">Enregistré ✓</span>}
      </div>
    </form>
  );
}
