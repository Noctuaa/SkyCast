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

    // SearchInput
    searchPlaceholder: 'Rechercher une ville...',
    searchResult: 'RÉSULTAT',
    searchNoMatch: 'Aucune ville ne correspond à',
    searchTryAgain: 'Essayez un autre nom',
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

    // SearchInput
    searchPlaceholder: 'Search for a city...',
    searchResult: 'RESULT',
    searchNoMatch: 'No cities match',
    searchTryAgain: 'Try a different name',
  },
} as const;

export type Translations = typeof translations.fr;
