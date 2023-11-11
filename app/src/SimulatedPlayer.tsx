import { Marker } from "react-native-maps";

import { SimulatedPlayer as SimulatedPlayerType } from "./types";
import { useSimulatePlayer } from "./player-simulation";
import { useGame } from "./game";
import { useState } from "react";

type Props = {
  player: SimulatedPlayerType;
  game: ReturnType<typeof useGame>;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SimulatedPlayer({ game, player }: Props) {
  const [playerUsingApp, setPlayerUsingApp] = useState(false);

  const currentCoordinate = useSimulatePlayer({ game, player });

  // TODO: Put simulatenousplayers to 2
  if (!currentCoordinate || !playerUsingApp) return null;

  return (
    <Marker
      coordinate={currentCoordinate}
      image={require("../assets/images/user-avatar-3.png")}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
}
