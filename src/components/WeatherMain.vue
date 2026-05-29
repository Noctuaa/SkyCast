<script setup lang="ts">
import { computed } from 'vue';
import type { ForecastResponse } from '../types/weather';
import { useI18n } from '../i18n/useI18n';
import { $lang, $unit } from '../stores/configStore';
import { convertTemp } from '../utils/weather';
import { useStore } from '@nanostores/vue';
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps<{
  forecast: ForecastResponse;
  locationName: string;
  locationState: string;
  initialLang: 'fr' | 'en';
  initialUnit: 'C' | 'F';
}>();

const unit = useStore($unit);
const { t, lang } = useI18n();

// Sync store before children mount — avoids SSR/client hydration mismatch
$lang.set(props.initialLang);
$unit.set(props.initialUnit);

const locale = computed(() => (lang.value === 'fr' ? 'fr-FR' : 'en-GB'));
const dayName = computed(() => new Date().toLocaleDateString(locale.value, { weekday: 'long' }));
const fullDate = computed(() =>
  new Date().toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
);
const current = computed(() => props.forecast.list[0]);
const isoDate = computed(() => new Date().toISOString().split('T')[0]);
</script>

<template>
  <section class="cell-main glass flex flex-col jc-between gap-5">
    <div class="wm-top flex flex-col ai-center gap-3">
      <div class="wm-loc inline-flex ai-center gap-2 text-sm font-semibold ink-1">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z"></path>
          <circle cx="12" cy="9" r="2.5"></circle>
        </svg>
        <h2 class="text-sm ink-1 font-semibold">{{ locationName }}</h2>
        <span class="wm-badge">{{ forecast.city.country }}</span>
      </div>
      <time class="wm-date text-center text-sm ink-3 font-medium" :datetime="isoDate">
        <b class="block t-capitalize text-base ink-1 font-semibold">{{ dayName }}</b>
        <span>{{ fullDate }}</span>
      </time>
    </div>
    <div class="flex ai-center jc-center gap-4">
      <div class="wm-icon flex-center flex-none">
        <WeatherIcon :iconCode="current.weather[0].icon" />
      </div>
      <div class="wm-temp">
        <output class="wm-temp-num num">
          {{ convertTemp(current.main.temp, unit) }}
          <sup>°{{ unit }}</sup>
        </output>
        <p class="wm-condi t-capitalize font-semibold ink-1">{{ current.weather[0].description }}</p>
        <p class="wm-sub text-sm ink-3">{{ locationState }}, {{ forecast.city.country }}</p>
      </div>
    </div>
    <div class="wm-stats grid text-center">
      <div class="stat tile">
        <div class="eyebrow">{{ t.feelsLike }}</div>
        <output class="stat-val num">
          {{ convertTemp(current.main.feels_like, unit) }}
          <small>°{{ unit }}</small>
        </output>
      </div>
      <div class="stat tile">
        <div class="eyebrow">{{ t.humidity }}</div>
        <output class="stat-val num">
          {{ current.main.humidity }}
          <small>%</small>
        </output>
      </div>
      <div class="stat tile">
        <div class="eyebrow">{{ t.pressure }}</div>
        <output class="stat-val num">
          {{ current.main.pressure }}
          <small><abbr title="hectopascals">hPa</abbr></small>
        </output>
      </div>
    </div>
  </section>
</template>
