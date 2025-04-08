/**
 * setting router
 */

// import { factories } from '@strapi/strapi'; 
// export default factories.createCoreRouter('api::setting.setting');

// Определяем маршрут вручную
export default {
  routes: [
    {
      method: 'GET',
      path: '/setting', // Путь относительно /api/
      handler: 'setting.find', // Используем стандартный обработчик find
      config: {
        policies: [], // Можно добавить политики авторизации, если нужно
        middlewares: [],
      },
    },
    // Можно добавить другие маршруты (например, update), если они понадобятся
    // {
    //   method: 'PUT',
    //   path: '/setting',
    //   handler: 'setting.update',
    //   config: { ... }
    // }
  ],
}; 