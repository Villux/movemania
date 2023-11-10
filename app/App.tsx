import { StatusBar } from "expo-status-bar";

import { useLocation } from "./src/utils";
import Main from "./src/Main";

export default function App() {
  const initialLocation = useLocation();

  return (
    <>
      {initialLocation ? <Main initialLocation={initialLocation} /> : null}
      <StatusBar style="auto" />
    </>
  );
}
