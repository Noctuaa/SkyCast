<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '../../i18n/useI18n';
import { $lang } from '../../stores/configStore';
import StatTile from '../ui/StatTile.vue';
const props = defineProps<{
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  cloudCover: number;
  visibility: number;
  initialLang: 'fr' | 'en';
}>();

$lang.set(props.initialLang);

const { t, lang } = useI18n();

const BEAUFORT = [
  { fr: 'Calme', en: 'Calm' },
  { fr: 'Très légère brise', en: 'Light air' },
  { fr: 'Légère brise', en: 'Light breeze' },
  { fr: 'Petite brise', en: 'Gentle breeze' },
  { fr: 'Jolie brise', en: 'Moderate breeze' },
  { fr: 'Bonne brise', en: 'Fresh breeze' },
  { fr: 'Vent frais', en: 'Strong breeze' },
  { fr: 'Grand frais', en: 'Near gale' },
  { fr: 'Coup de vent', en: 'Gale' },
  { fr: 'Fort coup de vent', en: 'Strong gale' },
  { fr: 'Tempête', en: 'Storm' },
  { fr: 'Violente tempête', en: 'Violent storm' },
  { fr: 'Ouragan', en: 'Hurricane' },
] as const;

const BFT_LIMITS = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7];

const toKmh = (mps: number) => Math.round(mps * 3.6);

const degToDir = computed(() => {
  const dirs =
    lang.value === 'fr' ? ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(props.windDeg / 45) % 8];
});

const beaufort = computed(() => {
  const force = BFT_LIMITS.filter((v) => props.windSpeed >= v).length;
  return { force, label: BEAUFORT[force][lang.value] };
});

const windFrom = computed(() => `${degToDir.value} · ${props.windDeg}°`);

const visibilityKm = computed(() => Math.round(props.visibility / 1000));
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="compass-wrap flex ai-center gap-6">
      <!-- prettier-ignore -->
      <svg class="wind-compass" viewBox="0 0 116 116" aria-hidden="true" fill="none">
        <defs>
          <linearGradient id="needle-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" />
            <stop offset="100%" stop-color="var(--accent-2)" />
          </linearGradient>
          <radialGradient id="dial-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--accent-soft)" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>
        </defs>
        <circle cx="58" cy="58" r="56" fill="url(#dial-bg)" stroke="var(--glass-border)" />
        <line x1="58"  y1="2"   x2="58"  y2="14"  stroke="var(--ink-3)" stroke-width="2" />
        <line x1="114" y1="58"  x2="102" y2="58"  stroke="var(--ink-3)" stroke-width="2" />
        <line x1="58"  y1="114" x2="58"  y2="102" stroke="var(--ink-3)" stroke-width="2" />
        <line x1="2"   y1="58"  x2="14"  y2="58"  stroke="var(--ink-3)" stroke-width="2" />
        <line x1="97.6" y1="18.4" x2="91.9" y2="24.1" stroke="var(--ink-3)" stroke-width="1.2" stroke-opacity="0.5" />
        <line x1="97.6" y1="97.6" x2="91.9" y2="91.9" stroke="var(--ink-3)" stroke-width="1.2" stroke-opacity="0.5" />
        <line x1="18.4" y1="97.6" x2="24.1" y2="91.9" stroke="var(--ink-3)" stroke-width="1.2" stroke-opacity="0.5" />
        <line x1="18.4" y1="18.4" x2="24.1" y2="24.1" stroke="var(--ink-3)" stroke-width="1.2" stroke-opacity="0.5" />
        <text x="58"  y="24"  text-anchor="middle" font-family="var(--font-sans)" font-weight="700" font-size="12" fill="var(--ink-2)">N</text>
        <text x="97" y="62"  text-anchor="middle" font-family="var(--font-sans)" font-weight="700" font-size="12" fill="var(--ink-2)">E</text>
        <text x="58"  y="100" text-anchor="middle" font-family="var(--font-sans)" font-weight="700" font-size="12" fill="var(--ink-2)">S</text>
        <text x="20"  y="62"  text-anchor="middle" font-family="var(--font-sans)" font-weight="700" font-size="12" fill="var(--ink-2)">{{ lang === 'fr' ? 'O' : 'W' }}</text>
        <g :transform="`rotate(${windDeg} 58 58)`" style="transition: transform 0.8s cubic-bezier(0.4, 1.6, 0.5, 1);">
          <polygon points="58,13 53,58 63,58" fill="url(#needle-g)" />
          <polygon points="58,103 54,58 62,58" fill="var(--ink-4)" opacity="0.5" />
          <circle cx="58" cy="58" r="4" fill="var(--accent)" stroke="white" stroke-width="1.5" />
        </g>
      </svg>

      <div class="wind-stats flex flex-col gap-2">
        <output class="wind-speed num">
          {{ toKmh(windSpeed) }}
          <small>km/h</small>
        </output>
        <output class="wind-from text-sm ink-2 font-medium">{{ windFrom }}</output>
        <span v-if="windGust" class="wind-gust text-sm ink-3">
          {{ t.windGust }}
          <strong class="ink-2">{{ toKmh(windGust) }} km/h</strong>
        </span>

        <div class="beaufort flex ai-center gap-3">
          <output class="bft-num num">{{ beaufort.force }}</output>
          <div>
            <small class="text-xs uppercase font-bold ink-3">Beaufort</small>
            <p class="text-sm font-semibold ink-1">{{ beaufort.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="extras grid grid-cols-2 gap-2">
      <StatTile :label="t.cloudCover" :value="cloudCover" unit="%" />
      <StatTile :label="t.visibility" :value="visibilityKm" unit="km" />
    </div>
  </div>
</template>

<style>
.beaufort {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--accent-soft);
  border: 1px solid var(--glass-border);
}

.wind-stats {
  flex: 1;
  min-width: 0;
}

.wind-compass {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.wind-speed {
  font-size: 36px;
  font-weight: 700;
  color: var(--ink-1);
  letter-spacing: -0.03em;
  line-height: 1;
}

.wind-speed small,
.wind-val small {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-3);
}

.wind-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink-1);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.bft-badge {
  margin-top: 2px;
}

.bft-num {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--grad-accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
</style>
