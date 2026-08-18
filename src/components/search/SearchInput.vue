<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { navigate } from 'astro:transitions/client';
import { useI18n } from '../../i18n/useI18n';
import LoadingSpinner from '../ui/LoadingSpinner.vue';
import type { GeocodingResult } from '../../types/weather';

const query = ref('');
const isMobile = ref(false);
const suggestions = ref<GeocodingResult[]>([]);
const loading = ref(false);
const showDrop = ref(false);
const mobileOpen = ref(false);
const hasFetched = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let currentController: AbortController | undefined;
const { t } = useI18n();

// 0x1f1a5 : décalage vers les "regional indicator symbols" Unicode — deux lettres
// consécutives (ex: FR) donnent ainsi l'emoji drapeau correspondant
const toFlag = (code: string) =>
  code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 0x1f1a5))
    .join('');

const fetchSuggestions = async () => {
  if (query.value.length < 2) {
    suggestions.value = [];
    return;
  }

  // Annule la requête précédente : sans ça, si elle répond après celle-ci,
  // elle écrase l'état avec des résultats obsolètes (effet de flash/re-ouverture)
  currentController?.abort();
  const controller = new AbortController();
  currentController = controller;

  // N'affiche le loader que si la requête dépasse 200ms, pour éviter un flash
  // visuel sur les réponses rapides
  const loadingTimer = setTimeout(() => {
    loading.value = true;
  }, 200);
  try {
    const res = await fetch(`/api/geocoding?q=${encodeURIComponent(query.value)}`, {
      signal: controller.signal,
    });
    const data: GeocodingResult[] = await res.json();
    const seen = new Set<string>();
    suggestions.value = data.filter((city) => {
      const key = `${city.name}-${city.country}-${city.state ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    suggestions.value = [];
  } finally {
    clearTimeout(loadingTimer);
    if (!controller.signal.aborted) {
      loading.value = false;
      hasFetched.value = true;
    }
  }
};

const onInput = () => {
  clearTimeout(debounceTimer);
  showDrop.value = true;
  debounceTimer = setTimeout(fetchSuggestions, 300);
};

const openSearch = () => {
  mobileOpen.value = !mobileOpen.value;
  document.getElementById('toolbar-nav')?.classList.remove('open');
  document.getElementById('hamburger-btn')?.classList.remove('active');
};

const selectCity = (city: GeocodingResult) => {
  document.cookie = `skycast_location=${encodeURIComponent(JSON.stringify({ name: city.name, country: city.country, state: city.state ?? '', lat: city.lat, lon: city.lon }))}; path=/; max-age=31536000`;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  suggestions.value = [];
  showDrop.value = false;
  mobileOpen.value = false;
  navigate(`/?lang=${lang}&lat=${city.lat}&lon=${city.lon}`);
};

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  const onResize = () => {
    isMobile.value = window.innerWidth < 768;
  };
  window.addEventListener('resize', onResize);
  onUnmounted(() => window.removeEventListener('resize', onResize));
});
</script>

<template>
  <!-- Bouton loupe mobile (caché en desktop via CSS) -->
  <button class="search-btn-mobile btn-tools flex" @click="openSearch" :aria-label="t.searchPlaceholder">
    <!-- prettier-ignore -->
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  </button>

  <!-- Teleport actif sur mobile pour échapper au stacking context du toolbar-nav -->
  <Teleport to="body" :disabled="!isMobile">
    <div class="search-wrap fixed z-100 flex flex-col md:flex-row ai-center" :class="{ open: mobileOpen }">
      <div class="search-box-inner flex ai-center gap-3 px-4 py-3">
        <!-- prettier-ignore -->
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="search-input"
          name="search"
          v-model="query"
          type="text"
          autocomplete="off"
          :placeholder="t.searchPlaceholder"
          :aria-label="t.searchPlaceholder"
          @input="onInput"
          @focus="showDrop = true"
          @blur="showDrop = false"
          class="text-base ink-1"
        />
      </div>

      <div v-if="showDrop && (suggestions.length || query.length >= 2)" class="search-drop z-100 ow-hidden">
        <div class="p-4 text-xs font-bold tracking-wide uppercase ink-3">
          <span>{{ suggestions.length }} {{ t.searchResult }}{{ suggestions.length > 1 ? 'S' : '' }}</span>
        </div>
        <ul v-if="suggestions.length" class="sd-list">
          <li
            v-for="city in suggestions"
            :key="`${city.lat}-${city.lon}`"
            class="sd-item flex ai-center py-3 px-4 gap-3 c-pointer"
            @mousedown.prevent="selectCity(city)"
          >
            <!-- mousedown.prevent plutôt que click : sans ça, le blur de l'input
            se déclenche avant le clic et ferme le menu avant la sélection -->
            <span class="grid pi-center">{{ toFlag(city.country_code) }}</span>
            <div class="flex flex-col gap-1">
              <span class="text-sm font-semibold ink-1 text-ellipsis">{{ city.name }}</span>
              <span class="text-xs ink-2 text-ellipsis">{{ city.state ? city.state + ' · ' : '' }}{{ city.country }}</span>
            </div>
          </li>
        </ul>
        <div v-else-if="loading" class="sd-loading flex-center p-4">
          <LoadingSpinner size="sm" />
        </div>
        <div v-else-if="hasFetched" class="sd-empty flex flex-col p-4 gap-1 text-sm text-center">
          <span class="text-sm font-semibold ink-1">{{ t.searchNoMatch }} "{{ query }}"</span>
          <span class="ink-2">{{ t.searchTryAgain }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
