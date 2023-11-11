import { useRef, useState } from "react";
import { Image, View } from "react-native";
import RNMapView, { Region, UserLocationChangeEvent } from "react-native-maps";

import { distanceBetweenCoords } from "./utils";
import { Reward, Coordinate, Hexagon } from "./types";
import { MapView, Icon } from "./components";
import { Hexagons } from "./Hexagons";
import { useGame } from "./game";
import { styled } from "./styled";
import { StatsBar } from "./StatsBar";
import { LevelCompleted, LevelStart } from "./LevelOverlays";
import { RewardMarker } from "./RewardMarker";
import { FoundRewardOverlay } from "./FoundRewardOverlay";

export function Main({ initialLocation }: { initialLocation: Coordinate }) {
  const { game, updatePhase, updateHexagons, resetGame } =
    useGame(initialLocation);
  const [markersVisible, setMarkersVisible] = useState(true);
  const [foundReward, setFoundReward] = useState<Reward | null>(null);
  const [followUserLocation, setFollowUserLocation] = useState(false);
  const lastLocation = useRef<Coordinate>(initialLocation);
  const mapRef = useRef<RNMapView>(null);

  const initialRegion = {
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  function handleUserLocationChange({ nativeEvent }: UserLocationChangeEvent) {
    const currentLocation = nativeEvent.coordinate;
    if (!currentLocation) return;

    const distance = distanceBetweenCoords(
      currentLocation,
      lastLocation.current
    );

    // Process the current location if the user has moved enough
    if (distance > 10) {
      const rewardForHexagon = updateHexagons(currentLocation);
      setFoundReward(rewardForHexagon);
    }

    if (followUserLocation) {
      mapRef.current?.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
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
    <Container>
      <LogoContainer>
        <Logo source={require("../assets/images/logo.png")} />
      </LogoContainer>

      <MapView
        mapRef={mapRef}
        initialRegion={initialRegion}
        onUserLocationChange={handleUserLocationChange}
        onRegionChange={handleRegionChange}
      >
        {game.phase === "play" && (
          <>
            <RewardMarkers hexagons={game.hexagons} />
            <Hexagons hexagons={game.hexagons} />
          </>
        )}
      </MapView>

      {game.phase === "start" && (
        <LevelStart startGame={() => updatePhase("play")} />
      )}

      {game.phase === "play" && (
        <>
          {!!foundReward && (
            <FoundRewardOverlay
              reward={foundReward}
              hide={() => setFoundReward(null)}
            />
          )}

          <StatsBar game={game} />

          <FollowUserButton onPress={() => setFollowUserLocation((v) => !v)}>
            <Icon
              name="location"
              size={24}
              color={followUserLocation ? "primary" : "primaryDark"}
            />
          </FollowUserButton>
        </>
      )}

      {game.phase === "stats" && (
        <LevelCompleted onContinue={() => updatePhase("highlights")} />
      )}

      {game.phase === "highlights" && <View>{/* TODO */}</View>}

      {(game.phase === "play" || game.phase === "highlights") && (
        <>
          <ResetGameButton onPress={resetGame}>
            <Icon name="reset" size={24} color="primary" />
          </ResetGameButton>

          <FinishGameButton onPress={() => updatePhase("stats")}>
            <Icon name="reset" size={24} color="primaryDark" />
          </FinishGameButton>
        </>
      )}
    </Container>
  );
}

function RewardMarkers({ hexagons }: { hexagons: Hexagon[] }) {
  return (
    <>
      {hexagons
        .filter((h) => h.reward && h.capturedBy === null)
        .map(({ reward, coordinate }) => (
          <RewardMarker
            key={`${coordinate.latitude}-${coordinate.longitude}`}
            reward={reward as Reward}
            coordinate={coordinate}
          />
        ))}
    </>
  );
}

const Container = styled(View, {
  flex: 1,
  backgroundColor: "#000",
});

const LogoContainer = styled(View, {
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: "auto",
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

const FinishGameButton = styled("TouchableOpacity", {
  position: "absolute",
  top: 140,
  left: 20,
  backgroundColor: "#000",
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
});

const Logo = styled(Image, {
  zIndex: 100,
  width: 150,
  height: 34,
  top: 72,
  marginHorizontal: "auto",
});
