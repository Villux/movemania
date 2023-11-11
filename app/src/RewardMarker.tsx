import { Marker } from "react-native-maps";

import { Coordinate, Reward } from "./types";
import { rewardAssets } from "../assets/assets";

export function RewardMarker({
  reward,
  coordinate,
  onPress,
}: {
  reward: Reward;
  coordinate: Coordinate;
  onPress?: () => void;
}) {
  const assets = rewardAssets[reward];

  return (
    <Marker
      coordinate={coordinate}
      image={assets.image}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
    />
  );
}
