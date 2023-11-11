import * as h3 from "h3-js";
import { Polygon } from "react-native-maps";
import { Hexagon } from "./types";

type Props = {
  hexagons: Hexagon[];
};

export function Hexagons({ hexagons }: Props) {
  return (
    <>
      {hexagons.map(({ h3Index, capturedBy }) => {
        let fillColor = "rgba(255, 245, 0, 0.04)";
        let strokeColor = "#000";

        if (capturedBy.includes("Teemu")) {
          // Me and others have captured this hexagon
          if (capturedBy.length > 1) {
            fillColor = "rgba(255, 245, 0, 0.75)";
            strokeColor = "rgba(255, 245, 0, 1)";
          } else {
            // Only I have captured this hexagon
            fillColor = "rgba(255, 245, 0, 0.4)";
            strokeColor = "rgba(255, 245, 0, 0.5)";
          }
        } else if (capturedBy.length > 0) {
          // Someone else has captured this hexagon
          fillColor = "rgba(255, 245, 0, 0.15)";
          strokeColor = "rgba(255, 245, 0, 0.2)";
        }

        const coordinates = h3.cellToBoundary(h3Index).map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        return (
          <Polygon
            key={h3Index}
            coordinates={coordinates}
            fillColor={fillColor}
            strokeColor={strokeColor}
            strokeWidth={1}
          />
        );
      })}
    </>
  );
}
