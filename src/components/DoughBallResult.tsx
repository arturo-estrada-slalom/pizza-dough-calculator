import { formatWeight } from "../utils/formatWeight";
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
  pizzaCount: number;
};

export function DoughBallResult({
  doughBallWeightGrams,
  diameter,
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
      <DoughBallContext>per {diameter}" standard pizza</DoughBallContext>
    </DoughBallCard>
  );
}
