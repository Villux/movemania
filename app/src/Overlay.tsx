import Animated, { FadeIn } from "react-native-reanimated";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function Overlay({ children }: { children: ReactNode }) {
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
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 32,
          padding: 24,
          paddingBottom: 0,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(150, 150, 150, 0.4)",
        }}
      >
        {children}
      </Animated.View>
    </BlurView>
  );
}
