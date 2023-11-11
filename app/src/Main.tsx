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
import {
  LevelCompleted,
  LevelHighlights,
  LevelStart,
  LevelStartNextLevel,
} from "./LevelOverlays";
import { RewardMarker } from "./RewardMarker";
import { FoundRewardOverlay } from "./FoundRewardOverlay";
import { player1, player3 } from "./player-simulation-data";
import ProgressBar from "./ProgressBar";
import { SimulatedPlayer } from "./SimulatedPlayer";
import { Stack } from "./components/Stack";
import { MAIN_PLAYER } from "./constants";

const debug = true;

export function Main({ initialLocation }: { initialLocation: Coordinate }) {
  const game = useGame(initialLocation);
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
      const rewardForHexagon = game.updateHexagons({
        currentLocation,
        player: MAIN_PLAYER,
      });

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
      <MapView
        mapRef={mapRef}
        initialRegion={initialRegion}
        onUserLocationChange={handleUserLocationChange}
        onRegionChange={handleRegionChange}
      >
        {game.state.phase === "play" && (
          <>
            {debug && <RewardMarkers hexagons={game.state.hexagons} />}
            <Hexagons hexagons={game.state.hexagons} />
            <SimulatedPlayer game={game} player={player1} />
            <SimulatedPlayer game={game} player={player3} />
          </>
        )}
      </MapView>

      {game.state.phase === "start" && (
        <LevelStart startGame={() => game.updatePhase("play")} />
      )}

      {game.state.phase === "play" && (
        <>
          {!!foundReward && (
            <FoundRewardOverlay
              reward={foundReward}
              hide={() => setFoundReward(null)}
            />
          )}

          <LogoContainer>
            <Logo source={require("../assets/images/logo.png")} />
          </LogoContainer>

          <UserAvatar source={require("../assets/images/user-avatar.jpg")} />

          <Footer axis="y" spacing="xxsmall">
            <ProgressBar onComplete={() => game.updatePhase("stats")} />

            <StatsBar stats={game.getStats(MAIN_PLAYER)} />
          </Footer>

          <FollowUserButton onPress={() => setFollowUserLocation((v) => !v)}>
            <Icon
              name="location"
              size={24}
              color={followUserLocation ? "primary" : "primaryDark"}
            />
          </FollowUserButton>
        </>
      )}

      {game.state.phase === "stats" && (
        <LevelCompleted
          stats={game.getStats(MAIN_PLAYER)}
          onContinue={() => game.updatePhase("highlights")}
        />
      )}

      {game.state.phase === "highlights" && (
        <LevelHighlights onContinue={() => game.updatePhase("next-level")} />
      )}

      {(game.state.phase === "play" || game.state.phase === "highlights") && (
        <>
          <ResetGameButton onPress={game.resetGame}>
            <Icon name="reset" size={24} color="primary" />
          </ResetGameButton>

          <FinishGameButton onPress={() => game.updatePhase("stats")}>
            <Icon name="reset" size={24} color="primaryDark" />
          </FinishGameButton>
        </>
      )}
      {game.state.phase === "next-level" && (
        <LevelStartNextLevel resetGame={game.resetGame} />
      )}
    </Container>
  );
}

const showAllRewardMarkers = true;

function RewardMarkers({ hexagons }: { hexagons: Hexagon[] }) {
  return (
    <>
      {hexagons
        .filter(
          (h) => h.reward && (showAllRewardMarkers || h.capturedBy.length)
        )
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

const UserAvatar = styled("Image", {
  zIndex: 100,
  position: "absolute",
  top: 72,
  right: 20,
  width: 40,
  height: 40,
  borderRadius: 48,
  borderWidth: 2,
  borderColor: "#FFF500",
});

const Footer = styled(Stack, {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  padding: 20,
});
