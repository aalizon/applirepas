/**
 * Données de départ : ingrédients (valeurs nutritionnelles pour 100 g, arrondies
 * d'après la table Ciqual de l'ANSES) et bibliothèque de recettes familiales originales.
 * Les quantités des recettes sont données pour 1 portion adulte.
 */

export const CATEGORIES = [
  "Fruits & légumes",
  "Boucherie & volaille",
  "Poissonnerie",
  "Crèmerie & œufs",
  "Boulangerie",
  "Épicerie salée",
  "Conserves",
  "Surgelés",
  "Condiments & épices",
  "Boissons",
  "Divers",
] as const;

type SeedIngredient = {
  name: string;
  category: (typeof CATEGORIES)[number];
  unit: "g" | "ml" | "piece";
  gramsPerPiece?: number;
  n: [kcal: number, protein: number, carbs: number, fat: number];
  pantry?: boolean;
};

const FL = "Fruits & légumes";
const BV = "Boucherie & volaille";
const PO = "Poissonnerie";
const CO = "Crèmerie & œufs";
const BO = "Boulangerie";
const ES = "Épicerie salée";
const CS = "Conserves";
const SU = "Surgelés";
const CE = "Condiments & épices";
const BS = "Boissons";

export const SEED_INGREDIENTS: SeedIngredient[] = [
  // Fruits & légumes
  { name: "oignon", category: FL, unit: "piece", gramsPerPiece: 110, n: [40, 1.2, 7.6, 0.2] },
  { name: "échalote", category: FL, unit: "piece", gramsPerPiece: 30, n: [72, 2.5, 14, 0.1] },
  { name: "ail", category: FL, unit: "piece", gramsPerPiece: 5, n: [131, 6, 25, 0.5] },
  { name: "carotte", category: FL, unit: "g", n: [36, 0.8, 7.6, 0.3] },
  { name: "pomme de terre", category: FL, unit: "g", n: [80, 2, 17, 0.1] },
  { name: "patate douce", category: FL, unit: "g", n: [86, 1.6, 18, 0.1] },
  { name: "courgette", category: FL, unit: "g", n: [17, 1.2, 2, 0.3] },
  { name: "aubergine", category: FL, unit: "g", n: [22, 1, 3.5, 0.2] },
  { name: "poivron", category: FL, unit: "g", n: [30, 1, 5.5, 0.3] },
  { name: "tomate", category: FL, unit: "g", n: [19, 0.8, 3, 0.2] },
  { name: "tomate cerise", category: FL, unit: "g", n: [22, 0.9, 3.5, 0.3] },
  { name: "champignon de Paris", category: FL, unit: "g", n: [22, 3, 0.5, 0.3] },
  { name: "poireau", category: FL, unit: "g", n: [27, 1.5, 4, 0.3] },
  { name: "brocoli", category: FL, unit: "g", n: [34, 3, 3, 0.4] },
  { name: "chou-fleur", category: FL, unit: "g", n: [26, 2, 3, 0.3] },
  { name: "courge butternut", category: FL, unit: "g", n: [45, 1, 10, 0.1] },
  { name: "épinards frais", category: FL, unit: "g", n: [25, 3, 1.5, 0.5] },
  { name: "salade verte", category: FL, unit: "g", n: [15, 1.3, 1.5, 0.2] },
  { name: "haricots verts", category: FL, unit: "g", n: [30, 2, 4, 0.2] },
  { name: "avocat", category: FL, unit: "piece", gramsPerPiece: 150, n: [160, 2, 1.5, 15] },
  { name: "citron", category: FL, unit: "piece", gramsPerPiece: 100, n: [30, 0.8, 2.5, 0.3] },
  { name: "gingembre frais", category: FL, unit: "g", n: [80, 1.8, 15, 0.8] },
  { name: "coriandre fraîche", category: FL, unit: "g", n: [23, 2, 1, 0.5] },
  { name: "persil", category: FL, unit: "g", n: [40, 3, 4, 0.8] },
  // Boucherie & volaille
  { name: "blanc de poulet", category: BV, unit: "g", n: [115, 24, 0, 1.8] },
  { name: "cuisse de poulet", category: BV, unit: "g", n: [160, 18, 0, 10] },
  { name: "escalope de dinde", category: BV, unit: "g", n: [105, 23, 0, 1.5] },
  { name: "bœuf haché 5%", category: BV, unit: "g", n: [125, 21, 0, 5] },
  { name: "bœuf à braiser", category: BV, unit: "g", n: [140, 21, 0, 6] },
  { name: "bœuf émincé", category: BV, unit: "g", n: [130, 22, 0, 4.5] },
  { name: "filet mignon de porc", category: BV, unit: "g", n: [115, 21, 0, 3] },
  { name: "lardons fumés", category: BV, unit: "g", n: [250, 15, 0.5, 21] },
  { name: "jambon blanc", category: BV, unit: "g", n: [110, 20, 1, 3] },
  { name: "saucisse de Toulouse", category: BV, unit: "g", n: [280, 15, 1, 24] },
  // Poissonnerie
  { name: "filet de cabillaud", category: PO, unit: "g", n: [80, 18, 0, 0.7] },
  { name: "pavé de saumon", category: PO, unit: "g", n: [200, 20, 0, 13] },
  { name: "crevettes décortiquées", category: PO, unit: "g", n: [95, 21, 0, 1] },
  // Crèmerie & œufs
  { name: "œuf", category: CO, unit: "piece", gramsPerPiece: 60, n: [140, 12.5, 0.5, 10] },
  { name: "beurre", category: CO, unit: "g", n: [745, 0.7, 0.6, 82], pantry: true },
  { name: "crème fraîche légère", category: CO, unit: "ml", n: [160, 3, 4, 15] },
  { name: "lait demi-écrémé", category: CO, unit: "ml", n: [46, 3.2, 4.8, 1.6], pantry: true },
  { name: "yaourt nature", category: CO, unit: "g", n: [60, 4, 5, 3] },
  { name: "gruyère râpé", category: CO, unit: "g", n: [400, 28, 0, 32] },
  { name: "parmesan", category: CO, unit: "g", n: [390, 33, 0, 28] },
  { name: "mozzarella", category: CO, unit: "g", n: [250, 18, 2, 19] },
  { name: "cheddar", category: CO, unit: "g", n: [400, 25, 1, 33] },
  { name: "fromage de chèvre", category: CO, unit: "g", n: [300, 19, 1, 24] },
  { name: "reblochon", category: CO, unit: "g", n: [330, 20, 0, 28] },
  { name: "tofu ferme", category: CO, unit: "g", n: [120, 13, 1.5, 7] },
  { name: "gnocchi", category: CO, unit: "g", n: [150, 3.5, 32, 0.5] },
  { name: "pâte brisée", category: CO, unit: "piece", gramsPerPiece: 230, n: [400, 6, 43, 22] },
  { name: "pâte à pizza", category: CO, unit: "piece", gramsPerPiece: 400, n: [260, 7, 48, 4] },
  // Boulangerie
  { name: "baguette", category: BO, unit: "g", n: [270, 9, 55, 1.5] },
  { name: "pain de mie", category: BO, unit: "piece", gramsPerPiece: 25, n: [270, 8, 50, 4] },
  { name: "pain burger", category: BO, unit: "piece", gramsPerPiece: 75, n: [280, 9, 48, 5] },
  { name: "tortilla de blé", category: BO, unit: "piece", gramsPerPiece: 40, n: [300, 8, 50, 7] },
  // Épicerie salée
  { name: "riz basmati", category: ES, unit: "g", n: [350, 8, 77, 0.8] },
  { name: "riz arborio", category: ES, unit: "g", n: [350, 7, 78, 0.6] },
  { name: "pâtes", category: ES, unit: "g", n: [355, 12, 70, 1.5] },
  { name: "spaghetti", category: ES, unit: "g", n: [355, 12, 70, 1.5] },
  { name: "feuilles de lasagne", category: ES, unit: "g", n: [355, 12, 70, 1.5] },
  { name: "nouilles chinoises", category: ES, unit: "g", n: [380, 13, 70, 4] },
  { name: "semoule", category: ES, unit: "g", n: [355, 12, 72, 1.5] },
  { name: "quinoa", category: ES, unit: "g", n: [360, 14, 60, 6] },
  { name: "lentilles vertes", category: ES, unit: "g", n: [330, 24, 48, 1.5] },
  { name: "lentilles corail", category: ES, unit: "g", n: [340, 25, 50, 1.5] },
  { name: "farine", category: ES, unit: "g", n: [350, 10, 73, 1], pantry: true },
  { name: "noix de cajou", category: ES, unit: "g", n: [590, 18, 27, 46] },
  { name: "olives noires", category: ES, unit: "g", n: [150, 1, 3, 15] },
  { name: "pesto", category: ES, unit: "g", n: [450, 5, 5, 45] },
  { name: "pâte de curry rouge", category: ES, unit: "g", n: [120, 2, 10, 8] },
  // Conserves
  { name: "lait de coco", category: CS, unit: "ml", n: [180, 1.8, 3, 18] },
  { name: "tomates concassées", category: CS, unit: "g", n: [25, 1.2, 4, 0.2] },
  { name: "coulis de tomate", category: CS, unit: "g", n: [30, 1.4, 5, 0.2] },
  { name: "pois chiches (conserve)", category: CS, unit: "g", n: [120, 7, 14, 2.5] },
  { name: "haricots rouges (conserve)", category: CS, unit: "g", n: [110, 8, 14, 0.5] },
  { name: "maïs (conserve)", category: CS, unit: "g", n: [95, 3, 17, 1.5] },
  { name: "thon au naturel", category: CS, unit: "g", n: [115, 26, 0, 1] },
  // Surgelés
  { name: "petits pois surgelés", category: SU, unit: "g", n: [70, 5, 9, 0.4] },
  // Condiments & épices (placard)
  { name: "huile d'olive", category: CE, unit: "ml", n: [900, 0, 0, 100], pantry: true },
  { name: "sauce soja", category: CE, unit: "ml", n: [60, 6, 7, 0], pantry: true },
  { name: "vinaigre", category: CE, unit: "ml", n: [20, 0, 0.5, 0], pantry: true },
  { name: "moutarde", category: CE, unit: "g", n: [150, 7, 5, 11], pantry: true },
  { name: "miel", category: CE, unit: "g", n: [320, 0.5, 80, 0], pantry: true },
  { name: "bouillon cube", category: CE, unit: "piece", gramsPerPiece: 10, n: [250, 10, 20, 15], pantry: true },
  { name: "sel", category: CE, unit: "g", n: [0, 0, 0, 0], pantry: true },
  { name: "poivre", category: CE, unit: "g", n: [0, 0, 0, 0], pantry: true },
  { name: "cumin", category: CE, unit: "g", n: [375, 18, 34, 22], pantry: true },
  { name: "curry en poudre", category: CE, unit: "g", n: [325, 14, 25, 14], pantry: true },
  { name: "paprika", category: CE, unit: "g", n: [280, 14, 18, 13], pantry: true },
  { name: "ras el hanout", category: CE, unit: "g", n: [300, 12, 40, 12], pantry: true },
  { name: "herbes de Provence", category: CE, unit: "g", n: [250, 9, 30, 7], pantry: true },
  // Boissons
  { name: "vin blanc", category: BS, unit: "ml", n: [70, 0, 1, 0] },
  { name: "vin rouge", category: BS, unit: "ml", n: [75, 0, 1, 0] },
];

type SeedRecipe = {
  title: string;
  description: string;
  prep: number;
  cook: number;
  tags: string;
  seasons?: string;
  batch: boolean;
  ingredients: [name: string, qty: number, note?: string][];
  steps: string[];
};

export const SEED_RECIPES: SeedRecipe[] = [
  {
    title: "Poulet curry coco & riz basmati",
    description: "Un curry doux qui plaît aux enfants, encore meilleur réchauffé.",
    prep: 15, cook: 20, tags: "poulet,famille", batch: true,
    ingredients: [
      ["blanc de poulet", 130, "en dés"], ["oignon", 0.25], ["ail", 0.5], ["lait de coco", 100],
      ["tomates concassées", 60], ["curry en poudre", 3], ["riz basmati", 70], ["huile d'olive", 5],
      ["coriandre fraîche", 3], ["sel", 1],
    ],
    steps: [
      "Faire cuire le riz basmati selon les indications du paquet.",
      "Faire revenir l'oignon émincé et l'ail dans l'huile 3 minutes.",
      "Ajouter le poulet en dés et le curry, saisir 5 minutes.",
      "Verser le lait de coco et les tomates concassées, laisser mijoter 12 minutes.",
      "Rectifier l'assaisonnement et parsemer de coriandre avant de servir avec le riz.",
    ],
  },
  {
    title: "Chili con carne",
    description: "Le classique du batch cooking : se garde 3 jours et se congèle très bien.",
    prep: 20, cook: 40, tags: "boeuf,famille", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["bœuf haché 5%", 110], ["oignon", 0.25], ["ail", 0.5], ["poivron", 50],
      ["haricots rouges (conserve)", 100, "égouttés"], ["tomates concassées", 120], ["maïs (conserve)", 40],
      ["cumin", 2], ["paprika", 1], ["riz basmati", 60], ["huile d'olive", 5],
    ],
    steps: [
      "Faire revenir l'oignon, l'ail et le poivron en dés dans l'huile.",
      "Ajouter la viande hachée et la faire dorer en l'émiettant.",
      "Ajouter les épices, les tomates concassées, puis laisser mijoter 25 minutes à couvert.",
      "Ajouter les haricots rouges et le maïs égouttés, poursuivre 10 minutes.",
      "Servir avec le riz.",
    ],
  },
  {
    title: "Lasagnes à la bolognaise",
    description: "Plat du week-end, à préparer en grande quantité pour les lunchbox.",
    prep: 30, cook: 45, tags: "boeuf,famille,four", batch: true,
    ingredients: [
      ["bœuf haché 5%", 100], ["oignon", 0.25], ["carotte", 30], ["coulis de tomate", 120],
      ["feuilles de lasagne", 60], ["lait demi-écrémé", 120], ["beurre", 10], ["farine", 10],
      ["gruyère râpé", 25], ["huile d'olive", 5], ["herbes de Provence", 1],
    ],
    steps: [
      "Bolognaise : faire revenir oignon et carotte hachés, ajouter la viande puis le coulis et les herbes. Mijoter 20 minutes.",
      "Béchamel : faire fondre le beurre, ajouter la farine, puis le lait en fouettant jusqu'à épaississement.",
      "Dans un plat, alterner feuilles de lasagne, bolognaise et béchamel.",
      "Finir par la béchamel et le gruyère. Enfourner 35 minutes à 180 °C.",
    ],
  },
  {
    title: "Hachis parmentier",
    description: "Réconfortant et économique, parfait pour les soirs d'hiver.",
    prep: 30, cook: 25, tags: "boeuf,famille,four", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["pomme de terre", 250], ["bœuf haché 5%", 100], ["oignon", 0.25], ["ail", 0.5],
      ["lait demi-écrémé", 40], ["beurre", 10], ["gruyère râpé", 20], ["sel", 1],
    ],
    steps: [
      "Cuire les pommes de terre épluchées 20 minutes à l'eau salée.",
      "Pendant ce temps, faire revenir oignon, ail et viande hachée.",
      "Écraser les pommes de terre avec le lait chaud et le beurre.",
      "Dans un plat : la viande, puis la purée, puis le gruyère. Gratiner 20 minutes à 200 °C.",
    ],
  },
  {
    title: "Saumon, riz & brocolis",
    description: "Assiette équilibrée et rapide, idéale en rééquilibrage.",
    prep: 10, cook: 20, tags: "poisson,rapide,leger", batch: true,
    ingredients: [
      ["pavé de saumon", 130], ["riz basmati", 70], ["brocoli", 150], ["citron", 0.25],
      ["huile d'olive", 5], ["sauce soja", 10],
    ],
    steps: [
      "Cuire le riz. Cuire les fleurettes de brocoli 8 minutes à la vapeur.",
      "Cuire le saumon à la poêle dans l'huile, 4 minutes côté peau puis 2 minutes de l'autre côté.",
      "Arroser d'un filet de citron et de sauce soja. Servir avec le riz et les brocolis.",
    ],
  },
  {
    title: "Cabillaud en papillote & légumes du soleil",
    description: "Léger et plein de couleurs, la cuisson se fait toute seule.",
    prep: 15, cook: 20, tags: "poisson,leger,four", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["filet de cabillaud", 150], ["courgette", 100], ["tomate cerise", 80], ["poivron", 50],
      ["citron", 0.25], ["huile d'olive", 5], ["herbes de Provence", 1], ["pomme de terre", 200],
    ],
    steps: [
      "Préchauffer le four à 200 °C. Cuire les pommes de terre à la vapeur.",
      "Couper les légumes en petits dés, les répartir sur des feuilles de papier cuisson.",
      "Poser le cabillaud dessus, arroser d'huile et de citron, parsemer d'herbes. Fermer les papillotes.",
      "Enfourner 18 à 20 minutes. Servir avec les pommes de terre.",
    ],
  },
  {
    title: "Pâtes carbonara",
    description: "La version familiale express avec une touche de crème.",
    prep: 10, cook: 12, tags: "porc,rapide,famille", batch: false,
    ingredients: [
      ["pâtes", 100], ["lardons fumés", 50], ["œuf", 1], ["parmesan", 15],
      ["crème fraîche légère", 30], ["poivre", 1],
    ],
    steps: [
      "Cuire les pâtes al dente.",
      "Faire dorer les lardons à sec dans une poêle.",
      "Battre les œufs avec la crème, le parmesan et le poivre.",
      "Hors du feu, mélanger les pâtes égouttées, les lardons et la préparation aux œufs.",
    ],
  },
  {
    title: "Dahl de lentilles corail",
    description: "Plat végétarien complet, riche en protéines et très économique.",
    prep: 15, cook: 25, tags: "vege,leger", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["lentilles corail", 70], ["lait de coco", 80], ["tomates concassées", 80], ["oignon", 0.25],
      ["ail", 0.5], ["gingembre frais", 5], ["curry en poudre", 3], ["épinards frais", 40],
      ["riz basmati", 50], ["huile d'olive", 5],
    ],
    steps: [
      "Faire revenir l'oignon, l'ail et le gingembre râpé avec le curry.",
      "Ajouter les lentilles rincées, les tomates, le lait de coco et 150 ml d'eau par portion.",
      "Laisser mijoter 20 minutes en remuant. Ajouter les épinards 2 minutes avant la fin.",
      "Servir avec le riz.",
    ],
  },
  {
    title: "Quiche lorraine & salade verte",
    description: "Se mange chaude le soir et froide le lendemain midi.",
    prep: 15, cook: 35, tags: "porc,oeuf,famille,four", batch: true,
    ingredients: [
      ["pâte brisée", 0.25], ["lardons fumés", 40], ["œuf", 0.75], ["crème fraîche légère", 50],
      ["lait demi-écrémé", 40], ["gruyère râpé", 20], ["salade verte", 40], ["huile d'olive", 5],
      ["vinaigre", 3], ["moutarde", 2],
    ],
    steps: [
      "Préchauffer le four à 180 °C. Foncer un moule avec la pâte brisée.",
      "Faire revenir les lardons, les répartir sur la pâte.",
      "Battre œufs, crème et lait, verser sur les lardons, parsemer de gruyère.",
      "Enfourner 35 minutes. Servir avec la salade assaisonnée d'une vinaigrette moutarde.",
    ],
  },
  {
    title: "Poêlée de gnocchis, courgettes & pesto",
    description: "Prêt en 15 minutes, parfait pour un midi à la maison.",
    prep: 10, cook: 15, tags: "vege,rapide", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["gnocchi", 200], ["courgette", 120], ["tomate cerise", 60], ["pesto", 20],
      ["parmesan", 10], ["huile d'olive", 5],
    ],
    steps: [
      "Faire dorer les gnocchis dans l'huile 6 à 8 minutes.",
      "Ajouter la courgette en dés et les tomates cerises coupées en deux, cuire 5 minutes.",
      "Hors du feu, mélanger avec le pesto et parsemer de parmesan.",
    ],
  },
  {
    title: "Wraps de poulet épicé",
    description: "Chacun garnit son wrap : succès garanti auprès des enfants.",
    prep: 20, cook: 10, tags: "poulet,rapide,famille", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["tortilla de blé", 2], ["blanc de poulet", 110], ["poivron", 50], ["oignon", 0.25],
      ["salade verte", 20], ["avocat", 0.25], ["yaourt nature", 30], ["maïs (conserve)", 30],
      ["paprika", 1], ["cumin", 1], ["huile d'olive", 5],
    ],
    steps: [
      "Émincer le poulet, le faire sauter avec le poivron, l'oignon et les épices.",
      "Préparer une sauce avec le yaourt, une pincée de sel et de cumin.",
      "Réchauffer les tortillas, garnir de salade, poulet, maïs, avocat et sauce. Rouler.",
    ],
  },
  {
    title: "Émincé de dinde aux champignons & riz",
    description: "Une sauce crémeuse légère qui plaît à tout le monde.",
    prep: 15, cook: 20, tags: "volaille,famille", seasons: "automne,hiver,printemps", batch: true,
    ingredients: [
      ["escalope de dinde", 130], ["champignon de Paris", 100], ["crème fraîche légère", 50],
      ["oignon", 0.25], ["riz basmati", 70], ["bouillon cube", 0.25], ["huile d'olive", 5], ["persil", 3],
    ],
    steps: [
      "Cuire le riz.",
      "Faire dorer la dinde émincée dans l'huile, réserver.",
      "Faire revenir l'oignon et les champignons, ajouter le bouillon émietté dans 50 ml d'eau par portion.",
      "Remettre la dinde, ajouter la crème et laisser épaissir 5 minutes. Parsemer de persil.",
    ],
  },
  {
    title: "Bœuf bourguignon",
    description: "Mijoté du dimanche, encore meilleur le lendemain.",
    prep: 30, cook: 150, tags: "boeuf,mijote", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["bœuf à braiser", 170], ["carotte", 80], ["oignon", 0.5], ["lardons fumés", 25],
      ["champignon de Paris", 60], ["vin rouge", 100], ["farine", 5], ["bouillon cube", 0.25],
      ["pomme de terre", 200], ["huile d'olive", 5], ["ail", 0.5], ["herbes de Provence", 1],
    ],
    steps: [
      "Faire dorer la viande en cubes dans l'huile en plusieurs fois, réserver.",
      "Faire revenir oignons, lardons et carottes. Remettre la viande, saupoudrer de farine.",
      "Mouiller avec le vin et le bouillon, ajouter ail et herbes. Mijoter 2 h à feu doux.",
      "Ajouter les champignons 30 minutes avant la fin. Servir avec des pommes de terre vapeur.",
    ],
  },
  {
    title: "Risotto aux champignons",
    description: "Crémeux sans crème, grâce au parmesan.",
    prep: 15, cook: 25, tags: "vege", seasons: "automne,hiver", batch: false,
    ingredients: [
      ["riz arborio", 80], ["champignon de Paris", 120], ["échalote", 0.5], ["vin blanc", 30],
      ["bouillon cube", 0.5], ["parmesan", 20], ["beurre", 10], ["huile d'olive", 5],
    ],
    steps: [
      "Préparer un bouillon chaud (250 ml d'eau par portion).",
      "Faire revenir l'échalote et les champignons dans l'huile, ajouter le riz et le nacrer 2 minutes.",
      "Déglacer au vin blanc puis ajouter le bouillon louche par louche en remuant (18 minutes).",
      "Hors du feu, incorporer le beurre et le parmesan.",
    ],
  },
  {
    title: "Soupe de légumes & tartines chèvre-miel",
    description: "Le dîner léger des soirs d'hiver.",
    prep: 20, cook: 30, tags: "vege,leger", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["poireau", 100], ["carotte", 100], ["pomme de terre", 100], ["oignon", 0.25],
      ["bouillon cube", 0.5], ["baguette", 60], ["fromage de chèvre", 30], ["miel", 3], ["huile d'olive", 5],
    ],
    steps: [
      "Faire revenir l'oignon et le poireau dans l'huile.",
      "Ajouter carottes et pommes de terre en morceaux, couvrir d'eau avec le bouillon. Cuire 25 minutes puis mixer.",
      "Garnir les tranches de baguette de chèvre et de miel, passer 5 minutes sous le gril.",
    ],
  },
  {
    title: "Tartiflette",
    description: "Le plat de montagne à partager, avec une salade verte.",
    prep: 25, cook: 30, tags: "porc,famille,four", seasons: "hiver", batch: true,
    ingredients: [
      ["pomme de terre", 300], ["lardons fumés", 50], ["oignon", 0.5], ["reblochon", 110],
      ["crème fraîche légère", 30], ["vin blanc", 20], ["salade verte", 40],
    ],
    steps: [
      "Cuire les pommes de terre à l'eau 15 minutes, les couper en rondelles.",
      "Faire revenir oignons et lardons, déglacer au vin blanc.",
      "Dans un plat : pommes de terre, lardons, crème, puis le reblochon coupé en deux dans l'épaisseur.",
      "Enfourner 25 minutes à 200 °C. Servir avec la salade.",
    ],
  },
  {
    title: "Poulet rôti & pommes de terre grenaille",
    description: "Le repas du dimanche, sans effort.",
    prep: 15, cook: 60, tags: "poulet,famille,four", batch: true,
    ingredients: [
      ["cuisse de poulet", 250], ["pomme de terre", 250], ["ail", 1], ["herbes de Provence", 1],
      ["huile d'olive", 10], ["sel", 1],
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Disposer les cuisses de poulet et les pommes de terre coupées en deux dans un plat.",
      "Arroser d'huile, ajouter l'ail en chemise, les herbes et le sel.",
      "Enfourner 55 à 60 minutes en arrosant à mi-cuisson.",
    ],
  },
  {
    title: "Tortilla espagnole & salade",
    description: "Omelette aux pommes de terre, délicieuse chaude ou froide en lunchbox.",
    prep: 15, cook: 20, tags: "oeuf,vege,famille", batch: true,
    ingredients: [
      ["œuf", 2], ["pomme de terre", 180], ["oignon", 0.25], ["huile d'olive", 10],
      ["salade verte", 40], ["vinaigre", 3],
    ],
    steps: [
      "Faire cuire doucement les pommes de terre en fines lamelles et l'oignon dans l'huile, 15 minutes.",
      "Battre les œufs, y ajouter les pommes de terre, saler.",
      "Remettre dans la poêle, cuire 5 minutes, retourner à l'aide d'une assiette et cuire encore 3 minutes.",
      "Servir avec la salade.",
    ],
  },
  {
    title: "Buddha bowl pois chiches & patate douce",
    description: "Bol complet et coloré, parfait pour les lunchbox.",
    prep: 20, cook: 25, tags: "vege,leger", seasons: "automne,hiver,printemps", batch: true,
    ingredients: [
      ["patate douce", 150], ["pois chiches (conserve)", 100], ["quinoa", 50], ["avocat", 0.25],
      ["épinards frais", 30], ["yaourt nature", 30], ["citron", 0.25], ["cumin", 1], ["huile d'olive", 8],
    ],
    steps: [
      "Rôtir la patate douce en cubes et les pois chiches avec l'huile et le cumin, 25 minutes à 200 °C.",
      "Cuire le quinoa 12 minutes.",
      "Préparer une sauce yaourt-citron.",
      "Dresser : quinoa, pousses d'épinards, légumes rôtis, avocat, sauce.",
    ],
  },
  {
    title: "Couscous au poulet & légumes",
    description: "Un grand classique familial, la semoule se prépare en 5 minutes.",
    prep: 25, cook: 45, tags: "poulet,famille,mijote", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["cuisse de poulet", 150], ["semoule", 70], ["carotte", 80], ["courgette", 80],
      ["pois chiches (conserve)", 60], ["oignon", 0.25], ["tomates concassées", 60],
      ["ras el hanout", 3], ["huile d'olive", 5], ["bouillon cube", 0.25],
    ],
    steps: [
      "Faire dorer le poulet dans une cocotte avec l'oignon et le ras el hanout.",
      "Ajouter carottes, tomates, bouillon et eau à hauteur. Mijoter 25 minutes.",
      "Ajouter courgettes et pois chiches, poursuivre 15 minutes.",
      "Préparer la semoule avec son volume d'eau bouillante salée. Servir avec le bouillon.",
    ],
  },
  {
    title: "Spaghetti bolognaise",
    description: "La sauce se prépare en double et se congèle.",
    prep: 15, cook: 30, tags: "boeuf,famille", batch: true,
    ingredients: [
      ["spaghetti", 100], ["bœuf haché 5%", 100], ["oignon", 0.25], ["carotte", 30],
      ["coulis de tomate", 130], ["parmesan", 10], ["huile d'olive", 5], ["ail", 0.5], ["herbes de Provence", 1],
    ],
    steps: [
      "Faire revenir oignon, ail et carotte hachés dans l'huile.",
      "Ajouter la viande, la faire dorer, puis le coulis et les herbes. Mijoter 20 minutes.",
      "Cuire les spaghetti, servir nappés de sauce et de parmesan.",
    ],
  },
  {
    title: "Salade niçoise",
    description: "Fraîche et complète, idéale à emporter.",
    prep: 20, cook: 10, tags: "poisson,oeuf,leger,rapide", seasons: "printemps,ete", batch: true,
    ingredients: [
      ["thon au naturel", 80], ["œuf", 1], ["haricots verts", 80], ["pomme de terre", 120],
      ["tomate", 100], ["olives noires", 15], ["salade verte", 30], ["huile d'olive", 10], ["vinaigre", 5],
    ],
    steps: [
      "Cuire les œufs 10 minutes (durs), les pommes de terre et les haricots verts à l'eau.",
      "Couper tomates, pommes de terre et œufs.",
      "Assembler avec la salade, le thon émietté et les olives. Assaisonner.",
    ],
  },
  {
    title: "Croque-monsieur & salade",
    description: "Le dîner du vendredi soir, prêt en 20 minutes.",
    prep: 10, cook: 10, tags: "porc,rapide,famille,four", batch: false,
    ingredients: [
      ["pain de mie", 4], ["jambon blanc", 50], ["gruyère râpé", 40], ["beurre", 8],
      ["salade verte", 40], ["huile d'olive", 5], ["vinaigre", 3],
    ],
    steps: [
      "Beurrer légèrement les tranches de pain de mie.",
      "Garnir de jambon et de gruyère, refermer et parsemer de gruyère.",
      "Cuire 10 minutes à 200 °C (ou à l'appareil à croque). Servir avec la salade.",
    ],
  },
  {
    title: "Pizza maison jambon-champignons",
    description: "Chacun décore sa part : l'activité cuisine du week-end.",
    prep: 20, cook: 15, tags: "porc,famille,four", batch: false,
    ingredients: [
      ["pâte à pizza", 0.35], ["coulis de tomate", 60], ["mozzarella", 60], ["jambon blanc", 40],
      ["champignon de Paris", 50], ["olives noires", 10], ["herbes de Provence", 1],
    ],
    steps: [
      "Préchauffer le four à 240 °C.",
      "Étaler la pâte, la napper de coulis de tomate assaisonné d'herbes.",
      "Garnir de jambon, champignons émincés, mozzarella et olives.",
      "Enfourner 12 à 15 minutes.",
    ],
  },
  {
    title: "Burger maison & potatoes au four",
    description: "Le fast-food fait maison, plus léger.",
    prep: 20, cook: 30, tags: "boeuf,famille,four", batch: false,
    ingredients: [
      ["pain burger", 1], ["bœuf haché 5%", 130], ["tomate", 40], ["salade verte", 15],
      ["oignon", 0.15], ["cheddar", 20], ["pomme de terre", 200], ["huile d'olive", 10],
      ["paprika", 1], ["moutarde", 5],
    ],
    steps: [
      "Couper les pommes de terre en quartiers, les mélanger avec l'huile et le paprika. Four 30 minutes à 210 °C.",
      "Former les steaks et les cuire 3 minutes par face. Poser le cheddar en fin de cuisson.",
      "Toaster les pains, garnir de moutarde, salade, tomate, oignon et steak.",
    ],
  },
  {
    title: "Wok de bœuf aux légumes & nouilles",
    description: "Cuisson minute au wok, légumes croquants.",
    prep: 15, cook: 10, tags: "boeuf,rapide", batch: false,
    ingredients: [
      ["bœuf émincé", 120], ["nouilles chinoises", 70], ["poivron", 60], ["carotte", 50],
      ["brocoli", 60], ["sauce soja", 15], ["gingembre frais", 5], ["ail", 0.5], ["huile d'olive", 8], ["miel", 5],
    ],
    steps: [
      "Cuire les nouilles, les égoutter.",
      "Saisir le bœuf 2 minutes à feu vif, réserver.",
      "Sauter les légumes en lanières avec l'ail et le gingembre 4 minutes.",
      "Remettre le bœuf et les nouilles, ajouter soja et miel, mélanger 1 minute.",
    ],
  },
  {
    title: "Filet mignon à la moutarde & haricots verts",
    description: "Tendre et rapide, avec une sauce onctueuse.",
    prep: 15, cook: 30, tags: "porc", batch: true,
    ingredients: [
      ["filet mignon de porc", 140], ["crème fraîche légère", 40], ["moutarde", 10],
      ["haricots verts", 150], ["pomme de terre", 150], ["échalote", 0.5], ["huile d'olive", 5],
    ],
    steps: [
      "Cuire pommes de terre et haricots verts à la vapeur.",
      "Dorer le filet mignon en médaillons dans l'huile, 4 minutes par face. Réserver.",
      "Faire revenir l'échalote, ajouter crème et moutarde, remettre la viande 5 minutes.",
    ],
  },
  {
    title: "Gratin de chou-fleur au jambon",
    description: "Pour faire aimer le chou-fleur aux enfants.",
    prep: 15, cook: 30, tags: "porc,famille,four", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["chou-fleur", 250], ["jambon blanc", 50], ["lait demi-écrémé", 100], ["farine", 10],
      ["beurre", 10], ["gruyère râpé", 25],
    ],
    steps: [
      "Cuire les fleurettes de chou-fleur 10 minutes à l'eau salée.",
      "Préparer une béchamel avec le beurre, la farine et le lait.",
      "Dans un plat : chou-fleur, jambon en lanières, béchamel, gruyère. Gratiner 20 minutes à 200 °C.",
    ],
  },
  {
    title: "Curry de crevettes coco",
    description: "Exotique et prêt en 20 minutes.",
    prep: 10, cook: 15, tags: "poisson,rapide", batch: true,
    ingredients: [
      ["crevettes décortiquées", 110], ["lait de coco", 100], ["pâte de curry rouge", 10],
      ["poivron", 60], ["riz basmati", 70], ["citron", 0.25], ["coriandre fraîche", 3],
    ],
    steps: [
      "Cuire le riz.",
      "Faire chauffer la pâte de curry 1 minute, ajouter le poivron émincé puis le lait de coco. Mijoter 8 minutes.",
      "Ajouter les crevettes 3 minutes. Finir avec citron et coriandre.",
    ],
  },
  {
    title: "Chakchouka",
    description: "Œufs pochés dans une sauce tomate-poivrons épicée.",
    prep: 15, cook: 25, tags: "oeuf,vege,leger", seasons: "ete,automne", batch: false,
    ingredients: [
      ["œuf", 2], ["poivron", 120], ["oignon", 0.25], ["tomates concassées", 150], ["ail", 0.5],
      ["cumin", 1], ["paprika", 1], ["huile d'olive", 8], ["baguette", 50],
    ],
    steps: [
      "Faire fondre oignon et poivrons émincés dans l'huile 10 minutes.",
      "Ajouter ail, épices et tomates, mijoter 10 minutes.",
      "Creuser des puits, y casser les œufs, couvrir et cuire 5 à 7 minutes. Servir avec du pain.",
    ],
  },
  {
    title: "Poulet basquaise",
    description: "Mijoté de poivrons et tomates, parfum d'été.",
    prep: 20, cook: 40, tags: "poulet,famille,mijote", seasons: "ete,automne", batch: true,
    ingredients: [
      ["cuisse de poulet", 180], ["poivron", 120], ["tomate", 120], ["oignon", 0.25], ["ail", 0.5],
      ["vin blanc", 30], ["riz basmati", 70], ["huile d'olive", 5], ["paprika", 1],
    ],
    steps: [
      "Dorer le poulet dans une cocotte, réserver.",
      "Faire revenir oignon, ail et poivrons. Ajouter les tomates en morceaux et le paprika.",
      "Remettre le poulet, déglacer au vin blanc, couvrir et mijoter 35 minutes.",
      "Servir avec le riz.",
    ],
  },
  {
    title: "Pâtes au saumon & épinards",
    description: "Crémeux et rapide, un bon apport en oméga-3.",
    prep: 10, cook: 15, tags: "poisson,rapide", batch: false,
    ingredients: [
      ["pâtes", 100], ["pavé de saumon", 90], ["épinards frais", 60], ["crème fraîche légère", 50],
      ["citron", 0.25], ["parmesan", 10],
    ],
    steps: [
      "Cuire les pâtes.",
      "Cuire le saumon en dés 3 minutes, ajouter les épinards jusqu'à ce qu'ils tombent.",
      "Ajouter la crème et le zeste de citron, mélanger avec les pâtes et le parmesan.",
    ],
  },
  {
    title: "Velouté de butternut & croûtons",
    description: "Doux et onctueux, les enfants adorent sa couleur.",
    prep: 15, cook: 30, tags: "vege,leger", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["courge butternut", 250], ["oignon", 0.25], ["crème fraîche légère", 20], ["bouillon cube", 0.5],
      ["baguette", 50], ["huile d'olive", 5], ["gruyère râpé", 15],
    ],
    steps: [
      "Faire revenir l'oignon, ajouter la butternut en cubes et couvrir d'eau avec le bouillon.",
      "Cuire 25 minutes, mixer avec la crème.",
      "Servir avec des croûtons de baguette dorés à la poêle et un peu de gruyère.",
    ],
  },
  {
    title: "Tofu sauté, légumes & riz",
    description: "Version végétale du wok, riche en protéines.",
    prep: 15, cook: 15, tags: "vege,rapide,leger", batch: true,
    ingredients: [
      ["tofu ferme", 130], ["brocoli", 100], ["poivron", 60], ["riz basmati", 70], ["sauce soja", 15],
      ["gingembre frais", 3], ["ail", 0.5], ["huile d'olive", 8], ["noix de cajou", 10],
    ],
    steps: [
      "Cuire le riz. Couper le tofu en dés et le faire dorer dans l'huile.",
      "Ajouter les légumes, l'ail et le gingembre, sauter 5 minutes.",
      "Ajouter la sauce soja et les noix de cajou. Servir sur le riz.",
    ],
  },
  {
    title: "Saucisses, lentilles & carottes",
    description: "Plat mijoté rustique, très économique.",
    prep: 15, cook: 35, tags: "porc,famille,mijote", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["saucisse de Toulouse", 120], ["lentilles vertes", 70], ["carotte", 80], ["oignon", 0.25],
      ["bouillon cube", 0.25], ["herbes de Provence", 1],
    ],
    steps: [
      "Dorer les saucisses dans une cocotte, réserver.",
      "Faire revenir oignon et carottes en rondelles.",
      "Ajouter les lentilles rincées, le bouillon et 3 fois leur volume d'eau. Remettre les saucisses.",
      "Mijoter 30 minutes à couvert.",
    ],
  },
  {
    title: "Petits pois, carottes & œufs mollets",
    description: "Un dîner végétarien tout simple et doux.",
    prep: 10, cook: 20, tags: "oeuf,vege,rapide,leger", seasons: "printemps", batch: false,
    ingredients: [
      ["petits pois surgelés", 150], ["carotte", 100], ["oignon", 0.25], ["œuf", 2], ["beurre", 8], ["baguette", 40],
    ],
    steps: [
      "Faire suer l'oignon dans le beurre, ajouter carottes en rondelles et petits pois, un fond d'eau. Cuire 15 minutes.",
      "Cuire les œufs 6 minutes dans l'eau bouillante, les rafraîchir et les écaler.",
      "Servir les légumes avec les œufs mollets et du pain.",
    ],
  },
];
