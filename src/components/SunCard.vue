<script setup lang="ts">
import { useI18n } from '../i18n/useI18n';
import { $lang } from '../stores/configStore';
import type { ForecastResponse } from '../types/weather';

const props = defineProps<{
  sunrise: number;
  sunset: number;
  timezone: number;
  initialLang: 'fr' | 'en';
}>();

const { t, lang } = useI18n();

// Sync store before children mount — avoids SSR/client hydration mismatch
$lang.set(lang.value);
</script>

<template>
  <div class="panel-title">
    <span>{{ t.sunriseSunset }}</span>
  </div>
</template>

<style></style>
