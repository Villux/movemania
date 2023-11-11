import React from "react";
import { styled } from "./styled";
import { Button, Overlay, Text } from "./components";
import { GameStats, Reward } from "./types";
import { rewardAssets } from "../assets/assets";
import HighlightSelector from "./HighlightSelector";
import { Stack } from "./components/Stack";
import { Image } from "react-native";

export function LevelStart({ startGame }: { startGame: () => void }) {
  return (
    <Overlay>
      <Stack axis="y" spacing="normal">
        <LevelImage source={require("../assets/images/level.jpeg")} />
        <Stack axis="y" spacing="normal" style={{ padding: 26 }}>
          <LevelText color="primary">Level 1</LevelText>
          <Text>
            Cyberpirates have seized an area nearby and hidden their treasure
            all around the area.
          </Text>

          <Text>Your job is to find and steal back that treasure.</Text>

          <LevelButton onPress={startGame}>Start level</LevelButton>
        </Stack>
      </Stack>
    </Overlay>
  );
}

export function LevelStartNextLevel({ resetGame }: { resetGame: () => void }) {
  return (
    <Overlay>
      <Stack axis="y" spacing="normal">
        <LevelImage source={require("../assets/images/level.jpeg")} />
        <Stack axis="y" spacing="normal" style={{ padding: 26 }}>
          <LevelText color="primary">Level 2</LevelText>
          <Text>Give a new description for the next level</Text>

          <Text>Your job is to find and steal back that treasure.</Text>

          <LevelButton onPress={resetGame}>Start level</LevelButton>
        </Stack>
      </Stack>
    </Overlay>
  );
}

export function LevelCompleted({
  stats,
  onContinue,
}: {
  stats: GameStats;
  onContinue: () => void;
}) {
  return (
    <>
      <Overlay>
        <Stack axis="y" spacing="small">
          <LevelImage source={require("../assets/images/level.jpeg")} />
          <Stack axis="y" spacing="small" style={{ padding: 26 }}>
            <LevelText color="primary">Level 1 completed</LevelText>

            <Text>You collected the following items:</Text>

            <LevelStatsContainer>
              {Object.entries(stats).map(([key, value]) => (
                <LevelStats key={key}>
                  <StatIcon source={rewardAssets[key as Reward].image} />

                  <StatText
                    color={value.collected === 0 ? "textMuted" : "primary"}
                  >
                    {value.collected}/{value.max} {key}
                  </StatText>
                </LevelStats>
              ))}
            </LevelStatsContainer>

            <LevelButton onPress={onContinue}>Continue</LevelButton>
          </Stack>
        </Stack>
      </Overlay>
    </>
  );
}

export function LevelHighlights({ onContinue }: { onContinue: () => void }) {
  return (
    <Overlay>
      <Stack axis="y" spacing="none" justify="center" align="center">
        <Image source={require("../assets/images/highlights.png")} />
        <Stack axis="y" spacing="small" style={{ padding: 26 }}>
          <LevelText color="primary">Team highlights</LevelText>

          <Text>Pick one of your teammates accomplishments to highlight:</Text>

          <LevelStatsContainer>
            <HighlightSelector />
          </LevelStatsContainer>

          <LevelButton onPress={onContinue}>Finish</LevelButton>
        </Stack>
      </Stack>
    </Overlay>
  );
}

const LevelText = styled(Text, {
  fontFamily: "Jomhuria",
  fontSize: 50,
  textAlign: "left",
});

const LevelButton = styled(Button, {
  alignItems: "center",
});

const LevelImage = styled("Image", {
  width: "100%",
  height: 200,
  borderRadius: 24,
});

const StatText = styled(Text, {
  fontFamily: "Jomhuria",
  fontSize: 32,
  fontWeight: "400",
});

const StatIcon = styled("Image", {
  width: 30,
  height: 30,
  marginBottom: 5,
});

const LevelStatsContainer = styled("View", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%",
});

const LevelStats = styled("View", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-evenly",
  margin: 5,
  width: 150,
  height: 52,
  borderRadius: 20,
  backgroundColor: "rgba(255, 255, 255, 0.10)",
});
