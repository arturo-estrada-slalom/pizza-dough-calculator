import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
  return (
    <IngredientsCard>
      <IngredientsTitle variant="h2">Ingredients</IngredientsTitle>
      <IngredientsSubtitle>
        Baker's percentages · {pizzaCount} pizzas
      </IngredientsSubtitle>
      <IngredientsTableContainer>
        <Table size="small" aria-label="Ingredients">
          <TableHead>
            <TableRow>
              <HeaderCell>Ingredient</HeaderCell>
              <HeaderCell align="right">Weight</HeaderCell>
              <HeaderCell align="right">Baker's %</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RECIPE_INGREDIENT_ORDER.map((key) => {
              const ingredient = RECIPE_INGREDIENTS[key];
              return (
                <IngredientRow key={key} isBase={ingredient.isBase}>
                  <IngredientNameCell>
                    {ingredient.name}
                    {ingredient.isBase && (
                      <BaseChip label="BASE" size="small" />
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
              <DataCell>Total Dough</DataCell>
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
