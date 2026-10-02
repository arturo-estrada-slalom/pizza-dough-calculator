import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  PizzaSettings,
  DIAMETER_DEFAULT,
  PIZZA_COUNT_DEFAULT,
} from "./PizzaSettings";

// Test harness mirroring how App lifts and owns this controlled state.
function ControlledPizzaSettings() {
  const [diameter, setDiameter] = useState(DIAMETER_DEFAULT);
  const [pizzaCount, setPizzaCount] = useState(PIZZA_COUNT_DEFAULT);

  return (
    <PizzaSettings
      diameter={diameter}
      onDiameterChange={setDiameter}
      pizzaCount={pizzaCount}
      onPizzaCountChange={setPizzaCount}
    />
  );
}

describe("<PizzaSettings />", () => {
  it("renders the Pizza Settings panel with Diameter, Thickness, and Number of Pizzas sections", () => {
    render(<ControlledPizzaSettings />);

    expect(
      screen.getByRole("heading", { name: "Pizza Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Diameter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Thickness" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Number of Pizzas" }),
    ).toBeInTheDocument();
  });

  describe("Diameter", () => {
    it("defaults to 14 inches and displays the min/max range", () => {
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", { name: "Diameter" });
      expect(slider).toHaveAttribute("aria-valuenow", "14");
      expect(screen.getByText("14")).toBeInTheDocument();
      expect(screen.getByText("inches")).toBeInTheDocument();
      expect(screen.getByText('10"')).toBeInTheDocument();
      expect(screen.getByText('20"')).toBeInTheDocument();
    });

    it("updates the displayed diameter when the slider value changes via the keyboard", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", { name: "Diameter" });
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(slider).toHaveAttribute("aria-valuenow", "15");
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("does not move the diameter below the minimum of 10", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", { name: "Diameter" });
      slider.focus();
      for (let i = 0; i < 10; i++) {
        await user.keyboard("{ArrowLeft}");
      }

      expect(slider).toHaveAttribute("aria-valuenow", "10");
    });

    it("does not move the diameter above the maximum of 20", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", { name: "Diameter" });
      slider.focus();
      for (let i = 0; i < 10; i++) {
        await user.keyboard("{ArrowRight}");
      }

      expect(slider).toHaveAttribute("aria-valuenow", "20");
    });
  });

  describe("Thickness", () => {
    it("renders exactly three options: Thin, Standard, and Thick", () => {
      render(<ControlledPizzaSettings />);

      expect(screen.getByRole("button", { name: "Thin" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Standard" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Thick" })).toBeInTheDocument();
    });

    it("indicates Standard as the currently selected option", () => {
      render(<ControlledPizzaSettings />);

      expect(screen.getByRole("button", { name: "Standard" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("disables the Thin and Thick options", () => {
      render(<ControlledPizzaSettings />);

      expect(screen.getByRole("button", { name: "Thin" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Thick" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Standard" })).toBeEnabled();
    });
  });

  describe("Number of Pizzas", () => {
    it("defaults to 4", () => {
      render(<ControlledPizzaSettings />);

      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("increases the displayed quantity by one when the increment control is activated", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      await user.click(
        screen.getByRole("button", { name: /increase number of pizzas/i }),
      );

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("decreases the displayed quantity by one when the decrement control is activated", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      await user.click(
        screen.getByRole("button", { name: /decrease number of pizzas/i }),
      );

      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("disables the increment control and stops at 100 when the maximum is reached", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const increment = screen.getByRole("button", {
        name: /increase number of pizzas/i,
      });
      for (let i = 0; i < 96; i++) {
        await user.click(increment);
      }

      expect(screen.getByText("100")).toBeInTheDocument();
      expect(increment).toBeDisabled();
    });

    it("disables the decrement control and stops at 1 when the minimum is reached", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const decrement = screen.getByRole("button", {
        name: /decrease number of pizzas/i,
      });
      for (let i = 0; i < 3; i++) {
        await user.click(decrement);
      }

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(decrement).toBeDisabled();
    });
  });
});
