# SkyCast

A modern weather app built with Astro SSR, Vue 3, and the Open-Meteo API.

**Live**: [skycast.nocdev.fr](https://skycast.nocdev.fr)

## Features

- 7-day forecast with weather icons
- Hourly charts (temperature, humidity, wind, precipitation)
- Air quality index (AQI)
- Interactive weather map (MapLibre + Open-Meteo layers)
- Wind card with Beaufort scale
- Sunrise/sunset arc
- Bilingual (FR / EN)
- Dark / light theme
- Server-side rendering with 10-minute cache
- Rate limiting (20 req/min per IP)
- Reverse geocoding via Nominatim

## Stack

- [Astro](https://astro.build) — SSR framework
- [Vue 3](https://vuejs.org) — interactive components
- [ApexCharts](https://apexcharts.com) — hourly charts
- [MapLibre GL](https://maplibre.org) — weather map
- [Open-Meteo](https://open-meteo.com) — free weather API, no key required
- [Nominatim](https://nominatim.org) — reverse geocoding

## Commands

| Command           | Action                               |
| :---------------- | :----------------------------------- |
| `npm install`     | Install dependencies                 |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build             |
| `npm test`        | Run unit tests (Vitest)              |

## License

MIT — © [nocdev.fr](https://nocdev.fr)
