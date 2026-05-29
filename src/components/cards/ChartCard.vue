<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $selectedDate } from '../../stores/forecastStore';
import { $unit } from '../../stores/configStore';
import { convertTemp } from '../../stores/actions';
import { useI18n } from '../../i18n/useI18n';
import VueApexCharts from 'vue3-apexcharts';
import type { ForecastResponse } from '../../types/weather';

const props = defineProps<{ forecast: ForecastResponse }>();
const selectedDate = useStore($selectedDate);
const unit = useStore($unit);
const { t } = useI18n();

const forecastDays = computed(() => {
  const days: Record<string, typeof props.forecast.list> = {};
  props.forecast.list.forEach((item) => {
    const day = item.dt_txt.split(' ')[0];
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });
  return days;
});

const items = computed(() => {
  const date = selectedDate.value ?? props.forecast.list[0]?.dt_txt.split(' ')[0];
  if (!date) return [];
  const dayItems = forecastDays.value[date] ?? [];

  const dates = Object.keys(forecastDays.value).sort();
  const nextDate = dates[dates.indexOf(date) + 1];
  if (nextDate) {
    const midnight = forecastDays.value[nextDate]?.find((i) => i.dt_txt.includes('00:00:00'));
    if (midnight) return [...dayItems, midnight];
  }

  return dayItems;
});

const series = computed(() => [
  {
    name: t.value.temperature,
    data: items.value.map((item) => convertTemp(item.main.temp, unit.value)),
  },
]);

const options = computed(() => ({
  chart: {
    type: 'area' as const,
    background: 'transparent',
    foreColor: '#64748b',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true, easing: 'easeinout' as const, dynamicAnimation: { enabled: true, speed: 400 } },
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}°`,
    style: { colors: ['#fff'], fontSize: '11px', fontWeight: 700 },
    background: { enabled: false },
    offsetY: -6,
  },
  stroke: { curve: 'smooth' as const, width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      colorStops: [
        { offset: 0, color: 'rgb(102, 126, 234)', opacity: 0.45 },
        { offset: 100, color: 'rgb(118, 75, 162)', opacity: 0.05 },
      ],
    },
  },
  markers: { size: 5, strokeWidth: 0 },
  colors: ['rgb(102, 126, 234)'],
  xaxis: {
    categories: items.value.map((item) => item.dt_txt.split(' ')[1].slice(0, 5)),
    type: 'category' as const,
    tooltip: { enabled: false },
    crosshairs: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
    title: { text: t.value.chartXAxis, style: { fontSize: '13px', fontWeight: 'bold' } },
  },
  yaxis: {
    title: { text: `${t.value.chartYAxis} (°${unit.value})`, style: { fontSize: '13px', fontWeight: 'bold' } },
  },
  grid: {
    borderColor: 'rgba(0,0,0,0.08)',
    strokeDashArray: 4,
    padding: { top: 20 },
  },
  tooltip: {
    enabled: true,
    marker: { show: false },
    custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
      const item = items.value[dataPointIndex];
      const time = item.dt_txt.split(' ')[1].slice(0, 5);
      return `
        <p class="tooltip-time">🕐 ${time}</p>
        <div class="tooltip-content">
          <p>🌡 ${t.value.temperature} : ${convertTemp(item.main.temp, unit.value)}°${unit.value}</p>
          <p class="t-capitalize">☁ ${item.weather[0].description}</p>
          <p>💧 ${t.value.humidity} : ${item.main.humidity}%</p>
          <p>💨 ${t.value.wind} : ${Math.round(item.wind.speed * 3.6)} km/h</p>
          <p>☔ ${t.value.precipitation} : ${item.rain?.['3h'] ?? 0} mm</p>
        </div>
      `;
    },
  },
  responsive: [{ breakpoint: 640, options: { chart: { height: 220 } } }],
  theme: { mode: 'light' as const },
}));
</script>

<template>
  <template v-if="items.length">
    <h2 class="chart-title">{{ t.chartTitle }}</h2>
    <div class="chart-scroll">
      <VueApexCharts type="area" :options="options" :series="series" height="350" width="100%" />
    </div>
  </template>
</template>
