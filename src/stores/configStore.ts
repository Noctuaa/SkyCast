import { atom } from "nanostores";

type Unit = 'C' | 'F';
type Lang = 'fr' | 'en';
type Theme = 'light' | 'dark';

export const $unit = atom<Unit>(
  (typeof document !== 'undefined'
    ? (JSON.parse(localStorage.getItem('skycast_config') ?? '{}').unit ?? 'C')
    : 'C') as Unit
);
export const $lang = atom<Lang>(
  (typeof document !== 'undefined' ? document.documentElement.lang : 'fr') as Lang
);
export const $theme = atom<Theme>(
  (typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') ?? 'light' : 'light') as Theme
);


/**
 * Persists current unit, lang and theme preferences to localStorage.
 */
export const saveConfig = () => {
  const config = {
    unit: $unit.get(),
    lang: $lang.get(),
    theme: $theme.get(),
  };
  localStorage.setItem('skycast_config', JSON.stringify(config));
  document.cookie = `skycast_prefs=${encodeURIComponent(JSON.stringify({ unit: $unit.get() }))}; path=/; max-age=31536000`;
};

/**
 * Loads user preferences from localStorage and applies them to the stores.
 * Called once at app init before fetching forecast data.
 */
export const loadConfig = () => {
  const raw = localStorage.getItem('skycast_config');
  if (!raw) return;

  const config = JSON.parse(raw);
  if (config.unit) $unit.set(config.unit);
  if (config.lang) $lang.set(config.lang);
  if (config.theme) $theme.set(config.theme);
};
