import Divider from "@mui/material/Divider";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      <SettingsTitle variant="h2">{t("pizzaSettings.title")}</SettingsTitle>

      <Section>
        <DiameterHeader>
          <SectionLabel variant="h3">
            {t("pizzaSettings.diameterLabel")}
          </SectionLabel>
          <DiameterValue>
            {diameter}
            <span className="unit">{t("pizzaSettings.inchesUnit")}</span>
          </DiameterValue>
        </DiameterHeader>
        <DiameterSlider
          aria-label={t("pizzaSettings.diameterLabel")}
          getAriaValueText={(value) =>
            `${value} ${t("pizzaSettings.inchesUnit")}`
          }
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
        <SectionLabel variant="h3">
          {t("pizzaSettings.thicknessLabel")}
        </SectionLabel>
        <ThicknessToggleGroup
          value={thickness}
          exclusive
          onChange={handleThicknessChange}
          aria-label={t("pizzaSettings.thicknessLabel")}
        >
          <ThicknessOption value="thin">{t("thickness.thin")}</ThicknessOption>
          <ThicknessOption value="standard">
            {t("thickness.standard")}
          </ThicknessOption>
          <ThicknessOption value="thick">
            {t("thickness.thick")}
          </ThicknessOption>
        </ThicknessToggleGroup>
      </Section>

      <Divider />

      <Section>
        <SectionLabel variant="h3">
          {t("pizzaSettings.numberOfPizzasLabel")}
        </SectionLabel>
        <PizzaCountRow>
          <PizzaCountButton
            aria-label={t("pizzaSettings.decreaseAriaLabel")}
            onClick={handleDecrement}
            disabled={pizzaCount <= PIZZA_COUNT_MIN}
          >
            −
          </PizzaCountButton>
          <PizzaCountValue>{pizzaCount}</PizzaCountValue>
          <PizzaCountButton
            aria-label={t("pizzaSettings.increaseAriaLabel")}
            onClick={handleIncrement}
            disabled={pizzaCount >= PIZZA_COUNT_MAX}
          >
            +
          </PizzaCountButton>
          <PizzaCountUnit>{t("pizzaSettings.pizzasUnit")}</PizzaCountUnit>
        </PizzaCountRow>
      </Section>
    </SettingsCard>
  );
}
