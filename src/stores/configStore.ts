import { atom } from "nanostores";

type Unit = 'C' | 'F';
type Lang = 'fr' | 'en';
type Theme = 'light' | 'dark';

export const $unit = atom<Unit>('C');
export const $lang = atom<Lang>(document.documentElement.lang as Lang);
export const $theme = atom<Theme>('light');

/**
 * Persists current unit, lang and theme preferences to localStorage.
 */
export const saveConfig = () => {
  localStorage.setItem('skycast_config', JSON.stringify({
    unit: $unit.get(),
    lang: $lang.get(),
    theme: $theme.get(),
  }));
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
