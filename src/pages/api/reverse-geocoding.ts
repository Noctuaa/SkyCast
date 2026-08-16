import type { APIRoute } from 'astro';
import { getReverseGeocoding } from '../../utils/weatherApi';

export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');
  const lang = url.searchParams.get('lang') ?? 'fr';

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: 'Missing lat/lon' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await getReverseGeocoding(lat, lon, lang);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[reverse-geocoding] error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
