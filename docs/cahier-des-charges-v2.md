# Product Requirements Document (PRD) : Personal Meal Planner App (avec Rééquilibrage)

## 1. Contexte et Objectifs du Projet
Développer une application web (PWA) de planification de repas et de listes de courses pour un usage familial, avec une double mission :
1. **Logistique :** Adapter les portions pour 4 personnes, gérer les jours de télétravail/présentiel, et automatiser le "Cook Once, Eat Twice" (restes pour le midi).
2. **Nutrition :** Intégrer une option de "Rééquilibrage Alimentaire" (suivi des calories/macros) pour l'utilisateur principal, sans imposer de régime au reste du foyer.

## 2. Stack Technique Recommandée
- **Frontend / Backend :** Next.js (App Router), React, TypeScript.
- **Styling :** Tailwind CSS + Shadcn/ui.
- **Base de données :** SQLite (auto-hébergement simple) avec Prisma ORM.
- **Déploiement :** Docker (Dockerfile et docker-compose.yml inclus).

## 3. Modèles de Données (Schéma Prisma mis à jour)

```prisma
model UserSettings {
  id                  String  @id @default(uuid())
  enableNutritionGoal Boolean @default(false) // Toggle pour activer le rééquilibrage
  dailyCaloriesTarget Int?    // ex: 1800 kcal
  proteinTarget       Int?    // en grammes
  carbsTarget         Int?    // en grammes
  fatsTarget          Int?    // en grammes
}

model FamilyMember {
  id          String  @id @default(uuid())
  name        String  // ex: Utilisateur, Isabelle, Louis, Manon
  multiplier  Float   // ex: Adulte = 1.0, Enfant = 0.5
  isMainUser  Boolean @default(false) // C'est pour lui qu'on calcule les macros si activé
  isActive    Boolean @default(true)
}

model Recipe {
  id            String             @id @default(uuid())
  title         String
  prepTime      Int                
  instructions  String             
  isBatchable   Boolean            
  ingredients   RecipeIngredient[]
  meals         Meal[]
  // Macros pour 1 portion standard (multiplier = 1.0)
  calories      Int     @default(0)
  proteins      Float   @default(0)
  carbs         Float   @default(0)
  fats          Float   @default(0)
}

model Ingredient {
  id          String             @id @default(uuid())
  name        String
  category    String             
  recipes     RecipeIngredient[]
}

model RecipeIngredient {
  id           String     @id @default(uuid())
  recipeId     String
  ingredientId String
  quantity     Float      // Quantité pour 1 portion (1.0)
  unit         String     
  isIndivisible Boolean   @default(false) 
  
  recipe       Recipe     @relation(fields: [recipeId], references: [id])
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
}

model MealPlan {
  id          String   @id @default(uuid())
  date        DateTime
  meals       Meal[]
}

model Meal {
  id          String   @id @default(uuid())
  mealPlanId  String
  recipeId    String
  type        String   // LUNCH, DINNER, SNACK
  isLeftover  Boolean  @default(false) 
  
  recipe      Recipe   @relation(fields: [recipeId], references: [id])
  mealPlan    MealPlan @relation(fields: [mealPlanId], references: [id])
}
```

## 4. Logique Métier Core (Core Business Logic)

### 4.1. Mode Rééquilibrage Alimentaire (Nutrition Tracker)
Si `enableNutritionGoal` est `true` dans `UserSettings` :
- L'algorithme calcule la somme des calories/macros des repas de la journée **uniquement** pour la part du `FamilyMember` ayant `isMainUser = true`.
- Le calcul pour l'utilisateur principal : `(Calories de la recette de base) * (Multiplier de l'utilisateur)`.
- La jauge se met à jour en temps réel lors du glisser-déposer des repas dans le calendrier.

### 4.2. Algorithme de Calcul des Portions (Family Mode)
La quantité totale d'un ingrédient pour cuisiner le repas familial :
`Total Ingredient = Quantité de base * Somme(Multipliers des membres actifs)`
*Règle d'arrondi :* Si `isIndivisible` est `true` (ex: oeuf), utiliser `Math.ceil()`. Le mode famille ne change rien au compteur de calories de l'utilisateur principal.

### 4.3. Logique "Leftover" (Reste pour le lendemain)
Pour les jours "Présentiel/Bureau" de l'utilisateur principal :
1. Assigne la recette du `DINNER` (J-1) au `LUNCH` (Jour J) avec le flag `isLeftover = true`.
2. Multiplie par 2 le coefficient de l'utilisateur principal lors du calcul des courses et des quantités à cuisiner le soir (J-1).
3. Divise et attribue correctement les calories : 1 portion pour le dîner, 1 portion pour le déjeuner du lendemain.

### 4.4. Générateur de Liste de Courses
- Agréger tous les `RecipeIngredient` d'une période donnée.
- Grouper par `ingredientId`, additionner les `quantity` avec conversion d'unités (ex: g en kg).
- Trier par `category` (Rayons du supermarché).

## 5. Interface Utilisateur (UI/UX)
- **Vue Calendrier :** Grille hebdomadaire. **Si l'option nutrition est active :** Affichage d'une barre de progression journalière (Kcal consommées / Kcal cibles) en haut de chaque jour.
- **Vue Recette :** Bouton "Mode Cuisine" (Wake Lock API). Affiche les quantités globales à cuisiner pour la famille.
- **Vue Réglages :** Un simple bouton "Activer le rééquilibrage alimentaire" qui fait apparaître les champs pour saisir ses objectifs journaliers (Calories, Protéines, etc.).

## 6. Instructions de développement pour Claude Code
1. Initialiser le projet Next.js + Prisma + SQLite.
2. Créer le schéma de BDD et les scripts de seed (avec des recettes incluant leurs macros).
3. Développer les actions serveur (Calcul des portions familiales + Calcul indépendant des calories pour le Main User).
4. Créer le frontend avec le toggle de nutrition conditionnel dans l'UI.
5. Dockeriser l'application.