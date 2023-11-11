import RNMapView, { MapViewProps, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";

type Props = MapViewProps & {
  mapRef?: React.RefObject<RNMapView>;
};
export function MapView(props: Props) {
  return (
    <RNMapView
      {...props}
      ref={props.mapRef}
      style={{ ...StyleSheet.absoluteFillObject }}
      provider={PROVIDER_GOOGLE}
      customMapStyle={require("../../assets/maps/map-theme.json")}
      minZoomLevel={13}
      maxZoomLevel={17}
      showsUserLocation
    />
  );
}
