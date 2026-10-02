import { REFERENCE_PIZZA, THICKNESS_FACTORS } from "./recipe";
import type { Thickness } from "./types";

// Standard dough-ball weight scales with pizza area relative to the
// reference pizza, then the selected thickness factor is applied
// (docs/PROJECT.md, docs/stories/005-thickness-factors.md).
export function calculateDoughBallWeight(
  diameter: number,
  thickness: Thickness,
): number {
  const areaRatio = (diameter / REFERENCE_PIZZA.diameter) ** 2;
  const standardDoughBallWeight = REFERENCE_PIZZA.doughWeight * areaRatio;
  return standardDoughBallWeight * THICKNESS_FACTORS[thickness];
}

export function calculateTotalDoughWeight(
  doughBallWeight: number,
  numberOfPizzas: number,
): number {
  return doughBallWeight * numberOfPizzas;
}
