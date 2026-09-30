"use client";

import { useState, useTransition } from "react";
import { Briefcase, Check, Home, Plus, Star, Trash2, X } from "lucide-react";
import { saveHousehold, type MemberInput } from "@/app/actions";
import { WEEKDAY_SHORT } from "@/lib/dates";
import type { PresenceStatus } from "@/lib/planner";

export const PROFILES = [
  { label: "Adulte", value: 1 },
  { label: "Grand appétit", value: 1.3 },
  { label: "Ado", value: 1.2 },
  { label: "Enfant 7-12 ans", value: 0.7 },
  { label: "Enfant 3-6 ans", value: 0.5 },
];

const STATUS_UI: Record<PresenceStatus, { label: string; icon: typeof Home; cls: string }> = {
  HOME: { label: "Maison", icon: Home, cls: "bg-ok-soft text-ok" },
  OFFICE: { label: "Gamelle (restes)", icon: Briefcase, cls: "bg-info-soft text-info" },
  AWAY: { label: "Absent / cantine", icon: X, cls: "bg-surface-2 text-muted" },
};

const PRESETS: { label: string; apply: () => Record<string, PresenceStatus> }[] = [
  { label: "Toujours à la maison", apply: () => ({}) },
  {
    label: "Écolier (cantine sauf mercredi)",
    apply: () => Object.fromEntries([1, 2, 4, 5].map((d) => [`${d}-LUNCH`, "AWAY" as PresenceStatus])),
  },
  {
    label: "Bureau du lundi au vendredi (gamelle)",
    apply: () => Object.fromEntries([1, 2, 3, 4, 5].map((d) => [`${d}-LUNCH`, "OFFICE" as PresenceStatus])),
  },
  {
    label: "Bureau lun-ven (cantine / resto)",
    apply: () => Object.fromEntries([1, 2, 3, 4, 5].map((d) => [`${d}-LUNCH`, "AWAY" as PresenceStatus])),
  },
];

function nextStatus(s: PresenceStatus, meal: "LUNCH" | "DINNER"): PresenceStatus {
  if (meal === "DINNER") return s === "HOME" ? "AWAY" : "HOME";
  return s === "HOME" ? "OFFICE" : s === "OFFICE" ? "AWAY" : "HOME";
}

export function HouseholdEditor({
  initial,
  onSaved,
  submitLabel = "Enregistrer",
}: {
  initial: MemberInput[];
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const [list, setList] = useState<MemberInput[]>(
    initial.length
      ? initial
      : [{ name: "", multiplier: 1, isMainUser: true, isActive: true, dislikes: "", presence: {} }],
  );
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const update = (i: number, patch: Partial<MemberInput>) =>
    setList((l) => l.map((m, j) => (j === i ? { ...m, ...patch } : patch.isMainUser ? { ...m, isMainUser: false } : m)));

  const status = (m: MemberInput, d: number, t: "LUNCH" | "DINNER"): PresenceStatus => m.presence[`${d}-${t}`] ?? "HOME";

  const save = () =>
    start(async () => {
      const res = await saveHousehold(list);
      if (res && "error" in res) setMsg(res.error ?? null);
      else {
        setMsg("Enregistré ✓");
        onSaved?.();
      }
    });

  // Aperçu : portions par repas
  const summary = [1, 2, 3, 4, 5, 6, 7].map((d) =>
    (["LUNCH", "DINNER"] as const).map((t) => {
      const eaters = list.filter(
        (m) => m.isActive && m.name.trim() && (status(m, d, t) === "HOME" || (t === "LUNCH" && status(m, d, t) === "OFFICE")),
      );
      return { n: eaters.length, portions: eaters.reduce((s, m) => s + Number(m.multiplier || 0), 0) };
    }),
  );

  return (
    <div className="space-y-4">
      {list.map((m, i) => (
        <div key={i} className="card space-y-4 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-40 flex-1">
              <label className="label">Prénom</label>
              <input className="input" value={m.name} placeholder="ex : Isabelle" onChange={(e) => update(i, { name: e.target.value })} />
            </div>
            <div className="w-44">
              <label className="label">Profil (portion)</label>
              <select
                className="input"
                value={PROFILES.some((p) => p.value === m.multiplier) ? m.multiplier : "custom"}
                onChange={(e) => e.target.value !== "custom" && update(i, { multiplier: Number(e.target.value) })}
              >
                {PROFILES.map((p) => (
                  <option key={p.label} value={p.value}>
                    {p.label} (×{p.value})
                  </option>
                ))}
                <option value="custom">Personnalisé</option>
              </select>
            </div>
            <div className="w-24">
              <label className="label">Coef.</label>
              <input
                className="input"
                type="number"
                step="0.1"
                min="0.1"
                max="3"
                value={m.multiplier}
                onChange={(e) => update(i, { multiplier: Number(e.target.value) })}
              />
            </div>
            <button
              type="button"
              onClick={() => update(i, { isMainUser: true })}
              className={`btn ${m.isMainUser ? "bg-warn-soft text-warn" : "btn-ghost"}`}
              title="Utilisateur principal : c'est pour lui que la jauge nutrition est calculée"
            >
              <Star size={16} fill={m.isMainUser ? "currentColor" : "none"} /> Principal
            </button>
            <button type="button" className="btn-icon" title="Retirer" onClick={() => setList((l) => l.filter((_, j) => j !== i))}>
              <Trash2 size={16} />
            </button>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="label mb-0">Qui mange quand ?</span>
              <select
                className="input w-auto py-1 text-xs"
                value=""
                onChange={(e) => {
                  const p = PRESETS[Number(e.target.value)];
                  if (p) update(i, { presence: p.apply() });
                }}
              >
                <option value="">Modèle rapide…</option>
                {PRESETS.map((p, k) => (
                  <option key={p.label} value={k}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-separate border-spacing-1 text-xs">
                <thead>
                  <tr>
                    <th />
                    {WEEKDAY_SHORT.map((d) => (
                      <th key={d} className="font-semibold text-muted">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(["LUNCH", "DINNER"] as const).map((t) => (
                    <tr key={t}>
                      <th className="pr-2 text-left font-semibold text-muted">{t === "LUNCH" ? "Midi" : "Soir"}</th>
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                        const s = status(m, d, t);
                        const ui = STATUS_UI[s];
                        return (
                          <td key={d}>
                            <button
                              type="button"
                              title={ui.label}
                              onClick={() => update(i, { presence: { ...m.presence, [`${d}-${t}`]: nextStatus(s, t) } })}
                              className={`flex h-10 w-full items-center justify-center rounded-lg ${ui.cls}`}
                            >
                              <ui.icon size={16} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="label">N&apos;aime pas (mots-clés séparés par des virgules)</label>
            <input
              className="input"
              value={m.dislikes}
              placeholder="ex : champignon, poivron, saumon"
              onChange={(e) => update(i, { dislikes: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={m.isActive} onChange={(e) => update(i, { isActive: e.target.checked })} />
            Présent dans le foyer (décocher pendant une longue absence)
          </label>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        {Object.entries(STATUS_UI).map(([k, v]) => (
          <span key={k} className={`chip ${v.cls}`}>
            <v.icon size={12} /> {v.label}
          </span>
        ))}
        <span>Touchez une case pour changer.</span>
      </div>

      <div className="card p-4">
        <p className="label">Aperçu : portions à prévoir</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-center text-xs">
            <thead>
              <tr>
                <th />
                {WEEKDAY_SHORT.map((d) => (
                  <th key={d} className="py-1 text-muted">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["Midi", "Soir"] as const).map((label, k) => (
                <tr key={label}>
                  <th className="py-1 text-left text-muted">{label}</th>
                  {summary.map((day, d) => (
                    <td key={d} className="py-1">
                      {day[k].n ? (
                        <span className="font-bold">
                          {day[k].n} <span className="font-normal text-muted">({day[k].portions.toLocaleString("fr-FR")})</span>
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            setList((l) => [...l, { name: "", multiplier: 1, isMainUser: false, isActive: true, dislikes: "", presence: {} }])
          }
        >
          <Plus size={16} /> Ajouter une personne
        </button>
        <button type="button" className="btn-primary ml-auto" disabled={pending} onClick={save}>
          <Check size={16} /> {pending ? "Enregistrement…" : submitLabel}
        </button>
        {msg && <span className="text-sm text-muted">{msg}</span>}
      </div>
    </div>
  );
}
