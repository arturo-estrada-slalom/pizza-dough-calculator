import { RECIPE_INGREDIENTS, TOTAL_BAKERS_PERCENTAGE } from "./recipe";
import type { Recipe } from "./types";

export function calculateFlourWeight(totalDoughWeight: number): number {
  return totalDoughWeight / TOTAL_BAKERS_PERCENTAGE;
}

// Derives all six ingredient weights from total dough weight using the
// fixed baker's percentages defined once in ./recipe (docs/PROJECT.md).
export function calculateRecipe(totalDoughWeight: number): Recipe {
  const flourWeight = calculateFlourWeight(totalDoughWeight);

  return {
    flour: flourWeight * RECIPE_INGREDIENTS.flour.bakersPercentage,
    water: flourWeight * RECIPE_INGREDIENTS.water.bakersPercentage,
    yeast: flourWeight * RECIPE_INGREDIENTS.yeast.bakersPercentage,
    salt: flourWeight * RECIPE_INGREDIENTS.salt.bakersPercentage,
    sugar: flourWeight * RECIPE_INGREDIENTS.sugar.bakersPercentage,
    oliveOil: flourWeight * RECIPE_INGREDIENTS.oliveOil.bakersPercentage,
  };
}
