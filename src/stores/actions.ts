import { $forecast, $forecastLoading, $forecastError, $searchOpen } from "./forecastStore";
import { $location } from "./locationStore";
import type { ForecastResponse, GeocodingResult } from "../types/weather";

export const setLocation = (location: GeocodingResult) => {
  $location.set(location)
}

const saveToCache = (forecast: ForecastResponse, location: GeocodingResult) => {
  localStorage.setItem('skycast_cache', JSON.stringify({
    forecast,
    location,
    timestamp: Date.now()
  }));
}

export const loadFromCache = () => {
  const raw = localStorage.getItem('skycast_cache');
  if (!raw) return false;

  const { forecast, location, timestamp } = JSON.parse(raw);
  const age = Date.now() - timestamp;

  if (age < 10 * 60 * 1000) {
    $forecast.set(forecast);
    $location.set(location);
    $searchOpen.set(false);

    saveToCache(forecast, location);

    return true;
  }

  $location.set(location);
  return false;
}

export const fetchForecast = async () => {
  const location = $location.get();
  if (!location) {
    $forecastError.set("No location set");
    return;
  }

  $forecastLoading.set(true);
  $forecastError.set(null);
  $searchOpen.set(false);

  try {
    const res = await fetch(`/api/forecast?lat=${location.lat}&lon=${location.lon}`);
    if (!res.ok) { throw new Error(`Failed to fetch forecast data: ${res.status}`); }
    const data = await res.json();

    $forecast.set(data);
    saveToCache(data, location);

  } catch (error) {
    $forecastError.set("Failed to fetch forecast data");
  } finally {
    $forecastLoading.set(false);
  }
}
