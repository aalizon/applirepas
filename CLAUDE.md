@AGENTS.md

# AppliRepas — notes pour Claude

- Langue de l'interface, des commentaires et de la doc : **français**.
- Base : `node:sqlite` + Drizzle (pilote `sqlite-proxy`, voir `src/db/index.ts`). Pas de module natif :
  l'appli doit rester déployable sur o2switch (Passenger, Node ≥ 22.5).
- Toute la logique métier va dans `src/lib/planner.ts` (fonctions pures) avec tests dans `planner.test.ts`.
- Mutations : `src/app/actions.ts` (Server Actions, `assertAuth()` en tête de chaque action).
- Schéma modifié → `npm run db:generate` (migration SQL dans `drizzle/`, appliquée au démarrage).
- Quantités des recettes stockées **pour 1 portion adulte** (coefficient 1.0).
- Vérifications : `npm run lint && npm run typecheck && npm test && npm run build`.
