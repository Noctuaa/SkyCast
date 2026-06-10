<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useStore } from '@nanostores/vue';
import { $unit, $theme } from '../../stores/configStore';
import { $selectedIndex } from '../../stores/forecastStore';
import { convertTemp } from '../../utils/weather';
import { icons } from '../../assets/icons';
import { useI18n } from '../../i18n/useI18n';
import type { OMHourlyWeather } from '../../types/weather';

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'));

const props = defineProps<{ hourly: OMHourlyWeather }>();
const unit = useStore($unit);
const theme = useStore($theme);
const selectedIndex = useStore($selectedIndex);
const { t } = useI18n();

type Tab = 'temp' | 'humidity' | 'wind' | 'precip';
const activeTab = ref<Tab>('temp');

const tabs = computed(() => [
  { key: 'temp' as Tab, label: t.value.temperature, icon: icons.temperature },
  { key: 'humidity' as Tab, label: t.value.humidity, icon: icons.humidity },
  { key: 'wind' as Tab, label: t.value.wind, icon: icons.wind },
  { key: 'precip' as Tab, label: t.value.precipitation, icon: icons.precipitation },
]);

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
    case 'humidity':
      return indices.value.map((i) => props.hourly.relative_humidity_2m[i]);
    case 'wind':
      return indices.value.map((i) => Math.round(props.hourly.wind_speed_10m[i]));
    case 'precip':
      return indices.value.map((i) => props.hourly.precipitation_probability[i]);
  }
});

const chartLabel = computed(() => {
  switch (activeTab.value) {
    case 'temp':
      return `${t.value.temperature} : °${unit.value}`;
    case 'humidity':
      return `${t.value.humidity} : %`;
    case 'wind':
      return `${t.value.wind} : km/h`;
    case 'precip':
      return `${t.value.precipitation} : %`;
  }
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
    style: {
      colors: [theme.value === 'dark' ? '#e2e8f0' : '#1e293b'],
      fontSize: '0.8rem',
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
  responsive: [{ breakpoint: 640, options: { chart: { height: 200 }, yaxis: { labels: { show: false } } } }],
  theme: { mode: theme.value === 'dark' ? ('dark' as const) : ('light' as const) },
}));
</script>

<template>
  <div class="contents">
    <div class="flex flex-wrap ai-center gap-3">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="btn-icon"
        :class="{ active: activeTab === tab.key }"
        :data-tooltip="tab.label"
        data-tooltip-dir="top"
        @click="activeTab = tab.key"
      >
        <span v-html="tab.icon"></span>
      </button>
      <span class="w-full text-xs ink-2 font-semibold">{{ chartLabel }}</span>
    </div>
    <div class="relative grid ai-center" style="height: 70%">
      <VueApexCharts type="line" :options="options" :series="series" height="280" width="100%" />
    </div>
  </div>
</template>
