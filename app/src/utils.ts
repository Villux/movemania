import { MutableRefObject, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as h3 from "h3-js";
import { Coordinate } from "./types";

export function useLocation() {
  const [location, setLocation] = useState<null | Coordinate>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  return location;
}

export function isCoordInPolygon(coord: Coordinate, polygonH3Index: string) {
  const boundary = h3.cellToBoundary(polygonH3Index).map(([lat, lng]) => ({
    latitude: lat,
    longitude: lng,
  }));

  return isCoordWithinBoundary({ coord, boundary });
}

export function isCoordWithinBoundary({
  coord,
  boundary,
}: {
  coord: Coordinate;
  boundary: Coordinate[];
}) {
  const [lat, lng] = [coord.latitude, coord.longitude];
  const [minLat, maxLat] = [
    Math.min(...boundary.map((c) => c.latitude)),
    Math.max(...boundary.map((c) => c.latitude)),
  ];
  const [minLng, maxLng] = [
    Math.min(...boundary.map((c) => c.longitude)),
    Math.max(...boundary.map((c) => c.longitude)),
  ];
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

export function distanceBetweenCoords(coord1: Coordinate, coord2: Coordinate) {
  const R = 6371e3; // metres
  const φ1 = (coord1.latitude * Math.PI) / 180; // λ in radians
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

export function moveCoordinateByKm({
  coordinate,
  km,
}: {
  coordinate: Coordinate;
  km: number;
}) {
  const { latitude, longitude } = coordinate;
  const lat = latitude + (km / 6371) * (180 / Math.PI);
  const lng =
    longitude +
    ((km / 6371) * (180 / Math.PI)) / Math.cos((latitude * Math.PI) / 180);
  return { latitude: lat, longitude: lng };
}

export function useStorageState<T>(key: string, getInitialValue: () => T) {
  const [value, setValue] = useState<T | null>(getInitialValue);

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        setValue(JSON.parse(value) as T);
      }
    })();
  }, [key]);

  const setStorageState = (value: T | null) => {
    if (value === null) {
      AsyncStorage.removeItem(key);
      setValue(null);
    } else {
      AsyncStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    }
  };

  return [value, setStorageState] as const;
}

export function useInterval(
  callback: () => void,
  delay: number | null
): MutableRefObject<number | null> {
  const intervalRef = useRef<number | null>(null);
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();

    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current!);
    }
  }, [delay]);

  return intervalRef;
}
