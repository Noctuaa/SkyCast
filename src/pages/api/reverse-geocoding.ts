import type { APIRoute } from 'astro'

interface NominatimReverseResult {
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
// prettier-ignore
const fetchReverseGeocoding = async (lat: string, lon: string, lang: string): Promise<{ name: string; country: string; country_code: string; state?: string }> => {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('accept-language', lang);

  const res = await fetch(url.toString(), { headers: { 'User-Agent': 'SkyCast/1.0 (weather app)' }, });
  if (!res.ok) throw new Error(`Nominatim reverse error: ${res.status}`);

  const data: NominatimReverseResult = await res.json();

  return {
    name: data.address.city ?? data.address.town ?? data.address.village ??
      data.address.municipality ?? data.display_name.split(',')[0],
    country: data.address.country,
    country_code: data.address.country_code.toUpperCase(),
    state: data.address.state,
  };
};


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
    const data = await fetchReverseGeocoding(lat, lon, lang);
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
