import { REFERENCE_PIZZA } from "./recipe";

// Standard dough-ball weight scales with pizza area relative to the
// reference pizza (docs/PROJECT.md). Thin/Thick are reserved for Story 005.
export function calculateDoughBallWeight(diameter: number): number {
    const areaRatio = (diameter / REFERENCE_PIZZA.diameter) ** 2;
    return REFERENCE_PIZZA.doughWeight * areaRatio;
}

export function calculateTotalDoughWeight(
    doughBallWeight: number,
    numberOfPizzas: number,
): number {
    return doughBallWeight * numberOfPizzas;
}
