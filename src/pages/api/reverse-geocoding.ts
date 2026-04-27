import type { APIRoute } from "astro";
import type { GeocodingResult } from "../../types/weather";
import { OPENWEATHER_API_KEY } from 'astro:env/server'

/**
 * Get the reverse geocoding data from OpenWeatherMap for a given query (latitude and longitude).
 * @param lat - The latitude of the location.
 * @param lon - The longitude of the location.
 * @returns  The reverse geocoding data from OpenWeatherMap API.
 * @throws {Error} if the API return an error.
 */
const fetchReverseGeocoding = async (lat: string, lon: string): Promise<GeocodingResult[]> => {
  const apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(apiUrl);
  if (!res.ok) { throw new Error(`Failed to fetch geocoding data: ${res.status}`); }
  return res.json();
}


/**
 * GET /api/reverse-geocoding?lat={lat}&lon={lon}
 * Returns the reverse geocoding data from coordinates (latitude and longitude) using the OpenWeatherMap API.
 * @queryParam url lat - The latitude of the location.
 * @queryParam url lon - The longitude of the location.
 */
export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat or lon parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await fetchReverseGeocoding(lat, lon);
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}