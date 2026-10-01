import { AppHeader } from "./components/AppHeader";
import { PizzaSettings } from "./components/PizzaSettings";
import {
  Background,
  AppContainer,
  ContentLayout,
  SettingsColumn,
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
        </ContentLayout>
      </AppContainer>
    </Background>
  );
}

export default App;
