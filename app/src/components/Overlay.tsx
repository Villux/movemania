import Animated, { FadeIn } from "react-native-reanimated";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export function Overlay({ children }: { children: ReactNode }) {
  return (
    <BlurView
      tint="dark"
      intensity={50}
      style={{
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        entering={FadeIn}
        style={{
          borderRadius: 24,
          padding: 32,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(150, 150, 150, 0.4)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        {children}
      </Animated.View>
    </BlurView>
  );
}
