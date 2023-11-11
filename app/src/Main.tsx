import * as h3 from "h3-js";
import LottieView from "lottie-react-native";
import { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Audio } from "expo-av";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Region,
  UserLocationChangeEvent,
} from "react-native-maps";

import {
  Coordinate,
  distanceBetweenCoords,
  isCoordInPolygon,
  useRewardGenerator,
} from "./utils";

import { Button, Overlay, Text } from "./components";
import { Reward } from "./types";

export function Main({ initialLocation }: { initialLocation: Coordinate }) {
  const [locations, setLocations] = useState<Coordinate[]>([initialLocation]);
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

  const hexagonSize = 10;

  const h3Index = h3.latLngToCell(
    initialLocation.latitude,
    initialLocation.longitude,
    hexagonSize
  );

  const hexagons = h3.gridDisk(h3Index, 6);

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
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        customMapStyle={require("../assets/maps/map-theme.json")}
        onUserLocationChange={handleUserLocationChange}
        onRegionChange={handleRegionChange}
        minZoomLevel={14}
        maxZoomLevel={17}
        followsUserLocation
        showsUserLocation
      >
        {hexagons.map((hexagon) => {
          const isCaptured = locations.some((l) =>
            isCoordInPolygon(l, hexagon)
          );
          const fillColor = `rgba(255, 245, 0, ${isCaptured ? 0.5 : 0.05})`;
          const strokeColor = isCaptured ? "#fff385" : "#000";

          const coordinates = h3.cellToBoundary(hexagon).map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));

          const reward = useRewardGenerator(hexagon, rewards);

          useEffect(() => {
            if (reward.type && isCaptured) {
              setRewardFound(true);
            }
          }, [isCaptured, reward]);

          return (
            <Fragment key={hexagon}>
              <Polygon
                coordinates={coordinates}
                fillColor={fillColor}
                strokeColor={strokeColor}
                strokeWidth={1}
              />
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
            </Fragment>
          );
        })}
      </MapView>

      <Overlay>
        <Text>Test</Text>
        <Text variant="button">Test</Text>
        <Button onPress={() => console.log("press")}>Start Game</Button>
      </Overlay>
    </View>
  );
}
function RewardFound({ reward, hide }: { reward: Reward; hide: () => void }) {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    async function handle() {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/coin.wav")
      );
      sound.playAsync().catch((e) => console.log(e));
      lottieRef.current?.play();
    }

    setTimeout(handle, 500);
  }, []);

  return (
    <Overlay>
      <Fragment>
        <Text style={{ textAlign: "center" }}>
          You've found a ${reward.type}!
        </Text>
        <LottieView
          ref={lottieRef}
          loop={false}
          autoPlay={false}
          speed={1.5}
          style={{ width: 200, height: 200 }}
          source={require("../assets/animations/coin.json")}
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
      image={require("../assets/images/coin.png")}
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
  map: {
    width: "100%",
    height: "100%",
  },
});
