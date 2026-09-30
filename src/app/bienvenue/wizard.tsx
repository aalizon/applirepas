"use client";

import { useState, useTransition } from "react";
import { ChefHat, Sparkles, UtensilsCrossed } from "lucide-react";
import { finishOnboarding, type MemberInput } from "@/app/actions";
import { HouseholdEditor } from "@/components/household-editor";
import { NutritionForm, PreferencesForm } from "@/components/settings-forms";
import type { Settings } from "@/db/schema";

const STEPS = ["Le foyer", "Vos habitudes", "Nutrition", "C'est parti"];

export function Wizard({ settings, household }: { settings: Settings; household: MemberInput[] }) {
  const [step, setStep] = useState(0);
  const [pending, start] = useTransition();

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-brand-ink">
          <UtensilsCrossed />
        </span>
        <div>
          <h1 className="h1">Bienvenue dans AppliRepas</h1>
          <p className="text-muted">Quelques réglages pour des menus vraiment adaptés à votre famille.</p>
        </div>
      </div>

      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`w-full rounded-xl px-2 py-2 text-xs font-bold ${
                i === step ? "bg-brand text-brand-ink" : i < step ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted"
              }`}
            >
              {i + 1}. {s}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="space-y-3">
          <h2 className="h2">Qui compose le foyer, et qui mange quand ?</h2>
          <p className="text-sm text-muted">
            Pour chaque personne, indiquez les repas pris à la maison, ceux où elle <b>emporte une gamelle</b> (elle mangera
            les restes du dîner de la veille) et ceux où elle est <b>absente</b> (cantine, restaurant…). Tout reste modifiable
            ensuite dans les réglages, et au cas par cas dans le planning.
          </p>
          <HouseholdEditor initial={household} onSaved={() => setStep(1)} submitLabel="Continuer" />
        </section>
      )}

      {step === 1 && (
        <section className="card space-y-3 p-5">
          <h2 className="h2">Vos habitudes en cuisine</h2>
          <PreferencesForm s={settings} onSaved={() => setStep(2)} submitLabel="Continuer" />
        </section>
      )}

      {step === 2 && (
        <section className="card space-y-3 p-5">
          <h2 className="h2">Rééquilibrage alimentaire (optionnel)</h2>
          <NutritionForm s={settings} onSaved={() => setStep(3)} submitLabel="Continuer" />
        </section>
      )}

      {step === 3 && (
        <section className="card space-y-4 p-6 text-center">
          <ChefHat className="mx-auto text-brand" size={48} />
          <h2 className="h2">Tout est prêt !</h2>
          <p className="text-muted">
            AppliRepas va vous proposer les repas de cette semaine à partir de sa bibliothèque de recettes. Vous pourrez
            changer, verrouiller ou relancer chaque repas, et importer vos recettes préférées depuis n&apos;importe quel site
            de cuisine.
          </p>
          <button className="btn-primary mx-auto" disabled={pending} onClick={() => start(() => finishOnboarding())}>
            <Sparkles size={16} /> {pending ? "Préparation des menus…" : "Proposer mes menus de la semaine"}
          </button>
        </section>
      )}
    </div>
  );
}
