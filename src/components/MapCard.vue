<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from '../i18n/useI18n';

const props = defineProps<{ lat: number; lon: number; name: string }>();

const { t } = useI18n();
const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<any>(null);
const activeLayer = ref<string>('clouds');

const weatherLayers: Record<string, { name: string; key: string }> = {
  clouds: { name: 'clouds_new', key: 'clouds' },
  precipitation: { name: 'precipitation_new', key: 'precipitation' },
  temperature: { name: 'temp_new', key: 'temperature' },
  wind: { name: 'wind_new', key: 'wind' },
};

const getLayerLabel = (key: string) => t.value[key as keyof typeof t.value] as string ?? key;

const addWeatherLayer = (map: any, key: string) => {
  const config = weatherLayers[key];
  const sourceId = `weather-${key}`;
  const layerId = `weather-${key}-layer`;

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: 'raster',
      tiles: [`/api/tiles/${config.name}/{z}/{x}/{y}.png`],
      tileSize: 256,
      attribution: '© OpenWeatherMap',
    });
    map.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: { 'raster-opacity': key === 'temperature' ? 0.8 : 1 },
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
  addWeatherLayer(mapInstance.value, key);
};

const initMap = async (lat: number, lon: number) => {
  const maplibregl = (await import('maplibre-gl')).default;
  await import('maplibre-gl/dist/maplibre-gl.css');

  const map = new maplibregl.Map({
    container: mapContainer.value!,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [lon, lat],
    zoom: 6,
  });

  new maplibregl.Marker({ color: 'var(--accent)' })
    .setLngLat([lon, lat])
    .setPopup(new maplibregl.Popup().setText(props.name))
    .addTo(map);

  map.on('load', () => {
    addWeatherLayer(map, 'clouds');
  });

  mapInstance.value = map;
};

onMounted(async () => {
  if (props.lat && props.lon) {
    await initMap(props.lat, props.lon);
  }
});

onUnmounted(() => {
  mapInstance.value?.remove();
});

watch(() => [props.lat, props.lon] as [number, number], ([lat, lon]) => {
  if (!mapInstance.value) return;
  mapInstance.value.flyTo({ center: [lon, lat], zoom: 6 });
});
</script>

<template>
  <div class="map-wrapper relative">
    <div class="map-controls absolute z-100">
      <button
        v-for="(config, key) in weatherLayers"
        :key="key"
        class="btn-tools layer-btn"
        :class="{ active: activeLayer === key }"
        :title="getLayerLabel(config.key)"
        @click="toggleLayer(key as string)"
      >
        <!-- Clouds -->
        <svg v-if="key === 'clouds'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path d="M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"/>
        </svg>
        <!-- Precipitation -->
        <svg v-else-if="key === 'precipitation'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.8 60c14.6-17.1 36.2-28 60.2-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96L96 320zM243.2 354.7c-2.4 5.6-.4 12 4.8 15.2l80 48c5.5 3.3 12.6 1.8 16.4-3.4l8-11c3.8-5.2 2.8-12.5-2.2-16.5l-80-64c-5.5-4.4-13.4-3.4-17.6 2.2l-8 11c-1.7 2.4-2.2 5.2-1.4 7.9zm-96 64c-2.4 5.6-.4 12 4.8 15.2l80 48c5.5 3.3 12.6 1.8 16.4-3.4l8-11c3.8-5.2 2.8-12.5-2.2-16.5l-80-64c-5.5-4.4-13.4-3.4-17.6 2.2l-8 11c-1.7 2.4-2.2 5.2-1.4 7.9zm192 64c-2.4 5.6-.4 12 4.8 15.2l80 48c5.5 3.3 12.6 1.8 16.4-3.4l8-11c3.8-5.2 2.8-12.5-2.2-16.5l-80-64c-5.5-4.4-13.4-3.4-17.6 2.2l-8 11c-1.7 2.4-2.2 5.2-1.4 7.9z"/>
        </svg>
        <!-- Temperature -->
        <svg v-else-if="key === 'temperature'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M160 64c-26.5 0-48 21.5-48 48l0 164.5c0 14.3-7.5 27.5-19.7 34.9C73.5 322.4 56 351.2 56 384c0 57.4 46.6 104 104 104s104-46.6 104-104c0-32.8-17.5-61.6-43.3-77.6C208.5 299 201 285.8 201 271.5L201 112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.2 0 160 0s112 50.2 112 112l0 159.5c38.5 23.5 64 65.8 64 114.5c0 88.4-71.6 160-160 160S16 472.4 16 384c0-48.7 25.5-91 64-114.5L80 112z"/>
        </svg>
        <!-- Wind -->
        <svg v-else-if="key === 'wind'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M288 32c0 17.7 14.3 32 32 32l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l320 0c53 0 96-43 96-96s-43-96-96-96l-32 0c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32l32 0c53 0 96-43 96-96s-43-96-96-96l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32zM128 512l32 0c53 0 96-43 96-96s-43-96-96-96L32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32z"/>
        </svg>
      </button>
    </div>
    <div ref="mapContainer" class="map-container z-10"></div>
  </div>
</template>
