export type IngredientKey =
  | "flour"
  | "water"
  | "yeast"
  | "salt"
  | "sugar"
  | "oliveOil";

export type Thickness = "thin" | "standard" | "thick";

export type IngredientDefinition = {
  key: IngredientKey;
  bakersPercentage: number;
  bakersPercentageDisplay: string;
  isBase?: boolean;
};

export type Recipe = Record<IngredientKey, number>;
