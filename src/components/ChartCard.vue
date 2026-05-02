<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $forecast, $selectedDate, $forecastDays } from '../stores/forecastStore';
import VueApexCharts from 'vue3-apexcharts';

const forecast = useStore($forecast);
const forecastDays = useStore($forecastDays);
const selectedDate = useStore($selectedDate);

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

const items = computed(() => {
  const date = selectedDate.value ?? forecast.value?.list[0]?.dt_txt.split(' ')[0];
  if (!date) return [];
  return forecastDays.value?.[date] ?? [];
});

const series = computed(() => [
  {
    name: 'Température',
    data: items.value.map((item) => Math.round(item.main.temp)),
  },
]);

const options = computed(() => {
  const dark = isDark();

  return {
    chart: {
      type: 'line' as const,
      background: 'transparent',
      foreColor: dark ? '#94a3b8' : '#64748b',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, easing: 'easeinout' as const, dynamicAnimation: { enabled: true, speed: 400 } },
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    stroke: { curve: 'smooth' as const, width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          { offset: 0, color: 'rgb(102, 126, 234)', opacity: 1 },
          { offset: 100, color: 'rgb(118, 75, 162)', opacity: 1 },
        ],
      },
    },
    markers: {
      size: 4,
    },
    colors: ['rgb(102, 126, 234)'],
    xaxis: {
      categories: items.value.map((item) => item.dt_txt.split(' ')[1].slice(0, 5)),
      type: 'category' as const,
      tooltip: { enabled: false },
      crosshairs: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
      title: { text: 'Heure', style: { fontSize: '13px', fontWeight: 'bold' } },
    },
    yaxis: {
      title: { text: 'Température (°C)', style: { fontSize: '13px', fontWeight: 'bold' } },
    },
    grid: {
      borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      strokeDashArray: 4,
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
            <p>🌡 Température : ${Math.round(item.main.temp)}°C</p>
            <p class="t-capitalize">☁ ${item.weather[0].description}</p>
            <p>💧 Humidité : ${item.main.humidity}%</p>
            <p>💨 Vent : ${Math.round(item.wind.speed * 3.6)} km/h</p>
            <p>☔ Précipitation : ${item.rain?.['3h'] ?? 0} mm</p>
          </div>
        `;
      },
    },
    theme: { mode: dark ? ('dark' as const) : ('light' as const) },
  };
});
</script>

<template>
  <VueApexCharts v-if="forecast && items.length" type="line" :options="options" :series="series" height="400" />
</template>
