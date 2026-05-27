<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { navigate } from 'astro:transitions/client';
import { useI18n } from '../i18n/useI18n';
import type { GeocodingResult } from '../types/weather';

const query = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const suggestions = ref<GeocodingResult[]>([]);
const loading = ref(false);
const showDrop = ref(false);
const isMobile = ref(false);
const mobileOpen = ref(false);
const hasFetched = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
const { t } = useI18n();

/** Fetches city suggestions from the geocoding API. Deduplicates results by name/country/state. */
const fetchSuggestions = async () => {
  if (query.value.length < 2) {
    suggestions.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await fetch(`/api/geocoding?q=${encodeURIComponent(query.value)}`);
    const data: GeocodingResult[] = await res.json();
    const seen = new Set<string>();
    suggestions.value = data.filter((city) => {
      const key = `${city.name}-${city.country}-${city.state ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    suggestions.value = [];
  } finally {
    loading.value = false;
    hasFetched.value = true;
  }
};

/** Debounces input to avoid firing a request on every keystroke. */
const onInput = () => {
  clearTimeout(debounceTimer);
  showDrop.value = true;
  debounceTimer = setTimeout(fetchSuggestions, 300);
};

/**
 * Toggles the mobile search overlay and closes the hamburger drawer.
 * Uses direct DOM manipulation — no navigation means no need for the nanostore here.
 */
const openSearch = () => {
  mobileOpen.value = !mobileOpen.value;
  document.getElementById('toolbar-nav')?.classList.remove('open');
  document.getElementById('hamburger-btn')?.classList.remove('active');
};

/**
 * Resolves a geocoding result to an OWM city ID, saves the location cookie,
 * then navigates to the forecast page.
 */
const selectCity = async (city: GeocodingResult) => {
  try {
    const res = await fetch(`/api/resolve-city?lat=${city.lat}&lon=${city.lon}`);
    const { cityId } = await res.json();
    document.cookie = `skycast_location=${encodeURIComponent(JSON.stringify({ name: city.name, country: city.country, state: city.state ?? '' }))}; path=/; max-age=31536000`;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    suggestions.value = [];
    showDrop.value = false;
    mobileOpen.value = false;
    navigate(`/?lang=${lang}&city=${cityId}`);
  } catch {
    showDrop.value = false;
    mobileOpen.value = false;
  }
};

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  const onResize = () => {
    isMobile.value = window.innerWidth < 768;
  };
  window.addEventListener('resize', onResize);

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });
});
</script>

<template>
  <!-- Desktop : input inline -->
  <div v-if="!isMobile" class="relative">
    <div class="search-bar">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="t.searchPlaceholder"
        aria-label="Search location"
        @input="onInput"
        @focus="showDrop = true"
        @blur="showDrop = false"
      />
    </div>
    <!-- Dropdown v-if="showDrop && suggestions.length" -->
    <div v-if="showDrop && (suggestions.length || query.length >= 2)" class="search-drop">
      <div class="sd-header">
        <span>{{ suggestions.length }} {{ t.searchResult }}{{ suggestions.length !== 1 ? 'S' : '' }}</span>
      </div>

      <ul v-if="suggestions.length" class="sd-list">
        <li
          v-for="(city, i) in suggestions"
          :key="`${city.lat}-${city.lon}`"
          class="sd-item"
          @mousedown.prevent="selectCity(city)"
        >
          <span class="sd-flag">{{ city.country }}</span>
          <div class="sd-info">
            <span class="sd-name">{{ city.name }}</span>
            <span class="sd-region">{{ city.state ? city.state + ' · ' : '' }}{{ city.country }}</span>
          </div>
        </li>
      </ul>

      <div v-else-if="hasFetched && !loading" class="sd-empty">
        <span>{{ t.searchNoMatch }} "{{ query }}"</span>
        <span>{{ t.searchTryAgain }}</span>
      </div>
    </div>
  </div>

  <!-- Mobile : bouton loupe + modal -->
  <template v-else>
    <button class="btn-tools" @click="openSearch" aria-label="Rechercher">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </button>
    <!-- Teleport escapes the toolbar's backdrop-filter stacking context -->
    <Teleport to="body">
      <div
        v-if="mobileOpen"
        class="search-overlay fixed z-100 flex ai-start jc-center"
        @click.self="mobileOpen = false"
      >
        <div class="search-box w-full">
          <input v-model="query" type="text" :placeholder="t.searchPlaceholder" @input="onInput" />
          <ul v-if="suggestions.length" class="sd-list absolute w-full">
            <li v-for="city in suggestions" :key="`${city.lat}-${city.lon}`" class="sd-item" @click="selectCity(city)">
              <span class="sd-flag">{{ city.country }}</span>
              <div class="sd-info">
                <span class="sd-name">{{ city.name }}</span>
                <span class="sd-region">{{ city.state ? city.state + ' · ' : '' }}{{ city.country }}</span>
              </div>
            </li>
          </ul>
          <div v-else-if="hasFetched && !loading" class="sd-empty">
            <span>{{ t.searchNoMatch }} "{{ query }}"</span>
            <span>{{ t.searchTryAgain }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
</template>
