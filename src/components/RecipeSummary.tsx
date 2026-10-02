import { HYDRATION_PERCENT_DISPLAY } from "../domain/recipe";
import { formatWeight } from "../utils/formatWeight";
import {
  SummaryCard,
  SummaryMetric,
  SummaryValue,
  SummaryLabel,
} from "./RecipeSummary.styled";

type SummaryMetricLabel =
  | "Total Dough"
  | "Total Flour"
  | "Total Water"
  | "Hydration";

const METRICS: { label: SummaryMetricLabel; unit: string }[] = [
  { label: "Total Dough", unit: "g" },
  { label: "Total Flour", unit: "g" },
  { label: "Total Water", unit: "g" },
  { label: "Hydration", unit: "%" },
];

type RecipeSummaryProps = {
  totalDoughWeightGrams: number;
  totalFlourGrams: number;
  totalWaterGrams: number;
};

export function RecipeSummary({
  totalDoughWeightGrams,
  totalFlourGrams,
  totalWaterGrams,
}: RecipeSummaryProps) {
  const values: Record<SummaryMetricLabel, string> = {
    "Total Dough": formatWeight(totalDoughWeightGrams),
    "Total Flour": formatWeight(totalFlourGrams),
    "Total Water": formatWeight(totalWaterGrams),
    // Hydration is fixed by the recipe formula, independent of inputs.
    Hydration: HYDRATION_PERCENT_DISPLAY,
  };

  return (
    <SummaryCard aria-label="Recipe Summary">
      {METRICS.map(({ label, unit }) => (
        <SummaryMetric key={label}>
          <SummaryValue>
            {values[label]}
            <span className="unit">{unit}</span>
          </SummaryValue>
          <SummaryLabel>{label}</SummaryLabel>
        </SummaryMetric>
      ))}
    </SummaryCard>
  );
}
