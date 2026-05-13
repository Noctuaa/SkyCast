<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $forecast, $selectedDate } from '../stores/forecastStore';
import { $unit } from '../stores/configStore';
import { convertTemp } from '../stores/actions';
import { useI18n } from '../i18n/useI18n';
import WeatherIcon from './WeatherIcon.vue';

const forecast = useStore($forecast);
const selectedDate = useStore($selectedDate);
const unit = useStore($unit);
const { lang } = useI18n();
const locale = computed(() => lang.value === 'fr' ? 'fr-FR' : 'en-GB');

const selectDay = (date: string) => {
  $selectedDate.set(date);
};

const dailyForecasts = computed(() => {
  if (!forecast.value) return [];

  const list = forecast.value.list;
  const days = new Map<string, (typeof list)[number][]>();

  forecast.value.list.forEach((item) => {
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
</script>

<template>
  <div v-if="dailyForecasts.length" class="forecast-card">
    <div
      v-for="day in dailyForecasts"
      :key="day.dt"
      class="forecast-day"
      :class="{ active: selectedDate === day.date }"
      @click="selectDay(day.date)"
    >
      <p class="forecast-date">
        <span class="forecast-weekday">
          {{ new Date(day.dt * 1000).toLocaleDateString(locale, { weekday: 'short' }) }}
        </span>
        {{ new Date(day.dt * 1000).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }) }}
      </p>
      <WeatherIcon :iconCode="day.icon" size="sm" />
      <p class="forecast-temps">
        <span class="temp-min">{{ convertTemp(day.temp_min, unit) }}°{{ unit }}</span>
        <span class="temp-max">{{ convertTemp(day.temp_max, unit) }}°{{ unit }}</span>
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
