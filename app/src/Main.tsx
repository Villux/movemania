import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Audio } from "expo-av";
import { Marker, Region, UserLocationChangeEvent } from "react-native-maps";

import { Coordinate, distanceBetweenCoords } from "./utils";
import { Game, Reward } from "./types";
import { Button, Overlay, MapView, Text } from "./components";
import { Hexagons } from "./Hexagons";
import { createGameState } from "./game";
import { styled } from "./styled";

export function Main({
  initialLocation,
  persistedGameState,
}: {
  initialLocation: Coordinate;
  persistedGameState: null | Game;
}) {
  const [locations, setLocations] = useState<Coordinate[]>([initialLocation]);
  const [game, setGame] = useState<Game | null>(persistedGameState);
  const [markersVisible, setMarkersVisible] = useState(true);
  const [rewardFound, setRewardFound] = useState(false);
  /* Store all the rewards in a state variable. */
  const [rewards, setRewards] = useState<Reward[]>([]);
  const currentLocation = locations[locations.length - 1];

  const initialRegion = {
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  function startGame() {
    const _game = createGameState({ currentLocation });
    setGame(_game);
    AsyncStorage.setItem("game", JSON.stringify(_game));
  }

  function resetGame() {
    setGame(null);
    AsyncStorage.removeItem("game");
  }

  function handleUserLocationChange({ nativeEvent }: UserLocationChangeEvent) {
    const { coordinate } = nativeEvent;
    if (!coordinate) return;

    const distance = distanceBetweenCoords(currentLocation, coordinate);

    if (distance > 10) {
      setLocations((p) => [...p, coordinate]);
    }
  }

  function handleRegionChange(region: Region) {
    const zoomLevel = Math.round(
      Math.log(360 / region.longitudeDelta) / Math.LN2
    );

    if (zoomLevel < 14) {
      setMarkersVisible(false);
    } else if (!markersVisible) {
      setMarkersVisible(true);
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={initialRegion}
        onUserLocationChange={handleUserLocationChange}
        onRegionChange={handleRegionChange}
      >
        {!!game && <Hexagons hexagons={game.hexagons} />}
      </MapView>

      {!game ? (
        <Overlay>
          <Button onPress={startGame}>Start Game</Button>
        </Overlay>
      ) : (
        <ResetGameButton onPress={resetGame}>
          <Text>X</Text>
        </ResetGameButton>
      )}
    </View>
  );
}

/*
 <RewardMarker
    reward={reward}
    onPress={() => setRewardFound(true)}
  />
  {rewardFound && (
    <RewardFound
      reward={reward}
      hide={() => setRewardFound(false)}
    />
  )}
*/

function RewardFound({ reward, hide }: { reward: Reward; hide: () => void }) {
  const lottieRef = useRef<LottieView>(null);
  if (!reward.type) return null;
  useEffect(() => {
    async function handle() {
      const { sound } = await Audio.Sound.createAsync(reward.assets.sound);
      sound.playAsync().catch((e) => console.log(e));
      lottieRef.current?.play();
    }

    setTimeout(handle, 500);
  }, []);

  return (
    <Overlay>
      <Fragment>
        <Text style={{ textAlign: "center" }}>
          You've found a {reward.type}!
        </Text>
        <LottieView
          ref={lottieRef}
          loop={false}
          autoPlay={false}
          speed={1.5}
          style={{ width: 200, height: 200 }}
          source={reward.assets.animation}
          onAnimationFinish={() => hide()}
        />
      </Fragment>
    </Overlay>
  );
}

function RewardMarker({
  reward,
  onPress,
}: {
  reward: Reward;
  onPress?: () => void;
}) {
  if (!reward.type) return null;

  return (
    <Marker
      coordinate={reward.coordinate}
      image={reward.assets.image}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

const ResetGameButton = styled("TouchableOpacity", {
  position: "absolute",
  top: 40,
  left: 20,
  backgroundColor: "#000",
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
});
