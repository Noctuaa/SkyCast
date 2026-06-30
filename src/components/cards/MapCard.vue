<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

import { useI18n } from '../../i18n/useI18n';

import LoadingSpinner from '../ui/LoadingSpinner.vue';

// Starts WASM loading as soon as the module is evaluated by the browser
const omPromise = import('@openmeteo/weather-map-layer');

const props = defineProps<{ lat: number; lon: number; name: string }>();

const { t } = useI18n();
const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<any>(null);
const activeLayer = ref<string>('clouds');
const isLoading = ref(true);

const OM_MODEL = 'dwd_icon';
const OM_BASE = `https://map-tiles.open-meteo.com/data_spatial/${OM_MODEL}/latest.json?time_step=current_time_1H`;

const weatherLayers: Record<string, { variable: string; key: string; opacity: number }> = {
  clouds: { variable: 'cloud_cover', key: 'clouds', opacity: 0.55 },
  precipitation: { variable: 'precipitation', key: 'precipitation', opacity: 0.65 },
  temperature: { variable: 'temperature_2m', key: 'temperature', opacity: 0.25 },
  wind: { variable: 'wind_u_component_10m', key: 'wind', opacity: 0.6 },
};

const getLayerLabel = (key: string) => (t.value[key as keyof typeof t.value] as string) ?? key;

const addWeatherLayer = (map: any, key: string) => {
  const config = weatherLayers[key];
  const sourceId = `weather-${key}`;
  const layerId = `weather-${key}-layer`;

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: 'raster',
      url: `om://${OM_BASE}&variable=${config.variable}`,
      maxzoom: 12,
      attribution: '© Open-Meteo',
    });
    map.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: { 'raster-opacity': config.opacity },
    });
  }

  Object.keys(weatherLayers).forEach((k) => {
    const id = `weather-${k}-layer`;
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', k === key ? 'visible' : 'none');
    }
  });

  activeLayer.value = key;
};

const toggleLayer = (key: string) => {
  if (!mapInstance.value || activeLayer.value === key) return;
  isLoading.value = true;
  addWeatherLayer(mapInstance.value, key);
  mapInstance.value.once('idle', () => {
    isLoading.value = false;
  });
};

const initMap = async (lat: number, lon: number, omPromise: Promise<any>) => {
  const [maplibregl] = await Promise.all([
    import('maplibre-gl').then((m) => m.default),
    import('maplibre-gl/dist/maplibre-gl.css'),
  ]);
  const { omProtocol } = await omPromise;
  maplibregl.addProtocol('om', omProtocol);

  const map = new maplibregl.Map({
    container: mapContainer.value!,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [lon, lat],
    zoom: 5.25,
  });

  const el = document.createElement('div');
  el.className = 'marker-dot';

  new maplibregl.Marker({ element: el })
    .setLngLat([lon, lat])
    .setPopup(new maplibregl.Popup({ closeButton: false, closeOnClick: false }).setText(props.name))
    .addTo(map)
    .togglePopup();

  map.on('load', () => {
    addWeatherLayer(map, 'clouds');
  });

  map.once('idle', () => {
    isLoading.value = false;
  });

  mapInstance.value = map;
};

onMounted(async () => {
  if (props.lat && props.lon) {
    await initMap(props.lat, props.lon, omPromise);
  }
});

onUnmounted(() => {
  mapInstance.value?.remove();
});

watch(
  () => [props.lat, props.lon] as [number, number],
  ([lat, lon]) => {
    if (!mapInstance.value) return;
    mapInstance.value.flyTo({ center: [lon, lat], zoom: 6 });
  },
);
</script>

<template>
  <div class="relative w-full h-full">
    <div class="map-controls absolute z-100 flex flex-col gap-1 p-1">
      <button
        v-for="(config, key) in weatherLayers"
        :key="key"
        class="btn-icon"
        :class="{ active: activeLayer === key }"
        :data-tooltip="getLayerLabel(config.key)"
        :aria-label="getLayerLabel(config.key)"
        @click="toggleLayer(key as string)"
      >
        <!-- prettier-ignore -->
        <svg v-if="key === 'clouds'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a4 4 0 0 0 .5-7.95 6 6 0 0 0-11.7-.55A4.5 4.5 0 0 0 6.5 18z"/></svg>
        <!-- prettier-ignore -->
        <svg v-else-if="key === 'precipitation'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/></svg>
        <!-- prettier-ignore -->
        <svg v-else-if="key === 'temperature'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
        <!-- prettier-ignore -->
        <svg v-else-if="key === 'wind'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
      </button>
    </div>
    <div ref="mapContainer" class="map-container w-full h-full z-10"></div>
    <LoadingSpinner v-if="isLoading" overlay size="lg" />
  </div>
</template>
