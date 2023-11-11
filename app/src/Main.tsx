import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Audio } from "expo-av";
import RNMapView, {
  Marker,
  Region,
  UserLocationChangeEvent,
} from "react-native-maps";

import { distanceBetweenCoords, isCoordInPolygon } from "./utils";
import { Game, Reward, Coordinate } from "./types";
import { Button, Overlay, MapView, Text } from "./components";
import { Hexagons } from "./Hexagons";
import { createGameState } from "./game";
import { styled } from "./styled";
import { rewardAssets } from "../assets/assets";

export function Main({
  initialLocation,
  persistedGameState,
}: {
  initialLocation: Coordinate;
  persistedGameState: null | Game;
}) {
  const [game, setGame] = useState<Game | null>(persistedGameState);
  const [markersVisible, setMarkersVisible] = useState(true);
  const [foundReward, setFoundReward] = useState<Reward | null>(null);
  const lastLocation = useRef<Coordinate>(initialLocation);
  const mapRef = useRef<RNMapView>(null);
  const [followUserLocation, setFollowUserLocation] = useState(false);

  const initialRegion = {
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  function startGame() {
    const _game = createGameState({ initialLocation });
    setGame(_game);
    AsyncStorage.setItem("game", JSON.stringify(_game));
  }

  function resetGame() {
    setGame(null);
    AsyncStorage.removeItem("game");
  }

  function handleUserLocationChange({ nativeEvent }: UserLocationChangeEvent) {
    const currentLocation = nativeEvent.coordinate;
    if (!currentLocation || !game) return;

    if (followUserLocation) {
      mapRef.current?.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }

    const distance = distanceBetweenCoords(
      currentLocation,
      lastLocation.current
    );

    if (distance > 10) {
      const newHexagons = game.hexagons.map((hexagon) => {
        if (hexagon.isCaptured) return hexagon;
        const isCaptured = isCoordInPolygon(currentLocation, hexagon.h3Index);
        if (isCaptured && hexagon.reward) {
          setFoundReward(hexagon.reward);
        }
        return { ...hexagon, isCaptured };
      });
      setGame({ ...game, hexagons: newHexagons });
    }

    lastLocation.current = currentLocation;
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
        mapRef={mapRef}
        initialRegion={initialRegion}
        onUserLocationChange={handleUserLocationChange}
        onRegionChange={handleRegionChange}
      >
        {!!game && (
          <>
            <FollowUserButton onPress={() => setFollowUserLocation((v) => !v)}>
              {/* Follow or Stop following */}
              <Text>{followUserLocation ? "F" : "S"}</Text>
            </FollowUserButton>
            {game.hexagons
              .filter((h) => h.reward)
              .map(({ reward, coordinate }) => (
                <RewardMarker
                  key={`${coordinate.latitude}-${coordinate.longitude}`}
                  reward={reward as Reward}
                  coordinate={coordinate}
                />
              ))}
            <Hexagons hexagons={game.hexagons} />
          </>
        )}
      </MapView>

      {!!foundReward && (
        <FoundRewardOverlay
          reward={foundReward}
          hide={() => setFoundReward(null)}
        />
      )}

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

function FoundRewardOverlay({
  reward,
  hide,
}: {
  reward: Reward;
  hide: () => void;
}) {
  const lottieRef = useRef<LottieView>(null);
  const assets = rewardAssets[reward];

  useEffect(() => {
    async function handle() {
      const { sound } = await Audio.Sound.createAsync(assets.sound);
      sound.playAsync().catch((e) => console.log(e));
      lottieRef.current?.play();
    }

    setTimeout(handle, 500);
  }, []);

  return (
    <Overlay>
      <Fragment>
        <Text style={{ textAlign: "center" }}>You've found a {reward}!</Text>
        <LottieView
          ref={lottieRef}
          loop={false}
          autoPlay={false}
          speed={1.5}
          style={{ width: 200, height: 200 }}
          source={assets.animation}
          onAnimationFinish={() => hide()}
        />
      </Fragment>
    </Overlay>
  );
}

function RewardMarker({
  reward,
  coordinate,
  onPress,
}: {
  reward: Reward;
  coordinate: Coordinate;
  onPress?: () => void;
}) {
  const assets = rewardAssets[reward];

  return (
    <Marker
      coordinate={coordinate}
      image={assets.image}
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

const FollowUserButton = styled("TouchableOpacity", {
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

const ResetGameButton = styled("TouchableOpacity", {
  position: "absolute",
  top: 90,
  left: 20,
  backgroundColor: "#000",
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
});
