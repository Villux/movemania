import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { useLocation, useStorageState } from "./src/utils";
import { Main } from "./src/Main";
import { ThemeProvider } from "./src/styled";
import { Game } from "./src/types";

export default function App() {
  const initialLocation = useLocation();
  const [persistedGameState] = useStorageState<Game>("game");
  const [fontsLoaded] = useFonts({
    Jomhuria: require("./assets/fonts/Jomhuria-Regular.ttf"),
    Offside: require("./assets/fonts/Offside-Regular.ttf"),
  });

  if (!fontsLoaded || !initialLocation) {
    return null;
  }

  return (
    <ThemeProvider>
      <Main
        initialLocation={initialLocation}
        persistedGameState={persistedGameState}
      />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
