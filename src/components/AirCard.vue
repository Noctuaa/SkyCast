<script setup lang="ts">
import { useI18n } from '../i18n/useI18n';
import { $lang } from '../stores/configStore';
import type { ForecastResponse } from '../types/weather';

const props = defineProps<{
  forecast: ForecastResponse;
  initialLang: 'fr' | 'en';
}>();

const { t, lang } = useI18n();

// Sync store before children mount — avoids SSR/client hydration mismatch
$lang.set(lang.value);
</script>

<template>
  <div class="panel-title">
    <span>{{ t.airQuality }}</span>
  </div>
</template>

<style></style>
