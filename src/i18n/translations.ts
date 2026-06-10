export const translations = {
  fr: {
    // SearchInput
    searchPlaceholder: 'Rechercher une ville...',
    searchResult: 'RÉSULTAT',
    searchNoMatch: 'Aucune ville ne correspond à',
    searchTryAgain: 'Essayez un autre nom',

    // WeatherCard
    feelsLike: 'Ressenti',
    humidity: 'Humidité',
    pressure: 'Pression',

    // MapCard
    map: 'Carte',
    clouds: 'Nuages',
    precipitation: 'Précipitations',
    temperature: 'Température',


    // WindCard
    wind: 'Vent',
    windSpeed: 'Vitesse',
    windDirection: 'Direction',
    windGust: 'Rafales',
    cloudCover: 'Nuages',
    visibility: 'Visibilité',

    // SunCard
    sunriseSunset: 'Lever & coucher',
    sunrise: 'Lever',
    sunset: 'Coucher',
    civilDawn: 'Aube',
    civilDusk: 'Crépuscule',
    solarNoon: 'Midi solaire',
    dayLength: 'Durée du jour',

    // AirCard
    airQuality: 'Qualité de l\'air',

    // ForecastCard
    forecast: 'Prévisions',
    forecastPrev: 'Cliquer pour prévisualiser',

    // ChartCard
    chartTitle: 'Prévisions 24h',
    chartInterval: 'Intervalles de 3 heures',
    chartYAxis: 'Température',
    chartXAxis: 'Heure',

    // Error banner
    apiErrorTitle: 'Service météo indisponible',
    apiErrorDesc: 'Les données météo sont temporairement inaccessibles. Réessayez dans quelques instants.',
    apiErrorRetry: 'Réessayer',

    // 404
    notFoundTitle: 'Page perdue dans le brouillard',
    notFoundDesc: 'Cette page n\'existe pas ou a été déplacée.',
    notFoundBtn: 'Retour à l\'accueil',

  },
  en: {
    // SearchInput
    searchPlaceholder: 'Search for a city...',
    searchResult: 'RESULT',
    searchNoMatch: 'No cities match',
    searchTryAgain: 'Try a different name',

    // WeatherCard
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    pressure: 'Pressure',

    // MapCard
    map: 'Map',
    clouds: 'Clouds',
    precipitation: 'Precipitation',
    temperature: 'Temperature',


    // WindCard
    wind: 'Wind',
    windSpeed: 'Speed',
    windDirection: 'Direction',
    windGust: 'Gusts',
    cloudCover: 'Cloud cover',
    visibility: 'Visibility',

    // SunCard
    sunriseSunset: 'Sunrise & sunset',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    civilDawn: 'Civil dawn',
    civilDusk: 'Civil dusk',
    solarNoon: 'Solar noon',
    dayLength: 'Day length',

    // AirCard
    airQuality: 'Air quality',

    // ForecastCard
    forecast: 'Forecast',
    forecastPrev: 'Tap a day to preview',

    // ChartCard
    chartTitle: '24-hour outlook',
    chartInterval: '3-hour intervals',
    chartYAxis: 'Temperature',
    chartXAxis: 'Time',

    // Error banner
    apiErrorTitle: 'Weather service unavailable',
    apiErrorDesc: 'Weather data is temporarily unavailable. Please try again in a few moments.',
    apiErrorRetry: 'Retry',

    // 404
    notFoundTitle: 'Page lost in the fog',
    notFoundDesc: 'This page doesn\'t exist or has been moved.',
    notFoundBtn: 'Back to home',
  },
} as const;

export type Translations = typeof translations.fr;
