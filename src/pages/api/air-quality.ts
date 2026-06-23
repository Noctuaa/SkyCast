import type { APIRoute } from 'astro';
import type { OMAirQualityResponse } from '../../types/weather';
import { isValidCoords } from '../../utils/coords';
import { createCache } from '../../utils/cache';

const cache = createCache<OMAirQualityResponse>();

const fetchAirQuality = async (lat: string, lon: string): Promise<OMAirQualityResponse> => {
  const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', 'european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Air quality error: ${res.status}`);
  return res.json();
};


export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');

  if (!lat || !lon || !isValidCoords(lat, lon)) {
    return new Response(JSON.stringify({ error: 'Invalid or missing lat/lon' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const key = `${lat},${lon}`;
    const cached = cache.get(key);
    if (cached) return new Response(JSON.stringify(cached), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await fetchAirQuality(lat, lon);
    cache.set(key, data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[air-quality] error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
