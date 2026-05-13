<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $forecast } from '../stores/forecastStore';
import { $unit } from '../stores/configStore';
import { $location } from '../stores/locationStore';
import { convertTemp } from '../stores/actions';
import { useI18n } from '../i18n/useI18n';
import WeatherIcon from './WeatherIcon.vue';
import SunArc from './SunArc.vue';

const forecast = useStore($forecast);
const location = useStore($location);
const unit = useStore($unit);
const { t, lang } = useI18n();

const current = computed(() => forecast.value?.list[0]);

const dayName = computed(() =>
  new Date().toLocaleDateString(`${lang.value}-${lang.value.toUpperCase()}`, { weekday: 'long' }),
);

const fullDate = computed(() =>
  new Date().toLocaleDateString(`${lang.value}-${lang.value.toUpperCase()}`, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
);

const city = computed(() => forecast.value?.city);
</script>

<template>
  <template v-if="current && city">
    <div class="weather-card">
      <div class="weather-header flex">
        <div class="weather-location">
          <p class="location-name">{{ location?.name }}</p>
          <p class="location-detail">{{ location?.state ? location.state + ', ' : '' }}{{ location?.country }}</p>
        </div>
        <div class="weather-date">
          <p class="day-name">{{ dayName }}</p>
          <p class="full-date">{{ fullDate }}</p>
        </div>
      </div>

      <div class="weather-main flex jc-around">
        <WeatherIcon :iconCode="current.weather[0].icon" />
        <div class="tt flex-center fd-column">
          <p class="weather-temp">{{ convertTemp(current.main.temp, unit) }}°{{ unit }}</p>
          <p class="weather-desc">{{ current.weather[0].description }}</p>
        </div>
      </div>

      <div class="weather-footer grid">
        <div class="flex jc-between">
          <div class="weather-stat">
            <span class="stat-label">{{ t.feelsLike }}</span>
            <span class="stat-value">{{ convertTemp(current.main.feels_like, unit) }}°{{ unit }}</span>
          </div>
          <div class="weather-stat">
            <span class="stat-label">{{ t.humidity }}</span>
            <span class="stat-value">{{ current.main.humidity }}%</span>
          </div>
          <div class="weather-stat">
            <span class="stat-label">{{ t.pressure }}</span>
            <span class="stat-value">{{ current.main.pressure }} hPa</span>
          </div>
        </div>
        <div class="wind-stat">
          <span class="stat-label">{{ t.wind }}</span>
          <div class="wind-stats flex jc-around ai-center">
            <div class="wind-details">
              <span class="stat-value">{{ Math.round(current.wind.speed * 3.6) }} km/h</span>
            </div>

            <div class="compass relative">
              <div class="compass-body absolute w-full h-full">
                <div class="compass-arrows absolute w-full h-full">
                  <div class="quad quad-ns"></div>
                  <div class="quad quad-eo"></div>
                  <div class="quad quad-neso"></div>
                  <div class="quad quad-nose"></div>
                </div>
                <div class="compass-directions absolute">
                  <div class="direction n">N</div>
                  <div class="direction e">E</div>
                  <div class="direction s">S</div>
                  <div class="direction o">O</div>
                </div>
                <div class="arrow w-full h-full flex jc-center" :style="`transform: rotate(${current.wind.deg}deg)`">
                  <div class="arrow-up"></div>
                  <div class="arrow-down"></div>
                </div>
                <div class="axis absolute"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="weather-sun">
          <span class="stat-label">{{ t.sunriseSunset }}</span>
          <SunArc :sunrise="city.sunrise" :sunset="city.sunset" />
        </div>
      </div>
    </div>
  </template>
</template>
