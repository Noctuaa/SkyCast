interface WmoEntry {
  icon: string;       // base icon sans suffixe d/n
  iconNight?: string; // base icon alternatif la nuit (ex: 10 le jour, 09 la nuit)
  fr: string;
  en: string;
}

const WMO_MAP: Record<number, WmoEntry> = {
  // Dégagé
  0:  { icon: '01', fr: 'Ciel dégagé',              en: 'Clear sky' },
  1:  { icon: '01', fr: 'Principalement dégagé',     en: 'Mainly clear' },
  // Nuages
  2:  { icon: '02', fr: 'Partiellement nuageux',     en: 'Partly cloudy' },
  3:  { icon: '04', fr: 'Couvert',                   en: 'Overcast' },
  // Brouillard
  45: { icon: '50', fr: 'Brouillard',                en: 'Fog' },
  48: { icon: '50', fr: 'Brouillard givrant',        en: 'Rime fog' },
  // Bruine
  51: { icon: '09', fr: 'Bruine légère',             en: 'Light drizzle' },
  53: { icon: '09', fr: 'Bruine modérée',            en: 'Moderate drizzle' },
  55: { icon: '09', fr: 'Bruine dense',              en: 'Dense drizzle' },
  56: { icon: '09', fr: 'Bruine verglaçante légère', en: 'Light freezing drizzle' },
  57: { icon: '09', fr: 'Bruine verglaçante forte',  en: 'Heavy freezing drizzle' },
  // Pluie — légère avec soleil/lune, forte sans
  61: { icon: '10', fr: 'Pluie légère',              en: 'Slight rain' },
  63: { icon: '09', fr: 'Pluie modérée',             en: 'Moderate rain' },
  65: { icon: '09', fr: 'Pluie forte',               en: 'Heavy rain' },
  66: { icon: '09', fr: 'Pluie verglaçante légère',  en: 'Light freezing rain' },
  67: { icon: '09', fr: 'Pluie verglaçante forte',   en: 'Heavy freezing rain' },
  // Neige
  71: { icon: '13', fr: 'Légère chute de neige',     en: 'Slight snowfall' },
  73: { icon: '13', fr: 'Chute de neige modérée',    en: 'Moderate snowfall' },
  75: { icon: '13', fr: 'Forte chute de neige',      en: 'Heavy snowfall' },
  77: { icon: '13', fr: 'Grains de neige',           en: 'Snow grains' },
  // Averses de pluie
  80: { icon: '09', fr: 'Averses légères',           en: 'Slight rain showers' },
  81: { icon: '09', fr: 'Averses modérées',          en: 'Moderate rain showers' },
  82: { icon: '09', fr: 'Averses violentes',         en: 'Violent rain showers' },
  // Averses de neige
  85: { icon: '13', fr: 'Averses de neige légères',  en: 'Slight snow showers' },
  86: { icon: '13', fr: 'Averses de neige fortes',   en: 'Heavy snow showers' },
  // Orage
  95: { icon: '11', fr: 'Orage',                     en: 'Thunderstorm' },
  96: { icon: '11', fr: 'Orage avec grêle légère',   en: 'Thunderstorm, slight hail' },
  99: { icon: '11', fr: 'Orage avec forte grêle',    en: 'Thunderstorm, heavy hail' },
};

/**
 * Retourne le code icône OWM et la description pour un code WMO.
 * is_day: 1 = jour, 0 = nuit
 */
export const getWmoInfo = (
  code: number,
  isDay: boolean,
  lang: 'fr' | 'en',
): { icon: string; description: string } => {
  const entry = WMO_MAP[code] ?? WMO_MAP[0];
  const suffix = isDay ? 'd' : 'n';
  const baseIcon = (!isDay && entry.iconNight) ? entry.iconNight : entry.icon;
  return {
    icon: `${baseIcon}${suffix}`,
    description: entry[lang],
  };
};
