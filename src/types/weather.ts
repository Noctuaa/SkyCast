export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility?: number;
  pop?: number; // Probability of precipitation
  rain?: {
    '3h': number; // Rain volume for the last 3 hours
  };
  snow?: {
    '3h': number; // Snow volume for the last 3 hours
  };
  sys: {
    pod: string; // Part of the day (n - night, d - day)
  };
  dt_txt: string; // Date and time in text format
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type ForecastDays = Record<string, ForecastItem[]>;
