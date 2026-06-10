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
    color: 'oklch(0.74 0.22 142)',
    grad: 'linear-gradient(to top, oklch(0.55 0.22 142), oklch(0.78 0.22 128))',
  },
  {
    fr: { label: 'Acceptable', desc: 'Acceptable, risque mineur pour les groupes sensibles' },
    en: { label: 'Fair', desc: 'Acceptable; minor concern for sensitive groups' },
    color: 'oklch(0.80 0.20 120)',
    grad: 'linear-gradient(to top, oklch(0.62 0.22 128), oklch(0.84 0.20 112))',
  },
  {
    fr: { label: 'Modéré', desc: 'Risque pour les groupes sensibles' },
    en: { label: 'Moderate', desc: 'Unhealthy for sensitive groups' },
    color: 'oklch(0.85 0.18 85)',
    grad: 'linear-gradient(to top, oklch(0.68 0.20 75), oklch(0.88 0.18 90))',
  },
  {
    fr: { label: 'Mauvais', desc: 'Nocif pour tout le monde' },
    en: { label: 'Poor', desc: 'Unhealthy for everyone' },
    color: 'oklch(0.74 0.18 50)',
    grad: 'linear-gradient(to top, oklch(0.58 0.20 40), oklch(0.78 0.18 55))',
  },
  {
    fr: { label: 'Très mauvais', desc: 'Très nocif, urgence sanitaire' },
    en: { label: 'Very Poor', desc: 'Very unhealthy, health emergency' },
    color: 'oklch(0.63 0.22 25)',
    grad: 'linear-gradient(to top, oklch(0.48 0.22 20), oklch(0.68 0.22 30))',
  },
] as const;

// European AQI continu (0-100+) → niveau 1-5
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
const barWidth = computed(() => `${(aqi.value / 5) * 100}%`);
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex ai-center gap-3">
      <div class="badge aqi-badge num text-xl" :style="{ background: level.color }">{{ aqi }}</div>
      <div class="flex flex-col gap-1">
        <span class="aqi-label text-lg font-bold ink-1">{{ label }}</span>
        <p class="aqi-desc text-xs ink-3">{{ desc }}</p>
        <div class="aqi-bar w-full">
          <div class="aqi-bar-fill h-full" :style="{ width: barWidth, background: level.color }"></div>
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
