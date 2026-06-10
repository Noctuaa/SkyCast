<script setup lang="ts">
withDefaults(
  defineProps<{
    overlay?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    overlay: false,
    size: 'md',
  },
);
</script>

<template>
  <Transition name="fade">
    <div v-if="overlay" class="spinner-overlay absolute z-1000 inset-0 grid pi-center">
      <div :class="['spinner', `spinner-${size}`]"></div>
    </div>
    <div v-else :class="['spinner', `spinner-${size}`]"></div>
  </Transition>
</template>
