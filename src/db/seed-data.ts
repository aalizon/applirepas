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
  // Ajouts v2
  { name: "concombre", category: FL, unit: "g", n: [13, 0.6, 2, 0.1] },
  { name: "céleri branche", category: FL, unit: "g", n: [16, 0.7, 2, 0.2] },
  { name: "menthe fraîche", category: FL, unit: "g", n: [45, 3.5, 5, 0.7] },
  { name: "veau (épaule)", category: BV, unit: "g", n: [130, 20, 0, 5.5] },
  { name: "chorizo", category: BV, unit: "g", n: [450, 24, 2, 38] },
  { name: "moules", category: PO, unit: "g", n: [30, 4, 1, 0.6] },
  { name: "ricotta", category: CO, unit: "g", n: [150, 9, 3, 11] },
  { name: "feta", category: CO, unit: "g", n: [265, 15, 1, 22] },
  { name: "pâte feuilletée", category: CO, unit: "piece", gramsPerPiece: 230, n: [400, 6, 38, 25] },
  { name: "pain pita", category: BO, unit: "piece", gramsPerPiece: 60, n: [270, 9, 55, 1.2] },
  { name: "farine de sarrasin", category: ES, unit: "g", n: [340, 13, 70, 3.4] },
  { name: "nouilles de riz", category: ES, unit: "g", n: [360, 6, 80, 0.6] },
  { name: "boulgour", category: ES, unit: "g", n: [350, 12, 69, 1.5] },
  { name: "cacahuètes", category: ES, unit: "g", n: [600, 26, 12, 49] },
  { name: "graines de sésame", category: ES, unit: "g", n: [580, 18, 12, 50] },
  { name: "olives vertes", category: ES, unit: "g", n: [145, 1, 1, 15] },
  { name: "chapelure", category: ES, unit: "g", n: [380, 12, 72, 4], pantry: true },
  { name: "sauce nuoc-mâm", category: CE, unit: "ml", n: [35, 5, 3, 0] },
  { name: "garam masala", category: CE, unit: "g", n: [380, 15, 45, 15], pantry: true },
  { name: "curcuma", category: CE, unit: "g", n: [310, 10, 60, 3], pantry: true },
  { name: "sucre", category: CE, unit: "g", n: [400, 0, 100, 0], pantry: true },
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
  // ----- Ajouts v2 -----
  {
    title: "Blanquette de veau",
    description: "Le grand classique mijoté, sauce onctueuse au riz.",
    prep: 30, cook: 90, tags: "viande,famille,mijote", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["veau (épaule)", 170], ["carotte", 80], ["champignon de Paris", 60], ["oignon", 0.25],
      ["crème fraîche légère", 40], ["farine", 8], ["beurre", 8], ["bouillon cube", 0.25],
      ["citron", 0.125], ["riz basmati", 70],
    ],
    steps: [
      "Couvrir la viande en morceaux d'eau froide avec le bouillon, porter à ébullition et écumer.",
      "Ajouter carottes et oignon, laisser frémir 1 h 15 à couvert.",
      "Faire revenir les champignons dans un peu de beurre. Cuire le riz.",
      "Préparer un roux (beurre + farine), le délayer avec 300 ml de bouillon de cuisson par 4 portions.",
      "Hors du feu, ajouter la crème et le jus de citron. Remettre viande, légumes et champignons.",
    ],
  },
  {
    title: "Pot-au-feu",
    description: "Bouillon parfumé, viande fondante et légumes d'hiver.",
    prep: 30, cook: 180, tags: "boeuf,famille,mijote", seasons: "hiver", batch: true,
    ingredients: [
      ["bœuf à braiser", 200], ["carotte", 120], ["poireau", 100], ["pomme de terre", 150],
      ["oignon", 0.25], ["céleri branche", 30], ["bouillon cube", 0.25], ["herbes de Provence", 1], ["moutarde", 10],
    ],
    steps: [
      "Mettre la viande dans une grande cocotte d'eau froide avec l'oignon, le bouillon et les herbes. Porter à ébullition, écumer.",
      "Laisser frémir 2 h à couvert.",
      "Ajouter carottes, poireaux et céleri, poursuivre 40 minutes.",
      "Ajouter les pommes de terre pour les 25 dernières minutes. Servir avec la moutarde.",
    ],
  },
  {
    title: "Moussaka",
    description: "Aubergines fondantes, viande épicée et béchamel gratinée.",
    prep: 35, cook: 45, tags: "boeuf,four", seasons: "ete,automne", batch: true,
    ingredients: [
      ["aubergine", 200], ["bœuf haché 5%", 100], ["oignon", 0.25], ["tomates concassées", 100],
      ["ail", 0.5], ["cumin", 1], ["lait demi-écrémé", 80], ["farine", 8], ["beurre", 8],
      ["gruyère râpé", 20], ["huile d'olive", 10],
    ],
    steps: [
      "Couper les aubergines en tranches, les badigeonner d'huile et les rôtir 20 minutes à 200 °C.",
      "Faire revenir oignon, ail et viande, ajouter tomates et cumin, mijoter 15 minutes.",
      "Préparer une béchamel avec beurre, farine et lait.",
      "Alterner aubergines et viande dans un plat, napper de béchamel, parsemer de gruyère. Cuire 30 minutes à 180 °C.",
    ],
  },
  {
    title: "Ratatouille & riz",
    description: "Les légumes du soleil mijotés, encore meilleurs le lendemain.",
    prep: 25, cook: 40, tags: "vege,leger", seasons: "ete", batch: true,
    ingredients: [
      ["courgette", 120], ["aubergine", 100], ["poivron", 80], ["tomate", 120], ["oignon", 0.25],
      ["ail", 0.5], ["herbes de Provence", 1], ["huile d'olive", 10], ["riz basmati", 60],
    ],
    steps: [
      "Couper tous les légumes en cubes.",
      "Faire revenir séparément aubergines puis courgettes dans l'huile, réserver.",
      "Faire fondre oignon, ail et poivrons, ajouter les tomates et les herbes.",
      "Remettre tous les légumes, couvrir et mijoter 30 minutes. Servir avec le riz.",
    ],
  },
  {
    title: "Poulet à la moutarde & riz",
    description: "Sauce crémeuse et relevée, prête en 30 minutes.",
    prep: 10, cook: 20, tags: "poulet,famille,rapide", batch: true,
    ingredients: [
      ["blanc de poulet", 140], ["moutarde", 15], ["crème fraîche légère", 50], ["échalote", 0.5],
      ["vin blanc", 20], ["riz basmati", 70], ["huile d'olive", 5],
    ],
    steps: [
      "Cuire le riz.",
      "Dorer le poulet en morceaux dans l'huile, réserver.",
      "Faire revenir l'échalote, déglacer au vin blanc, ajouter crème et moutarde.",
      "Remettre le poulet 5 minutes dans la sauce.",
    ],
  },
  {
    title: "Poulet tikka masala",
    description: "Poulet mariné au yaourt dans une sauce tomate épicée et douce.",
    prep: 20, cook: 25, tags: "poulet,famille", batch: true,
    ingredients: [
      ["blanc de poulet", 140], ["yaourt nature", 50], ["garam masala", 3], ["curcuma", 1],
      ["tomates concassées", 120], ["crème fraîche légère", 30], ["oignon", 0.25], ["ail", 0.5],
      ["gingembre frais", 5], ["riz basmati", 70], ["huile d'olive", 5], ["coriandre fraîche", 3],
    ],
    steps: [
      "Mélanger le poulet en morceaux avec le yaourt, la moitié des épices et une pincée de sel. Laisser mariner 15 minutes.",
      "Cuire le riz.",
      "Faire revenir oignon, ail et gingembre avec le reste des épices, ajouter les tomates et mijoter 10 minutes.",
      "Ajouter le poulet et sa marinade, cuire 10 minutes puis ajouter la crème. Parsemer de coriandre.",
    ],
  },
  {
    title: "Nuggets de poulet maison & frites au four",
    description: "La version maison, croustillante et sans friture, que les enfants adorent.",
    prep: 20, cook: 30, tags: "poulet,famille,four", batch: false,
    ingredients: [
      ["blanc de poulet", 120], ["œuf", 0.5], ["chapelure", 30], ["farine", 10], ["paprika", 1],
      ["pomme de terre", 200], ["huile d'olive", 10], ["salade verte", 30],
    ],
    steps: [
      "Couper les pommes de terre en frites, les mélanger avec la moitié de l'huile. Enfourner 30 minutes à 220 °C.",
      "Couper le poulet en morceaux, les passer dans la farine, l'œuf battu puis la chapelure au paprika.",
      "Disposer sur une plaque, arroser du reste d'huile et cuire 15 minutes avec les frites.",
      "Servir avec la salade.",
    ],
  },
  {
    title: "Gratin de pâtes jambon-fromage",
    description: "Le gratin réconfortant du mercredi, prêt en 30 minutes.",
    prep: 15, cook: 20, tags: "porc,famille,four", batch: true,
    ingredients: [
      ["pâtes", 90], ["jambon blanc", 50], ["crème fraîche légère", 40], ["lait demi-écrémé", 50],
      ["gruyère râpé", 35], ["salade verte", 30],
    ],
    steps: [
      "Cuire les pâtes 2 minutes de moins que le temps indiqué.",
      "Mélanger avec le jambon en dés, la crème, le lait et la moitié du gruyère.",
      "Verser dans un plat, couvrir du reste de gruyère et gratiner 15 minutes à 210 °C. Servir avec la salade.",
    ],
  },
  {
    title: "Minestrone",
    description: "Soupe italienne complète aux légumes et petites pâtes.",
    prep: 20, cook: 30, tags: "vege,leger", seasons: "printemps,automne,hiver", batch: true,
    ingredients: [
      ["carotte", 60], ["courgette", 60], ["céleri branche", 30], ["poireau", 50], ["tomates concassées", 100],
      ["haricots rouges (conserve)", 60], ["pâtes", 30], ["bouillon cube", 0.5], ["parmesan", 10], ["huile d'olive", 5],
    ],
    steps: [
      "Faire revenir poireau, carotte et céleri en petits dés dans l'huile.",
      "Ajouter courgette, tomates, bouillon et 300 ml d'eau par portion. Cuire 20 minutes.",
      "Ajouter les haricots et les pâtes, cuire 10 minutes. Servir avec le parmesan.",
    ],
  },
  {
    title: "Salade César au poulet",
    description: "Poulet grillé, croûtons et parmesan : la salade qui cale.",
    prep: 20, cook: 10, tags: "poulet,rapide,leger", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["blanc de poulet", 120], ["salade verte", 80], ["parmesan", 15], ["baguette", 30],
      ["yaourt nature", 30], ["moutarde", 5], ["citron", 0.125], ["ail", 0.25], ["huile d'olive", 10],
    ],
    steps: [
      "Griller le poulet à la poêle 6 minutes par face, le trancher.",
      "Dorer les cubes de pain dans une poêle avec un filet d'huile.",
      "Sauce : yaourt, moutarde, citron, ail râpé, un peu de parmesan.",
      "Assembler salade, poulet, croûtons, copeaux de parmesan et sauce.",
    ],
  },
  {
    title: "Poke bowl au saumon",
    description: "Riz, saumon mariné, avocat et crudités.",
    prep: 20, cook: 15, tags: "poisson,leger", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["pavé de saumon", 110], ["riz basmati", 70], ["avocat", 0.5], ["concombre", 60], ["carotte", 40],
      ["maïs (conserve)", 30], ["sauce soja", 15], ["graines de sésame", 5], ["vinaigre", 5],
    ],
    steps: [
      "Cuire le riz, l'assaisonner d'un peu de vinaigre et laisser tiédir.",
      "Couper le saumon en cubes et le mariner 10 minutes dans la sauce soja.",
      "Trancher avocat et concombre, râper la carotte.",
      "Dresser le riz et les garnitures, parsemer de sésame.",
    ],
  },
  {
    title: "Poisson pané maison & purée",
    description: "Cabillaud en croûte dorée et purée maison.",
    prep: 20, cook: 25, tags: "poisson,famille", batch: false,
    ingredients: [
      ["filet de cabillaud", 140], ["chapelure", 25], ["œuf", 0.5], ["farine", 10], ["pomme de terre", 220],
      ["lait demi-écrémé", 50], ["beurre", 10], ["huile d'olive", 10], ["citron", 0.25],
    ],
    steps: [
      "Cuire les pommes de terre 20 minutes, les écraser avec le lait chaud et le beurre.",
      "Passer le poisson dans la farine, l'œuf battu puis la chapelure.",
      "Dorer 3 à 4 minutes par face dans l'huile. Servir avec la purée et le citron.",
    ],
  },
  {
    title: "Moules marinières & frites au four",
    description: "Le repas convivial du bord de mer.",
    prep: 20, cook: 30, tags: "poisson,famille", seasons: "ete,automne", batch: false,
    ingredients: [
      ["moules", 400], ["échalote", 0.5], ["vin blanc", 50], ["persil", 5], ["beurre", 8],
      ["pomme de terre", 250], ["huile d'olive", 10],
    ],
    steps: [
      "Couper les pommes de terre en frites, les mélanger avec l'huile et les cuire 30 minutes à 220 °C.",
      "Nettoyer les moules.",
      "Faire fondre l'échalote dans le beurre, ajouter le vin blanc puis les moules. Couvrir 6 à 8 minutes en remuant.",
      "Parsemer de persil et servir avec les frites.",
    ],
  },
  {
    title: "Paella au poulet & chorizo",
    description: "Le plat du dimanche à partager, safrané au curcuma.",
    prep: 25, cook: 35, tags: "poulet,porc,famille", seasons: "ete", batch: true,
    ingredients: [
      ["cuisse de poulet", 120], ["crevettes décortiquées", 50], ["chorizo", 25], ["riz arborio", 80],
      ["poivron", 60], ["petits pois surgelés", 40], ["oignon", 0.25], ["tomates concassées", 60],
      ["curcuma", 1], ["paprika", 1], ["bouillon cube", 0.5], ["huile d'olive", 10], ["citron", 0.25],
    ],
    steps: [
      "Dorer le poulet dans l'huile, ajouter le chorizo en rondelles puis l'oignon et le poivron.",
      "Ajouter le riz, les épices et les tomates, mélanger 2 minutes.",
      "Mouiller avec 250 ml de bouillon par portion, cuire 20 minutes sans remuer.",
      "Ajouter crevettes et petits pois, poursuivre 8 minutes. Servir avec le citron.",
    ],
  },
  {
    title: "Lasagnes épinards-ricotta",
    description: "Une version végétarienne douce et gourmande.",
    prep: 25, cook: 40, tags: "vege,famille,four", batch: true,
    ingredients: [
      ["feuilles de lasagne", 60], ["épinards frais", 150], ["ricotta", 80], ["coulis de tomate", 100],
      ["mozzarella", 40], ["parmesan", 10], ["ail", 0.5], ["huile d'olive", 5],
    ],
    steps: [
      "Faire tomber les épinards avec l'ail dans l'huile, les égoutter et les mélanger à la ricotta.",
      "Dans un plat : coulis, lasagnes, mélange épinards-ricotta, puis recommencer.",
      "Finir par le coulis, la mozzarella et le parmesan. Cuire 35 minutes à 180 °C.",
    ],
  },
  {
    title: "Chili sin carne",
    description: "La version 100 % végétale du chili, riche en fibres.",
    prep: 15, cook: 30, tags: "vege,leger", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["haricots rouges (conserve)", 150], ["lentilles corail", 30], ["poivron", 60], ["oignon", 0.25],
      ["tomates concassées", 150], ["maïs (conserve)", 40], ["cumin", 2], ["paprika", 1], ["ail", 0.5],
      ["riz basmati", 60], ["huile d'olive", 5],
    ],
    steps: [
      "Faire revenir oignon, ail et poivron dans l'huile avec les épices.",
      "Ajouter tomates, lentilles rincées et 100 ml d'eau par portion. Mijoter 20 minutes.",
      "Ajouter haricots rouges et maïs, poursuivre 10 minutes. Servir avec le riz.",
    ],
  },
  {
    title: "Falafels, taboulé & sauce yaourt",
    description: "Boulettes de pois chiches croustillantes façon street-food.",
    prep: 30, cook: 15, tags: "vege", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["pois chiches (conserve)", 130], ["oignon", 0.15], ["ail", 0.5], ["persil", 8], ["cumin", 2],
      ["farine", 15], ["boulgour", 50], ["tomate", 60], ["concombre", 50], ["menthe fraîche", 3],
      ["citron", 0.25], ["yaourt nature", 50], ["pain pita", 1], ["huile d'olive", 15],
    ],
    steps: [
      "Mixer les pois chiches égouttés avec oignon, ail, persil, cumin et farine. Former des boulettes.",
      "Cuire le boulgour 10 minutes, le mélanger avec tomate, concombre, menthe, citron et un filet d'huile.",
      "Dorer les falafels dans l'huile 3 minutes par face.",
      "Servir avec la sauce yaourt et le pain pita.",
    ],
  },
  {
    title: "Taboulé libanais & feta",
    description: "Frais et parfumé, idéal pour la gamelle d'été.",
    prep: 20, cook: 10, tags: "vege,rapide,leger", seasons: "printemps,ete", batch: true,
    ingredients: [
      ["boulgour", 60], ["tomate", 100], ["concombre", 80], ["persil", 15], ["menthe fraîche", 5],
      ["citron", 0.5], ["feta", 40], ["huile d'olive", 10],
    ],
    steps: [
      "Cuire le boulgour 10 minutes, l'égoutter et le laisser refroidir.",
      "Couper tomates et concombre en petits dés, ciseler persil et menthe.",
      "Mélanger le tout avec le jus de citron, l'huile et la feta émiettée.",
    ],
  },
  {
    title: "Quiche aux poireaux",
    description: "Fondue de poireaux et pâte croustillante.",
    prep: 20, cook: 35, tags: "vege,oeuf,four", seasons: "automne,hiver,printemps", batch: true,
    ingredients: [
      ["pâte brisée", 0.25], ["poireau", 150], ["œuf", 0.75], ["crème fraîche légère", 50],
      ["gruyère râpé", 20], ["beurre", 5], ["salade verte", 40],
    ],
    steps: [
      "Faire fondre les poireaux émincés dans le beurre 10 minutes.",
      "Foncer le moule avec la pâte, y répartir les poireaux.",
      "Battre œufs et crème, verser, parsemer de gruyère. Cuire 35 minutes à 180 °C.",
    ],
  },
  {
    title: "Galettes de sarrasin complètes",
    description: "Jambon, œuf, fromage : la galette bretonne, naturellement sans gluten.",
    prep: 15, cook: 20, tags: "porc,oeuf,famille,rapide", batch: false,
    ingredients: [
      ["farine de sarrasin", 60], ["œuf", 1.25], ["jambon blanc", 40], ["gruyère râpé", 30],
      ["beurre", 8], ["salade verte", 30],
    ],
    steps: [
      "Mélanger la farine de sarrasin avec 150 ml d'eau par portion, un quart d'œuf battu et une pincée de sel. Laisser reposer 10 minutes.",
      "Cuire une galette dans une poêle beurrée bien chaude.",
      "Garnir de gruyère, jambon, casser un œuf au centre. Replier les bords et cuire jusqu'à ce que le blanc soit pris.",
    ],
  },
  {
    title: "Rôti de porc & purée maison",
    description: "Le rôti du dimanche, les tranches restantes font de parfaites lunchbox.",
    prep: 15, cook: 60, tags: "porc,famille,four", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["filet mignon de porc", 160], ["pomme de terre", 220], ["lait demi-écrémé", 50], ["beurre", 10],
      ["ail", 0.5], ["herbes de Provence", 1], ["huile d'olive", 5], ["haricots verts", 100],
    ],
    steps: [
      "Frotter la viande d'ail, d'herbes et d'huile, la rôtir 45 minutes à 180 °C.",
      "Cuire les pommes de terre et les haricots verts à l'eau salée.",
      "Écraser les pommes de terre avec le lait chaud et le beurre.",
      "Laisser reposer le rôti 10 minutes avant de le trancher.",
    ],
  },
  {
    title: "Porc au caramel & riz",
    description: "Le classique vietnamien sucré-salé.",
    prep: 15, cook: 30, tags: "porc", batch: true,
    ingredients: [
      ["filet mignon de porc", 140], ["sucre", 15], ["sauce nuoc-mâm", 10], ["sauce soja", 10],
      ["oignon", 0.25], ["ail", 0.5], ["riz basmati", 70], ["haricots verts", 80], ["huile d'olive", 5],
    ],
    steps: [
      "Faire un caramel à sec avec le sucre, le détendre avec 50 ml d'eau chaude par portion.",
      "Dorer la viande en cubes avec oignon et ail dans l'huile.",
      "Ajouter caramel, nuoc-mâm et soja, laisser mijoter 20 minutes jusqu'à ce que la sauce nappe.",
      "Servir avec le riz et les haricots verts.",
    ],
  },
  {
    title: "Pad thaï aux crevettes",
    description: "Nouilles de riz sautées, cacahuètes et citron vert.",
    prep: 20, cook: 10, tags: "poisson,rapide", batch: false,
    ingredients: [
      ["nouilles de riz", 80], ["crevettes décortiquées", 90], ["œuf", 1], ["carotte", 40],
      ["cacahuètes", 15], ["sauce nuoc-mâm", 10], ["sauce soja", 10], ["sucre", 5],
      ["citron", 0.25], ["coriandre fraîche", 3], ["huile d'olive", 8],
    ],
    steps: [
      "Faire tremper les nouilles dans l'eau chaude 8 minutes, les égoutter.",
      "Sauter les crevettes et la carotte râpée 2 minutes, pousser sur le côté et brouiller l'œuf.",
      "Ajouter nouilles, nuoc-mâm, soja et sucre, mélanger 2 minutes.",
      "Servir avec cacahuètes concassées, coriandre et citron.",
    ],
  },
  {
    title: "Riz cantonais",
    description: "Idéal pour finir un reste de riz, prêt en 15 minutes.",
    prep: 10, cook: 10, tags: "porc,oeuf,rapide,famille", batch: true,
    ingredients: [
      ["riz basmati", 70], ["jambon blanc", 40], ["œuf", 1], ["petits pois surgelés", 50],
      ["oignon", 0.15], ["sauce soja", 10], ["huile d'olive", 8],
    ],
    steps: [
      "Cuire le riz (ou utiliser un reste froid).",
      "Brouiller les œufs dans l'huile, réserver.",
      "Sauter l'oignon, les petits pois et le jambon en dés, ajouter le riz et la sauce soja.",
      "Remettre les œufs, mélanger et servir bien chaud.",
    ],
  },
  {
    title: "Fajitas de bœuf",
    description: "Lamelles de bœuf et poivrons épicés à garnir soi-même.",
    prep: 20, cook: 10, tags: "boeuf,rapide,famille", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["bœuf émincé", 110], ["tortilla de blé", 2], ["poivron", 100], ["oignon", 0.25], ["cumin", 1],
      ["paprika", 1], ["yaourt nature", 30], ["avocat", 0.25], ["salade verte", 20], ["huile d'olive", 8],
    ],
    steps: [
      "Saisir le bœuf avec les épices 2 minutes à feu vif, réserver.",
      "Sauter poivrons et oignon en lanières 5 minutes, remettre la viande.",
      "Réchauffer les tortillas et garnir de viande, salade, avocat et yaourt.",
    ],
  },
  {
    title: "Omelette aux champignons & salade",
    description: "Le dîner express quand on rentre tard.",
    prep: 10, cook: 10, tags: "oeuf,vege,rapide,leger", batch: false,
    ingredients: [
      ["œuf", 2.5], ["champignon de Paris", 100], ["persil", 3], ["gruyère râpé", 15], ["beurre", 5],
      ["salade verte", 50], ["huile d'olive", 5], ["vinaigre", 3], ["baguette", 40],
    ],
    steps: [
      "Faire sauter les champignons émincés dans le beurre.",
      "Battre les œufs avec le persil, verser sur les champignons et cuire à feu moyen.",
      "Parsemer de gruyère, plier l'omelette. Servir avec la salade et le pain.",
    ],
  },
  {
    title: "Curry de pois chiches & épinards",
    description: "Curry végétal au lait de coco, prêt en 25 minutes.",
    prep: 10, cook: 20, tags: "vege,leger,rapide", batch: true,
    ingredients: [
      ["pois chiches (conserve)", 140], ["épinards frais", 60], ["lait de coco", 80], ["tomates concassées", 100],
      ["oignon", 0.25], ["ail", 0.5], ["gingembre frais", 5], ["curry en poudre", 3], ["riz basmati", 60],
      ["huile d'olive", 5],
    ],
    steps: [
      "Faire revenir oignon, ail, gingembre et curry dans l'huile.",
      "Ajouter tomates, lait de coco et pois chiches, mijoter 15 minutes.",
      "Ajouter les épinards 2 minutes avant la fin. Servir avec le riz.",
    ],
  },
  {
    title: "Soupe de nouilles au poulet",
    description: "Bouillon parfumé au gingembre, façon ramen express.",
    prep: 15, cook: 20, tags: "poulet,leger", seasons: "automne,hiver", batch: false,
    ingredients: [
      ["blanc de poulet", 100], ["nouilles chinoises", 60], ["carotte", 50], ["épinards frais", 40],
      ["gingembre frais", 5], ["ail", 0.5], ["sauce soja", 15], ["bouillon cube", 0.5], ["œuf", 1],
    ],
    steps: [
      "Porter 400 ml d'eau par portion à ébullition avec le bouillon, le gingembre, l'ail et la sauce soja.",
      "Y pocher le poulet 12 minutes, le sortir et l'effilocher. Cuire les œufs 6 minutes à part.",
      "Cuire les nouilles et la carotte en julienne dans le bouillon 4 minutes, ajouter les épinards.",
      "Servir dans des bols avec le poulet et l'œuf coupé en deux.",
    ],
  },
  {
    title: "Tajine de poulet aux citrons & olives",
    description: "Mijoté parfumé, servi avec de la semoule.",
    prep: 20, cook: 50, tags: "poulet,mijote", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["cuisse de poulet", 200], ["oignon", 0.5], ["citron", 0.25], ["olives vertes", 25], ["ail", 0.5],
      ["gingembre frais", 3], ["curcuma", 1], ["coriandre fraîche", 3], ["semoule", 70], ["huile d'olive", 8],
    ],
    steps: [
      "Dorer le poulet dans l'huile, ajouter oignons émincés, ail, gingembre et curcuma.",
      "Mouiller avec 150 ml d'eau par portion, couvrir et mijoter 40 minutes.",
      "Ajouter citron en quartiers et olives, poursuivre 10 minutes.",
      "Préparer la semoule, parsemer de coriandre.",
    ],
  },
  {
    title: "Gnocchis à la sorrentine",
    description: "Gratinés à la tomate et à la mozzarella filante.",
    prep: 10, cook: 20, tags: "vege,famille,four", batch: false,
    ingredients: [
      ["gnocchi", 200], ["coulis de tomate", 120], ["mozzarella", 60], ["parmesan", 10], ["ail", 0.5],
      ["huile d'olive", 5], ["herbes de Provence", 1],
    ],
    steps: [
      "Faire chauffer le coulis avec l'ail et les herbes 5 minutes.",
      "Cuire les gnocchis 2 minutes à l'eau bouillante, les mélanger à la sauce.",
      "Verser dans un plat, couvrir de mozzarella et de parmesan, gratiner 10 minutes à 220 °C.",
    ],
  },
  {
    title: "Frittata courgettes & feta",
    description: "Omelette épaisse au four, délicieuse froide en gamelle.",
    prep: 15, cook: 20, tags: "oeuf,vege,leger", seasons: "printemps,ete", batch: true,
    ingredients: [
      ["œuf", 2], ["courgette", 150], ["feta", 35], ["menthe fraîche", 2], ["oignon", 0.15],
      ["huile d'olive", 8], ["salade verte", 40],
    ],
    steps: [
      "Faire revenir oignon et courgettes en rondelles fines dans une poêle allant au four.",
      "Battre les œufs avec la menthe, verser sur les légumes, émietter la feta.",
      "Cuire 5 minutes sur le feu puis 12 minutes au four à 190 °C. Servir avec la salade.",
    ],
  },
  {
    title: "Steak haché, haricots verts & purée",
    description: "Le repas simple qui met tout le monde d'accord.",
    prep: 15, cook: 25, tags: "boeuf,famille,rapide", batch: false,
    ingredients: [
      ["bœuf haché 5%", 120], ["haricots verts", 120], ["pomme de terre", 200], ["lait demi-écrémé", 50],
      ["beurre", 10], ["échalote", 0.25],
    ],
    steps: [
      "Cuire pommes de terre et haricots verts à l'eau salée.",
      "Écraser les pommes de terre avec le lait chaud et la moitié du beurre.",
      "Faire sauter les haricots avec l'échalote et le reste du beurre.",
      "Cuire les steaks 2 à 3 minutes par face.",
    ],
  },
  {
    title: "Papillote de saumon aux poireaux",
    description: "Saumon fondant sur une fondue de poireaux, cuisson sans surveillance.",
    prep: 15, cook: 20, tags: "poisson,leger,four", seasons: "automne,hiver,printemps", batch: false,
    ingredients: [
      ["pavé de saumon", 130], ["poireau", 150], ["crème fraîche légère", 20], ["citron", 0.25],
      ["riz basmati", 60], ["beurre", 5],
    ],
    steps: [
      "Faire fondre les poireaux émincés dans le beurre 8 minutes, ajouter la crème.",
      "Répartir sur des feuilles de papier cuisson, poser le saumon, ajouter une rondelle de citron. Fermer.",
      "Cuire 15 minutes à 200 °C. Servir avec le riz.",
    ],
  },
  {
    title: "Bo bun au bœuf",
    description: "Salade tiède vietnamienne, fraîche et croquante.",
    prep: 25, cook: 10, tags: "boeuf,leger", seasons: "printemps,ete", batch: false,
    ingredients: [
      ["bœuf émincé", 100], ["nouilles de riz", 60], ["salade verte", 40], ["carotte", 50], ["concombre", 50],
      ["menthe fraîche", 3], ["cacahuètes", 15], ["sauce nuoc-mâm", 15], ["sucre", 5], ["citron", 0.25],
      ["ail", 0.5], ["huile d'olive", 5],
    ],
    steps: [
      "Préparer la sauce : nuoc-mâm, sucre, jus de citron, ail et 30 ml d'eau par portion.",
      "Cuire les nouilles, les rincer à l'eau froide.",
      "Saisir le bœuf avec un peu de sauce 2 minutes.",
      "Dresser : salade, nouilles, crudités, bœuf, menthe et cacahuètes. Arroser de sauce.",
    ],
  },
  {
    title: "Pâtes au pesto, tomates cerises & mozzarella",
    description: "Le plat d'été express, chaud ou en salade.",
    prep: 10, cook: 12, tags: "vege,rapide,famille", seasons: "printemps,ete", batch: true,
    ingredients: [
      ["pâtes", 100], ["pesto", 25], ["tomate cerise", 80], ["mozzarella", 50], ["parmesan", 10],
    ],
    steps: [
      "Cuire les pâtes al dente.",
      "Couper les tomates cerises en deux et la mozzarella en dés.",
      "Mélanger les pâtes égouttées avec le pesto, les tomates, la mozzarella et le parmesan.",
    ],
  },
  {
    title: "Soupe de lentilles corail & carottes",
    description: "Velouté vegan, doux et rassasiant.",
    prep: 10, cook: 25, tags: "vege,leger", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["lentilles corail", 50], ["carotte", 150], ["oignon", 0.25], ["lait de coco", 50], ["cumin", 1],
      ["bouillon cube", 0.5], ["huile d'olive", 5], ["baguette", 40],
    ],
    steps: [
      "Faire revenir l'oignon et le cumin dans l'huile.",
      "Ajouter carottes en rondelles, lentilles rincées, bouillon et 350 ml d'eau par portion. Cuire 20 minutes.",
      "Mixer avec le lait de coco. Servir avec du pain.",
    ],
  },
  {
    title: "Tarte fine tomates-moutarde",
    description: "Tarte d'été croustillante, parfaite avec une salade.",
    prep: 15, cook: 30, tags: "vege,four", seasons: "ete", batch: false,
    ingredients: [
      ["pâte feuilletée", 0.25], ["tomate", 150], ["moutarde", 15], ["gruyère râpé", 20],
      ["herbes de Provence", 1], ["huile d'olive", 5], ["salade verte", 40],
    ],
    steps: [
      "Étaler la pâte, la badigeonner de moutarde et parsemer de gruyère.",
      "Couvrir de rondelles de tomates, arroser d'huile, parsemer d'herbes.",
      "Cuire 30 minutes à 200 °C. Servir avec la salade.",
    ],
  },
  {
    title: "Hachis parmentier de patate douce",
    description: "La version colorée et plus douce du parmentier.",
    prep: 25, cook: 25, tags: "boeuf,famille,four", seasons: "automne,hiver", batch: true,
    ingredients: [
      ["patate douce", 220], ["bœuf haché 5%", 100], ["oignon", 0.25], ["carotte", 40],
      ["beurre", 8], ["gruyère râpé", 15], ["cumin", 1],
    ],
    steps: [
      "Cuire les patates douces 15 minutes à l'eau, les écraser avec le beurre.",
      "Faire revenir oignon, carotte râpée et viande avec le cumin.",
      "Monter en plat, parsemer de gruyère et gratiner 20 minutes à 200 °C.",
    ],
  },
  {
    title: "Saucisses, purée & compotée d'oignons",
    description: "Bistrot et réconfortant, prêt en 30 minutes.",
    prep: 15, cook: 30, tags: "porc,famille", seasons: "automne,hiver", batch: false,
    ingredients: [
      ["saucisse de Toulouse", 120], ["pomme de terre", 220], ["lait demi-écrémé", 50], ["beurre", 10],
      ["oignon", 0.5], ["sucre", 3], ["vinaigre", 5], ["salade verte", 30],
    ],
    steps: [
      "Cuire les pommes de terre et préparer une purée avec le lait et le beurre.",
      "Faire fondre les oignons émincés 20 minutes à feu doux avec le sucre et le vinaigre.",
      "Cuire les saucisses à la poêle 15 minutes en les retournant.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Allergènes (les 14 allergènes à déclaration obligatoire, règlement UE 1169/2011)
// et origine animale des ingrédients, pour les allergies et régimes de chaque membre.
// ---------------------------------------------------------------------------

export const ALLERGENS = [
  { code: "gluten", label: "Gluten" },
  { code: "crustaces", label: "Crustacés" },
  { code: "oeufs", label: "Œufs" },
  { code: "poissons", label: "Poissons" },
  { code: "arachides", label: "Arachides" },
  { code: "soja", label: "Soja" },
  { code: "lait", label: "Lait" },
  { code: "fruits-a-coque", label: "Fruits à coque" },
  { code: "celeri", label: "Céleri" },
  { code: "moutarde", label: "Moutarde" },
  { code: "sesame", label: "Sésame" },
  { code: "sulfites", label: "Sulfites" },
  { code: "lupin", label: "Lupin" },
  { code: "mollusques", label: "Mollusques" },
] as const;

export const DIETS = [
  { code: "", label: "Mange de tout" },
  { code: "sans-porc", label: "Sans porc" },
  { code: "pescetarien", label: "Pescétarien (poisson, pas de viande)" },
  { code: "vegetarien", label: "Végétarien" },
  { code: "vegan", label: "Végétalien (vegan)" },
] as const;

export const SEED_ALLERGENS: Record<string, string> = {
  "pâtes": "gluten", "spaghetti": "gluten", "feuilles de lasagne": "gluten,oeufs", "nouilles chinoises": "gluten,oeufs",
  "semoule": "gluten", "boulgour": "gluten", "farine": "gluten", "chapelure": "gluten", "baguette": "gluten",
  "pain de mie": "gluten,lait", "pain burger": "gluten,lait,sesame", "tortilla de blé": "gluten", "pain pita": "gluten",
  "pâte brisée": "gluten,lait", "pâte feuilletée": "gluten,lait", "pâte à pizza": "gluten", "gnocchi": "gluten",
  "bouillon cube": "celeri", "sauce soja": "soja,gluten", "tofu ferme": "soja",
  "œuf": "oeufs",
  "beurre": "lait", "crème fraîche légère": "lait", "lait demi-écrémé": "lait", "yaourt nature": "lait",
  "gruyère râpé": "lait", "parmesan": "lait", "mozzarella": "lait", "cheddar": "lait", "fromage de chèvre": "lait",
  "reblochon": "lait", "ricotta": "lait", "feta": "lait", "pesto": "lait,fruits-a-coque",
  "filet de cabillaud": "poissons", "pavé de saumon": "poissons", "thon au naturel": "poissons", "sauce nuoc-mâm": "poissons",
  "crevettes décortiquées": "crustaces", "pâte de curry rouge": "crustaces", "moules": "mollusques",
  "noix de cajou": "fruits-a-coque", "cacahuètes": "arachides", "graines de sésame": "sesame",
  "céleri branche": "celeri", "moutarde": "moutarde",
  "vin blanc": "sulfites", "vin rouge": "sulfites", "vinaigre": "sulfites",
};

/** Origine animale : volaille | boeuf | porc | viande (autre) | poisson | crustace | mollusque | animal (miel…) */
export const SEED_ANIMAL: Record<string, string> = {
  "blanc de poulet": "volaille", "cuisse de poulet": "volaille", "escalope de dinde": "volaille",
  "bœuf haché 5%": "boeuf", "bœuf à braiser": "boeuf", "bœuf émincé": "boeuf", "veau (épaule)": "viande",
  "filet mignon de porc": "porc", "lardons fumés": "porc", "jambon blanc": "porc", "saucisse de Toulouse": "porc",
  "chorizo": "porc",
  "filet de cabillaud": "poisson", "pavé de saumon": "poisson", "thon au naturel": "poisson", "sauce nuoc-mâm": "poisson",
  "crevettes décortiquées": "crustace", "pâte de curry rouge": "crustace", "moules": "mollusque",
  "miel": "animal",
};
