<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $unit } from '../../stores/configStore';
import { $selectedIndex } from '../../stores/forecastStore';
import { convertTemp } from '../../utils/weather';
import { useI18n } from '../../i18n/useI18n';
import { getWmoInfo } from '../../i18n/wmo';
import WeatherIcon from '../ui/WeatherIcon.vue';
import { icons } from '../../assets/icons';
import type { OMDailyWeather } from '../../types/weather';

const props = defineProps<{ daily: OMDailyWeather }>();
const unit = useStore($unit);
const selectedIndex = useStore($selectedIndex);
const { lang } = useI18n();
const locale = computed(() => (lang.value === 'fr' ? 'fr-FR' : 'en-GB'));

const days = computed(() =>
  props.daily.time.slice(0, 8).map((dateStr, i) => {
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

const handleClick = (i: number, event: MouseEvent) => {
  $selectedIndex.set(i);
  (event.currentTarget as HTMLElement).scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest',
  });
};
</script>

<template>
  <div class="forecast-wrap grid gap-3">
    <div
      v-for="(day, i) in days"
      :key="i"
      class="forecast-day box flex flex-col ai-center gap-2 c-pointer"
      :class="{ active: selectedIndex === i }"
      @click="handleClick(i, $event)"
    >
      <p class="flex flex-col ai-center">
        <span class="font-bold uppercase text-sm ink-1">
          {{ day.date.toLocaleDateString(locale, { weekday: 'short' }) }}
        </span>
        <span class="text-xs ink-3">
          {{ day.date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }) }}
        </span>
      </p>
      <WeatherIcon :iconCode="day.icon" size="sm" />
      <p class="flex ai-center gap-1 text-xs font-semibold accent">
        <span v-html="icons.precipitation" aria-hidden="true"></span>
        {{ day.precip }}%
      </p>
      <p class="flex ai-center gap-2">
        <span class="text-sm ink-2 font-semibold">{{ convertTemp(day.tempMin, unit) }}°</span>
        <span class="text-base ink-1 font-bold">{{ convertTemp(day.tempMax, unit) }}°{{ unit }}</span>
      </p>
    </div>
  </div>
</template>
