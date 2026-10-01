import { PLACEHOLDER_RESULTS } from "./placeholderResultsData";
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

export function RecipeSummary() {
  const {
    totalDoughWeightGrams,
    totalFlourGrams,
    totalWaterGrams,
    hydrationPercent,
  } = PLACEHOLDER_RESULTS;

  const values: Record<SummaryMetricLabel, number> = {
    "Total Dough": totalDoughWeightGrams,
    "Total Flour": totalFlourGrams,
    "Total Water": totalWaterGrams,
    Hydration: hydrationPercent,
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
