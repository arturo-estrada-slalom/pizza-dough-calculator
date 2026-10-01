import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeSummary } from "./RecipeSummary";

describe("<RecipeSummary />", () => {
  it("renders as an accessible region named 'Recipe Summary'", () => {
    render(<RecipeSummary />);

    expect(
      screen.getByRole("region", { name: "Recipe Summary" }),
    ).toBeInTheDocument();
  });

  it("renders the four metrics with their values, units, and labels in order", () => {
    render(<RecipeSummary />);

    expect(screen.getByText("Total Dough")).toBeInTheDocument();
    expect(screen.getByText("Total Flour")).toBeInTheDocument();
    expect(screen.getByText("Total Water")).toBeInTheDocument();
    expect(screen.getByText("Hydration")).toBeInTheDocument();

    expect(screen.getByText("2880")).toBeInTheDocument();
    expect(screen.getByText("1692.13")).toBeInTheDocument();
    expect(screen.getByText("1049.12")).toBeInTheDocument();
    expect(screen.getByText("62")).toBeInTheDocument();

    const labels = screen
      .getAllByText(/Total Dough|Total Flour|Total Water|Hydration/)
      .map((el) => el.textContent);
    expect(labels).toEqual([
      "Total Dough",
      "Total Flour",
      "Total Water",
      "Hydration",
    ]);
  });

  it("displays the Hydration metric as 62%", () => {
    render(<RecipeSummary />);

    const hydrationValue = screen.getByText("62").closest("div");
    expect(hydrationValue).toHaveTextContent("62%");
  });
});
