import { useRef, useState } from "react";
import { View } from "react-native";
import RNMapView, { Region, UserLocationChangeEvent } from "react-native-maps";

import { distanceBetweenCoords } from "./utils";
import { Reward, Coordinate, Hexagon } from "./types";
import { MapView, Icon, Image } from "./components";
import { Hexagons } from "./Hexagons";
import { useGame } from "./game";
import { styled } from "./styled";
import { StatsBar } from "./StatsBar";
import { RewardMarker } from "./RewardMarker";
import { FoundRewardOverlay } from "./FoundRewardOverlay";
import { player1, player3 } from "./player-simulation-data";
import { ProgressBar } from "./ProgressBar";
import { SimulatedPlayer } from "./SimulatedPlayer";
import { Stack } from "./components/Stack";
import { MAIN_PLAYER } from "./constants";
import { LevelStartOverlay } from "./LevelStartOverlay";
import { LevelCompletedOverlay } from "./LevelCompletedOverlay";
import { LevelHighlightsOverlay } from "./LevelHighlightsOverlay";
import { LevelStartNextOverlay } from "./LevelStartNextOverlay";

const debug = false;

export function Main({ initialLocation }: { initialLocation: Coordinate }) {
  const game = useGame(initialLocation);
  const [markersVisible, setMarkersVisible] = useState(true);
  const [foundReward, setFoundReward] = useState<Reward | null>(null);
  const [followUserLocation, setFollowUserLocation] = useState(true);
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

      <Header>
        <FloatingButton onPress={() => setFollowUserLocation((v) => !v)}>
          <Icon
            name="location"
            size={24}
            color={followUserLocation ? "primary" : "primaryDark"}
          />
        </FloatingButton>

        <Image
          autoSize={{ height: 24 }}
          source={require("../assets/images/logo.png")}
        />

        <UserAvatar source={require("../assets/images/user-avatar.jpg")} />
      </Header>

      {game.state.phase === "start" && (
        <LevelStartOverlay startGame={() => game.updatePhase("play")} />
      )}

      {game.state.phase === "play" && (
        <>
          {!!foundReward && (
            <FoundRewardOverlay
              reward={foundReward}
              hide={() => setFoundReward(null)}
            />
          )}

          <Footer axis="y" spacing="xxsmall">
            <ProgressBar
              hexagons={game.state.hexagons}
              stats={game.getStats(MAIN_PLAYER)}
              onComplete={() => game.updatePhase("stats")}
            />
            <StatsBar stats={game.getStats(MAIN_PLAYER)} />
          </Footer>

          {debug && (
            <>
              <ResetGameButton onPress={game.resetGame}>
                <Icon name="reset" size={24} color="primary" />
              </ResetGameButton>

              <FinishGameButton onPress={() => game.updatePhase("stats")}>
                <Icon name="check" size={24} color="primary" />
              </FinishGameButton>
            </>
          )}
        </>
      )}

      {game.state.phase === "stats" && (
        <LevelCompletedOverlay
          stats={game.getStats(MAIN_PLAYER)}
          onContinue={() => game.updatePhase("highlights")}
        />
      )}

      {game.state.phase === "highlights" && (
        <LevelHighlightsOverlay
          onContinue={() => game.updatePhase("next-level")}
        />
      )}

      {game.state.phase === "next-level" && (
        <LevelStartNextOverlay resetGame={game.resetGame} />
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

const Header = styled("View", {
  flexDirection: "row",
  position: "absolute",
  top: 60,
  left: 16,
  right: 16,
  alignItems: "center",
  justifyContent: "space-between",
});

const FloatingButton = styled("TouchableOpacity", {
  backgroundColor: "#000",
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
});

const ResetGameButton = styled(FloatingButton, {
  position: "absolute",
  top: 112,
  left: 16,
});

const FinishGameButton = styled(FloatingButton, {
  position: "absolute",
  top: 162,
  left: 16,
});

const UserAvatar = styled("Image", {
  zIndex: 100,
  width: 40,
  height: 40,
  borderRadius: 48,
  borderWidth: 2,
  borderColor: "#FFF500",
});

const Footer = styled(Stack, {
  position: "absolute",
  bottom: 24,
  left: 16,
  right: 16,
  zIndex: 100,
});
