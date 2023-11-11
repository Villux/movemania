import { Button, Overlay, Text } from "./components";
import { Stack } from "./components/Stack";
import { styled } from "./styled";

export function LevelStartOverlay({ startGame }: { startGame: () => void }) {
  return (
    <Overlay>
      <Stack axis="y" spacing="normal">
        <LevelImage source={require("../assets/images/level.jpeg")} />
        <Stack
          axis="y"
          spacing="normal"
          style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 26 }}
        >
          <Text variant="title" color="primary">
            Level 1
          </Text>
          <Text>
            Cyberpirates have seized an area nearby and hidden their treasure
            all around the area.
          </Text>
          <Text>Your job is to find and steal back that treasure.</Text>
          <Button onPress={startGame}>Start level</Button>
        </Stack>
      </Stack>
    </Overlay>
  );
}

const LevelImage = styled("ImageBackground", {
  height: 200,
});
