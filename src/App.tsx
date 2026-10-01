import { AppHeader } from "./components/AppHeader";
import { Background, AppContainer } from "./App.styled";

function App() {
  return (
    <Background>
      <AppContainer maxWidth="lg">
        <AppHeader />
      </AppContainer>
    </Background>
  );
}

export default App;
