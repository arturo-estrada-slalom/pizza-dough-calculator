import { useTranslation } from "react-i18next";
import { HYDRATION_PERCENT_DISPLAY } from "../domain/recipe";
import { formatWeight } from "../utils/formatWeight";
import {
  SummaryCard,
  SummaryMetric,
  SummaryValue,
  SummaryLabel,
} from "./RecipeSummary.styled";

type SummaryMetricKey =
  | "common.totalDough"
  | "recipeSummary.totalFlour"
  | "recipeSummary.totalWater"
  | "recipeSummary.hydration";

const METRICS: { labelKey: SummaryMetricKey; unit: string }[] = [
  { labelKey: "common.totalDough", unit: "g" },
  { labelKey: "recipeSummary.totalFlour", unit: "g" },
  { labelKey: "recipeSummary.totalWater", unit: "g" },
  { labelKey: "recipeSummary.hydration", unit: "%" },
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
  const { t } = useTranslation();

  const values: Record<SummaryMetricKey, string> = {
    "common.totalDough": formatWeight(totalDoughWeightGrams),
    "recipeSummary.totalFlour": formatWeight(totalFlourGrams),
    "recipeSummary.totalWater": formatWeight(totalWaterGrams),
    // Hydration is fixed by the recipe formula, independent of inputs.
    "recipeSummary.hydration": HYDRATION_PERCENT_DISPLAY,
  };

  return (
    <SummaryCard aria-label={t("recipeSummary.ariaLabel")}>
      {METRICS.map(({ labelKey, unit }) => (
        <SummaryMetric key={labelKey}>
          <SummaryValue>
            {values[labelKey]}
            <span className="unit">{unit}</span>
          </SummaryValue>
          <SummaryLabel>{t(labelKey)}</SummaryLabel>
        </SummaryMetric>
      ))}
    </SummaryCard>
  );
}
