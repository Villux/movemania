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
        const capturedCount = capturedBy?.length ?? 0;

        // Increase opacity of hexagon fill color based on number of players
        // that have captured it.
        const fillColor = `rgba(255, 245, 0, ${Math.min(
          1,
          0.08 + capturedCount * 0.25
        )})`;

        const strokeColor = capturedCount > 0 ? "#fff385" : "#000";

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
