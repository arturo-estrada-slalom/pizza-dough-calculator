import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoughBallResult } from "./DoughBallResult";

describe("<DoughBallResult />", () => {
  it("renders the Dough Ball label, weight, unit, pizza-count indicator, and context", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={480}
        diameter={16}
        pizzaCount={6}
      />,
    );

    expect(screen.getByText("Dough Ball")).toBeInTheDocument();
    expect(screen.getByText("480")).toBeInTheDocument();
    expect(screen.getByText("g")).toBeInTheDocument();
    expect(screen.getByText("× 6")).toBeInTheDocument();
    expect(screen.getByText('per 16" standard pizza')).toBeInTheDocument();
  });

  it("renders as an accessible region named 'Dough Ball result'", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={480}
        diameter={16}
        pizzaCount={6}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Dough Ball result" }),
    ).toBeInTheDocument();
  });

  it("displays a non-integer dough-ball weight without changing per changing pizza count", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={367.5}
        diameter={14}
        pizzaCount={10}
      />,
    );

    expect(screen.getByText("367.5")).toBeInTheDocument();
    expect(screen.getByText("× 10")).toBeInTheDocument();
  });
});
