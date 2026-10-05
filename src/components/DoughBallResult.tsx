import { useTranslation } from "react-i18next";
import { formatWeight } from "../utils/formatWeight";
import type { Thickness } from "../domain/types";
import {
  DoughBallCard,
  DoughBallHeader,
  DoughBallLabel,
  PizzaCountChip,
  DoughBallWeightRow,
  DoughBallWeightNumber,
  DoughBallContext,
} from "./DoughBallResult.styled";

type DoughBallResultProps = {
  doughBallWeightGrams: number;
  diameter: number;
  thickness: Thickness;
  pizzaCount: number;
};

export function DoughBallResult({
  doughBallWeightGrams,
  diameter,
  thickness,
  pizzaCount,
}: DoughBallResultProps) {
  const { t } = useTranslation();
  // Thickness names are resolved from the domain's stable thickness key
  // (docs/stories/007-language-localization.md AC-007-14); the contextual
  // sentence uses the lower-cased form, matching the original English
  // phrasing ("per 16\" thin pizza").
  const thicknessLabel = t(`thickness.${thickness}`).toLowerCase();

  return (
    <DoughBallCard aria-label={t("doughBall.resultAriaLabel")}>
      <DoughBallHeader>
        <DoughBallLabel>{t("doughBall.label")}</DoughBallLabel>
        <PizzaCountChip
          aria-label={t("doughBall.pizzaCountAriaLabel", { count: pizzaCount })}
        >
          × {pizzaCount}
        </PizzaCountChip>
      </DoughBallHeader>
      <DoughBallWeightRow>
        <DoughBallWeightNumber>
          {formatWeight(doughBallWeightGrams)}
        </DoughBallWeightNumber>
        <span className="unit">g</span>
      </DoughBallWeightRow>
      <DoughBallContext>
        {t("doughBall.context", { diameter, thickness: thicknessLabel })}
      </DoughBallContext>
    </DoughBallCard>
  );
}
