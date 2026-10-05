import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "react-i18next";
import { RECIPE_INGREDIENT_ORDER, RECIPE_INGREDIENTS } from "../domain/recipe";
import type { Recipe } from "../domain/types";
import { formatWeight } from "../utils/formatWeight";
import {
  IngredientsCard,
  IngredientsTitle,
  IngredientsSubtitle,
  IngredientsTableContainer,
  HeaderCell,
  DataCell,
  WeightValue,
  IngredientRow,
  IngredientNameCell,
  BaseChip,
  TotalRow,
} from "./Ingredients.styled";

type IngredientsProps = {
  recipe: Recipe;
  totalDoughWeightGrams: number;
  pizzaCount: number;
};

export function Ingredients({
  recipe,
  totalDoughWeightGrams,
  pizzaCount,
}: IngredientsProps) {
  const { t } = useTranslation();

  return (
    <IngredientsCard>
      <IngredientsTitle variant="h2">{t("ingredients.title")}</IngredientsTitle>
      <IngredientsSubtitle>
        {t("ingredients.subtitle", { count: pizzaCount })}
      </IngredientsSubtitle>
      <IngredientsTableContainer>
        <Table size="small" aria-label={t("ingredients.tableAriaLabel")}>
          <TableHead>
            <TableRow>
              <HeaderCell>{t("ingredients.ingredientHeader")}</HeaderCell>
              <HeaderCell align="right">
                {t("ingredients.weightHeader")}
              </HeaderCell>
              <HeaderCell align="right">
                {t("ingredients.bakersPercentHeader")}
              </HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RECIPE_INGREDIENT_ORDER.map((key) => {
              const ingredient = RECIPE_INGREDIENTS[key];
              return (
                <IngredientRow key={key} isBase={ingredient.isBase}>
                  <IngredientNameCell>
                    {t(`ingredientNames.${key}`)}
                    {ingredient.isBase && (
                      <BaseChip label={t("ingredients.base")} size="small" />
                    )}
                  </IngredientNameCell>
                  <DataCell align="right">
                    <WeightValue>{`${formatWeight(recipe[key])} g`}</WeightValue>
                  </DataCell>
                  <DataCell align="right">
                    {ingredient.bakersPercentageDisplay}%
                  </DataCell>
                </IngredientRow>
              );
            })}
            <TotalRow>
              <DataCell>{t("common.totalDough")}</DataCell>
              <DataCell align="right">
                <WeightValue>{`${formatWeight(totalDoughWeightGrams)} g`}</WeightValue>
              </DataCell>
              <DataCell align="right" />
            </TotalRow>
          </TableBody>
        </Table>
      </IngredientsTableContainer>
    </IngredientsCard>
  );
}
