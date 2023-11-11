import { memo } from "react";
import { SvgXml } from "react-native-svg";
import type { ViewStyle } from "react-native";

import * as icons from "./icons";
import { Theme, useTheme } from "../styled";

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  color?: keyof Theme["colors"];
  forcedColor?: string;
  size?: number;
  style?: ViewStyle;
};

export const Icon = memo(function Icon({
  name,
  color = "text",
  forcedColor,
  size = 24,
  style,
}: Props) {
  const theme = useTheme();
  const iconColor = forcedColor || theme.colors[color];

  return (
    <SvgXml
      xml={icons[name]}
      width={size}
      height={size}
      color={iconColor}
      style={style}
    />
  );
});
