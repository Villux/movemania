import { View } from "react-native";
import { styled } from "./styled";

interface SpacerProps {
  axis: "x" | "y";
  size: number;
}

export const Spacer = styled("View", {
  axis: {
    x: { height: "auto" },
    y: { width: "auto" },
  },
});
