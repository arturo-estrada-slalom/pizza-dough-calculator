import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PLACEHOLDER_RESULTS } from "./placeholderResultsData";
import {
  IngredientsCard,
  IngredientsTitle,
  IngredientsSubtitle,
  IngredientsTableContainer,
  HeaderCell,
  IngredientRow,
  IngredientNameCell,
  BaseChip,
  TotalRow,
} from "./Ingredients.styled";

export function Ingredients() {
  const { ingredients, totalDoughWeightGrams, pizzaCount } =
    PLACEHOLDER_RESULTS;

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
            {ingredients.map((ingredient) => (
              <IngredientRow key={ingredient.name} isBase={ingredient.isBase}>
                <IngredientNameCell>
                  {ingredient.name}
                  {ingredient.isBase && <BaseChip label="BASE" size="small" />}
                </IngredientNameCell>
                <TableCell align="right">{ingredient.weightGrams} g</TableCell>
                <TableCell align="right">{ingredient.bakersPercent}%</TableCell>
              </IngredientRow>
            ))}
            <TotalRow>
              <TableCell>Total Dough</TableCell>
              <TableCell align="right">{totalDoughWeightGrams} g</TableCell>
              <TableCell align="right" />
            </TotalRow>
          </TableBody>
        </Table>
      </IngredientsTableContainer>
    </IngredientsCard>
  );
}
