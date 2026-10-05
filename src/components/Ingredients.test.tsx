import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Ingredients } from "./Ingredients";
import type { Recipe } from "../domain/types";
import { en_US } from "../i18n/locales/en-US";

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
      screen.getByRole("heading", { name: en_US.ingredients.title }),
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

    const table = screen.getByRole("table", {
      name: en_US.ingredients.tableAriaLabel,
    });

    expect(table).toHaveTextContent(en_US.ingredientNames.flour);
    expect(table).toHaveTextContent("1692.13 g");
    expect(table).toHaveTextContent("100%");

    expect(table).toHaveTextContent(en_US.ingredientNames.water);
    expect(table).toHaveTextContent("1049.12 g");
    expect(table).toHaveTextContent("62%");

    expect(table).toHaveTextContent(en_US.ingredientNames.yeast);
    expect(table).toHaveTextContent("6.77 g");
    expect(table).toHaveTextContent("0.4%");

    expect(table).toHaveTextContent(en_US.ingredientNames.salt);
    expect(table).toHaveTextContent("42.3 g");
    expect(table).toHaveTextContent("2.5%");

    expect(table).toHaveTextContent(en_US.ingredientNames.sugar);
    expect(table).toHaveTextContent("33.84 g");
    expect(table).toHaveTextContent("2.0%");

    expect(table).toHaveTextContent(en_US.ingredientNames.oliveOil);
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

    const breadFlourRow = screen.getByRole("row", {
      name: new RegExp(en_US.ingredientNames.flour, "i"),
    });
    expect(breadFlourRow).toHaveTextContent(en_US.ingredients.base);

    const waterRow = screen.getByRole("row", {
      name: new RegExp(`^${en_US.ingredientNames.water}`, "i"),
    });
    expect(waterRow).not.toHaveTextContent(en_US.ingredients.base);
  });

  it("displays the total dough weight", () => {
    render(
      <Ingredients
        recipe={CANONICAL_RECIPE}
        totalDoughWeightGrams={2880}
        pizzaCount={6}
      />,
    );

    expect(screen.getByText(en_US.common.totalDough)).toBeInTheDocument();
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

    const table = screen.getByRole("table", {
      name: en_US.ingredients.tableAriaLabel,
    });

    expect(table).toHaveTextContent("100%");
    expect(table).toHaveTextContent("62%");
    expect(table).toHaveTextContent("0.4%");
    expect(table).toHaveTextContent("2.5%");
    expect(table).toHaveTextContent("2.0%");
    expect(table).toHaveTextContent("3.3%");
  });
});
