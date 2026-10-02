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
  return (
    <DoughBallCard aria-label="Dough Ball result">
      <DoughBallHeader>
        <DoughBallLabel>Dough Ball</DoughBallLabel>
        <PizzaCountChip aria-label={`${pizzaCount} pizzas`}>
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
        per {diameter}" {thickness} pizza
      </DoughBallContext>
    </DoughBallCard>
  );
}
