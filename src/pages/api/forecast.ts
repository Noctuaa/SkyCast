import type { APIRoute } from 'astro';
import { isValidCoords } from '../../utils/coords';
import { getForecast } from '../../utils/weatherApi';

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
    const data = await getForecast(lat, lon);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[forecast] error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
