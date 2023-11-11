import { Marker } from "react-native-maps";

import { SimulatedPlayer as SimulatedPlayerType } from "./types";
import { useSimulatePlayer } from "./player-simulation";
import { useGame } from "./game";

type Props = {
  player: SimulatedPlayerType;
  game: ReturnType<typeof useGame>;
};

export function SimulatedPlayer({ game, player }: Props) {
  const currentCoordinate = useSimulatePlayer({ game, player });
  if (!currentCoordinate) return null;
  return (
    <Marker
      coordinate={currentCoordinate}
      image={require("../assets/images/user-avatar-3.png")}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
}
