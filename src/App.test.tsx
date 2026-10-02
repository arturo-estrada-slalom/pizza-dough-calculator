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

  it("renders the Dough Ball, Recipe Summary, and Ingredients results sections with calculated values for the default settings", () => {
    render(<App />);

    expect(screen.getByText("Dough Ball")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Recipe Summary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ingredients" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Bread Flour")).toBeInTheDocument();
    // Default settings: 14" diameter, 4 pizzas -> 367.5g dough ball.
    expect(screen.getByText("367.5")).toBeInTheDocument();
  });

  it("updates the Dough Ball, Recipe Summary, and Ingredients when the diameter and pizza count change, reaching the canonical 16-inch/6-pizza reference values", async () => {
    const user = userEvent.setup();
    render(<App />);

    const diameterSlider = screen.getByRole("slider", { name: "Diameter" });
    diameterSlider.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");

    const increment = screen.getByRole("button", {
      name: /increase number of pizzas/i,
    });
    await user.click(increment);
    await user.click(increment);

    expect(screen.getByText("480")).toBeInTheDocument();
    expect(screen.getByText("× 6")).toBeInTheDocument();
    expect(screen.getByText("2880")).toBeInTheDocument();
    expect(screen.getByText("1692.13")).toBeInTheDocument();
    expect(screen.getByText("1049.12")).toBeInTheDocument();
    expect(screen.getByText("6.77 g")).toBeInTheDocument();
  });

  it("does not change the dough-ball weight when only the number of pizzas changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /increase number of pizzas/i }),
    );

    expect(screen.getByText("367.5")).toBeInTheDocument();
  });

  it("does not change calculated values when interacting with the disabled Thickness options", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Standard" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Thin" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Thick" })).toBeDisabled();
    expect(screen.getByText("367.5")).toBeInTheDocument();
  });
});
