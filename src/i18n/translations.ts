export const translations = {
  fr: {
    // WeatherCard
    feelsLike: 'Ressenti',
    humidity: 'Humidité',
    pressure: 'Pression',
    wind: 'Vent',
    windDirection: 'Direction',
    sunriseSunset: 'Lever & coucher',

    // MapCard
    map: 'Carte',
    clouds: 'Nuages',
    precipitation: 'Précipitations',
    temperature: 'Température',

    // ChartCard
    chartTitle: 'Prévisions toutes les 3 heures',
    chartYAxis: 'Température',
    chartXAxis: 'Heure',

    // SearchModal
    searchPlaceholder: 'Rechercher une ville...',
  },
  en: {
    // WeatherCard
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    pressure: 'Pressure',
    wind: 'Wind',
    windDirection: 'Direction',
    sunriseSunset: 'Sunrise & sunset',

    // MapCard
    map: 'Map',
    clouds: 'Clouds',
    precipitation: 'Precipitation',
    temperature: 'Temperature',

    // ChartCard
    chartTitle: 'Forecast every 3 hours',
    chartYAxis: 'Temperature',
    chartXAxis: 'Time',

    // SearchModal
    searchPlaceholder: 'Search for a city...',
  },
} as const;

export type Translations = typeof translations.fr;
