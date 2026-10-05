import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoughBallResult } from "./DoughBallResult";
import { en_US } from "../i18n/locales/en-US";

describe("<DoughBallResult />", () => {
  it("renders the Dough Ball label, weight, unit, pizza-count indicator, and context", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={480}
        diameter={16}
        thickness="standard"
        pizzaCount={6}
      />,
    );

    expect(screen.getByText(en_US.doughBall.label)).toBeInTheDocument();
    expect(screen.getByText("480")).toBeInTheDocument();
    expect(screen.getByText("g")).toBeInTheDocument();
    expect(screen.getByText("× 6")).toBeInTheDocument();
    expect(screen.getByText('per 16" standard pizza')).toBeInTheDocument();
  });

  it("renders as an accessible region named for the Dough Ball result", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={480}
        diameter={16}
        thickness="standard"
        pizzaCount={6}
      />,
    );

    expect(
      screen.getByRole("region", { name: en_US.doughBall.resultAriaLabel }),
    ).toBeInTheDocument();
  });

  it("displays a non-integer dough-ball weight without changing per changing pizza count", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={367.5}
        diameter={14}
        thickness="standard"
        pizzaCount={10}
      />,
    );

    expect(screen.getByText("367.5")).toBeInTheDocument();
    expect(screen.getByText("× 10")).toBeInTheDocument();
  });

  it("reflects the Thin thickness in the contextual text", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={384}
        diameter={16}
        thickness="thin"
        pizzaCount={4}
      />,
    );

    expect(screen.getByText('per 16" thin pizza')).toBeInTheDocument();
  });

  it("reflects the Thick thickness in the contextual text", () => {
    render(
      <DoughBallResult
        doughBallWeightGrams={576}
        diameter={16}
        thickness="thick"
        pizzaCount={4}
      />,
    );

    expect(screen.getByText('per 16" thick pizza')).toBeInTheDocument();
  });
});
