<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $searchOpen, $forecast } from '../stores/forecastStore';
import { setLocation, fetchForecast } from '../stores/actions';
import type { GeocodingResult } from '../types/weather';

const searchOpen = useStore($searchOpen);
const forecast = useStore($forecast);

const query = ref('');
const suggestions = ref<GeocodingResult[]>([]);
const loading = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

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

const selectCity = (city: GeocodingResult) => {
  setLocation(city);
  fetchForecast();
  query.value = '';
  suggestions.value = [];
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
        type="text"
        placeholder="Rechercher une ville..."
        autofocus
      />
      <label for="search-city" class="sr-only">Rechercher une ville</label>
      <ul v-if="suggestions.length" class="suggestions absolute z-10 w-full ow-hidden">
        <li
          v-for="city in suggestions"
          :key="`${city.lat}-${city.lon}`"
          class="flex fd-column c-pointer"
          @click="selectCity(city)"
        >
          <span class="suggestion-name">{{ city.name }}</span>
          <span class="suggestion-detail">{{ city.state ? city.state + ' - ' : '' }}{{ city.country }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
