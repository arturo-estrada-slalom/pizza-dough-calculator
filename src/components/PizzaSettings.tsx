import { useState } from "react";
import Divider from "@mui/material/Divider";
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

const DIAMETER_MIN = 10;
const DIAMETER_MAX = 20;
const DIAMETER_DEFAULT = 14;

const PIZZA_COUNT_MIN = 1;
const PIZZA_COUNT_MAX = 100;
const PIZZA_COUNT_DEFAULT = 4;

// Thickness selection is reserved for Story 005; "standard" is the only
// selectable option for this story (see docs/PROJECT.md).
const THICKNESS = "standard";

export function PizzaSettings() {
  const [diameter, setDiameter] = useState(DIAMETER_DEFAULT);
  const [pizzaCount, setPizzaCount] = useState(PIZZA_COUNT_DEFAULT);

  const handleDiameterChange = (_event: Event, newValue: number | number[]) => {
    setDiameter(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  const handleDecrement = () => {
    setPizzaCount((count) => Math.max(PIZZA_COUNT_MIN, count - 1));
  };

  const handleIncrement = () => {
    setPizzaCount((count) => Math.min(PIZZA_COUNT_MAX, count + 1));
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
          value={THICKNESS}
          exclusive
          aria-label="Thickness"
        >
          <ThicknessOption value="thin" disabled>
            Thin
          </ThicknessOption>
          <ThicknessOption value="standard">Standard</ThicknessOption>
          <ThicknessOption value="thick" disabled>
            Thick
          </ThicknessOption>
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
