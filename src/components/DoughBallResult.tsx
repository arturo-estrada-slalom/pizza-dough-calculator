import { PLACEHOLDER_RESULTS } from "./placeholderResultsData";
import {
  DoughBallCard,
  DoughBallHeader,
  DoughBallLabel,
  PizzaCountChip,
  DoughBallWeightRow,
  DoughBallWeightNumber,
  DoughBallContext,
} from "./DoughBallResult.styled";

export function DoughBallResult() {
  const { doughBallWeightGrams, pizzaCount, pizzaContext } =
    PLACEHOLDER_RESULTS;

  return (
    <DoughBallCard aria-label="Dough Ball result">
      <DoughBallHeader>
        <DoughBallLabel>Dough Ball</DoughBallLabel>
        <PizzaCountChip aria-label={`${pizzaCount} pizzas`}>
          × {pizzaCount}
        </PizzaCountChip>
      </DoughBallHeader>
      <DoughBallWeightRow>
        <DoughBallWeightNumber>{doughBallWeightGrams}</DoughBallWeightNumber>
        <span className="unit">g</span>
      </DoughBallWeightRow>
      <DoughBallContext>{pizzaContext}</DoughBallContext>
    </DoughBallCard>
  );
}
