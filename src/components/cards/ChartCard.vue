<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $unit, $theme } from '../../stores/configStore';
import { $selectedIndex } from '../../stores/forecastStore';
import { convertTemp } from '../../stores/actions';
import VueApexCharts from 'vue3-apexcharts';
import type { OMHourlyWeather } from '../../types/weather';

const props = defineProps<{ hourly: OMHourlyWeather }>();
const unit = useStore($unit);
const theme = useStore($theme);
const selectedIndex = useStore($selectedIndex);

type Tab = 'temp' | 'feels' | 'humidity' | 'wind' | 'precip';
const activeTab = ref<Tab>('temp');

const tabs: { key: Tab; label: string }[] = [
  { key: 'temp',     label: 'TEMP' },
  { key: 'feels',    label: 'FEELS' },
  { key: 'humidity', label: 'HUMIDITY' },
  { key: 'wind',     label: 'WIND' },
  { key: 'precip',   label: 'PRECIP' },
];

// 00h → 00h J+1, toutes les 3h (9 points) selon le jour sélectionné
const indices = computed(() => {
  const base = selectedIndex.value * 24;
  return [0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => base + h);
});

const labels = computed(() => indices.value.map((i) => props.hourly.time[i].slice(-5)));

const rawData = computed((): number[] => {
  switch (activeTab.value) {
    case 'temp':
      return indices.value.map((i) => convertTemp(Math.round(props.hourly.temperature_2m[i]), unit.value));
    case 'feels':
      return indices.value.map((i) => convertTemp(Math.round(props.hourly.apparent_temperature[i]), unit.value));
    case 'humidity':
      return indices.value.map((i) => props.hourly.relative_humidity_2m[i]);
    case 'wind':
      return indices.value.map((i) => Math.round(props.hourly.wind_speed_10m[i]));
    case 'precip':
      return indices.value.map((i) => props.hourly.precipitation_probability[i]);
  }
});

const yLabel = computed(() => {
  if (activeTab.value === 'temp' || activeTab.value === 'feels') return `°${unit.value}`;
  if (activeTab.value === 'wind') return 'km/h';
  return '%';
});

const dataLabelFmt = computed(() => {
  if (activeTab.value === 'temp' || activeTab.value === 'feels')
    return (val: number) => `${val}°`;
  if (activeTab.value === 'wind')
    return (val: number) => `${val}`;
  return (val: number) => `${val}%`;
});

const series = computed(() => [{ name: activeTab.value, data: rawData.value }]);

const options = computed(() => ({
  chart: {
    type: 'line' as const,
    background: 'transparent',
    foreColor: theme.value === 'dark' ? '#94a3b8' : '#64748b',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeinout' as const,
      dynamicAnimation: { enabled: true, speed: 350 },
    },
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  dataLabels: {
    enabled: true,
    formatter: dataLabelFmt.value,
    style: {
      colors: [theme.value === 'dark' ? '#e2e8f0' : '#1e293b'],
      fontSize: '11px',
      fontWeight: 700,
    },
    background: { enabled: false },
    offsetY: -8,
  },
  stroke: { curve: 'smooth' as const, width: 2.5 },
  markers: { size: 4, strokeWidth: 0, fillOpacity: 1 },
  colors: ['rgb(102, 126, 234)'],
  xaxis: {
    categories: labels.value,
    type: 'category' as const,
    tooltip: { enabled: false },
    crosshairs: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
    labels: { style: { fontSize: '11px' } },
  },
  yaxis: {
    labels: { style: { fontSize: '11px' } },
  },
  grid: {
    borderColor: theme.value === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    strokeDashArray: 4,
    padding: { top: 20, right: 16 },
  },
  tooltip: { enabled: false },
  responsive: [{ breakpoint: 640, options: { chart: { height: 200 } } }],
  theme: { mode: theme.value === 'dark' ? ('dark' as const) : ('light' as const) },
}));
</script>

<template>
  <div class="chart-tabs flex gap-2">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="chart-tab"
      :class="{ active: activeTab === tab.key }"
      @click="activeTab = tab.key"
    >
      {{ tab.label }}
    </button>
  </div>
  <div class="chart-wrap relative">
    <span class="chart-unit text-xs text-muted">{{ yLabel }}</span>
    <VueApexCharts type="line" :options="options" :series="series" height="280" width="100%" />
  </div>
</template>

<style scoped>
.chart-tabs {
  flex-wrap: wrap;
  margin-block-end: 4px;
}

.chart-wrap {
  position: relative;
}

.chart-unit {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
  pointer-events: none;
}

.chart-tab {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--glass-edge);
  background: transparent;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.chart-tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
</style>
