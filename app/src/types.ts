import { Coordinate } from "./utils";

export type T = {
  coin: number;
  diamond: number;
  key: number;
  chest: number;
};

export type RewardType = "coin" | "diamond" | "key" | "chest" | null;

export type Reward = {
  type: RewardType;
  coordinate: Coordinate;
  assets: any;
};

export type RewardAsset =
  | {
      type: Reward["type"];
      image: string;
      animation: string;
      sound: string;
    }
  | null
  | undefined;
