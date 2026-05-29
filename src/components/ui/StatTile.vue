<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{
    label: string;
    value: number | string;
    unit?: string;
    sub?: string;
    decimals?: number;
    stacked?: boolean;
  }>(),
  {
    sub: '',
    unit: '',
    decimals: 0,
    stacked: false,
  },
);

const display = computed(() =>
  typeof props.value === 'number' && props.decimals > 0 ? props.value.toFixed(props.decimals) : props.value,
);
</script>

<template>
  <div class="tile p-3" :class="stacked ? 'flex flex-col' : 'flex jc-between ai-center'">
    <span class="eyebrow">
      {{ label }}
      <sub v-if="sub">{{ sub }}</sub>
    </span>
    <output class="stat-tile-val num">
      {{ display }}
      <small v-if="unit">{{ unit }}</small>
    </output>
  </div>
</template>

<style>
.stat-tile-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink-1);
  letter-spacing: -0.02em;
}

.stat-tile-val small {
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-3);
  margin-left: 1px;
}
</style>
