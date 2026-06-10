<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '../../i18n/useI18n.ts';
import { $lang } from '../../stores/configStore.ts';
import SunArc from './SunArc.vue';
import StatTile from '../ui/StatTile.vue';

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
          <output class="block num text-sm font-semibold ink-1">{{ sunTimes.sunrise }}</output>
        </div>
        <div class="text-right">
          <span class="eyebrow">{{ t.sunset }}</span>
          <output class="block num text-sm font-semibold ink-1">{{ sunTimes.sunset }}</output>
        </div>
      </div>
    </div>

    <div class="extras grid grid-cols-2 gap-2">
      <StatTile :label="t.civilDawn" :value="civilDawn" stacked />
      <StatTile :label="t.civilDusk" :value="civilDusk" stacked />
      <StatTile :label="t.solarNoon" :value="solarNoon" stacked />
      <StatTile :label="t.dayLength" :value="dayLength" stacked />
    </div>
  </div>
</template>
