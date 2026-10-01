import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Ingredients } from "./Ingredients";

describe("<Ingredients />", () => {
  it("renders the Ingredients heading", () => {
    render(<Ingredients />);

    expect(
      screen.getByRole("heading", { name: "Ingredients" }),
    ).toBeInTheDocument();
  });

  it("lists all six ingredients with a name, weight in grams, and baker's percentage", () => {
    render(<Ingredients />);

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
    render(<Ingredients />);

    const breadFlourRow = screen.getByRole("row", { name: /Bread Flour/i });
    expect(breadFlourRow).toHaveTextContent("BASE");

    const waterRow = screen.getByRole("row", { name: /^Water/i });
    expect(waterRow).not.toHaveTextContent("BASE");
  });

  it("displays the total dough weight", () => {
    render(<Ingredients />);

    expect(screen.getByText("Total Dough")).toBeInTheDocument();
    expect(screen.getByText("2880 g")).toBeInTheDocument();
  });
});
