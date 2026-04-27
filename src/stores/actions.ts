import { $forecast, $forecastLoading, $forecastError } from "./forecastStore";
import { $location } from "./locationStore";
import type { GeocodingResult } from "../types/weather";

export const setLocation = (location: GeocodingResult) => {
  $location.set(location)
}

export const fetchForecast = async () => {
  const location = $location.get();
  if (!location) {
    $forecastError.set("No location set");
    return;
  }

  $forecastLoading.set(true);
  $forecastError.set(null);

  try {
    const res = await fetch(`/api/forecast?lat=${location.lat}&lon=${location.lon}`);
    if (!res.ok) { throw new Error(`Failed to fetch forecast data: ${res.status}`); }
    const data = await res.json();
    $forecast.set(data);
  } catch (error) {
    $forecastError.set("Failed to fetch forecast data");
  } finally {
    $forecastLoading.set(false);
  }
}