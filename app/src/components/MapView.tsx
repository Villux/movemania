import RNMapView, { MapViewProps, PROVIDER_GOOGLE } from "react-native-maps";

export function MapView(props: MapViewProps) {
  return (
    <RNMapView
      {...props}
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      customMapStyle={require("../../assets/maps/map-theme.json")}
      minZoomLevel={14}
      maxZoomLevel={17}
      followsUserLocation
      showsUserLocation
    />
  );
}
