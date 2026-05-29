<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps<{
  sunrise: number;
  sunset: number;
  timezone: number;
}>();

const PATH_LENGTH = 600;

const progress = ref(0);
const isDay = ref(false);
const mounted = ref(false);

onMounted(() => {
  const raw = (Date.now() / 1000 - props.sunrise) / (props.sunset - props.sunrise);
  progress.value = Math.max(0, Math.min(1, raw));
  isDay.value = raw >= 0 && raw < 1;
  mounted.value = true;
});

// Position sur la courbe de Bézier quadratique M 20 102 Q 130 -13 240 102
const sunPos = computed(() => {
  const t = progress.value;
  const x = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 130 + t ** 2 * 240;
  const y = (1 - t) ** 2 * 102 + 2 * (1 - t) * t * -13 + t ** 2 * 102;
  return {
    left: `${(x / 260) * 100}%`,
    top: `${(y / 110) * 100}%`,
  };
});

const dashOffset = computed(() => PATH_LENGTH * (1 - progress.value));
</script>

<template>
  <div class="sun-arc-wrap relative">
    <!-- prettier-ignore -->
    <svg class="sun-arc-svg" viewBox="0 0 260 110" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="arc-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="var(--accent-2)"       stop-opacity="0.2" />
          <stop offset="50%"  stop-color="oklch(0.85 0.15 85)"   stop-opacity="0.9" />
          <stop offset="100%" stop-color="var(--accent)"         stop-opacity="0.2" />
        </linearGradient>
        <linearGradient id="arc-bg-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stop-color="oklch(0.85 0.15 85)" stop-opacity="0" />
          <stop offset="100%" stop-color="oklch(0.85 0.15 85)" stop-opacity="0.15" />
        </linearGradient>
      </defs>
      <!-- Remplissage sous la courbe -->
      <path d="M 20 102 Q 130 -13 240 102 L 240 102 L 20 102 Z" fill="url(#arc-bg-g)" />
      <!-- Arc complet en pointillés (dim) -->
      <path d="M 20 102 Q 130 -13 240 102" fill="none" stroke="var(--glass-edge)" stroke-width="2" stroke-dasharray="3 5" />
      <!-- Arc progressif (accent) -->
      <path d="M 20 102 Q 130 -13 240 102" fill="none" stroke="url(#arc-g)" stroke-width="3" stroke-linecap="round" :pathLength="PATH_LENGTH" :stroke-dasharray="PATH_LENGTH" :stroke-dashoffset="dashOffset" />
      <!-- Ligne d'horizon -->
      <line x1="0" y1="102" x2="260" y2="102" stroke="var(--ink-3)" stroke-opacity="0.2" stroke-dasharray="2 4" />
    </svg>

    <!-- Soleil / Lune -->
    <div v-if="mounted" class="sun-icon-wrap absolute" :style="{ left: sunPos.left, top: sunPos.top }">
      <WeatherIcon :iconCode="isDay ? '01d' : '01n'" size="xs" />
    </div>
  </div>
</template>

<style>
.sun-arc-svg {
  width: 100%;
  height: 110px;
  display: block;
}

.sun-icon-wrap {
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
