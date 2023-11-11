import { Button, Overlay, Stack, Text } from "./components";
import { styled } from "./styled";

export function LevelStartNextOverlay({
  resetGame,
}: {
  resetGame: () => void;
}) {
  return (
    <Overlay>
      <Stack axis="y" spacing="normal">
        <LevelImage source={require("../assets/images/level-2.jpg")} />
        <Stack
          axis="y"
          spacing="medium"
          style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 26 }}
        >
          <Stack axis="y" spacing="small">
            <Text variant="title" color="primary">
              Level 2
            </Text>
            <Text style={{ lineHeight: 24 }}>
              Your objective in this level is to team up with a fellow
              adventurer and explore the expansive area on foot, uncovering
              hidden secrets and overcoming obstacles together.
            </Text>
          </Stack>
          <Button onPress={resetGame}>Start level</Button>
        </Stack>
      </Stack>
    </Overlay>
  );
}

const LevelImage = styled("ImageBackground", {
  height: 200,
});
