<script setup lang="ts">
import { computed } from 'vue';

import { useI18n } from '../../i18n/useI18n';
import { $lang } from '../../stores/configStore';

import StatTile from '../ui/StatTile.vue';

import type { OMAirQualityResponse } from '../../types/weather';

const props = defineProps<{
  airQuality: OMAirQualityResponse['current'];
  locationName: string;
  initialLang: 'fr' | 'en';
}>();

$lang.set(props.initialLang);

const { lang } = useI18n();

const AQI_DATA = [
  {
    fr: { label: 'Bon', desc: "Qualité de l'air excellente" },
    en: { label: 'Good', desc: 'Air quality is satisfactory' },
    color: 'oklch(0.72 0.20 145)',
  },
  {
    fr: { label: 'Acceptable', desc: 'Acceptable, risque mineur pour les groupes sensibles' },
    en: { label: 'Fair', desc: 'Acceptable; minor concern for sensitive groups' },
    color: 'oklch(0.82 0.18 115)',
  },
  {
    fr: { label: 'Modéré', desc: 'Risque pour les groupes sensibles' },
    en: { label: 'Moderate', desc: 'Unhealthy for sensitive groups' },
    color: 'oklch(0.83 0.18 80)',
  },
  {
    fr: { label: 'Mauvais', desc: 'Nocif pour tout le monde' },
    en: { label: 'Poor', desc: 'Unhealthy for everyone' },
    color: 'oklch(0.72 0.20 45)',
  },
  {
    fr: { label: 'Très mauvais', desc: 'Très nocif, urgence sanitaire' },
    en: { label: 'Very Poor', desc: 'Very unhealthy, health emergency' },
    color: 'oklch(0.60 0.22 25)',
  },
] as const;

// Continuous European AQI (0-100+) → level 1-5
const toLevel = (eaqi: number): number => {
  if (eaqi <= 20) return 1;
  if (eaqi <= 40) return 2;
  if (eaqi <= 60) return 3;
  if (eaqi <= 80) return 4;
  return 5;
};

const aqi = computed(() => toLevel(props.airQuality.european_aqi));
const level = computed(() => AQI_DATA[aqi.value - 1]);
const label = computed(() => level.value[lang.value].label);
const desc = computed(() => level.value[lang.value].desc);
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex ai-center gap-3">
      <div class="badge aqi-badge num text-xl" :style="{ background: level.color }">{{ aqi }}</div>
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <span class="aqi-label text-lg font-bold ink-1">{{ label }}</span>
        <p class="aqi-desc text-xs ink-3">{{ desc }}</p>
        <div class="aqi-bar flex gap-1">
          <div
            v-for="i in 5"
            :key="i"
            class="aqi-segment"
            :style="{ background: i <= aqi ? AQI_DATA[i - 1].color : 'oklch(0.7 0.04 270 / 0.25)' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="extras grid grid-cols-2 gap-2">
      <StatTile label="PM" sub="2.5" :value="airQuality.pm2_5" :decimals="1" unit="µg/m³" />
      <StatTile label="PM" sub="10" :value="airQuality.pm10" :decimals="1" unit="µg/m³" />
      <StatTile label="NO" sub="2" :value="airQuality.nitrogen_dioxide" :decimals="1" unit="µg/m³" />
      <StatTile label="O" sub="3" :value="airQuality.ozone" :decimals="1" unit="µg/m³" />
    </div>
  </div>
</template>
