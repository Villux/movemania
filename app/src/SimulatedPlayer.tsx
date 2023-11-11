import { Marker } from "react-native-maps";

import { SimulatedPlayer as SimulatedPlayerType } from "./types";
import { useSimulatePlayer } from "./player-simulation";
import { useGame } from "./game";

type Props = {
  player: SimulatedPlayerType;
  game: ReturnType<typeof useGame>;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SimulatedPlayer({ game, player }: Props) {
  // Enable simulated player when there are at least 3 hexagons captured
  // by the main player
  const enabled =
    game.state.phase === "play" &&
    game.state.hexagons.map((h) => h.capturedBy.length > 0).filter(Boolean)
      .length > 5;

  const currentCoordinate = useSimulatePlayer({ game, player, enabled });

  return (
    <Marker
      coordinate={currentCoordinate}
      image={require("../assets/images/simulated-player-marker.png")}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
}
