<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from '@nanostores/vue';
import { $location } from '../stores/locationStore';
import 'leaflet/dist/leaflet.css';

const location = useStore($location);
const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<any>(null);
const currentMarker = ref<any>(null);
const activeLayer = ref<string>('');
const L = ref<any>(null);

const weatherLayers = ref({
  clouds: { layer: null as any, name: 'clouds_new', label: 'Nuages', opacity: 1, key: 'clouds' },
  precipitation: {
    layer: null as any,
    name: 'precipitation_new',
    label: 'Précipitations',
    opacity: 1,
    key: 'precipitation',
  },
  temperature: { layer: null as any, name: 'temp_new', label: 'Température', opacity: 0.8, key: 'temperature' },
  wind: { layer: null as any, name: 'wind_new', label: 'Vent', opacity: 1, key: 'wind' },
});

const currentPosition = computed(() => ({
  lat: location.value?.lat,
  lon: location.value?.lon,
  name: location.value?.name ?? 'Position',
}));

/**
 * Places a location marker on the map at the given coordinates.
 * Removes the previous marker if one already exists.
 * @param lat - Latitude of the location.
 * @param lon - Longitude of the location.
 */
const addMarker = (lat: number, lon: number) => {
  if (currentMarker.value) {
    currentMarker.value.remove();
  }

  currentMarker.value = L.value.marker([lat, lon]).addTo(mapInstance.value).bindPopup(currentPosition.value.name);
};

/**
 * Switches the active weather layer on the map.
 * Removes the current layer if one is active, then adds the selected one.
 * Creates the tile layer on first use, then reuses it on subsequent toggles.
 * @param key - The layer key to activate ('clouds', 'precipitation', 'temperature', 'wind').
 */
const toggleLayer = (key: string) => {
  const config = weatherLayers.value[key as keyof typeof weatherLayers.value];

  if (activeLayer.value === key) return;

  if (activeLayer.value) {
    weatherLayers.value[activeLayer.value as keyof typeof weatherLayers.value].layer?.remove();
  }

  if (!config.layer) {
    config.layer = L.value.tileLayer(`/api/tiles/${config.name}/{z}/{x}/{y}.png`, {
      opacity: config.opacity,
      attribution: '© OpenWeatherMap',
    });
  }

  config.layer.addTo(mapInstance.value);
  activeLayer.value = key;
};

/**
 * Initializes the Leaflet map centered on the given coordinates.
 * Dynamically imports Leaflet to avoid SSR issues (requires the DOM).
 * Adds the OpenStreetMap base layer, the location marker, and the default weather layer.
 * @param lat - Latitude of the initial map center.
 * @param lon - Longitude of the initial map center.
 */
const initMap = async (lat: number, lon: number) => {
  L.value = (await import('leaflet')).default;

  mapInstance.value = L.value.map(mapContainer.value!, {
    center: [lat, lon],
    zoom: 6,
    zoomControl: true,
  });

  L.value
    .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    })
    .addTo(mapInstance.value);

  addMarker(lat, lon);
  toggleLayer('clouds'); // Show clouds layer by default
};

onMounted(async () => {
  const { lat, lon } = currentPosition.value;
  if (lat && lon) {
    await initMap(lat, lon);
  }
});

watch(currentPosition, async (pos) => {
  if (!pos.lat || !pos.lon) return;

  if (!mapInstance.value) {
    await initMap(pos.lat, pos.lon);
  } else {
    mapInstance.value.setView([pos.lat, pos.lon], 8);
    addMarker(pos.lat, pos.lon);
  }
});
</script>

<template>
  <div class="map-controls">
    <button
      v-for="(config, key) in weatherLayers"
      :key="key"
      class="layer-btn"
      :class="{ active: activeLayer === key }"
      @click="toggleLayer(key)"
    >
      {{ config.label }}
    </button>
  </div>
  <div ref="mapContainer" class="map-container"></div>
</template>
