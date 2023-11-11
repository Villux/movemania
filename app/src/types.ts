export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Reward = "coin" | "diamond" | "key" | "chest";

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

export type Game = {
  hexagons: Hexagon[];
  phase: GamePhase;
};

export type SimulatedPlayer = {
  name: string;
  color: string;
  route: Coordinate[];
};
