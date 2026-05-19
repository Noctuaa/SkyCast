import type { APIRoute } from "astro";
import { OPENWEATHER_API_KEY } from 'astro:env/server';

export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat or lon" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to resolve city" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify({ cityId: data.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
