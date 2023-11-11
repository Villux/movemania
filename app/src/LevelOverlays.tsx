import { View } from "react-native";
import React from "react";
import { styled } from "./styled";
import { Button, Overlay, Text } from "./components";
import { Spacer } from "./Spacer";
import { Reward } from "./types";
import { rewardAssets } from "../assets/assets";

export function LevelStart({ startGame }: { startGame: () => void }) {
  return (
    <Overlay>
      <LevelView>
        <LevelImage source={require("../assets/images/level.jpeg")} />
        <Spacer />
        <LevelText color="primary">Level 1</LevelText>
        <Text>
          Cyberpirates have seized an area nearby and hidden their treasure all
          around the area.
        </Text>
        <Spacer />
        <Text>Your job is to find and steal back that treasure.</Text>
        <Spacer />
        <LevelButton onPress={startGame}>Start level</LevelButton>
      </LevelView>
    </Overlay>
  );
}

const mock: {
  [key in Reward]: {
    collected: number;
    total: number;
  };
} = {
  coin: {
    collected: 5,
    total: 10,
  },
  diamond: {
    collected: 0,
    total: 5,
  },
  key: {
    collected: 1,
    total: 1,
  },
  chest: {
    collected: 0,
    total: 1,
  },
};

export function LevelCompleted({
  goToNextLevel,
}: {
  goToNextLevel: () => void;
}) {
  return (
    <Overlay>
      <LevelView>
        <LevelImage source={require("../assets/images/level.jpeg")} />
        <Spacer />
        <LevelText color="primary">Level 1 completed</LevelText>
        <Spacer />
        <Text>You collected the following items:</Text>
        <Spacer />
        <LevelStatsContainer>
          {Object.entries(mock).map(([key, value]) => (
            <LevelStats key={key}>
              <StatIcon source={rewardAssets[key as Reward].image} />

              <StatText color={value.collected === 0 ? "textMuted" : "primary"}>
                {value.collected}/{value.total} {key}
              </StatText>
            </LevelStats>
          ))}
        </LevelStatsContainer>
        <Spacer />

        <LevelButton onPress={goToNextLevel}>Continue</LevelButton>
      </LevelView>
    </Overlay>
  );
}

const LevelView = styled(View, {
  borderRadius: 10,
  display: "flex",
});

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
  height: 150,
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
