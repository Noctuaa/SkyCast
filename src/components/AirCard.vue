<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '../i18n/useI18n';
import { $lang } from '../stores/configStore';
import type { OMAirQualityResponse } from '../types/weather';

const props = defineProps<{
  airQuality: OMAirQualityResponse['current'];
  locationName: string;
  initialLang: 'fr' | 'en';
}>();

$lang.set(props.initialLang);

const { lang } = useI18n();

const AQI_DATA = [
  {
    fr: { label: 'Bon',          desc: 'Qualité de l\'air excellente' },
    en: { label: 'Good',         desc: 'Air quality is satisfactory' },
    color: 'oklch(0.74 0.22 142)',
    grad:  'linear-gradient(to top, oklch(0.55 0.22 142), oklch(0.78 0.22 128))',
  },
  {
    fr: { label: 'Acceptable',   desc: 'Acceptable, risque mineur pour les groupes sensibles' },
    en: { label: 'Fair',         desc: 'Acceptable; minor concern for sensitive groups' },
    color: 'oklch(0.80 0.20 120)',
    grad:  'linear-gradient(to top, oklch(0.62 0.22 128), oklch(0.84 0.20 112))',
  },
  {
    fr: { label: 'Modéré',       desc: 'Risque pour les groupes sensibles' },
    en: { label: 'Moderate',     desc: 'Unhealthy for sensitive groups' },
    color: 'oklch(0.85 0.18 85)',
    grad:  'linear-gradient(to top, oklch(0.68 0.20 75), oklch(0.88 0.18 90))',
  },
  {
    fr: { label: 'Mauvais',      desc: 'Nocif pour tout le monde' },
    en: { label: 'Poor',         desc: 'Unhealthy for everyone' },
    color: 'oklch(0.74 0.18 50)',
    grad:  'linear-gradient(to top, oklch(0.58 0.20 40), oklch(0.78 0.18 55))',
  },
  {
    fr: { label: 'Très mauvais', desc: 'Très nocif, urgence sanitaire' },
    en: { label: 'Very Poor',    desc: 'Very unhealthy, health emergency' },
    color: 'oklch(0.63 0.22 25)',
    grad:  'linear-gradient(to top, oklch(0.48 0.22 20), oklch(0.68 0.22 30))',
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

    <p class="air-location eyebrow text-right">{{ locationName }}</p>

    <div class="air-main flex ai-center gap-3">
      <div class="aqi-badge num" :style="{ background: level.color }">{{ aqi }}</div>
      <div class="flex flex-col gap-1">
        <p class="aqi-label font-bold ink-1">{{ label }}</p>
        <p class="aqi-desc text-sm ink-3">{{ desc }}</p>
        <div class="aqi-bar">
          <div class="aqi-bar-fill" :style="{ width: barWidth, background: level.color }"></div>
        </div>
      </div>
    </div>

    <div class="extras grid grid-cols-2 gap-2">
      <div class="tile p-3 flex jc-between ai-center">
        <span class="eyebrow">PM<sub>2.5</sub></span>
        <output class="air-val num">{{ airQuality.pm2_5.toFixed(1) }}<small> µg/m³</small></output>
      </div>
      <div class="tile p-3 flex jc-between ai-center">
        <span class="eyebrow">PM<sub>10</sub></span>
        <output class="air-val num">{{ airQuality.pm10.toFixed(1) }}<small> µg/m³</small></output>
      </div>
      <div class="tile p-3 flex jc-between ai-center">
        <span class="eyebrow">NO<sub>2</sub></span>
        <output class="air-val num">{{ airQuality.nitrogen_dioxide.toFixed(1) }}<small> µg/m³</small></output>
      </div>
      <div class="tile p-3 flex jc-between ai-center">
        <span class="eyebrow">O<sub>3</sub></span>
        <output class="air-val num">{{ airQuality.ozone.toFixed(1) }}<small> µg/m³</small></output>
      </div>
    </div>
  </div>
</template>

<style>
.air-location {
  margin-top: -4px;
}

.aqi-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px -4px oklch(0.3 0.1 142 / 0.4);
}

.aqi-label {
  font-size: 18px;
  letter-spacing: -0.02em;
}

.aqi-desc {
  font-size: 12px;
  line-height: 1.3;
}

.aqi-bar {
  height: 4px;
  border-radius: 99px;
  background: var(--glass-edge);
  width: 100%;
  margin-top: 4px;
  overflow: hidden;
}

.aqi-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
}

.air-val {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-1);
  letter-spacing: -0.01em;
}

.air-val small {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-3);
  margin-left: 1px;
}
</style>
