import { AppHeader } from "./components/AppHeader";
import { PizzaSettings } from "./components/PizzaSettings";
import { DoughBallResult } from "./components/DoughBallResult";
import { RecipeSummary } from "./components/RecipeSummary";
import { Ingredients } from "./components/Ingredients";
import {
  Background,
  AppContainer,
  ContentLayout,
  SettingsColumn,
  ResultsColumn,
} from "./App.styled";

function App() {
  return (
    <Background>
      <AppContainer maxWidth="lg">
        <AppHeader />
        <ContentLayout>
          <SettingsColumn>
            <PizzaSettings />
          </SettingsColumn>
          <ResultsColumn>
            <DoughBallResult />
            <RecipeSummary />
            <Ingredients />
          </ResultsColumn>
        </ContentLayout>
      </AppContainer>
    </Background>
  );
}

export default App;
