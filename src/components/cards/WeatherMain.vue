<script setup lang="ts">
import { computed } from 'vue';
import type { OMCurrentWeather } from '../../types/weather';
import { useI18n } from '../../i18n/useI18n';
import { $lang, $unit } from '../../stores/configStore';
import { convertTemp } from '../../utils/weather';
import { useStore } from '@nanostores/vue';
import { getWmoInfo } from '../../i18n/wmo';
import WeatherIcon from '../ui/WeatherIcon.vue';
import StatTile from '../ui/StatTile.vue';

const props = defineProps<{
  current: OMCurrentWeather;
  uvIndex: number;
  country: string;
  locationName: string;
  locationState: string;
  initialLang: 'fr' | 'en';
  initialUnit: 'C' | 'F';
}>();

$lang.set(props.initialLang);
$unit.set(props.initialUnit);

const unit = useStore($unit);
const { t, lang } = useI18n();

const locale = computed(() => (lang.value === 'fr' ? 'fr-FR' : 'en-GB'));
const dayName = computed(() => new Date().toLocaleDateString(locale.value, { weekday: 'long' }));
const fullDate = computed(() =>
  new Date().toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
);
const isoDate = computed(() => new Date().toISOString().split('T')[0]);

const wmo = computed(() => getWmoInfo(props.current.weather_code, props.current.is_day === 1, lang.value));
</script>

<template>
  <div class="flex flex-col jc-between gap-5">
    <div class="wm-top flex flex-col ai-center gap-3">
      <div class="wm-loc inline-flex ai-center gap-2 text-sm font-semibold ink-1">
        <!-- prettier-ignore -->
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <h2 class="text-sm ink-1 font-semibold">{{ locationName }}</h2>
      </div>
      <time class="wm-date text-center text-sm ink-3 font-medium" :datetime="isoDate">
        <b class="block capitalize text-base ink-1 font-semibold">{{ dayName }}</b>
        <span>{{ fullDate }}</span>
      </time>
    </div>

    <div class="flex ai-center jc-center gap-4">
      <WeatherIcon :iconCode="wmo.icon" />
      <div class="flex flex-col ai-center">
        <output class="wm-temp num">
          {{ convertTemp(current.temperature_2m, unit) }}
          <sup class="relative font-medium ink-3">°{{ unit }}</sup>
        </output>
        <div class="wm-info">
          <p class="capitalize font-semibold ink-1">{{ wmo.description }}</p>
          <p class="text-sm ink-3">{{ locationState ? `${locationState}, ` : '' }}{{ country }}</p>
          <div class="flex ai-center gap-2">
            <span class="text-sm font-semibold ink-3">UV :</span>
            <output class="text-sm font-bold ink-1 num">{{ uvIndex }}</output>
          </div>
        </div>
      </div>
    </div>

    <div class="extras grid grid-cols-3 gap-2 text-center">
      <StatTile :label="t.feelsLike" :value="convertTemp(current.apparent_temperature, unit)" unit="°C" stacked />
      <StatTile :label="t.humidity" :value="current.relative_humidity_2m" unit="%" stacked />
      <StatTile :label="t.pressure" :value="Math.round(current.pressure_msl)" unit="hPa" stacked />
    </div>
  </div>
</template>
