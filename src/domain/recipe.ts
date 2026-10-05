import type { IngredientDefinition, IngredientKey, Thickness } from "./types";

// Single source of truth for the reference pizza (docs/PROJECT.md).
export const REFERENCE_PIZZA = {
  diameter: 16,
  doughWeight: 480,
};

// Single source of truth for thickness multipliers applied to the Standard
// dough-ball weight (docs/stories/005-thickness-factors.md).
export const THICKNESS_FACTORS: Record<Thickness, number> = {
  thin: 0.8,
  standard: 1.0,
  thick: 1.2,
};

export const DEFAULT_THICKNESS: Thickness = "standard";

export const RECIPE_INGREDIENT_ORDER: IngredientKey[] = [
  "flour",
  "water",
  "yeast",
  "salt",
  "sugar",
  "oliveOil",
];

// Single source of truth for the fixed recipe's baker's percentages
// (docs/PROJECT.md). `bakersPercentage` drives calculation;
// `bakersPercentageDisplay` is the documented fixed display string.
// Display names are a presentation/localization concern resolved by the
// presentation layer from `key` (docs/ARCHITECTURE.md "Localization") and
// are not stored here.
export const RECIPE_INGREDIENTS: Record<IngredientKey, IngredientDefinition> =
{
  flour: {
    key: "flour",
    bakersPercentage: 1,
    bakersPercentageDisplay: "100",
    isBase: true,
  },
  water: {
    key: "water",
    bakersPercentage: 0.62,
    bakersPercentageDisplay: "62",
  },
  yeast: {
    key: "yeast",
    bakersPercentage: 0.004,
    bakersPercentageDisplay: "0.4",
  },
  salt: {
    key: "salt",
    bakersPercentage: 0.025,
    bakersPercentageDisplay: "2.5",
  },
  sugar: {
    key: "sugar",
    bakersPercentage: 0.02,
    bakersPercentageDisplay: "2.0",
  },
  oliveOil: {
    key: "oliveOil",
    bakersPercentage: 0.033,
    bakersPercentageDisplay: "3.3",
  },
};

export const TOTAL_BAKERS_PERCENTAGE = RECIPE_INGREDIENT_ORDER.reduce(
  (sum, key) => sum + RECIPE_INGREDIENTS[key].bakersPercentage,
  0,
);

// Hydration is always the fixed water baker's percentage (docs/PROJECT.md).
export const HYDRATION_PERCENT_DISPLAY =
  RECIPE_INGREDIENTS.water.bakersPercentageDisplay;
