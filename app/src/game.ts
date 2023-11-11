import * as h3 from "h3-js";

import { MAIN_PLAYER } from "./constants";
import { isCoordInPolygon, moveCoordinateByKm, useStorageState } from "./utils";

import {
  Coordinate,
  Game,
  GamePhase,
  GameStats,
  Hexagon,
  Reward,
} from "./types";
import { getReward } from "./game-reward";

const MAX_COINS = 5;
const MAX_GEMS = 2;
const MAX_KEYS = 1;
const MAX_CHESTS = 1;

export function useGame(initialLocation: Coordinate) {
  const [_state, setState] = useStorageState<Game>("game", () =>
    createGame(initialLocation)
  );

  const state = _state!; // hack to get rid of the null...

  function updateHexagons({
    player,
    currentLocation,
  }: {
    currentLocation: Coordinate;
    player: string;
  }) {
    let foundReward: Reward | null = null;

    const hexagonIndex = state.hexagons.findIndex((hexagon) => {
      return isCoordInPolygon(currentLocation, hexagon.h3Index);
    });

    // Nothing to update and no reward found
    if (hexagonIndex === -1) return;

    if (state.gameState.simultaneousPlayers === 1 && player !== MAIN_PLAYER) {
      state.gameState.simultaneousPlayers = 2;
    }

    const hexagon = state.hexagons[hexagonIndex];

    const notCapturedByPlayer = !hexagon.capturedBy.includes(player);

    if (notCapturedByPlayer) {
      if (player === MAIN_PLAYER) {
        const reward = getReward({
          gameState: state.gameState,
          rewardState: state.rewardState,
        });

        hexagon.reward = reward;
      }

      hexagon.capturedBy = [...hexagon.capturedBy, player];

      // Show the found reward to user
      if (hexagon.reward && player === MAIN_PLAYER) {
        foundReward = hexagon.reward;
      }
    }

    const newHexagons = [...state.hexagons];
    newHexagons[hexagonIndex] = hexagon;

    setState({ ...state, hexagons: newHexagons });

    return foundReward;
  }

  function updatePhase(phase: GamePhase) {
    setState({ ...state, phase });
  }

  function resetGame() {
    setState(createGame(initialLocation));
  }

  function getStats(player: string) {
    const stats: GameStats = {
      coin: {
        collected: 0,
        max: MAX_COINS,
      },
      gem: {
        collected: 0,
        max: MAX_GEMS,
      },
      key: {
        collected: 0,
        max: MAX_KEYS,
      },
      chest: {
        collected: 0,
        max: MAX_CHESTS,
      },
    };

    state.hexagons.forEach((hexagon) => {
      if (hexagon.capturedBy?.includes(player) && hexagon.reward) {
        stats[hexagon.reward].collected += 1;
      }
    });

    return stats;
  }

  return { state, getStats, updateHexagons, updatePhase, resetGame };
}

function createGame(initialLocation: Coordinate): Game {
  const game: Game = {
    hexagons: [],
    phase: "start",
    gameState: {
      totalTiles: 0,
      collectedTiles: 0,
      tilesToLevelUp: 15,
      tilesExtensionRation: 1.5,
      simultaneousPlayers: 1,
      boostEffect: 1.3,
      tilesCollectedSinceLastReward: 0,
      lastTileRation: 0.01,
      lastTilesRewardProbability: 1,
      probK: -70,
      consequentRewardProbability: 0.5,
    },
    rewardState: {
      coin: {
        name: "coin",
        foundCount: 0,
        maxCount: 3,
      },
      gem: {
        name: "gem",
        foundCount: 0,
        maxCount: 2,
      },
      chest: {
        name: "chest",
        foundCount: 0,
        maxCount: 1,
        fixedProbability: 0.02,
      },
      key: {
        name: "key",
        foundCount: 0,
        maxCount: 1,
        fixedProbability: 0.02,
      },
    },
  };

  const gameLocation = moveCoordinateByKm({
    coordinate: initialLocation,
    km: 0,
  });

  const hexagons = createHexagons(gameLocation);

  game.gameState.totalTiles = hexagons.length;
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
      capturedBy: [],
      reward: null,
      coordinate: {
        latitude: coord[0],
        longitude: coord[1],
      },
    };
  });

  return hexagons;
}
