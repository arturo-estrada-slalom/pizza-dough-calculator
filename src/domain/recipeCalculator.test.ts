import { describe, it, expect } from "vitest";
import { calculateFlourWeight, calculateRecipe } from "./recipeCalculator";

describe("calculateFlourWeight", () => {
  it("returns approximately 1692.13g of flour for 2880g of total dough", () => {
    expect(calculateFlourWeight(2880)).toBeCloseTo(1692.13, 2);
  });
});

describe("calculateRecipe", () => {
  it("returns the canonical six 16-inch pizzas ingredient breakdown", () => {
    const recipe = calculateRecipe(2880);

    expect(recipe.flour).toBeCloseTo(1692.13, 2);
    expect(recipe.water).toBeCloseTo(1049.12, 2);
    expect(recipe.yeast).toBeCloseTo(6.77, 2);
    expect(recipe.salt).toBeCloseTo(42.3, 2);
    expect(recipe.sugar).toBeCloseTo(33.84, 2);
    expect(recipe.oliveOil).toBeCloseTo(55.84, 2);
  });

  it("sums the ingredient weights back to the total dough weight", () => {
    const totalDoughWeight = 2880;

    const recipe = calculateRecipe(totalDoughWeight);
    const sum =
      recipe.flour +
      recipe.water +
      recipe.yeast +
      recipe.salt +
      recipe.sugar +
      recipe.oliveOil;

    expect(sum).toBeCloseTo(totalDoughWeight, 2);
  });

  it("scales correctly at the minimum pizza-count boundary (1 pizza, 16 inches)", () => {
    const totalDoughWeight = 480;

    const recipe = calculateRecipe(totalDoughWeight);
    const sum =
      recipe.flour +
      recipe.water +
      recipe.yeast +
      recipe.salt +
      recipe.sugar +
      recipe.oliveOil;

    expect(sum).toBeCloseTo(totalDoughWeight, 2);
  });

  it("scales correctly at the maximum pizza-count boundary (100 pizzas, 16 inches)", () => {
    const totalDoughWeight = 48000;

    const recipe = calculateRecipe(totalDoughWeight);
    const sum =
      recipe.flour +
      recipe.water +
      recipe.yeast +
      recipe.salt +
      recipe.sugar +
      recipe.oliveOil;

    expect(sum).toBeCloseTo(totalDoughWeight, 2);
  });
});
