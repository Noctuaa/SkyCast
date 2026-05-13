import type { APIRoute } from "astro";
import type { ForecastResponse } from "../../types/weather";
import { OPENWEATHER_API_KEY } from 'astro:env/server'

/**
 * Get the weather forecast from OpenWeatherMap for 5 days with 3 hours interval.
 * @param lat - The latitude of the location.
 * @param lon - The longitude of the location.
 * @returns The weather forecast data from OpenWeatherMap API.
 * @throws {Error} if the API return an error.
 */
const fetchForecast = async (lat: string, lon: string, lang: string): Promise<ForecastResponse> => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${lang}&cnt=40`
  const res = await fetch(apiUrl);
  if (!res.ok) { throw new Error(`Failed to fetch forecast data: ${res.status}`); }
  return res.json();
}


/**
 * GET /api/forecast?lat={lat}&lon={lon}
 * Returns the weather forecast from coordinates (latitude and longitude) using the OpenWeatherMap API.
 * @queryParam url lat - The latitude of the location.
 * @queryParam url lon - The longitude of the location. 
 * @queryParam url lang - The language for weather descriptions (default: 'fr').
 */
export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const lang = url.searchParams.get("lang") || "fr";

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat or lon parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await fetchForecast(lat, lon, lang);
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}