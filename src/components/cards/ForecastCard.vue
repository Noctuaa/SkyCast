<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $unit } from '../../stores/configStore';
import { $selectedIndex } from '../../stores/forecastStore';
import { convertTemp } from '../../stores/actions';
import { useI18n } from '../../i18n/useI18n';
import { getWmoInfo } from '../../i18n/wmo';
import WeatherIcon from '../ui/WeatherIcon.vue';
import type { OMDailyWeather } from '../../types/weather';

const props = defineProps<{ daily: OMDailyWeather }>();
const unit = useStore($unit);
const selectedIndex = useStore($selectedIndex);
const { lang } = useI18n();
const locale = computed(() => (lang.value === 'fr' ? 'fr-FR' : 'en-GB'));

const days = computed(() =>
  props.daily.time.slice(0, 7).map((dateStr, i) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const { icon } = getWmoInfo(props.daily.weather_code[i], true, lang.value);
    return {
      date,
      icon,
      tempMin: Math.round(props.daily.temperature_2m_min[i]),
      tempMax: Math.round(props.daily.temperature_2m_max[i]),
      precip: props.daily.precipitation_probability_max[i],
    };
  }),
);
</script>

<template>
  <div class="forecast-grid">
    <div
      v-for="(day, i) in days"
      :key="i"
      class="forecast-day box flex flex-col ai-center gap-2 c-pointer"
      :class="{ active: selectedIndex === i }"
      @click="$selectedIndex.set(i)"
    >
      <p class="flex flex-col ai-center">
        <span class="font-bold t-capitalize text-sm">
          {{ day.date.toLocaleDateString(locale, { weekday: 'short' }) }}
        </span>
        <span class="text-xs text-muted">
          {{ day.date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }) }}
        </span>
      </p>
      <WeatherIcon :iconCode="day.icon" size="sm" />
      <p v-if="day.precip > 0" class="precip flex ai-center gap-1 text-xs text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden="true">
          <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 2 12 2z"/>
        </svg>
        {{ day.precip }}%
      </p>
      <p class="flex gap-2">
        <span class="text-sm text-muted">{{ convertTemp(day.tempMin, unit) }}°</span>
        <span class="text-sm font-semibold">{{ convertTemp(day.tempMax, unit) }}°{{ unit }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.forecast-grid {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.forecast-day {
  flex: 1;
  min-width: 72px;
  text-align: center;
  transition: opacity 0.2s;
}

.forecast-day:not(.active) {
  opacity: 0.6;
}

.forecast-day.active {
  border-color: var(--accent);
}
</style>
