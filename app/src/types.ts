export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Reward = "coin" | "gem" | "key" | "chest";

export type Hexagon = {
  h3Index: string;
  capturedBy: string[];
  reward: Reward | null;
  coordinate: Coordinate;
};

export type GamePhase =
  | "start"
  | "play"
  | "stats"
  | "highlights"
  | "next-level"; // fake phase for displaying the next level

export type GameStats = Record<Reward, { collected: number; max: number }>;

export type RewardState = {
  name: Reward;
  foundCount: number;
  maxCount: number;
  fixedProbability?: number;
};

export type GameState = {
  totalTiles: number;
  collectedTiles: number;
  tilesToLevelUp: number;
  tilesExtensionRation: number;
  simultaneousPlayers: number;
  boostEffect: number;
  tilesCollectedSinceLastReward: number;
  lastTileRation: number;
  lastTilesRewardProbability: number;
  probK: number;
  consequentRewardProbability: number;
};

export type Game = {
  hexagons: Hexagon[];
  phase: GamePhase;
  gameState: GameState;
  rewardState: Record<Reward, RewardState>;
};

export type SimulatedPlayer = {
  name: string;
  color: string;
  route: Coordinate[];
};
