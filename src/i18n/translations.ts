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
    forecastPrev: 'Cliquer sur une journée pour prévisualiser',

    // ChartCard
    chartTitle: 'Prévisions toutes les 3 heures',
    chartInterval: 'Intervalles de 3 heures',
    chartYAxis: 'Température',
    chartXAxis: 'Heure',


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
    chartTitle: 'Forecast every 3 hours',
    chartInterval: '3-hour intervals',
    chartYAxis: 'Temperature',
    chartXAxis: 'Time',
  },
} as const;

export type Translations = typeof translations.fr;
