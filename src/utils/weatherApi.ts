import type { OMResponse, OMAirQualityResponse } from '../types/weather';
import { createCache } from './cache';

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

const forecastCache = createCache<OMResponse>();

export const getForecast = async (lat: string, lon: string): Promise<OMResponse> => {
  const key = `${lat},${lon}`;
  const cached = forecastCache.get(key);
  if (cached) return cached;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', CURRENT);
  url.searchParams.set('hourly', HOURLY);
  url.searchParams.set('daily', DAILY);
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '9');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data: OMResponse = await res.json();
  forecastCache.set(key, data);
  return data;
};

const airQualityCache = createCache<OMAirQualityResponse>();

export const getAirQuality = async (lat: string, lon: string): Promise<OMAirQualityResponse> => {
  const key = `${lat},${lon}`;
  const cached = airQualityCache.get(key);
  if (cached) return cached;

  const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', 'european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Air quality error: ${res.status}`);
  const data: OMAirQualityResponse = await res.json();
  airQualityCache.set(key, data);
  return data;
};

interface NominatimReverseResult {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country: string;
    country_code: string;
  };
}

export interface ReverseGeocodingResult {
  name: string;
  country: string;
  country_code: string;
  state?: string;
}

export const getReverseGeocoding = async (
  lat: string,
  lon: string,
  lang: string
): Promise<ReverseGeocodingResult> => {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('accept-language', lang);

  const res = await fetch(url.toString(), { headers: { 'User-Agent': 'SkyCast/1.0 (weather app)' } });
  if (!res.ok) throw new Error(`Nominatim reverse error: ${res.status}`);

  const data: NominatimReverseResult = await res.json();

  return {
    name:
      data.address.city ??
      data.address.town ??
      data.address.village ??
      data.address.municipality ??
      data.display_name.split(',')[0],
    country: data.address.country,
    country_code: data.address.country_code.toUpperCase(),
    state: data.address.state,
  };
};
