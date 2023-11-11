export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Reward = "coin" | "diamond" | "key" | "chest";

export type Hexagon = {
  h3Index: string;
  isCaptured: boolean;
  reward: Reward | null;
  coordinate: Coordinate;
};

export type Game = {
  hexagons: Hexagon[];
};

// export type T = {
//   coin: number;
//   diamond: number;
//   key: number;
//   chest: number;
// };

// export type Reward = {
//   type: RewardType;
//   assets: any;
// };

// export type RewardAsset =
//   | {
//       type: Reward["type"];
//       image: string;
//       animation: string;
//       sound: string;
//     }
//   | null
//   | undefined;
