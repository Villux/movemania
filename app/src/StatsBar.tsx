import React from "react";
import { Image } from "react-native";

import { GameStats, Reward } from "./types";
import { styled } from "./styled";
import { rewardAssets } from "../assets/assets";
import { Text } from "./components";

export function StatsBar({ stats }: { stats: GameStats }) {
  return (
    <StatsBarContainer>
      {Object.entries(stats).map(([key, value]) => (
        <Square key={key}>
          <StatIcon source={rewardAssets[key as Reward].image} />
          <StatText color={value.collected === 0 ? "textMuted" : "primary"}>
            {value.collected}
          </StatText>
        </Square>
      ))}
    </StatsBarContainer>
  );
}

const Square = styled("View", {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  margin: 5,
  width: 80,
  height: 52,
  borderRadius: 20,
  padding: 5,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
});

const StatsBarContainer = styled("View", {
  zIndex: 100,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  // TODO: make this better
  marginHorizontal: 10, // Add padding from left and right
  width: "95%", // Keep width at 100%
  height: 65,
  position: "absolute",
  bottom: 20,
  borderRadius: 24,
  backgroundColor: "#00000099",
});

const StatIcon = styled(Image, {
  width: 30,
  height: 30,
  marginBottom: 5,
});

const StatText = styled(Text, {
  fontFamily: "Jomhuria",
  fontSize: 32,
  lineHeight: 32,
  textAlign: "left",
});
