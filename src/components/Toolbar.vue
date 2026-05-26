<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { navigate } from 'astro:transitions/client';
import { $unit, $lang, $theme, saveConfig } from '../stores/configStore';
import { $navOpen } from '../stores/uiStore';
import SearchInput from './SearchInput.vue';

const props = defineProps<{
  initialUnit: 'C' | 'F';
  initialLang: 'fr' | 'en';
}>();

// Local ref instead of useStore($unit) — avoids SSR/client hydration mismatch on initial render
const unit = ref<'C' | 'F'>(props.initialUnit);

// Must run synchronously in setup (not onMounted) so SearchInput's useI18n()
// reads the correct lang before the child component mounts
$lang.set(props.initialLang);
const lang = ref<'fr' | 'en'>(props.initialLang);

/**
 * Updates the temperature unit locally and in the store.
 * No page reload needed — ForecastCard and ChartCard react via useStore($unit).
 */
const setUnit = (newUnit: 'C' | 'F') => {
  if (unit.value === newUnit) return;
  unit.value = newUnit;
  $unit.set(newUnit);
  saveConfig();
};

/**
 * Switches the language and reloads the page to fetch OWM data in the new lang.
 * $navOpen.set(true) preserves the mobile drawer state across the navigation
 * via astro:before-swap in Navbar.astro.
 */
const toggleLang = () => {
  const next = lang.value === 'fr' ? 'en' : 'fr';
  $lang.set(next);
  lang.value = next;
  saveConfig();
  $navOpen.set(true);
  const cityId = new URL(window.location.href).searchParams.get('city');
  if (cityId) navigate(`/?lang=${next}&city=${cityId}`);
};

/**
 * Toggles light/dark theme with a View Transition when available.
 * Reads data-theme from the DOM (source of truth) rather than the store
 * to avoid any desync between the store and the actual applied theme.
 */
const toggleTheme = () => {
  const current = (document.documentElement.getAttribute('data-theme') ?? 'light') as 'light' | 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  const switchTheme = () => {
    $theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
    saveConfig();
  };
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }
  document.startViewTransition(switchTheme);
};

onMounted(() => {
  $unit.set(props.initialUnit);
});
</script>

<template>
  <SearchInput />
  <div class="seg" role="group" aria-label="Temperature unit">
    <button class="seg-btn" :class="{ active: unit === 'C' }" @click="setUnit('C')">°C</button>
    <button class="seg-btn" :class="{ active: unit === 'F' }" @click="setUnit('F')">°F</button>
  </div>
  <button class="btn-tools lang-toggle" @click="toggleLang">{{ lang.toUpperCase() }}</button>
  <button class="btn-tools" @click="toggleTheme" aria-label="Toggle theme">
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
      <path
        d="M288-32c8.4 0 16.3 4.4 20.6 11.7L364.1 72.3 468.9 46c8.2-2 16.9 .4 22.8 6.3S500 67 498 75.1l-26.3 104.7 92.7 55.5c7.2 4.3 11.7 12.2 11.7 20.6s-4.4 16.3-11.7 20.6L471.7 332.1 498 436.8c2 8.2-.4 16.9-6.3 22.8S477 468 468.9 466l-104.7-26.3-55.5 92.7c-4.3 7.2-12.2 11.7-20.6 11.7s-16.3-4.4-20.6-11.7L211.9 439.7 107.2 466c-8.2 2-16.8-.4-22.8-6.3S76 445 78 436.8l26.2-104.7-92.6-55.5C4.4 272.2 0 264.4 0 256s4.4-16.3 11.7-20.6L104.3 179.9 78 75.1c-2-8.2 .3-16.8 6.3-22.8S99 44 107.2 46l104.7 26.2 55.5-92.6 1.8-2.6c4.5-5.7 11.4-9.1 18.8-9.1zm0 144a144 144 0 1 0 0 288 144 144 0 1 0 0-288zm0 240a96 96 0 1 1 0-192 96 96 0 1 1 0 192z"
      />
    </svg>
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        d="M256 0C114.6 0 0 114.6 0 256S114.6 512 256 512c68.8 0 131.3-27.2 177.3-71.4 7.3-7 9.4-17.9 5.3-27.1s-13.7-14.9-23.8-14.1c-4.9 .4-9.8 .6-14.8 .6-101.6 0-184-82.4-184-184 0-72.1 41.5-134.6 102.1-164.8 9.1-4.5 14.3-14.3 13.1-24.4S322.6 8.5 312.7 6.3C294.4 2.2 275.4 0 256 0z"
      />
    </svg>
  </button>
</template>
