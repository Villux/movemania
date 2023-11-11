import { useMemo, useRef } from "react";

import { type useGame } from "./game";
import { useInterval } from "./utils";
import { SimulatedPlayer } from "./types";

export function useSimulatePlayers({
  player,
  game,
}: {
  player: SimulatedPlayer;
  game: ReturnType<typeof useGame>;
}) {
  const intervalMs = useMemo(() => 2000 + Math.random() * 2000, []);
  const interval = game.state.phase === "play" ? intervalMs : null;
  const coordinates = useRef([...player.route]);

  useInterval(() => {
    const coordinate = coordinates.current.shift();

    if (coordinate) {
      game.updateHexagons({
        player: player.name,
        currentLocation: coordinate,
      });
    }
  }, interval);
}
