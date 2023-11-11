import { styled } from "./styled";
import { GameStats, Reward } from "./types";
import { Button, Grid, Overlay, Text } from "./components";
import { Stack } from "./components/Stack";
import { rewardAssets } from "../assets/assets";

export function LevelCompletedOverlay({
  stats,
  onContinue,
}: {
  stats: GameStats;
  onContinue: () => void;
}) {
  return (
    <Overlay>
      <Stack axis="y" spacing="small">
        <LevelImage source={require("../assets/images/level-1.jpg")} />
        <Stack
          axis="y"
          spacing="medium"
          style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 26 }}
        >
          <Stack axis="y" spacing="small">
            <Text variant="title" color="primary">
              Level 1 completed
            </Text>

            <Text>You collected the following items:</Text>
          </Stack>

          <LevelStatsContainer>
            <Grid spacing="normal" columns={2}>
              {Object.entries(stats).map(([key, value]) => (
                <LevelStats key={key}>
                  <StatIcon source={rewardAssets[key as Reward].image} />

                  <StatText
                    variant="button"
                    color={value.collected === 0 ? "textMuted" : "primary"}
                  >
                    {value.collected}/{value.max} {key}s
                  </StatText>
                </LevelStats>
              ))}
            </Grid>
          </LevelStatsContainer>

          <Button onPress={onContinue}>Continue</Button>
        </Stack>
      </Stack>
    </Overlay>
  );
}

const LevelImage = styled("ImageBackground", {
  height: 200,
});

const StatText = styled(Text, {
  fontSize: 32,
  marginTop: 4, // stupid fix for visually centering the text...
});

const StatIcon = styled("Image", {
  width: 32,
  height: 32,
});

const LevelStatsContainer = styled("View", {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
});

const LevelStats = styled("View", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  backgroundColor: "rgba(255, 255, 255, 0.10)",
});
