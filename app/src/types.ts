import { Coordinate } from "./utils";

export type Reward = {
  type: "coin" | "diamond" | "key" | "chest" | null;
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
