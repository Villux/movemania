import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { styled } from "./styled";
import { Hexagon, Reward, RewardState } from "./types";
import { Stack } from "./components/Stack";

export function ProgressBar({
  collectedTiles,
  stats,
  onComplete,
}: {
  collectedTiles: number;
  stats: Record<Reward, RewardState>;
  onComplete: () => void;
}) {
  const getExpByReward = (reward: Reward) => {
    switch (reward) {
      case "coin":
        return 5;
      case "gem":
        return 10;
      case "key":
        return 20;
      case "chest":
        return 30;
      default:
        return 0;
    }
  };

  const getExp = (stats: Record<Reward, RewardState>) => {
    if (collectedTiles === 0) return 0;
    let exp = 0;
    Object.entries(stats).forEach(([key, value]) => {
      exp += value.foundCount * getExpByReward(key as Reward);
    });
    exp += collectedTiles * 2;
    return Math.min(exp, 100);
  };

  const exp = getExp(stats);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(exp, { duration: 100 });
  }, [exp, stats]);

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
  //   When the bar is full, call the onComplete callback
  useEffect(() => {
    if (progress.value === 100) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [progress.value]);

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
