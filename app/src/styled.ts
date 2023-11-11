import { StyleSheet } from "react-native";
import { createStitches } from "stitches-native";
import type * as Stitches from "stitches-native";

const { styled, css, createTheme, config, theme, useTheme, ThemeProvider } =
  createStitches({
    theme: {
      colors: {
        primary: "#FFF500",
        primaryDark: "#716D00",
        primaryLight: "#FFF385",
        text: "#FFFFFF",
        textMuted: "#808080",
        buttonText: "#000000",
      },
      radii: {
        none: 0,
        small: 4,
        normal: 8,
        medium: 16,
        large: 24,
        full: 999,
      },
      space: {
        none: 0,
        xxsmall: 4,
        xsmall: 8,
        small: 12,
        normal: 16,
        medium: 24,
        large: 32,
        xlarge: 48,
        xxlarge: 56,
        xxxlarge: 72,
      },
      sizes: {
        hairline: StyleSheet.hairlineWidth,
      },
      fonts: {
        playful: "Jomhuria",
        normal: "Offside",
      },
    },
  });

export { styled, css, createTheme, useTheme, config, theme, ThemeProvider };
export type CSS = Stitches.CSS<typeof config>;
export type Theme = typeof theme;
export type Color = keyof Theme["colors"];
export type Space = keyof Theme["space"];
export type Radii = keyof Theme["radii"];
export type Fonts = keyof Theme["fonts"];
