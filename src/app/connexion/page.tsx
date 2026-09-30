"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { UtensilsCrossed } from "lucide-react";
import { login } from "@/app/actions";

function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const next = useSearchParams().get("next") ?? "/";
  return (
    <form action={action} className="card mx-auto mt-16 max-w-sm space-y-4 p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-brand-ink">
          <UtensilsCrossed size={20} />
        </span>
        <h1 className="text-xl font-extrabold">AppliRepas</h1>
      </div>
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="label" htmlFor="password">
          Mot de passe familial
        </label>
        <input id="password" name="password" type="password" className="input" autoFocus required />
      </div>
      {state?.error && <p className="text-sm text-warn">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending}>
        {pending ? "Connexion…" : "Entrer"}
      </button>
    </form>
  );
}

export default function Connexion() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
