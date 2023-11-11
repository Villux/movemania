import { styled } from "../styled";
import { themeProp } from "./utils";

export const Text = styled("Text", {
  color: "$text",
  variants: {
    ...themeProp("color", "colors", (color) => ({
      color,
    })),
    align: {
      left: { textAlign: "left" },
      right: { textAlign: "right" },
      center: { textAlign: "center" },
    },
    uppercase: {
      true: { textTransform: "uppercase" },
      false: { textTransform: "none" },
    },
    variant: {
      default: {
        fontFamily: "$normal",
        fontSize: 18,
      },
      button: {
        fontFamily: "$playful",
        fontSize: 40,
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
