import { $forecast, $forecastLoading, $forecastError, $searchOpen, $forecastDays, $selectedDate } from "./forecastStore";
import { $location } from "./locationStore";
import { loadConfig, $lang } from "./configStore";
import type { ForecastResponse, ForecastDays, ForecastItem, GeocodingResult } from "../types/weather";
import { convertTemp } from '../utils/weather';
export { convertTemp }

export const setLocation = (location: GeocodingResult) => {
  $location.set(location);
};

const saveToCache = (forecast: ForecastResponse) => {
  const location = $location.get();
  localStorage.setItem('skycast_cache', JSON.stringify({
    forecast,
    location: location ? { name: location.name, country: location.country, lat: location.lat, lon: location.lon } : null,
    lang: $lang.get(),
    timestamp: Date.now()
  }));
};

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

export const applyForecast = (forecast: ForecastResponse) => {
  $forecast.set(forecast);
  $forecastDays.set(processForecastDays(forecast.list));
  $selectedDate.set(forecast.list[0].dt_txt.split(' ')[0]);
};

const loadFromCache = () => {
  const raw = localStorage.getItem('skycast_cache');
  if (!raw) return false;

  const { forecast, location, lang, timestamp } = JSON.parse(raw);

  if (lang && lang !== $lang.get()) return false;
  const age = Date.now() - timestamp;

  if (age < 10 * 60 * 1000) {
    applyForecast(forecast);
    if (location) $location.set(location);
    $searchOpen.set(false);
    saveToCache(forecast);
    history.pushState({}, '', `?city=${forecast.city.id}`);
    return true;
  }

  if (location) $location.set(location);
  return false;
};

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
    saveToCache(data);
    history.pushState({}, '', `?city=${data.city.id}`);

  } catch (error) {
    $forecastError.set("Failed to fetch forecast data");
  } finally {
    $forecastLoading.set(false);
  }
};

export const initForecast = async () => {
  loadConfig();
  if (loadFromCache()) return;

  if (!$location.get()) {
    $searchOpen.set(true);
    return;
  }

  await fetchForecast();
};
