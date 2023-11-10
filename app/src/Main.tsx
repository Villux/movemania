import * as h3 from "h3-js";
import LottieView from "lottie-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Region,
  UserLocationChangeEvent,
} from "react-native-maps";

import { Coordinate, distanceBetweenCoords, isCoordInPolygon } from "./utils";

export default function Main({
  initialLocation,
}: {
  initialLocation: Coordinate;
}) {
  const [locations, setLocations] = useState<Coordinate[]>([initialLocation]);
  const [markersVisible, setMarkersVisible] = useState(true);
  const [coinFound, setCoinFound] = useState(false);
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
  const coinLatLng = h3.cellToLatLng(hexagons[2]);
  const coinCoordinate = { latitude: coinLatLng[0], longitude: coinLatLng[1] };

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
        customMapStyle={require("../assets/map-theme.json")}
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

          return (
            <Polygon
              key={hexagon}
              coordinates={coordinates}
              fillColor={fillColor}
              strokeColor={strokeColor}
              strokeWidth={1}
            />
          );
        })}
        {markersVisible && (
          <CoinMarker
            coordinate={coinCoordinate}
            onPress={() => setCoinFound(true)}
          />
        )}
      </MapView>

      {coinFound && <CoinFound hide={() => setCoinFound(false)} />}
    </View>
  );
}

function CoinFound({ hide }: { hide: () => void }) {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    async function handle() {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/coin-sound.wav")
      );
      sound.playAsync().catch((e) => console.log(e));
      lottieRef.current?.play();
    }

    setTimeout(handle, 500);
  }, []);

  return (
    <BlurView
      tint="dark"
      intensity={50}
      style={{
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        entering={FadeIn}
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 32,
          padding: 24,
          paddingBottom: 0,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(150, 150, 150, 0.4)",
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "500",
            fontSize: 18,
          }}
        >
          You've found a coin!
        </Text>
        <LottieView
          ref={lottieRef}
          loop={false}
          autoPlay={false}
          speed={1.5}
          style={{ width: 200, height: 200 }}
          source={require("../assets/coin-animation.json")}
          onAnimationFinish={() => hide()}
        />
      </Animated.View>
    </BlurView>
  );
}

function CoinMarker({
  coordinate,
  onPress,
}: {
  coordinate: Coordinate;
  onPress?: () => void;
}) {
  return (
    <Marker
      coordinate={coordinate}
      image={require("../assets/coin.png")}
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
