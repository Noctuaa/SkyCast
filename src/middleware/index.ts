import { defineMiddleware } from 'astro:middleware';
import { checkRateLimit } from '../utils/rateLimit';

export const onRequest = defineMiddleware(async (context, next) => {
  // Rate limiting — 20 req/min per IP, API routes only
  // x-forwarded-for takes priority to get the real IP behind a proxy
  if (context.url.pathname.startsWith('/api/')) {
    const ip =
      context.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      context.request.headers.get('cf-connecting-ip') ??
      'unknown';

    const { allowed, retryAfter } = checkRateLimit(ip);

    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      });
    }
  }

  // Security headers — applied to all responses
  // wasm-unsafe-eval required by MapLibre GL (WebAssembly), worker-src blob: for its Web Workers
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "worker-src blob:",
      "img-src 'self' data: blob: https://*.openstreetmap.org https://*.maptiler.com https://*.openfreemap.org",
      "connect-src 'self' https://api.open-meteo.com https://air-quality-api.open-meteo.com https://geocoding-api.open-meteo.com https://*.openfreemap.org https://*.maptiler.com https://map-tiles.open-meteo.com",
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  return response;
});

