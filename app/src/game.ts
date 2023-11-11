import * as h3 from "h3-js";

import { Coordinate, moveCoordinateByKm } from "./utils";
import { Game } from "./types";

export function createGameState({
  currentLocation,
}: {
  currentLocation: Coordinate;
}): Game {
  const gameLocation = moveCoordinateByKm({
    coordinate: currentLocation,
    km: 1,
  });

  const hexagonSize = 10;

  const h3Index = h3.latLngToCell(
    gameLocation.latitude,
    gameLocation.longitude,
    hexagonSize
  );

  const hexagonsH3Indices = h3.gridDisk(h3Index, 6);

  const hexagons = hexagonsH3Indices.map((h3Index) => ({
    h3Index,
    isCaptured: false,
  }));

  const game = {
    hexagons,
  };

  return game;
}
