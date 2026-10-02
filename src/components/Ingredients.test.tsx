import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Ingredients } from "./Ingredients";
import type { Recipe } from "../domain/types";

const CANONICAL_RECIPE: Recipe = {
  flour: 1692.13,
  water: 1049.12,
  yeast: 6.77,
  salt: 42.3,
  sugar: 33.84,
  oliveOil: 55.84,
};

describe("<Ingredients />", () => {
  it("renders the Ingredients heading", () => {
    render(
      <Ingredients
        recipe={CANONICAL_RECIPE}
        totalDoughWeightGrams={2880}
        pizzaCount={6}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Ingredients" }),
    ).toBeInTheDocument();
  });

  it("lists all six ingredients with a name, weight in grams, and baker's percentage", () => {
    render(
      <Ingredients
        recipe={CANONICAL_RECIPE}
        totalDoughWeightGrams={2880}
        pizzaCount={6}
      />,
    );

    const table = screen.getByRole("table", { name: "Ingredients" });

    expect(table).toHaveTextContent("Bread Flour");
    expect(table).toHaveTextContent("1692.13 g");
    expect(table).toHaveTextContent("100%");

    expect(table).toHaveTextContent("Water");
    expect(table).toHaveTextContent("1049.12 g");
    expect(table).toHaveTextContent("62%");

    expect(table).toHaveTextContent("Yeast");
    expect(table).toHaveTextContent("6.77 g");
    expect(table).toHaveTextContent("0.4%");

    expect(table).toHaveTextContent("Salt");
    expect(table).toHaveTextContent("42.3 g");
    expect(table).toHaveTextContent("2.5%");

    expect(table).toHaveTextContent("Sugar");
    expect(table).toHaveTextContent("33.84 g");
    expect(table).toHaveTextContent("2.0%");

    expect(table).toHaveTextContent("Olive Oil");
    expect(table).toHaveTextContent("55.84 g");
    expect(table).toHaveTextContent("3.3%");
  });

  it("visually distinguishes the Bread Flour row as the base ingredient with a BASE chip", () => {
    render(
      <Ingredients
        recipe={CANONICAL_RECIPE}
        totalDoughWeightGrams={2880}
        pizzaCount={6}
      />,
    );

    const breadFlourRow = screen.getByRole("row", { name: /Bread Flour/i });
    expect(breadFlourRow).toHaveTextContent("BASE");

    const waterRow = screen.getByRole("row", { name: /^Water/i });
    expect(waterRow).not.toHaveTextContent("BASE");
  });

  it("displays the total dough weight", () => {
    render(
      <Ingredients
        recipe={CANONICAL_RECIPE}
        totalDoughWeightGrams={2880}
        pizzaCount={6}
      />,
    );

    expect(screen.getByText("Total Dough")).toBeInTheDocument();
    expect(screen.getByText("2880 g")).toBeInTheDocument();
  });

  it("continues to display the fixed baker's percentages for a different set of calculated weights", () => {
    const smallerRecipe: Recipe = {
      flour: 863.69,
      water: 535.49,
      yeast: 3.45,
      salt: 21.59,
      sugar: 17.27,
      oliveOil: 28.5,
    };

    render(
      <Ingredients
        recipe={smallerRecipe}
        totalDoughWeightGrams={1470}
        pizzaCount={4}
      />,
    );

    const table = screen.getByRole("table", { name: "Ingredients" });

    expect(table).toHaveTextContent("100%");
    expect(table).toHaveTextContent("62%");
    expect(table).toHaveTextContent("0.4%");
    expect(table).toHaveTextContent("2.5%");
    expect(table).toHaveTextContent("2.0%");
    expect(table).toHaveTextContent("3.3%");
  });
});
