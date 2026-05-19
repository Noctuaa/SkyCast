import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const raw = context.cookies.get('skycast_prefs')?.value;
  const config = raw ? JSON.parse(decodeURIComponent(raw)) : {};
  context.locals.unit = ['C', 'F'].includes(config.unit) ? config.unit : 'C';
  return next();
});
