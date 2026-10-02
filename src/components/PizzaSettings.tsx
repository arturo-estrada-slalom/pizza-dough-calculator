import Divider from "@mui/material/Divider";
import type { MouseEvent } from "react";
import type { Thickness } from "../domain/types";
import {
  SettingsCard,
  SettingsTitle,
  Section,
  SectionLabel,
  DiameterHeader,
  DiameterValue,
  DiameterSlider,
  DiameterRangeLabels,
  ThicknessToggleGroup,
  ThicknessOption,
  PizzaCountRow,
  PizzaCountButton,
  PizzaCountValue,
  PizzaCountUnit,
} from "./PizzaSettings.styled";

export const DIAMETER_MIN = 10;
export const DIAMETER_MAX = 20;
export const DIAMETER_DEFAULT = 14;

export const PIZZA_COUNT_MIN = 1;
export const PIZZA_COUNT_MAX = 100;
export const PIZZA_COUNT_DEFAULT = 4;

type PizzaSettingsProps = {
  diameter: number;
  onDiameterChange: (diameter: number) => void;
  thickness: Thickness;
  onThicknessChange: (thickness: Thickness) => void;
  pizzaCount: number;
  onPizzaCountChange: (pizzaCount: number) => void;
};

export function PizzaSettings({
  diameter,
  onDiameterChange,
  thickness,
  onThicknessChange,
  pizzaCount,
  onPizzaCountChange,
}: PizzaSettingsProps) {
  const handleDiameterChange = (_event: Event, newValue: number | number[]) => {
    onDiameterChange(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  const handleThicknessChange = (
    _event: MouseEvent<HTMLElement>,
    newValue: Thickness | null,
  ) => {
    // MUI's exclusive ToggleButtonGroup reports null when the already-
    // selected option is pressed again; ignore it to keep a selection.
    if (newValue !== null) {
      onThicknessChange(newValue);
    }
  };

  const handleDecrement = () => {
    onPizzaCountChange(Math.max(PIZZA_COUNT_MIN, pizzaCount - 1));
  };

  const handleIncrement = () => {
    onPizzaCountChange(Math.min(PIZZA_COUNT_MAX, pizzaCount + 1));
  };

  return (
    <SettingsCard>
      <SettingsTitle variant="h2">Pizza Settings</SettingsTitle>

      <Section>
        <DiameterHeader>
          <SectionLabel variant="h3">Diameter</SectionLabel>
          <DiameterValue>
            {diameter}
            <span className="unit">inches</span>
          </DiameterValue>
        </DiameterHeader>
        <DiameterSlider
          aria-label="Diameter"
          getAriaValueText={(value) => `${value} inches`}
          value={diameter}
          onChange={handleDiameterChange}
          min={DIAMETER_MIN}
          max={DIAMETER_MAX}
          step={1}
        />
        <DiameterRangeLabels>
          <span>{DIAMETER_MIN}"</span>
          <span>{DIAMETER_MAX}"</span>
        </DiameterRangeLabels>
      </Section>

      <Divider />

      <Section>
        <SectionLabel variant="h3">Thickness</SectionLabel>
        <ThicknessToggleGroup
          value={thickness}
          exclusive
          onChange={handleThicknessChange}
          aria-label="Thickness"
        >
          <ThicknessOption value="thin">Thin</ThicknessOption>
          <ThicknessOption value="standard">Standard</ThicknessOption>
          <ThicknessOption value="thick">Thick</ThicknessOption>
        </ThicknessToggleGroup>
      </Section>

      <Divider />

      <Section>
        <SectionLabel variant="h3">Number of Pizzas</SectionLabel>
        <PizzaCountRow>
          <PizzaCountButton
            aria-label="Decrease number of pizzas"
            onClick={handleDecrement}
            disabled={pizzaCount <= PIZZA_COUNT_MIN}
          >
            −
          </PizzaCountButton>
          <PizzaCountValue>{pizzaCount}</PizzaCountValue>
          <PizzaCountButton
            aria-label="Increase number of pizzas"
            onClick={handleIncrement}
            disabled={pizzaCount >= PIZZA_COUNT_MAX}
          >
            +
          </PizzaCountButton>
          <PizzaCountUnit>pizzas</PizzaCountUnit>
        </PizzaCountRow>
      </Section>
    </SettingsCard>
  );
}
