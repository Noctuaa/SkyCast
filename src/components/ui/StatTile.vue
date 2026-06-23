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
  <div class="tile" :class="stacked ? 'flex flex-col' : 'flex jc-between ai-center'">
    <span class="eyebrow">
      {{ label }}
      <sub v-if="sub">{{ sub }}</sub>
    </span>
    <output class="num text-lg font-bold ink-1 tracking-tight">
      {{ display }}
      <small v-if="unit">{{ unit }}</small>
    </output>
  </div>
</template>
