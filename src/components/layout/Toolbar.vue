<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { navigate } from 'astro:transitions/client';
import { $unit, $lang, $theme, saveConfig } from '../../stores/configStore.ts';
import { $navOpen } from '../../stores/uiStore.ts';
import SearchInput from './../search/SearchInput.vue';

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
  const params = new URL(window.location.href).searchParams;
  const lat = params.get('lat');
  const lon = params.get('lon');
  if (lat && lon) navigate(`/?lang=${next}&lat=${lat}&lon=${lon}`);
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
  document.documentElement.classList.add('theme-switching');
  document.startViewTransition(switchTheme).finished.then(() => {
    document.documentElement.classList.remove('theme-switching');
  });
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
  <button class="btn-tools lang-toggle" @click="toggleLang">
    {{ lang === 'fr' ? 'EN' : 'FR' }}
  </button>
  <button class="btn-tools" @click="toggleTheme" aria-label="Toggle theme">
    <!-- prettier-ignore -->
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>

    <!-- prettier-ignore -->
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon">
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
    </svg>
  </button>
</template>
