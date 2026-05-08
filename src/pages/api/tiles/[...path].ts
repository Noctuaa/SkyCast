import type { APIRoute } from 'astro';
import { OPENWEATHER_API_KEY } from 'astro:env/server';

/**                                                                                                                                                         
 * GET /api/tiles/[...path]
 * Proxies OpenWeatherMap tile requests to keep the API key server-side.                                                                                    
 * Forwards the tile path (layer/z/x/y.png) to OWM and returns the PNG image.                                                                               
 * Tiles are cached for 10 minutes to reduce redundant API calls.                                                                                           
 * @param params.path - The tile path (e.g. "clouds_new/6/32/22.png").
 */
export const GET: APIRoute = async ({ params }) => {
  const path = params.path;

  if (!path) {
    return new Response('Bad Request', { status: 400 });
  }

  const tileUrl = `https://tile.openweathermap.org/map/${path}?appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(tileUrl);

  if (!res.ok) {
    return new Response('Tile not found', { status: res.status });
  }

  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
