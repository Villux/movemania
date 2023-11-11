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
            <Text>Robot apes have raided an area near you!</Text>
            <Text>
              You need to help the locals find all the barrels and bananas that
              the apes have thrown in the streets.
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
