import type { APIRoute } from 'astro';
import type { OMResponse } from '../../types/weather';
import { isValidCoords } from '../../utils/coords';
import { createCache } from '../../utils/cache';

const cache = createCache<OMResponse>();

const CURRENT = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'pressure_msl',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'visibility',
  'is_day',
].join(',');

const HOURLY = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'visibility',
  'cloud_cover',
  'uv_index',
].join(',');

const DAILY = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_probability_max',
].join(',');

const fetchForecast = async (lat: string, lon: string): Promise<OMResponse> => {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', CURRENT);
  url.searchParams.set('hourly', HOURLY);
  url.searchParams.set('daily', DAILY);
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '8');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
};

export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');

  if (!lat || !lon || !isValidCoords(lat, lon)) {
    return new Response(JSON.stringify({ error: 'Invalid or missing lat/lon' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const key = `${lat},${lon}`;
    const cached = cache.get(key);
    if (cached) return new Response(JSON.stringify(cached), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await fetchForecast(lat, lon);
    cache.set(key, data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
