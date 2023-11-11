import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { styled } from "./styled";
import { GameStats, Hexagon } from "./types";
import { Text } from "./components";
import { Stack } from "./components/Stack";

export function ProgressBar({
  hexagons,
  stats,
  onComplete,
}: {
  hexagons: Hexagon[];
  stats: GameStats;
  onComplete: () => void;
}) {
  // Progress is calculated as so:
  // The total exp needed to level up is 1000
  // A new tile is worth 50 exp
  // A coin is worth 50 exp
  // A gem is worth 100 exp
  // A key is worth 150 exp
  // A chest is worth 200 exp

  //   const progress = useMemo(() => {
  //     let prog = 0;
  //     for (const hexagon of hexagons) {
  //       prog += hexagon.capturedBy.includes(MAIN_PLAYER) ? 50 : 0;
  //     }

  //     type Reward = "coin" | "gem" | "key" | "chest";

  //     type GameStats = Record<Reward, { collected: number; max: number }>;

  //     // Get the prog from the stats
  //     const { coin, gem, key, chest } = stats;

  //     prog += coin.collected * 5;
  //     prog += gem.collected * 10;
  //     prog += key.collected * 15;
  //     prog += chest.collected * 20;

  //     return prog;
  //   }, [hexagons, stats]);
  //   console.log("getProgress", progress);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(100, { duration: 50000 });
  }, [stats, hexagons]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  // let boost = true;

  // useEffect(() => {
  //   setTimeout(() => {
  //     boost = true;
  //   }, 10000);
  // }, [progress.value]);
  // //   When the bar is full, call the onComplete callback
  // useEffect(() => {
  //   if (progress.value === 100) {
  //     onComplete();
  //   }
  // }, [progress.value]);

  return (
    <Stack axis="y" spacing="none">
      {/* {boost && (
        <Boost>
          <Text
            variant="button"
            color="buttonText"
            style={{
              fontSize: 18,
            }}
          >
            Boost
          </Text>
        </Boost>
      )}
      
      boost && { shadowColor: "#00FF29" }
      */}
      <Stack
        axis="x"
        spacing="xxsmall"
        align="center"
        style={{ paddingLeft: 12, paddingRight: 16 }}
      >
        <Image source={require("../assets/images/boost.png")} />
        <Container>
          <Progress style={progressStyle} />
        </Container>
      </Stack>
    </Stack>
  );
}

const Container = styled(View, {
  flex: 1,
  height: 8,
  borderRadius: 999,
  backgroundColor: "#00000080",
});

const Progress = styled(Animated.View, {
  height: 8,
  borderRadius: 999,
  backgroundColor: "#00FF29",
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.8,
  shadowRadius: 16,
});

// const Boost = styled(View, {
//   borderRadius: 4,
//   position: "absolute",
//   backgroundColor: "#00FF29",
//   right: 10,
//   bottom: 25,
//   paddingHorizontal: 3,
//   paddingVertical: 1,
// });
