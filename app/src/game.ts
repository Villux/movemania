import * as h3 from "h3-js";
import { useMemo } from "react";

import { isCoordInPolygon, moveCoordinateByKm, useStorageState } from "./utils";

import {
  Coordinate,
  Game,
  GamePhase,
  GameStats,
  Hexagon,
  Reward,
} from "./types";

const MAX_COINS = 5;
const MAX_DIAMONDS = 3;
const MAX_KEYS = 1;
const MAX_CHESTS = 1;

const playerName = "Teemu";

export function useGame(initialLocation: Coordinate) {
  const [_state, setState] = useStorageState<Game>("game");
  const state = _state || createGame(initialLocation);

  function updateHexagons(currentLocation: Coordinate) {
    let foundReward: Reward | null = null;

    const updatedHexagons = state.hexagons.map((hexagon) => {
      if (hexagon.capturedBy) return hexagon;

      const isCaptured = isCoordInPolygon(currentLocation, hexagon.h3Index);

      if (isCaptured && hexagon.reward) {
        foundReward = hexagon.reward;
      }

      return {
        ...hexagon,
        capturedBy: isCaptured ? playerName : null,
      };
    });

    setState({ ...state, hexagons: updatedHexagons });

    return foundReward;
  }

  function updatePhase(phase: GamePhase) {
    setState({ ...state, phase });
  }

  function resetGame() {
    setState(createGame(initialLocation));
  }

  const stats = useMemo(() => {
    const stats: GameStats = {
      coin: 0,
      diamond: 0,
      key: 0,
      chest: 0,
    };

    state.hexagons.forEach((hexagon) => {
      if (hexagon.capturedBy === playerName && hexagon.reward) {
        stats[hexagon.reward] += 1;
      }
    });

    return stats;
  }, [state.hexagons]);

  return { state, stats, updateHexagons, updatePhase, resetGame };
}

function createGame(initialLocation: Coordinate): Game {
  const game: Game = {
    hexagons: [],
    phase: "start",
  };

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

  const hexagons = createHexagons(gameLocation);

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

  game.hexagons = hexagons;

  return game;
}

function createHexagons(gameLocation: Coordinate) {
  const hexagonSize = 10;

  const h3Index = h3.latLngToCell(
    gameLocation.latitude,
    gameLocation.longitude,
    hexagonSize
  );

  const hexagonsH3Indices = h3.gridDisk(h3Index, 7);

  const hexagons: Hexagon[] = hexagonsH3Indices.map((h3Index) => {
    const coord = h3.cellToLatLng(h3Index);

    return {
      h3Index,
      capturedBy: null,
      reward: null,
      coordinate: {
        latitude: coord[0],
        longitude: coord[1],
      },
    };
  });

  return hexagons;
}

const coinProbability = 0.2;
const diamondProbability = 0.1;
const keyProbability = 0.05;
const chestProbability = 0.05;

// TODO: do not assign a reward if sibling hexagon already has a reward

function assignReward(
  hexagon: Hexagon,
  rewardAssigments: Record<Reward, number>
) {
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
}
