import Link from "next/link";
import { Carrot, LogOut } from "lucide-react";
import { logout } from "@/app/actions";
import { authEnabled } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { getHouseholdInput } from "@/lib/household-input";
import { HouseholdEditor } from "@/components/household-editor";
import { NutritionForm, PreferencesForm } from "@/components/settings-forms";

export const dynamic = "force-dynamic";

export default async function Reglages() {
  const [settings, household] = await Promise.all([getSettings(), getHouseholdInput()]);
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="h1 mr-auto">Réglages</h1>
        <Link href="/reglages/ingredients" className="btn-ghost">
          <Carrot size={16} /> Ingrédients & rayons
        </Link>
        {authEnabled() && (
          <form action={logout}>
            <button className="btn-ghost">
              <LogOut size={16} /> Déconnexion
            </button>
          </form>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="h2">Le foyer : qui mange quand ?</h2>
        <p className="text-sm text-muted">
          Planning type de la semaine. Pour une exception (sortie, congés…), touchez directement le prénom dans le planning.
        </p>
        <HouseholdEditor initial={household} />
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="h2">Habitudes & propositions</h2>
        <PreferencesForm s={settings} />
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="h2">Rééquilibrage alimentaire</h2>
        <NutritionForm s={settings} />
      </section>
    </div>
  );
}
