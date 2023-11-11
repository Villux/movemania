import Animated, { FadeIn } from "react-native-reanimated";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { styled } from "../styled";

export function Overlay({ children }: { children: ReactNode }) {
  return (
    <Wrapper tint="dark" intensity={50}>
      <Content entering={FadeIn}>{children}</Content>
    </Wrapper>
  );
}

const Wrapper = styled(BlurView, {
  ...StyleSheet.absoluteFillObject,
  alignItems: "center",
  justifyContent: "center",
});

const Content = styled(Animated.View, {
  borderRadius: "$large",
  padding: "$medium",
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: "rgba(150, 150, 150, 0.4)",
  backgroundColor: "rgba(0,0,0,0.4)",
});
