import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoughBallResult } from "./DoughBallResult";

describe("<DoughBallResult />", () => {
  it("renders the Dough Ball label, weight, unit, pizza-count indicator, and context", () => {
    render(<DoughBallResult />);

    expect(screen.getByText("Dough Ball")).toBeInTheDocument();
    expect(screen.getByText("480")).toBeInTheDocument();
    expect(screen.getByText("g")).toBeInTheDocument();
    expect(screen.getByText("× 6")).toBeInTheDocument();
    expect(screen.getByText('per 16" standard pizza')).toBeInTheDocument();
  });

  it("renders as an accessible region named 'Dough Ball result'", () => {
    render(<DoughBallResult />);

    expect(
      screen.getByRole("region", { name: "Dough Ball result" }),
    ).toBeInTheDocument();
  });
});
