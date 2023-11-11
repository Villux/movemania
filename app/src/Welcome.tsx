import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Overlay } from "./components";

export function Welcome({
  setGameStarted,
}: {
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  console.log(`>> Here's the Welcome component!`);
  return (
    <Overlay>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/images/logo.png")}
        />
        <Text style={styles.title}>Welcome to the treasure hunt!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setGameStarted(true);
          }}
        >
          <Text style={styles.subtitle}>Start</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    width: 304,
    height: 150,
    margin: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 150,
    height: 34,
  },
  title: {
    // fontFamily: "'Offside'",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 23,
    color: "#FFFFFF",
  },
  subtitle: {
    // fontFamily: "'Offside'",
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
  },
  button: {
    background: "#FFF500",
    borderRadius: 16,
  },
});
