export const translations = {
  fr: {
    // WeatherCard
    feelsLike: 'Ressenti',
    humidity: 'Humidité',
    pressure: 'Pression',

    // WindCard
    wind: 'Vent',
    windSpeed: 'Vitesse',
    windDirection: 'Direction',
    windGust: 'Rafales',
    cloudCover: 'Nuages',
    visibility: 'Visibilité',

    // SunCard
    sunriseSunset: 'Lever & coucher',

    // AirCard
    airQuality: 'Qualité de l\'air',

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

    // WindCard
    wind: 'Wind',
    windSpeed: 'Speed',
    windDirection: 'Direction',
    windGust: 'Gusts',
    cloudCover: 'Cloud cover',
    visibility: 'Visibility',

    // SunCard
    sunriseSunset: 'Sunrise & sunset',

    // AirCard
    airQuality: 'Air quality',

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
