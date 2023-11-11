import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { useLocation } from "./src/utils";
import { Main } from "./src/Main";
import { ThemeProvider } from "./src/styled";

export default function App() {
  const initialLocation = useLocation();

  const [fontsLoaded] = useFonts({
    Jomhuria: require("./assets/fonts/Jomhuria-Regular.ttf"),
    Offside: require("./assets/fonts/Offside-Regular.ttf"),
  });

  if (!fontsLoaded || !initialLocation) {
    return null;
  }

  return (
    <ThemeProvider>
      <Main initialLocation={initialLocation} />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
