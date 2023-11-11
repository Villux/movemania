import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { styled } from "./styled";

export default function ProgressBar({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(100, { duration: 100000 });
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  //   When the bar is full, call the onComplete callback
  useEffect(() => {
    if (progress.value === 100) {
      onComplete();
    }
  }, [progress.value]);

  return (
    <Container>
      <Progress style={progressStyle} />
    </Container>
  );
}

const Container = styled(View, {
  height: 8,
  margin: 10,
  borderRadius: 999,
  backgroundColor: "#00000080",
});

const Progress = styled(Animated.View, {
  height: 8,
  borderRadius: 999,
  backgroundColor: "#00FF29",
  shadowColor: "#00FF29",
  shadowOffset: {
    width: 0,
    height: 12,
  },
  shadowOpacity: 0.88,
  shadowRadius: 16.0,

  elevation: 24,
});
