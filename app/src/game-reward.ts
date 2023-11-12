import { GameState, Reward, RewardState } from "./types";

const DEFAULT_PROBABILITY = 0.1;

const getRewardProbability = (
  reward: RewardState,
  gameState: GameState,
  ratioOfTilesLeft: number
) => {
  let probability = DEFAULT_PROBABILITY;

  // calculate probability based on the target amount of tiles and level size
  if (reward.maxCount > 0) {
    probability = reward.maxCount / gameState.tilesToLevelUp;
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
    reward.maxCount > 0 &&
    reward.foundCount < reward.maxCount
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
  if (gameState.tilesCollectedSinceLastReward < 1) {
    return null;
  }

  // calculate how much level is left to play
  const ratioOfTilesLeft =
    1 -
    (gameState.collectedTiles / gameState.tilesToLevelUp) *
      gameState.tilesExtensionRation;

  for (let reward of Object.values(rewardStates)) {
    // check if reward is already fully collected in collectedRewards
    if (reward.foundCount >= reward.maxCount) {
      continue;
    }

    const probability = getRewardProbability(
      reward,
      gameState,
      ratioOfTilesLeft
    );

    if (Math.random() <= probability) {
      return reward.name;
    }
  }

  return null;
};

export const getReward = ({
  gameState,
  rewardState,
}: {
  gameState: GameState;
  rewardState: Record<Reward, RewardState>;
}) => {
  const reward = achieveReward(rewardState, gameState);

  gameState.tilesCollectedSinceLastReward += 1;

  gameState.collectedTiles += 1;

  // Doesn't make sense to return rewards too soon
  if (gameState.collectedTiles < 4) return null;

  if (reward) {
    gameState.tilesCollectedSinceLastReward = 0;
    const state = rewardState[reward];
    state.foundCount += 1;
  }

  return reward;
};
