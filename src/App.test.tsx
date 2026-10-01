import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("<App />", () => {
  it("renders the application header content", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Pizza Dough Calculator" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Baker's percentages for home & professional use"),
    ).toBeInTheDocument();
  });

  it("renders the Pizza Settings panel", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Pizza Settings" }),
    ).toBeInTheDocument();
  });

  it("renders the Dough Ball, Recipe Summary, and Ingredients results sections", () => {
    render(<App />);

    expect(screen.getByText("Dough Ball")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Recipe Summary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ingredients" }),
    ).toBeInTheDocument();
  });

  it("does not change the results sections when Pizza Settings controls are changed", async () => {
    const user = userEvent.setup();
    render(<App />);

    const diameterSlider = screen.getByRole("slider", { name: "Diameter" });
    diameterSlider.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(
      screen.getByRole("button", { name: /increase number of pizzas/i }),
    );

    expect(screen.getByText("480")).toBeInTheDocument();
    expect(screen.getByText("2880")).toBeInTheDocument();
    expect(screen.getByText("Bread Flour")).toBeInTheDocument();
  });
});
