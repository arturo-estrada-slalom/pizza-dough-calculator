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

  it("preserves Thick thickness and recalculates all results when the pizza count changes, without altering baker's percentages or hydration", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Thick" }));

    expect(screen.getByRole("button", { name: "Thick" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Four 14" Thick pizzas: 367.5 × 1.20 = 441g per ball.
    expect(screen.getByText("441")).toBeInTheDocument();
    expect(screen.getByText("× 4")).toBeInTheDocument();
    expect(screen.getByText("1764")).toBeInTheDocument();
    expect(screen.getByText("1036.43")).toBeInTheDocument();
    expect(screen.getByText("642.59")).toBeInTheDocument();
    expect(screen.getByText("1036.43 g")).toBeInTheDocument();
    expect(screen.getByText("642.59 g")).toBeInTheDocument();
    expect(screen.getByText("4.15 g")).toBeInTheDocument();
    expect(screen.getByText("25.91 g")).toBeInTheDocument();
    expect(screen.getByText("20.73 g")).toBeInTheDocument();
    expect(screen.getByText("34.2 g")).toBeInTheDocument();
    expect(screen.getByText("1764 g")).toBeInTheDocument();
    for (const percentage of ["100%", "62%", "0.4%", "2.5%", "2.0%", "3.3%"]) {
      expect(screen.getByText(percentage)).toBeInTheDocument();
    }
    expect(screen.getByText("62")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /increase number of pizzas/i }),
    );

    expect(screen.getByRole("button", { name: "Thick" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Standard" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText('per 14" thick pizza')).toBeInTheDocument();
    expect(screen.getByText("441")).toBeInTheDocument();
    expect(screen.getByText("× 5")).toBeInTheDocument();
    expect(screen.getByText("2205")).toBeInTheDocument();
    expect(screen.getByText("1295.53")).toBeInTheDocument();
    expect(screen.getByText("803.23")).toBeInTheDocument();
    expect(screen.getByText("1295.53 g")).toBeInTheDocument();
    expect(screen.getByText("803.23 g")).toBeInTheDocument();
    expect(screen.getByText("5.18 g")).toBeInTheDocument();
    expect(screen.getByText("32.39 g")).toBeInTheDocument();
    expect(screen.getByText("25.91 g")).toBeInTheDocument();
    expect(screen.getByText("42.75 g")).toBeInTheDocument();
    expect(screen.getByText("2205 g")).toBeInTheDocument();
    for (const percentage of ["100%", "62%", "0.4%", "2.5%", "2.0%", "3.3%"]) {
      expect(screen.getByText(percentage)).toBeInTheDocument();
    }
    expect(screen.getByText("62")).toBeInTheDocument();
  });

  it("recalculates the Dough Ball, Total Dough, Total Flour, and Total Water when the thickness changes, without altering baker's percentages or hydration", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("button", { name: "Standard" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Default settings: 14" diameter, 4 pizzas, Standard -> 367.5g dough ball.
    expect(screen.getByText("367.5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Thick" }));

    expect(screen.getByRole("button", { name: "Thick" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Standard" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    // Thick applies a 1.20 factor: 367.5 × 1.20 = 441g per ball.
    expect(screen.getByText("441")).toBeInTheDocument();
    expect(screen.getByText('per 14" thick pizza')).toBeInTheDocument();
    expect(screen.getByText("1764")).toBeInTheDocument();
    expect(screen.getByText("1036.43")).toBeInTheDocument();
    expect(screen.getByText("642.59")).toBeInTheDocument();
    expect(screen.getByText("1036.43 g")).toBeInTheDocument();
    expect(screen.getByText("642.59 g")).toBeInTheDocument();
    expect(screen.getByText("4.15 g")).toBeInTheDocument();
    expect(screen.getByText("25.91 g")).toBeInTheDocument();
    expect(screen.getByText("20.73 g")).toBeInTheDocument();
    expect(screen.getByText("34.2 g")).toBeInTheDocument();
    // Baker's percentages and hydration remain unaffected by thickness.
    for (const percentage of ["100%", "62%", "0.4%", "2.5%", "2.0%", "3.3%"]) {
      expect(screen.getByText(percentage)).toBeInTheDocument();
    }
    expect(screen.getByText("62")).toBeInTheDocument();
  });
});
