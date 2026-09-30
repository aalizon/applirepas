"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check, ClipboardCopy, Plus, RotateCcw, Trash2 } from "lucide-react";
import { addManualItem, deleteManualItem, resetShopping, toggleManualItem, toggleShoppingCheck } from "@/app/actions";

type Item = { key: string; name: string; qty: string; recipes?: string[] };
type Manual = { id: string; label: string; category: string; checked: boolean };

export function ShoppingView({
  week,
  categories,
  pantry,
  checked,
  manual,
  allCategories,
  mealsCount,
}: {
  week: string;
  categories: { name: string; items: Item[] }[];
  pantry: Item[];
  checked: string[];
  manual: Manual[];
  allCategories: string[];
  mealsCount: number;
}) {
  const [, start] = useTransition();
  const [checkedSet, setChecked] = useOptimistic(new Set(checked), (s, { key, on }: { key: string; on: boolean }) => {
    const n = new Set(s);
    if (on) n.add(key);
    else n.delete(key);
    return n;
  });
  const [manualState, setManual] = useOptimistic(manual, (s, { id, on }: { id: string; on: boolean }) =>
    s.map((m) => (m.id === id ? { ...m, checked: on } : m)),
  );
  const [hideDone, setHideDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggle = (key: string) =>
    start(async () => {
      const on = !checkedSet.has(key);
      setChecked({ key, on });
      await toggleShoppingCheck(week, key, on);
    });
  const toggleM = (m: Manual) =>
    start(async () => {
      setManual({ id: m.id, on: !m.checked });
      await toggleManualItem(m.id, !m.checked);
    });

  // Fusion : articles générés + manuels, par rayon
  const names = new Set([...categories.map((c) => c.name), ...manualState.map((m) => m.category)]);
  const sections = [...names]
    .sort((a, b) => allCategories.indexOf(a) - allCategories.indexOf(b))
    .map((name) => ({
      name,
      items: categories.find((c) => c.name === name)?.items ?? [],
      manual: manualState.filter((m) => m.category === name),
    }));
  const total = categories.reduce((s, c) => s + c.items.length, 0) + manualState.length;
  const done =
    categories.reduce((s, c) => s + c.items.filter((i) => checkedSet.has(i.key)).length, 0) +
    manualState.filter((m) => m.checked).length;

  const copy = async () => {
    const text = sections
      .map(
        (s) =>
          `${s.name.toUpperCase()}\n` +
          [
            ...s.items.filter((i) => !checkedSet.has(i.key)).map((i) => `- ${i.qty} ${i.name}`),
            ...s.manual.filter((m) => !m.checked).map((m) => `- ${m.label}`),
          ].join("\n"),
      )
      .filter((s) => s.includes("\n-"))
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-3 p-3">
        <div className="flex-1">
          <div className="text-sm font-bold">
            {done} / {total} articles
          </div>
          <div className="text-xs text-muted">{mealsCount} repas à cuisiner cette semaine</div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-ok" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} /> Masquer le panier
        </label>
        <button className="btn-ghost" onClick={copy}>
          <ClipboardCopy size={16} /> {copied ? "Copié !" : "Copier"}
        </button>
        <button className="btn-icon" title="Tout décocher" onClick={() => confirm("Tout décocher ?") && start(() => resetShopping(week))}>
          <RotateCcw size={16} />
        </button>
      </div>

      <form
        action={(fd) => start(() => addManualItem(week, fd))}
        className="flex flex-wrap gap-2"
        onSubmit={(e) => setTimeout(() => (e.target as HTMLFormElement).reset(), 0)}
      >
        <input name="label" className="input min-w-40 flex-1" placeholder="Ajouter un article (lessive, pain…)" required />
        <select name="category" className="input w-auto" defaultValue="Divers">
          {allCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="btn-primary">
          <Plus size={16} />
        </button>
      </form>

      {!total && <p className="card p-6 text-center text-muted">Rien à acheter : planifiez des repas pour générer la liste.</p>}

      {sections.map((s) => {
        const items = s.items.filter((i) => !hideDone || !checkedSet.has(i.key));
        const man = s.manual.filter((m) => !hideDone || !m.checked);
        if (!items.length && !man.length) return null;
        return (
          <section key={s.name} className="card overflow-hidden">
            <h2 className="bg-surface-2 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-muted">{s.name}</h2>
            <ul className="divide-y divide-line">
              {items.map((i) => {
                const on = checkedSet.has(i.key);
                return (
                  <li key={i.key}>
                    <button onClick={() => toggle(i.key)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                      <Box on={on} />
                      <span className={`flex-1 ${on ? "text-muted line-through" : ""}`}>
                        <b>{i.qty}</b> {i.name}
                        {i.recipes && <span className="block text-xs text-muted">{i.recipes.join(" · ")}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
              {man.map((m) => (
                <li key={m.id} className="flex items-center">
                  <button onClick={() => toggleM(m)} className="flex flex-1 items-center gap-3 px-4 py-3 text-left">
                    <Box on={m.checked} />
                    <span className={m.checked ? "text-muted line-through" : ""}>{m.label}</span>
                  </button>
                  <button className="btn-icon mr-2" onClick={() => start(() => deleteManualItem(m.id))}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {pantry.length > 0 && (
        <details className="card p-4">
          <summary className="cursor-pointer text-sm font-bold">Vérifier dans le placard ({pantry.length})</summary>
          <ul className="mt-2 space-y-1 text-sm">
            {pantry.map((p) => (
              <li key={p.key}>
                <button onClick={() => toggle(p.key)} className="flex items-center gap-2">
                  <Box on={checkedSet.has(p.key)} />
                  <span className={checkedSet.has(p.key) ? "text-muted line-through" : ""}>
                    {p.qty} {p.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">Ces produits sont marqués « placard » (Réglages → Ingrédients).</p>
        </details>
      )}
    </div>
  );
}

function Box({ on }: { on: boolean }) {
  return (
    <span className={`grid h-6 w-6 flex-none place-items-center rounded-md border-2 ${on ? "border-ok bg-ok text-white" : "border-line"}`}>
      {on && <Check size={14} />}
    </span>
  );
}
