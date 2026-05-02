import { $forecast, $forecastLoading, $forecastError, $searchOpen, $forecastDays, $selectedDate } from "./forecastStore";
import { $location } from "./locationStore";
import type { ForecastResponse, ForecastDays, ForecastItem, GeocodingResult } from "../types/weather";

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

export const loadFromCache = () => {
  const raw = localStorage.getItem('skycast_cache');
  if (!raw) return false;

  const { forecast, location, timestamp } = JSON.parse(raw);
  const age = Date.now() - timestamp;

  if (age < 10 * 60 * 1000) {
    $forecast.set(forecast);
    $forecastDays.set(processForecastDays(forecast.list));
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
    $forecastDays.set(processForecastDays(data.list));
    $selectedDate.set(data.list[0].dt_txt.split(' ')[0]);
    saveToCache(data, location);

  } catch (error) {
    $forecastError.set("Failed to fetch forecast data");
  } finally {
    $forecastLoading.set(false);
  }
}
