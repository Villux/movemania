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
        <LevelImage source={require("../assets/images/level.jpeg")} />
        <Stack
          axis="y"
          spacing="medium"
          style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 26 }}
        >
          <Stack axis="y" spacing="small">
            <Text variant="title" color="primary">
              Level 2
            </Text>
            <Text>Give a new description for the next level</Text>
            <Text>Your job is to find and steal back that treasure.</Text>
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
