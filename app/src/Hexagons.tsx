import * as h3 from "h3-js";
import { Polygon } from "react-native-maps";

type Props = {
  hexagons: Array<{
    h3Index: string;
    isCaptured: boolean;
  }>;
};

export function Hexagons({ hexagons }: Props) {
  return (
    <>
      {hexagons.map(({ h3Index, isCaptured }) => {
        const fillColor = `rgba(255, 245, 0, ${isCaptured ? 0.5 : 0.05})`;
        const strokeColor = isCaptured ? "#fff385" : "#000";

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
