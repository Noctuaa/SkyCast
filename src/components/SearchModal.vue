<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useStore } from '@nanostores/vue';
import { $searchOpen } from '../stores/forecastStore';
import { navigate } from 'astro:transitions/client';
import type { GeocodingResult } from '../types/weather';

const searchOpen = useStore($searchOpen);

const query = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const suggestions = ref<GeocodingResult[]>([]);
const loading = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(searchOpen, (val) => {
  if (val) nextTick(() => inputRef.value?.focus());
});

const onInput = () => {
  clearTimeout(debounceTimer);

  if (query.value.length < 2) {
    suggestions.value = [];
    return;
  }

  debounceTimer = setTimeout(async () => {
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
    } catch (error) {
      suggestions.value = [];
    } finally {
      loading.value = false;
    }
  }, 300);
};

const selectCity = async (city: GeocodingResult) => {
  try {
    const res = await fetch(`/api/resolve-city?lat=${city.lat}&lon=${city.lon}`);
    const { cityId } = await res.json();
    document.cookie = `skycast_location=${encodeURIComponent(JSON.stringify({ name: city.name, country: city.country }))}; path=/; max-age=31536000`;
    $searchOpen.set(false);
    const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    navigate(`/?lang=${lang}&city=${cityId}`);
  } catch {
    $searchOpen.set(false);
  }
};
</script>

<template>
  <div v-if="searchOpen" class="search-overlay fixed z-100 flex ai-start jc-center">
    <div class="search-box w-full">
      <input
        id="search-city"
        name="search-city"
        v-model="query"
        @input="onInput"
        ref="inputRef"
        type="text"
        placeholder="Rechercher une ville..."
      />
      <label for="search-city" class="sr-only">Rechercher une ville</label>
      <ul v-if="suggestions.length" class="suggestions absolute z-10 w-full ow-hidden">
        <li
          v-for="city in suggestions"
          :key="`${city.lat}-${city.lon}`"
          class="flex flex-col c-pointer"
          @click="selectCity(city)"
        >
          <span class="suggestion-name">{{ city.name }}</span>
          <span class="suggestion-detail">{{ city.state ? city.state + ' - ' : '' }}{{ city.country }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
