import { useEffect, useMemo, useState } from "react";

import { type useGame } from "./game";
import { useInterval } from "./utils";
import { SimulatedPlayer } from "./types";

export function useSimulatePlayer({
  player,
  game,
}: {
  player: SimulatedPlayer;
  game: ReturnType<typeof useGame>;
}) {
  const intervalMs = useMemo(() => 2000 + Math.random() * 2000, []);
  const interval = game.state.phase === "play" ? intervalMs : null;
  const [currentCoordinateIndex, setCurrentCoordinateIndex] = useState(0);

  useInterval(() => {
    if (currentCoordinateIndex < player.route.length - 1) {
      setCurrentCoordinateIndex((index) => index + 1);
    }
  }, interval);

  useEffect(() => {
    const coordinate = player.route[currentCoordinateIndex];

    if (coordinate) {
      game.updateHexagons({
        player: player.name,
        currentLocation: coordinate,
      });
    }
  }, [currentCoordinateIndex]);

  return player.route[currentCoordinateIndex];
}
