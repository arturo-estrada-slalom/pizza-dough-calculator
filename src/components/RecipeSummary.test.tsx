import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeSummary } from "./RecipeSummary";
import { en_US } from "../i18n/locales/en-US";

describe("<RecipeSummary />", () => {
  it("renders as an accessible region named for the Recipe Summary", () => {
    render(
      <RecipeSummary
        totalDoughWeightGrams={2880}
        totalFlourGrams={1692.13}
        totalWaterGrams={1049.12}
      />,
    );

    expect(
      screen.getByRole("region", { name: en_US.recipeSummary.ariaLabel }),
    ).toBeInTheDocument();
  });

  it("renders the four metrics with their values, units, and labels in order", () => {
    render(
      <RecipeSummary
        totalDoughWeightGrams={2880}
        totalFlourGrams={1692.13}
        totalWaterGrams={1049.12}
      />,
    );

    expect(screen.getByText(en_US.common.totalDough)).toBeInTheDocument();
    expect(
      screen.getByText(en_US.recipeSummary.totalFlour),
    ).toBeInTheDocument();
    expect(
      screen.getByText(en_US.recipeSummary.totalWater),
    ).toBeInTheDocument();
    expect(screen.getByText(en_US.recipeSummary.hydration)).toBeInTheDocument();

    expect(screen.getByText("2880")).toBeInTheDocument();
    expect(screen.getByText("1692.13")).toBeInTheDocument();
    expect(screen.getByText("1049.12")).toBeInTheDocument();
    expect(screen.getByText("62")).toBeInTheDocument();

    const labels = screen
      .getAllByText(
        new RegExp(
          [
            en_US.common.totalDough,
            en_US.recipeSummary.totalFlour,
            en_US.recipeSummary.totalWater,
            en_US.recipeSummary.hydration,
          ].join("|"),
        ),
      )
      .map((el) => el.textContent);
    expect(labels).toEqual([
      en_US.common.totalDough,
      en_US.recipeSummary.totalFlour,
      en_US.recipeSummary.totalWater,
      en_US.recipeSummary.hydration,
    ]);
  });

  it("displays the Hydration metric as 62% regardless of the supplied totals", () => {
    render(
      <RecipeSummary
        totalDoughWeightGrams={1470}
        totalFlourGrams={863.69}
        totalWaterGrams={535.49}
      />,
    );

    const hydrationValue = screen.getByText("62").closest("div");
    expect(hydrationValue).toHaveTextContent("62%");
  });
});
