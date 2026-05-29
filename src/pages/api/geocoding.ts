import type { APIRoute } from 'astro';
import type { GeocodingResult } from '../../types/weather';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country: string;
    country_code: string;
  };
}

const fetchGeocoding = async (query: string, lang: string): Promise<GeocodingResult[]> => {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '8');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('accept-language', lang);

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'SkyCast/1.0 (weather app)' },
  });
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

  const data: NominatimResult[] = await res.json();

  return data.map((r) => ({
    id: r.place_id,
    name: r.address.city ?? r.address.town ?? r.address.village ?? r.address.municipality ?? r.display_name.split(',')[0],
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    country: r.address.country,
    country_code: r.address.country_code.toUpperCase(),
    state: r.address.state,
    timezone: '',
  }));
};

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q');
  const lang = url.searchParams.get('lang') ?? 'fr';

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing q parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await fetchGeocoding(query, lang);
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
