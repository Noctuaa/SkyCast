<script setup lang="ts">
withDefaults(
  defineProps<{
    iconCode: string;
    size?: string;
  }>(),
  {
    size: 'md',
  },
);
</script>

<template>
  <!-- Clear -->
  <div v-if="['01d', '01n'].includes(iconCode)" :class="['grid pi-center relative', `i${iconCode}`, `size-${size}`]">
    <div :class="[iconCode === '01d' ? 'sun' : 'moon']"></div>
  </div>
  <!-- Few Clouds -->
  <div
    v-else-if="['02d', '02n'].includes(iconCode)"
    :class="['grid pi-center relative wi-multi', `i${iconCode}`, `size-${size}`]"
  >
    <div v-if="iconCode === '02d'" class="sun sun-partial"></div>
    <div v-else class="moon moon-partial"></div>
    <div class="cloud"></div>
  </div>
  <!-- Partly Cloudy -->
  <div
    v-else-if="['03d', '03n', '04d', '04n'].includes(iconCode)"
    :class="['grid pi-center relative wi-multi', `i${iconCode}`, `size-${size}`]"
  >
    <div v-if="['03d', '03n'].includes(iconCode)" class="cloud second-cloud"></div>
    <div v-else class="cloud second-cloud dark-cloud"></div>
    <div class="cloud"></div>
  </div>
  <!-- Rain -->
  <div
    v-else-if="['09d', '09n', '10d', '10n'].includes(iconCode)"
    :class="['grid pi-center relative wi-multi', `i${iconCode}`, `size-${size}`]"
  >
    <div v-if="['09d', '09n'].includes(iconCode)" class="cloud second-cloud dark-cloud"></div>
    <div v-else :class="[iconCode === '10d' ? 'sun sun-partial' : 'moon moon-partial']"></div>
    <div class="cloud"></div>
    <div class="rain-drops">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <!-- Thunderstorm -->
  <div
    v-else-if="['11d', '11n'].includes(iconCode)"
    :class="['grid pi-center relative wi-multi', `i${iconCode}`, `size-${size}`]"
  >
    <div class="cloud second-cloud dark-cloud"></div>
    <div class="cloud thunder-cloud"></div>
    <div class="bolt"></div>
  </div>
  <!-- Snow -->
  <div
    v-else-if="['13d', '13n'].includes(iconCode)"
    :class="['grid pi-center relative wi-multi', `i${iconCode}`, `size-${size}`]"
  >
    <div class="cloud"></div>
    <div class="snowflakes">
      <span class="snowflake">❅</span>
      <span class="snowflake">❅</span>
      <span class="snowflake">❅</span>
      <span class="snowflake">❅</span>
    </div>
  </div>
  <!-- Mist -->
  <div
    v-else-if="['50d', '50n'].includes(iconCode)"
    :class="['grid pi-center relative wi-multi', `i${iconCode}`, `size-${size}`]"
  >
    <div class="cloud fog-cloud"></div>
    <div class="fog-layers">
      <div class="fog-layer"></div>
      <div class="fog-layer"></div>
      <div class="fog-layer"></div>
    </div>
  </div>
</template>
