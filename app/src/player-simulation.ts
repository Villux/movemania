import { useEffect, useMemo, useState } from "react";

import { type useGame } from "./game";
import { useInterval } from "./utils";
import { SimulatedPlayer } from "./types";

export function useSimulatePlayer({
  player,
  game,
  enabled,
}: {
  player: SimulatedPlayer;
  game: ReturnType<typeof useGame>;
  enabled: boolean;
}) {
  const intervalMs = useMemo(() => 2000 + Math.random() * 2000, []);
  const [currentCoordinateIndex, setCurrentCoordinateIndex] = useState(0);

  useInterval(
    () => {
      if (currentCoordinateIndex < player.route.length - 1) {
        setCurrentCoordinateIndex((index) => index + 1);
      }
    },
    enabled ? intervalMs : null
  );

  useEffect(() => {
    if (!enabled) return;

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
