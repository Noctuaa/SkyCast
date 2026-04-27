import type { APIRoute } from "astro";
import type { GeocodingResult } from "../../types/weather";
import { OPENWEATHER_API_KEY } from 'astro:env/server'

/**
 * Get the geocoding data from OpenWeatherMap for a given query (city name, state, country).
 * @param query - The search query for the location (e.g., city name, state, country).
 * @returns The geocoding data from OpenWeatherMap API.
 * @throws {Error} if the API return an error.
 */
const fetchGeocoding = async (query: string): Promise<GeocodingResult[]> => {
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(apiUrl);
  if (!res.ok) { throw new Error(`Failed to fetch geocoding data: ${res.status}`); }
  return res.json();
}

/**
 * GET /api/geocoding?q={query}
 * Returns the geocoding data from a search query (city name, state, country) using the OpenWeatherMap API.
 * @queryParam url q - The search query for the location (e.g., city name, state, country).
 */
export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing q parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await fetchGeocoding(query);
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}