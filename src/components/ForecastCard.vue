<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import { $selectedDate } from '../stores/forecastStore';
import { $unit } from '../stores/configStore';
import { convertTemp } from '../stores/actions';
import { useI18n } from '../i18n/useI18n';
import WeatherIcon from './WeatherIcon.vue';
import type { ForecastResponse } from '../types/weather';

const props = defineProps<{ forecast: ForecastResponse }>();
const selectedDate = useStore($selectedDate);
const unit = useStore($unit);
const { lang } = useI18n();
const locale = computed(() => (lang.value === 'fr' ? 'fr-FR' : 'en-GB'));

const selectDay = (date: string) => {
  $selectedDate.set(date);
};

const dailyForecasts = computed(() => {
  const list = props.forecast.list;
  const days = new Map<string, (typeof list)[number][]>();

  list.forEach((item) => {
    const day = item.dt_txt.split(' ')[0];
    if (!days.has(day)) days.set(day, []);
    days.get(day)!.push(item);
  });

  return [...days.entries()].map(([date, items]) => {
    const midday = items.find((f) => f.dt_txt.includes('12:00:00')) ?? items[0];
    return {
      dt: midday.dt,
      date,
      icon: midday.weather[0].icon,
      temp_min: Math.round(Math.min(...items.map((f) => f.main.temp_min))),
      temp_max: Math.round(Math.max(...items.map((f) => f.main.temp_max))),
    };
  });
});

onMounted(() => {
  if (!selectedDate.value && dailyForecasts.value.length) {
    $selectedDate.set(dailyForecasts.value[0].date);
  }
});
</script>

<template>
  <div class="forecast-card">
    <div
      v-for="day in dailyForecasts"
      :key="day.dt"
      class="forecast-day box flex fd-column ai-center gap-2 c-pointer"
      :class="{ active: selectedDate === day.date }"
      @click="selectDay(day.date)"
    >
      <p class="forecast-date flex fd-column ai-center">
        <span class="forecast-weekday font-bold t-capitalize">
          {{ new Date(day.dt * 1000).toLocaleDateString(locale, { weekday: 'short' }) }}
        </span>
        <span class="text-xs text-muted">
          {{ new Date(day.dt * 1000).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }) }}
        </span>
      </p>
      <WeatherIcon :iconCode="day.icon" size="sm" />
      <p class="forecast-temps flex gap-2">
        <span class="temp-min text-sm">{{ convertTemp(day.temp_min, unit) }}°{{ unit }}</span>
        <span class="temp-max text-sm font-semibold">{{ convertTemp(day.temp_max, unit) }}°{{ unit }}</span>
      </p>
    </div>
  </div>
</template>

<style>
.forecast-card {
  max-width: 360px;
  grid-area: 2 / 1 / 3 / 2;
}
</style>
