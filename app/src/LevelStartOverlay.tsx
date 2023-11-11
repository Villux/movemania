import { Button, Overlay, Text } from "./components";
import { Stack } from "./components/Stack";
import { styled } from "./styled";

export function LevelStartOverlay({ startGame }: { startGame: () => void }) {
  return (
    <Overlay>
      <Stack axis="y" spacing="normal">
        <LevelImage source={require("../assets/images/level-1.jpg")} />
        <Stack
          axis="y"
          spacing="normal"
          style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 26 }}
        >
          <Text variant="title" color="primary">
            Level 1
          </Text>
          <Text style={{ lineHeight: 24 }}>
            Navigate through the mysterious land, collecting coins and gems
            along the way, locate the hidden treasure chest, and find the
            elusive key to unlock its secrets.
          </Text>
          <Button onPress={startGame}>Start level</Button>
        </Stack>
      </Stack>
    </Overlay>
  );
}

const LevelImage = styled("ImageBackground", {
  height: 200,
});
