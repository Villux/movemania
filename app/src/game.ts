import * as h3 from "h3-js";

import { moveCoordinateByKm } from "./utils";
import { Coordinate, Game, Hexagon, Reward } from "./types";

const MAX_COINS = 5;
const MAX_DIAMONDS = 3;
const MAX_KEYS = 1;
const MAX_CHESTS = 1;

export function createGameState({
  initialLocation,
}: {
  initialLocation: Coordinate;
}): Game {
  const rewardAssigments: Record<Reward, number> = {
    coin: 0,
    diamond: 0,
    key: 0,
    chest: 0,
  };

  const gameLocation = moveCoordinateByKm({
    coordinate: initialLocation,
    km: 0,
  });

  const hexagonSize = 10;

  const h3Index = h3.latLngToCell(
    gameLocation.latitude,
    gameLocation.longitude,
    hexagonSize
  );

  const hexagonsH3Indices = h3.gridDisk(h3Index, 6);

  const hexagons: Array<Hexagon> = hexagonsH3Indices.map((h3Index) => {
    const coord = h3.cellToLatLng(h3Index);

    return {
      h3Index,
      isCaptured: false,
      reward: null,
      coordinate: {
        latitude: coord[0],
        longitude: coord[1],
      },
    };
  });

  const hasAssignedAllRewards = () => {
    return (
      rewardAssigments.coin === MAX_COINS &&
      rewardAssigments.diamond === MAX_DIAMONDS &&
      rewardAssigments.key === MAX_KEYS &&
      rewardAssigments.chest === MAX_CHESTS
    );
  };

  while (!hasAssignedAllRewards()) {
    hexagons.forEach((hexagon) => {
      assignReward(hexagon, rewardAssigments);
    });
  }

  const game = {
    hexagons,
  };

  return game;
}

const coinProbability = 0.2;
const diamondProbability = 0.1;
const keyProbability = 0.05;
const chestProbability = 0.05;

export const assignReward = (
  hexagon: Hexagon,
  rewardAssigments: Record<Reward, number>
) => {
  const random = Math.random();
  if (rewardAssigments.chest < MAX_CHESTS && random <= chestProbability) {
    rewardAssigments.chest += 1;
    hexagon.reward = "chest";
  } else if (rewardAssigments.key < MAX_KEYS && random <= keyProbability) {
    rewardAssigments.key += 1;
    hexagon.reward = "key";
  } else if (
    rewardAssigments.diamond < MAX_DIAMONDS &&
    random <= diamondProbability
  ) {
    rewardAssigments.diamond += 1;
    hexagon.reward = "diamond";
  } else if (rewardAssigments.coin < MAX_COINS && random <= coinProbability) {
    rewardAssigments.coin += 1;
    hexagon.reward = "coin";
  }
};
