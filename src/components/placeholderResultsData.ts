export type PlaceholderIngredient = {
    name: string;
    weightGrams: number;
    bakersPercent: string;
    isBase?: boolean;
};

export type PlaceholderResults = {
    doughBallWeightGrams: number;
    pizzaCount: number;
    pizzaContext: string;
    totalDoughWeightGrams: number;
    totalFlourGrams: number;
    totalWaterGrams: number;
    hydrationPercent: number;
    ingredients: PlaceholderIngredient[];
};

// Presentation-only placeholder data for Story 003 (results presentation).
//
// These are static display values — NOT calculated values and NOT domain
// constants (see docs/ARCHITECTURE.md, docs/PROJECT.md). They exist only to
// demonstrate the Dough Ball, Recipe Summary, and Ingredients components'
// visual presentation ahead of Story 004's calculation wiring, and must stay
// mutually consistent (dough-ball weight × pizza count ≈ total dough weight;
// the six ingredient weights sum ≈ total dough weight).
//
// The figures mirror docs/PROJECT.md's documented canonical test case (the
// 16" reference pizza × 6) so the numbers are traceable to the documented
// domain model rather than invented. Baker's percentages are the fixed,
// literal values required by this story, stored as strings to preserve
// their exact documented formatting (e.g. "2.0" rather than "2").
export const PLACEHOLDER_RESULTS: PlaceholderResults = {
    doughBallWeightGrams: 480,
    pizzaCount: 6,
    pizzaContext: 'per 16" standard pizza',
    totalDoughWeightGrams: 2880,
    totalFlourGrams: 1692.13,
    totalWaterGrams: 1049.12,
    hydrationPercent: 62,
    ingredients: [
        {
            name: "Bread Flour",
            weightGrams: 1692.13,
            bakersPercent: "100",
            isBase: true,
        },
        { name: "Water", weightGrams: 1049.12, bakersPercent: "62" },
        { name: "Yeast", weightGrams: 6.77, bakersPercent: "0.4" },
        { name: "Salt", weightGrams: 42.3, bakersPercent: "2.5" },
        { name: "Sugar", weightGrams: 33.84, bakersPercent: "2.0" },
        { name: "Olive Oil", weightGrams: 55.84, bakersPercent: "3.3" },
    ],
};
