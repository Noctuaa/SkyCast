<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $forecast } from '../stores/forecastStore';
import { $location } from '../stores/locationStore';
import WeatherIcon from './WeatherIcon.vue';

const forecast = useStore($forecast);
const location = useStore($location);

const dayName = computed(() => new Date().toLocaleDateString('fr-FR', { weekday: 'long' }));
const fullDate = computed(() =>
  new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
);
const current = computed(() => forecast.value?.list[0]);
const city = computed(() => forecast.value?.city);
</script>

<template>
  <div v-if="current && city" class="weather-card">
    <div class="weather-header flex fd-column">
      <div class="weather-date">
        <p class="day-name">{{ dayName }}</p>
        <p class="full-date">{{ fullDate }}</p>
      </div>

      <div class="weather-location">
        <p class="location-name">{{ location?.name }}</p>
        <p class="location-detail">{{ location?.state ? location.state + ', ' : '' }}{{ location?.country }}</p>
      </div>
    </div>

    <div class="weather-main flex-center fd-column">
      <WeatherIcon :iconCode="current.weather[0].icon" />
      <p class="weather-temp">{{ Math.round(current.main.temp) }}°C</p>
      <p class="weather-desc">{{ current.weather[0].description }}</p>
    </div>

    <div class="weather-footer flex jc-around">
      <div class="weather-stat">
        <span class="stat-label">Ressenti</span>
        <span class="stat-value">{{ Math.round(current.main.feels_like) }}°C</span>
      </div>
      <div class="weather-stat">
        <span class="stat-label">Humidité</span>
        <span class="stat-value">{{ current.main.humidity }}%</span>
      </div>
      <div class="weather-stat">
        <span class="stat-label">Vent</span>
        <div class="stat-wind">
          <span class="wind-arrow" :style="{ transform: `rotate(${current.wind.deg}deg)` }">↑</span>
          <span class="stat-value">{{ Math.round(current.wind.speed * 3.6) }} km/h</span>
        </div>
      </div>
    </div>
  </div>
</template>
