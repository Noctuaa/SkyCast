<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '../i18n/useI18n';
import { $lang } from '../stores/configStore';
import SunArc from './SunArc.vue';

const props = defineProps<{
  sunrise: number;
  sunset: number;
  timezone: number;
  initialLang: 'fr' | 'en';
}>();

$lang.set(props.initialLang);

const { t } = useI18n();

const fmt = (ts: number) => {
  const d = new Date((ts + props.timezone) * 1000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
};

const sunTimes = computed(() => ({
  sunrise: fmt(props.sunrise),
  sunset: fmt(props.sunset),
}));

const civilDawn = computed(() => fmt(props.sunrise - 30 * 60));
const civilDusk = computed(() => fmt(props.sunset + 30 * 60));
const solarNoon = computed(() => fmt(Math.floor((props.sunrise + props.sunset) / 2)));

const dayLength = computed(() => {
  const s = props.sunset - props.sunrise;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${String(m).padStart(2, '0')}m`;
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <div>
      <SunArc :sunrise="sunrise" :sunset="sunset" :timezone="timezone" />

      <div class="sun-times flex jc-between ai-center">
        <div>
          <span class="eyebrow">{{ t.sunrise }}</span>
          <output class="sun-time-val num">{{ sunTimes.sunrise }}</output>
        </div>
        <div class="text-right">
          <span class="eyebrow">{{ t.sunset }}</span>
          <output class="sun-time-val num">{{ sunTimes.sunset }}</output>
        </div>
      </div>
    </div>

    <div class="extras grid grid-cols-2 gap-2">
      <div class="tile p-3">
        <p class="eyebrow">{{ t.civilDawn }}</p>
        <output class="sun-tile-val num">{{ civilDawn }}</output>
      </div>
      <div class="tile p-3">
        <p class="eyebrow">{{ t.civilDusk }}</p>
        <output class="sun-tile-val num">{{ civilDusk }}</output>
      </div>
      <div class="tile p-3">
        <p class="eyebrow">{{ t.solarNoon }}</p>
        <output class="sun-tile-val num">{{ solarNoon }}</output>
      </div>
      <div class="tile p-3">
        <p class="eyebrow">{{ t.dayLength }}</p>
        <output class="sun-tile-val num">{{ dayLength }}</output>
      </div>
    </div>
  </div>
</template>

<style>
.sun-time-val {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-1);
  letter-spacing: -0.02em;
  display: block;
  line-height: 1.2;
}

.sun-tile-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink-1);
  letter-spacing: -0.02em;
  display: block;
  margin-top: 2px;
}
</style>
