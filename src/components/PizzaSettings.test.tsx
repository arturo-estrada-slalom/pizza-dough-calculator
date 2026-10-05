import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  PizzaSettings,
  DIAMETER_DEFAULT,
  PIZZA_COUNT_DEFAULT,
} from "./PizzaSettings";
import type { Thickness } from "../domain/types";
import { DEFAULT_THICKNESS } from "../domain/recipe";
import { en_US } from "../i18n/locales/en-US";

// Test harness mirroring how App lifts and owns this controlled state.
function ControlledPizzaSettings() {
  const [diameter, setDiameter] = useState(DIAMETER_DEFAULT);
  const [thickness, setThickness] = useState<Thickness>(DEFAULT_THICKNESS);
  const [pizzaCount, setPizzaCount] = useState(PIZZA_COUNT_DEFAULT);

  return (
    <PizzaSettings
      diameter={diameter}
      onDiameterChange={setDiameter}
      thickness={thickness}
      onThicknessChange={setThickness}
      pizzaCount={pizzaCount}
      onPizzaCountChange={setPizzaCount}
    />
  );
}

describe("<PizzaSettings />", () => {
  it("renders the Pizza Settings panel with Diameter, Thickness, and Number of Pizzas sections", () => {
    render(<ControlledPizzaSettings />);

    expect(
      screen.getByRole("heading", { name: en_US.pizzaSettings.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: en_US.pizzaSettings.diameterLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: en_US.pizzaSettings.thicknessLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: en_US.pizzaSettings.numberOfPizzasLabel,
      }),
    ).toBeInTheDocument();
  });

  describe("Diameter", () => {
    it("defaults to 14 inches and displays the min/max range", () => {
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", {
        name: en_US.pizzaSettings.diameterLabel,
      });
      expect(slider).toHaveAttribute("aria-valuenow", "14");
      expect(screen.getByText("14")).toBeInTheDocument();
      expect(
        screen.getByText(en_US.pizzaSettings.inchesUnit),
      ).toBeInTheDocument();
      expect(screen.getByText('10"')).toBeInTheDocument();
      expect(screen.getByText('20"')).toBeInTheDocument();
    });

    it("updates the displayed diameter when the slider value changes via the keyboard", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", {
        name: en_US.pizzaSettings.diameterLabel,
      });
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(slider).toHaveAttribute("aria-valuenow", "15");
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("does not move the diameter below the minimum of 10", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", {
        name: en_US.pizzaSettings.diameterLabel,
      });
      slider.focus();
      for (let i = 0; i < 10; i++) {
        await user.keyboard("{ArrowLeft}");
      }

      expect(slider).toHaveAttribute("aria-valuenow", "10");
    });

    it("does not move the diameter above the maximum of 20", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const slider = screen.getByRole("slider", {
        name: en_US.pizzaSettings.diameterLabel,
      });
      slider.focus();
      for (let i = 0; i < 10; i++) {
        await user.keyboard("{ArrowRight}");
      }

      expect(slider).toHaveAttribute("aria-valuenow", "20");
    });
  });

  describe("Thickness", () => {
    it("renders exactly three options: Thin, Standard, and Thick, all enabled", () => {
      render(<ControlledPizzaSettings />);

      expect(
        screen.getByRole("button", { name: en_US.thickness.thin }),
      ).toBeEnabled();
      expect(
        screen.getByRole("button", { name: en_US.thickness.standard }),
      ).toBeEnabled();
      expect(
        screen.getByRole("button", { name: en_US.thickness.thick }),
      ).toBeEnabled();
    });

    it("indicates Standard as the currently selected option by default", () => {
      render(<ControlledPizzaSettings />);

      expect(
        screen.getByRole("button", { name: en_US.thickness.standard }),
      ).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.getByRole("button", { name: en_US.thickness.thin }),
      ).toHaveAttribute("aria-pressed", "false");
      expect(
        screen.getByRole("button", { name: en_US.thickness.thick }),
      ).toHaveAttribute("aria-pressed", "false");
    });

    it("selects Thin and deselects Standard when the Thin option is activated", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      await user.click(
        screen.getByRole("button", { name: en_US.thickness.thin }),
      );

      expect(
        screen.getByRole("button", { name: en_US.thickness.thin }),
      ).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.getByRole("button", { name: en_US.thickness.standard }),
      ).toHaveAttribute("aria-pressed", "false");
    });

    it("selects Thick when the Thick option is activated", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      await user.click(
        screen.getByRole("button", { name: en_US.thickness.thick }),
      );

      expect(
        screen.getByRole("button", { name: en_US.thickness.thick }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    it("keeps the currently selected thickness selected when the already-active option is activated again", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      await user.click(
        screen.getByRole("button", { name: en_US.thickness.standard }),
      );

      expect(
        screen.getByRole("button", { name: en_US.thickness.standard }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    it("keeps the selected thickness unchanged when the diameter is changed", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      await user.click(
        screen.getByRole("button", { name: en_US.thickness.thick }),
      );

      const slider = screen.getByRole("slider", {
        name: en_US.pizzaSettings.diameterLabel,
      });
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(
        screen.getByRole("button", { name: en_US.thickness.thick }),
      ).toHaveAttribute("aria-pressed", "true");
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
        screen.getByRole("button", {
          name: en_US.pizzaSettings.increaseAriaLabel,
        }),
      );

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("decreases the displayed quantity by one when the decrement control is activated", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      await user.click(
        screen.getByRole("button", {
          name: en_US.pizzaSettings.decreaseAriaLabel,
        }),
      );

      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("disables the increment control and stops at 100 when the maximum is reached", async () => {
      const user = userEvent.setup();
      render(<ControlledPizzaSettings />);

      const increment = screen.getByRole("button", {
        name: en_US.pizzaSettings.increaseAriaLabel,
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
        name: en_US.pizzaSettings.decreaseAriaLabel,
      });
      for (let i = 0; i < 3; i++) {
        await user.click(decrement);
      }

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(decrement).toBeDisabled();
    });
  });
});
