import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import {
  PizzaSettings,
  DIAMETER_DEFAULT,
  PIZZA_COUNT_DEFAULT,
} from "./components/PizzaSettings";
import { DoughBallResult } from "./components/DoughBallResult";
import { RecipeSummary } from "./components/RecipeSummary";
import { Ingredients } from "./components/Ingredients";
import {
  calculateDoughBallWeight,
  calculateTotalDoughWeight,
} from "./domain/doughCalculator";
import { calculateRecipe } from "./domain/recipeCalculator";
import { DEFAULT_THICKNESS } from "./domain/recipe";
import {
  Background,
  AppContainer,
  ContentLayout,
  SettingsColumn,
  ResultsColumn,
} from "./App.styled";

function App() {
  const [diameter, setDiameter] = useState(DIAMETER_DEFAULT);
  const [thickness, setThickness] = useState(DEFAULT_THICKNESS);
  const [pizzaCount, setPizzaCount] = useState(PIZZA_COUNT_DEFAULT);

  const doughBallWeightGrams = calculateDoughBallWeight(diameter, thickness);
  const totalDoughWeightGrams = calculateTotalDoughWeight(
    doughBallWeightGrams,
    pizzaCount,
  );
  const recipe = calculateRecipe(totalDoughWeightGrams);

  return (
    <Background>
      <AppContainer maxWidth="lg">
        <AppHeader />
        <ContentLayout>
          <SettingsColumn>
            <PizzaSettings
              diameter={diameter}
              onDiameterChange={setDiameter}
              thickness={thickness}
              onThicknessChange={setThickness}
              pizzaCount={pizzaCount}
              onPizzaCountChange={setPizzaCount}
            />
          </SettingsColumn>
          <ResultsColumn>
            <DoughBallResult
              doughBallWeightGrams={doughBallWeightGrams}
              diameter={diameter}
              thickness={thickness}
              pizzaCount={pizzaCount}
            />
            <RecipeSummary
              totalDoughWeightGrams={totalDoughWeightGrams}
              totalFlourGrams={recipe.flour}
              totalWaterGrams={recipe.water}
            />
            <Ingredients
              recipe={recipe}
              totalDoughWeightGrams={totalDoughWeightGrams}
              pizzaCount={pizzaCount}
            />
          </ResultsColumn>
        </ContentLayout>
      </AppContainer>
    </Background>
  );
}

export default App;
