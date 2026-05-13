import { $forecast, $forecastLoading, $forecastError, $searchOpen, $forecastDays, $selectedDate } from "./forecastStore";
import { $location } from "./locationStore";
import { loadConfig, $lang } from "./configStore";
import type { ForecastResponse, ForecastDays, ForecastItem, GeocodingResult } from "../types/weather";

export const setLocation = (location: GeocodingResult) => {
  $location.set(location);
};

const saveToCache = (forecast: ForecastResponse, location: GeocodingResult) => {
  localStorage.setItem('skycast_cache', JSON.stringify({
    forecast,
    location,
    lang: $lang.get(),
    timestamp: Date.now()
  }));
};

/**
 * Groups raw API forecast items by day.
 * Each day includes the next day's 00:00:00 item to render a full
 * midnight-to-midnight curve in ChartCard.
 */
const processForecastDays = (list: ForecastItem[]): ForecastDays => {
  const allDates = [...new Set(list.map(item => item.dt_txt.split(' ')[0]))];

  return Object.fromEntries(
    allDates.map((date, index) => {
      const dayItems = list.filter(item => item.dt_txt.startsWith(date));
      const nextDate = allDates[index + 1];

      if (nextDate) {
        const midnight = list.find(item => item.dt_txt === `${nextDate} 00:00:00`);
        if (midnight) dayItems.push(midnight);
      }

      return [date, dayItems];
    })
  );
};

const applyForecast = (forecast: ForecastResponse) => {
  $forecast.set(forecast);
  $forecastDays.set(processForecastDays(forecast.list));
  $selectedDate.set(forecast.list[0].dt_txt.split(' ')[0]);
};

/**
 * Loads forecast data from localStorage if it exists and is under 10 minutes old.
 * Invalidates the cache if the stored language differs from the current one.
 * @returns true if valid cache was found and applied, false otherwise.
 */
const loadFromCache = () => {
  const raw = localStorage.getItem('skycast_cache');
  if (!raw) return false;

  const { forecast, location, lang, timestamp } = JSON.parse(raw);

  if (lang && lang !== $lang.get()) return false;
  const age = Date.now() - timestamp;


  if (age < 10 * 60 * 1000) {
    applyForecast(forecast);
    $location.set(location);
    $searchOpen.set(false);
    saveToCache(forecast, location);
    return true;
  }

  $location.set(location);
  return false;
};

/**
 * Fetches the 5-day forecast from the OpenWeatherMap API
 * for the location stored in $location.
 */
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
    const res = await fetch(`/api/forecast?lat=${location.lat}&lon=${location.lon}&lang=${$lang.get()}`);
    if (!res.ok) throw new Error(`Failed to fetch forecast data: ${res.status}`);
    const data = await res.json();

    applyForecast(data);
    saveToCache(data, location);

  } catch (error) {
    $forecastError.set("Failed to fetch forecast data");
  } finally {
    $forecastLoading.set(false);
  }
};

/**
 * Entry point to initialize forecast data on page load.
 * Loads from cache if available and fresh, otherwise fetches from API.
 * Opens the search modal if no location is set.
 */
export const initForecast = async () => {
  loadConfig();
  if (loadFromCache()) return;

  if (!$location.get()) {
    $searchOpen.set(true);
    return;
  }

  await fetchForecast();
};

/**
 * Converts a Celsius temperature to the target unit.
 * @param temp - Temperature in Celsius.
 * @param unit - Target unit ('C' or 'F').
 * @returns Rounded temperature in the target unit.
 */
export const convertTemp = (temp: number, unit: 'C' | 'F'): number => {
  if (unit === 'F') return Math.round(temp * 9 / 5 + 32);
  return Math.round(temp);
}; 
