import { GameState, Reward, RewardState } from "./types";

const DEFAULT_PROBABILITY = 0.1;

const getRewardProbability = (
  reward: RewardState,
  gameState: GameState,
  ratioOfTilesLeft: number
) => {
  let probability = DEFAULT_PROBABILITY;

  // calculate probability based on the target amount of tiles and level size
  if (reward.aimCount > 0) {
    probability = reward.aimCount / gameState.tilesToLevelUp;
  }

  // use fixed probability if set
  if (reward.fixedProbability && reward.fixedProbability >= 0) {
    probability = reward.fixedProbability;
  }

  // increase probability if game is running out
  if (ratioOfTilesLeft < 0.2) {
    probability =
      probability * (1 + Math.exp(gameState.probK * ratioOfTilesLeft));
  }

  // adjust reward probably based on the boost effect and player count
  probability =
    probability * gameState.boostEffect ** gameState.simultaneousPlayers;

  // remaining rewards need to be given quicker
  if (
    ratioOfTilesLeft < gameState.lastTileRation &&
    reward.aimCount > 0 &&
    reward.foundCount < reward.aimCount
  ) {
    probability = 1;
  }
  // for safety...
  return Math.max(0, Math.min(probability, 1));
};

export const achieveReward = (
  rewardStates: Record<Reward, RewardState>,
  gameState: GameState
): Reward | null => {
  // consecutive rewards only sometimes
  if (
    gameState.tilesCollectedSinceLastReward < 1 &&
    Math.random() > gameState.consequentRewardProbability
  ) {
    return null;
  }

  // calculate how much level is left to play
  const ratioOfTilesLeft =
    1 -
    (gameState.collectedTiles / gameState.tilesToLevelUp) *
      gameState.tilesExtensionRation;

  let r = null;

  Object.values(rewardStates).forEach((reward) => {
    // check if reward is already fully collected in collectedRewards
    if (reward.foundCount < reward.maxCount) {
      const probability = getRewardProbability(
        reward,
        gameState,
        ratioOfTilesLeft
      );

      console.log("> probability", probability);

      if (Math.random() <= probability) {
        r = reward.name;
      }
    }
  });

  return r;
};

export const getReward = ({
  gameState,
  rewardState,
}: {
  gameState: GameState;
  rewardState: Record<Reward, RewardState>;
}) => {
  gameState.collectedTiles += 1;

  if (gameState.collectedTiles < 3) return null;

  const reward = achieveReward(rewardState, gameState);

  gameState.tilesCollectedSinceLastReward += 1;

  if (reward) {
    gameState.tilesCollectedSinceLastReward = 0;
    const state = rewardState[reward];
    state.foundCount += 1;
  }

  return reward;
};
