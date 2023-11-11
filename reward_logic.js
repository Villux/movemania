// main app manages

const gameState = {
    totalTiles: 169,
    collectedTiles: 0,
    tilesToLevelUp: 25,
    tilesExtensionRation: 1.5,
    simultaneousPlayers: 1,
    boostEffect: 1.3,
    tilesCollectedSinceLastReward: 0,
    lastTileRation: 0.01,
    lastTilesRewardProbability: 1,
    probK: -70,
    consequentRewardProbability: 0.5,
}
const rewardsStates = [
    {
        name: "coin",
        foundCount: 0,
        aimCount: 3,
        maxCount: 5,
    },
    {
        name: "diamond",
        foundCount: 0,
        aimCount: 1,
        maxCount: 2,
    },
    {
        name: "box",
        foundCount: 0,
        aimCount: 0,
        maxCount: 1,
        fixedProbability: 0.15,
    },
    {
        name: "key",
        foundCount: 0,
        aimCount: 0,
        maxCount: 1,
        fixedProbability: 0.15,
    },
]

// end main app manages

const DEFAULT_PROBABILITY = 0.1

const getRewardProbability = (reward, gameState, ratioOfTilesLeft) => {
    let probability = DEFAULT_PROBABILITY

    // calculate probability based on the target amount of tiles and level size
    if (reward.aimCount > 0) {
        probability = reward.aimCount / gameState.tilesToLevelUp
    } 

    // use fixed probability if set
    if (reward.fixedProbability >= 0) {
        probability = reward.fixedProbability
    }
    
    // increase probability if game is running out
    if (ratioOfTilesLeft < 0.2) {
        probability = probability * (1 + Math.exp(gameState.probK * ratioOfTilesLeft));
    }
    
    // adjust reward probably based on the boost effect and player count
    probability = probability * gameState.boostEffect ** gameState.simultaneousPlayers

    // remaining rewards need to be given quicker
    if (ratioOfTilesLeft < gameState.lastTileRation && reward.aimCount > 0 && reward.foundCount < reward.aimCount) {
        probability = 1
    }
    // for safety...
    return Math.max(0, Math.min(probability, 1))
}

const achieveReward = (rewardsStates, gameState, ) => {
    // consecutive rewards only sometimes
    if (gameState.tilesCollectedSinceLastReward < 1 && Math.random() > gameState.consequentRewardProbability) {
        return []
    }

    // calculate how much level is left to play
    const ratioOfTilesLeft = 1 - gameState.collectedTiles / gameState.tilesToLevelUp * gameState.tilesExtensionRation
    for (let reward of rewardsStates) {
        //  check if reward is already fully collected in collectedRewards
        if (reward.foundCount >= reward.maxCount) {
            continue;
        }
        
        const probability = getRewardProbability(reward, gameState, ratioOfTilesLeft)
        if (Math.random() <= probability) {
            return [reward.name];
        }
    }
    return []
}

// only for test purposes

const runGame = () => {
    let keeRunning = true;
    while (keeRunning) {
        _rewards = achieveReward(rewardsStates, gameState)
        
        gameState.tilesCollectedSinceLastReward += 1
        
        console.log("New tile collected")
        if (_rewards.length > 0) {
            gameState.tilesCollectedSinceLastReward = 0
            console.log("Reward achieved: ", _rewards[0])
        }
        for (let reward of rewardsStates) {
            if (reward.name === _rewards[0]) {
                reward.foundCount += 1
            }
            
        }
        gameState.collectedTiles += 1
        keeRunning = rewardsStates[0].foundCount < rewardsStates[0].aimCount || rewardsStates[1].foundCount < rewardsStates[1].aimCount
    }
    console.log("Game finished", gameState.collectedTiles)
}

runGame()

// end only for test purposes
