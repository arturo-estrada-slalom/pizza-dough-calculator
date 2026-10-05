import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { en_US } from "./i18n/locales/en-US";
import { es_MX } from "./i18n/locales/es-MX";

describe("<App />", () => {
  it("renders the application header content", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: en_US.app.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(en_US.app.subtitle)).toBeInTheDocument();
  });

  it("renders the Pizza Settings panel", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: en_US.pizzaSettings.title }),
    ).toBeInTheDocument();
  });

  it("renders the Dough Ball, Recipe Summary, and Ingredients results sections with calculated values for the default settings", () => {
    render(<App />);

    expect(screen.getByText(en_US.doughBall.label)).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: en_US.recipeSummary.ariaLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: en_US.ingredients.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(en_US.ingredientNames.flour)).toBeInTheDocument();
    // Default settings: 14" diameter, 4 pizzas -> 367.5g dough ball.
    expect(screen.getByText("367.5")).toBeInTheDocument();
  });

  it("updates the Dough Ball, Recipe Summary, and Ingredients when the diameter and pizza count change, reaching the canonical 16-inch/6-pizza reference values", async () => {
    const user = userEvent.setup();
    render(<App />);

    const diameterSlider = screen.getByRole("slider", {
      name: en_US.pizzaSettings.diameterLabel,
    });
    diameterSlider.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");

    const increment = screen.getByRole("button", {
      name: en_US.pizzaSettings.increaseAriaLabel,
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
      screen.getByRole("button", {
        name: en_US.pizzaSettings.increaseAriaLabel,
      }),
    );

    expect(screen.getByText("367.5")).toBeInTheDocument();
  });

  it("recalculates the Dough Ball, Total Dough, Total Flour, and Total Water when the thickness changes, without altering baker's percentages or hydration", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("button", { name: en_US.thickness.standard }),
    ).toHaveAttribute("aria-pressed", "true");
    // Default settings: 14" diameter, 4 pizzas, Standard -> 367.5g dough ball.
    expect(screen.getByText("367.5")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: en_US.thickness.thick }),
    );

    expect(
      screen.getByRole("button", { name: en_US.thickness.thick }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: en_US.thickness.standard }),
    ).toHaveAttribute("aria-pressed", "false");
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

  it("switches all localized content to Spanish without changing calculated results when Español is selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    const diameterSlider = screen.getByRole("slider", {
      name: en_US.pizzaSettings.diameterLabel,
    });
    diameterSlider.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "🇲🇽 Español" }));

    expect(
      screen.getByRole("heading", { name: es_MX.app.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: es_MX.pizzaSettings.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: es_MX.thickness.standard }),
    ).toBeInTheDocument();
    expect(screen.getByText(es_MX.ingredientNames.flour)).toBeInTheDocument();
    // 16" diameter at Standard thickness still yields a 480g dough ball.
    expect(screen.getByText("480")).toBeInTheDocument();
  });
});
