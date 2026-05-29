import type { APIRoute } from 'astro';
import type { OMAirQualityResponse } from '../../types/weather';

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

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: 'Missing lat or lon' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await fetchAirQuality(lat, lon);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
