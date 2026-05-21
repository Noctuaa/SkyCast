<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const props = defineProps<{
  sunrise: number;
  sunset: number;
  timezone: number;
}>();

const ARC_CENTER_Y = 85;
const ARC_RY = 50;
const ARC_RX = 80;
const VB_MIN_Y = 25;
const VB_HEIGHT = 65;

const sunTimes = computed(() => {
  const fmt = (ts: number) => {
    const d = new Date((ts + props.timezone) * 1000);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  };
  return { sunrise: fmt(props.sunrise), sunset: fmt(props.sunset) };
});

const sunState = ref<{ isVisible: boolean; isDay: boolean; left: string; top: string } | null>(null);

onMounted(() => {
  const progress = (Date.now() / 1000 - props.sunrise) / (props.sunset - props.sunrise);
  const clamped = progress < 0 ? 1 : Math.min(1, progress);
  const angle = Math.PI * (1 - clamped);
  const x = 100 + ARC_RX * Math.cos(angle);
  const y = ARC_CENTER_Y - ARC_RY * Math.sin(angle);
  sunState.value = {
    isVisible: true,
    isDay: progress >= 0 && progress < 1,
    left: `${(x / 200) * 100}%`,
    top: `${((y - VB_MIN_Y) / VB_HEIGHT) * 100}%`,
  };
});
</script>

<template>
  <div class="relative">
    <svg viewBox="0 25 200 65" class="sun-arc">
      <path d="M 20,85 A 80,50 0 0,1 180,85" />
    </svg>
    <div
      v-if="sunState?.isVisible"
      class="weather-icon size-xs sun-position"
      :style="{ left: sunState?.left, top: sunState?.top }"
    >
      <div :class="sunState?.isDay ? 'sun' : 'moon'"></div>
    </div>
  </div>
  <div class="sun-times">
    <span class="stat-value">{{ sunTimes.sunrise }}</span>
    <span class="stat-value">{{ sunTimes.sunset }}</span>
  </div>
</template>
