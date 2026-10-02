export type IngredientKey =
  | "flour"
  | "water"
  | "yeast"
  | "salt"
  | "sugar"
  | "oliveOil";

export type IngredientDefinition = {
  key: IngredientKey;
  name: string;
  bakersPercentage: number;
  bakersPercentageDisplay: string;
  isBase?: boolean;
};

export type Recipe = Record<IngredientKey, number>;
