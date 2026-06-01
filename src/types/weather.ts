export interface GeocodingResult {
  id: number;
  name: string;
  lat: number;
  lon: number;
  country: string;
  country_code: string;
  state?: string;
  timezone: string;
  elevation?: number;
}

// ===== Open-Meteo =====

export interface OMCurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  pressure_msl: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  visibility: number;
  is_day: number; // 1 = jour, 0 = nuit
}

export interface OMDailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_probability_max: number[];
}

export interface OMHourlyWeather {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  visibility: number[];
  cloud_cover: number[];
  uv_index: number[];
}

export interface OMAirQuality {
  time: string[];
  european_aqi: number[];
  pm2_5: number[];
  pm10: number[];
  nitrogen_dioxide: number[];
  ozone: number[];
}

export interface OMAirQualityResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    european_aqi: number;
    pm2_5: number;
    pm10: number;
    nitrogen_dioxide: number;
    ozone: number;
  };
}

export interface OMResponse {
  latitude: number;
  longitude: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: OMCurrentWeather;
  daily: OMDailyWeather;
  hourly: OMHourlyWeather;
}
