# AppliRepas

Planificateur de repas **sur mesure** pour la famille : propositions de menus adaptés à
« qui mange quand », restes du dîner pour le déjeuner du lendemain (*cook once, eat twice*),
liste de courses par rayon et suivi nutritionnel optionnel pour l'utilisateur principal.

Cahier des charges d'origine : [`docs/cahier-des-charges-v2.md`](docs/cahier-des-charges-v2.md).

## Fonctionnalités

| | |
|---|---|
| **Assistant de démarrage** | Composition du foyer (coefficient de portion par personne : adulte, ado, enfant…), **planning type « Qui mange quand ? »** par personne, jour et repas : 🏠 maison · 💼 gamelle (mange les restes) · ✖ absent/cantine. Modèles rapides (écolier, bureau…), aliments refusés, aperçu des portions. Tout est modifiable dans **Réglages**. |
| **Exceptions ponctuelles** | Dans le planning, un clic sur un prénom change sa présence **pour ce repas uniquement** (clic droit : retour au planning type). |
| **Moteur de proposition** | Génère la semaine selon : présences, temps max semaine / week-end, saison, non-répétition sur N semaines, variété des protéines, favoris et notes, aliments refusés, recettes « réchauffables » quand un reste est nécessaire, cible calorique si activée. |
| **Planning** | Relancer 🎲, choisir 🔍, verrouiller 🔒 (conservé lors d'une nouvelle proposition), glisser-déposer pour échanger deux repas, activer/désactiver les restes du midi. |
| **Restes** | Les jours où quelqu'un emporte sa gamelle, le déjeuner = dîner de la veille ; la veille, l'appli indique « cuisiner X portions ». |
| **Recettes** | 35 recettes familiales de départ, **import depuis une URL** (Marmiton, 750g, Cuisine AZ, Jow, Ricardo… via les données schema.org), création/édition, favoris, notes, exclusion. Quantités recalculées pour le repas. **Mode cuisine** plein écran, étape par étape, écran maintenu allumé (Wake Lock). |
| **Courses** | Agrégation de la semaine, conversions d'unités, arrondis « achat » (pièces entières), tri par rayon, produits du placard à part, articles manuels, cases cochées synchronisées entre appareils, copie texte, consultation **hors ligne** (PWA). |
| **Rééquilibrage** | Optionnel : objectif kcal/macros, forfait petit-déjeuner, jauge par jour, portion ajustable par repas. Calculé **depuis les ingrédients** (valeurs Ciqual/ANSES) et uniquement pour l'utilisateur principal. |
| **Accès** | Mot de passe familial (`APP_PASSWORD`), installable sur l'écran d'accueil du téléphone. |

## D'où viennent les recettes ?

1. **Bibliothèque de départ** (`src/db/seed-data.ts`) : 35 recettes familiales originales
   (quantités pour 1 portion adulte) et ~95 ingrédients avec valeurs nutritionnelles arrondies
   d'après la [table Ciqual de l'ANSES](https://ciqual.anses.fr/).
2. **Import par URL** : la plupart des sites de cuisine publient leurs recettes au format
   structuré [schema.org/Recipe](https://schema.org/Recipe) (pour Google). L'appli lit ces
   données, convertit les quantités en portion adulte, relie les ingrédients à la base et crée
   les nouveaux (à compléter dans *Réglages → Ingrédients*). Usage personnel uniquement.
3. **Saisie manuelle** (recettes de famille, carnet perso).
4. *Plus tard (option IA)* : import depuis une photo ou un texte libre, suggestions.

## Choix techniques

- **Next.js 16** (App Router, Server Actions) + TypeScript + Tailwind CSS 4.
- **SQLite via `node:sqlite`** (module intégré à Node ≥ 22.5) + **Drizzle ORM** — écart
  volontaire avec Prisma du cahier des charges : aucun binaire natif à compiler ni à télécharger,
  ce qui rend le déploiement sur l'hébergement mutualisé **o2switch** fiable.
- Logique métier pure et testée dans `src/lib/planner.ts` (présences, portions, restes,
  nutrition, courses, moteur de proposition).
- Migrations appliquées et données de départ chargées automatiquement au démarrage.

## Développement

```bash
npm install
npm run dev           # http://localhost:3000 (base dans ./data/)
npm test              # tests unitaires (vitest)
npm run lint && npm run typecheck
npm run db:generate   # après modification de src/db/schema.ts
```

## Déploiement

- **o2switch** : voir [`docs/DEPLOIEMENT_O2SWITCH.md`](docs/DEPLOIEMENT_O2SWITCH.md)
  (`npm run package` ou artefact GitHub Actions).
- **Docker** (NAS, Raspberry Pi…) : `docker compose up -d`.

## Structure

```
src/
  app/            pages (planning, recettes, courses, réglages, bienvenue, connexion) + actions.ts
  components/     composants d'interface (éditeur du foyer, planning, courses…)
  db/             schéma Drizzle, connexion node:sqlite, données de départ
  lib/            planner.ts (logique métier), recipe-import.ts, dates.ts, data.ts, auth.ts
drizzle/          migrations SQL
scripts/          package.mjs (paquet de déploiement)
```

## Pistes suivantes

- Option IA (clé API) : import photo/texte, estimation nutritionnelle, suggestions « frigo vide ».
- Intégration Home Assistant (menu du jour, liste de courses → liste To-do).
- Import complet de la table Ciqual, ordre des rayons par magasin, historique et statistiques.
