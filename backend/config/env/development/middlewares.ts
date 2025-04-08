export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  // Кастомная конфигурация CORS вместо строки 'strapi::cors'
  {
    name: 'strapi::cors',
    config: {
      // enabled: true, // Убрали согласно предупреждению Strapi
      headers: '*',
      origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]; 