/**
 * Конфигурация приложения
 */
export const config = {
  // Базовый URL для API
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Конфигурация для аутентификации
  AUTH: {
    TOKEN_KEY: 'moneychange_auth',
    REFRESH_INTERVAL: 30 * 60 * 1000, // 30 минут
    LOGIN_URL: '/auth/login',
    LOGOUT_URL: '/auth/logout'
  },
  
  // Настройки локализации
  LOCALE: {
    DEFAULT: 'en',
    SUPPORTED: ['en', 'es', 'ru']
  },
  
  // Настройки курсов валют
  EXCHANGE_RATES: {
    UPDATE_INTERVAL: 60 * 60 * 1000, // 1 час
    DEFAULT_BASE: 'EUR',
    SUPPORTED_CURRENCIES: [
      'USD', 'EUR', 'GBP', 'CHF', 'CAD', 'NOK', 'SEK', 'DKK'
    ],
    URL: '/exchange-rates'
  },
  
  // Настройки для API курсов валют
  EXCHANGE_API: {
    BASE_URL: 'https://api.exchangerate.host',
    KEY: 'demo-key',
    TIMEOUT: 10000,
    DISABLE_MOCK: false
  },
  
  // Настройки темы
  THEME_STORAGE_KEY: 'theme',
  DEFAULT_THEME: 'dark',
  CURRENCY_UPDATE_INTERVAL: 300000, // 5 минут
  RATE_CACHE_DURATION: 18000000, // 5 часов
}; 