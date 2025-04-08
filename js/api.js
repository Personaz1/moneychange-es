/**
 * API модуль для работы с курсами валют
 * Обеспечивает получение, кэширование и конвертацию валют
 */

import { config } from './config.js';

// Конфигурация для API и кэширования
const CONFIG = {
  API_URL: 'http://localhost:3000/api/exchange-rates',
  CACHE_KEY: 'exchangeRates',
  CACHE_TIMESTAMP_KEY: 'exchangeRatesTimestamp',
  CACHE_DURATION: 5 * 60 * 60 * 1000, // 5 часов в миллисекундах
  DEFAULT_BASE: 'EUR',
  // Список поддерживаемых валют
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'CHF', 'CAD', 'NOK', 'SEK', 'DKK']
};

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Получение флага для валюты
 * @param {string} currency Код валюты
 * @returns {string} Эмодзи флага
 */
function getCurrencyFlag(currency) {
  // Таблица соответствия кодов валют и флагов (эмодзи)
  const flagMap = {
    'USD': '🇺🇸',
    'EUR': '🇪🇺',
    'GBP': '🇬🇧',
    'CHF': '🇨🇭',
    'CAD': '🇨🇦',
    'NOK': '🇳🇴',
    'SEK': '🇸🇪',
    'DKK': '🇩🇰'
  };
  
  return flagMap[currency] || '🏳️';
}

/**
 * Проверка поддерживается ли валюта
 * @param {string} currency Код валюты
 * @returns {boolean} true если валюта поддерживается
 */
function isCurrencySupported(currency) {
  return CONFIG.SUPPORTED_CURRENCIES.includes(currency);
}

/**
 * Загрузка курсов из кэша
 * @returns {Promise<Object|null>} Объект с курсами или null, если кэш отсутствует
 */
async function loadFromCache() {
  return new Promise((resolve) => {
    try {
      const cachedRates = localStorage.getItem(CONFIG.CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);
      
      if (!cachedRates || !cachedTimestamp || 
        Date.now() - parseInt(cachedTimestamp, 10) > CONFIG.CACHE_DURATION) {
        resolve(null);
        return;
      }
      
      const rates = JSON.parse(cachedRates);
      console.log('Загружены курсы из кэша');
      resolve(rates);
    } catch (error) {
      console.error('Ошибка при загрузке из кэша:', error);
      resolve(null);
    }
  });
}

/**
 * Сохранение курсов в кэш
 * @param {Object} rates Объект с курсами валют
 */
function saveToCache(rates) {
  try {
    localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(CONFIG.CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log('Курсы сохранены в кэш');
  } catch (error) {
    console.error('Ошибка при сохранении в кэш:', error);
  }
}

/**
 * Получение курсов валют с сервера
 * @returns {Promise<Object>} Объект с курсами валют
 */
async function fetchRates() {
  try {
    const cachedRates = await loadFromCache();
    if (cachedRates) {
      return cachedRates;
    }
    
    const response = await fetch(CONFIG.API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.rates) {
      throw new Error('Неверный ответ API');
    }
    
    saveToCache(data.rates);
    return data.rates;
  } catch (error) {
    console.error('Ошибка при получении курсов:', error);
    return null;
  }
}

/**
 * Конвертация валюты
 * @param {number} amount Сумма для конвертации
 * @param {string} fromCurrency Исходная валюта
 * @param {string} toCurrency Целевая валюта
 * @param {string} operation 'buy' или 'sell'
 * @returns {Promise<number>} Сконвертированная сумма
 */
async function convertCurrency(amount, fromCurrency, toCurrency, operation = 'sell') {
  try {
    const rates = await fetchRates();
    if (!rates) {
      throw new Error('Курсы не доступны');
    }
    
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    // Получаем курс для пары валют
    const rate = rates[`${fromCurrency}/${toCurrency}`];
    if (!rate) {
      throw new Error('Курс не найден');
    }
    
    // Применяем курс в зависимости от операции
    return amount * (operation === 'buy' ? rate.buy : rate.sell);
  } catch (error) {
    console.error('Ошибка при конвертации:', error);
    return 0;
  }
}

/**
 * API-клиент для работы с бэкендом
 */
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || config.API_BASE_URL;
    }

    /**
     * Формирует полный URL для запроса
     * @param {string} endpoint - Конечная точка API
     * @returns {string} Полный URL для запроса
     */
    getUrl(endpoint) {
        // Проверяем, начинается ли endpoint со слеша
        if (endpoint.startsWith('/')) {
            endpoint = endpoint.substring(1);
        }
        
        // Формируем полный URL
        return `${this.baseUrl}/${endpoint}`;
    }

    /**
     * Выполняет GET-запрос к API
     * @param {string} endpoint - Конечная точка API
     * @param {Object} headers - Дополнительные заголовки запроса
     * @returns {Promise<any>} Результат запроса
     */
    async get(endpoint, headers = {}) {
        try {
            const response = await fetch(this.getUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    ...headers
                }
            });
            
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Выполняет POST-запрос к API
     * @param {string} endpoint - Конечная точка API
     * @param {Object} data - Данные для отправки
     * @param {Object} headers - Дополнительные заголовки запроса
     * @returns {Promise<any>} Результат запроса
     */
    async post(endpoint, data = {}, headers = {}) {
        try {
            const response = await fetch(this.getUrl(endpoint), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...headers
                },
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Выполняет PUT-запрос к API
     * @param {string} endpoint - Конечная точка API
     * @param {Object} data - Данные для отправки
     * @param {Object} headers - Дополнительные заголовки запроса
     * @returns {Promise<any>} Результат запроса
     */
    async put(endpoint, data = {}, headers = {}) {
        try {
            const response = await fetch(this.getUrl(endpoint), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...headers
                },
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Выполняет PATCH-запрос к API
     * @param {string} endpoint - Конечная точка API
     * @param {Object} data - Данные для отправки
     * @param {Object} headers - Дополнительные заголовки запроса
     * @returns {Promise<any>} Результат запроса
     */
    async patch(endpoint, data = {}, headers = {}) {
        try {
            const response = await fetch(this.getUrl(endpoint), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...headers
                },
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Выполняет DELETE-запрос к API
     * @param {string} endpoint - Конечная точка API
     * @param {Object} headers - Дополнительные заголовки запроса
     * @returns {Promise<any>} Результат запроса
     */
    async delete(endpoint, headers = {}) {
        try {
            const response = await fetch(this.getUrl(endpoint), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    ...headers
                }
            });
            
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Обрабатывает ответ от сервера
     * @param {Response} response - Ответ от сервера
     * @returns {Promise<any>} Обработанный результат запроса
     */
    async handleResponse(response) {
        if (!response.ok) {
            // Если ответ не OK, пытаемся получить детали ошибки
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                // Если не можем распарсить JSON, используем статус-текст
                errorData = { message: response.statusText };
            }
            
            // Создаем объект ошибки с дополнительной информацией
            const error = new Error(errorData.message || 'Произошла ошибка при выполнении запроса');
            error.status = response.status;
            error.data = errorData;
            throw error;
        }
        
        // Пытаемся распарсить тело как JSON
        // Для пустых ответов (например, 204 No Content) возвращаем null
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }
        
        return await response.json();
    }

    /**
     * Обрабатывает ошибки запросов
     * @param {Error} error - Ошибка запроса
     */
    handleError(error) {
        // Логируем ошибку
        console.error('API request failed:', error);
        
        // Проверяем тип ошибки (сетевая, серверная и т.д.)
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            // Сетевая ошибка (нет соединения, CORS и т.д.)
            error.message = 'Не удалось установить соединение с сервером. Проверьте ваше интернет-соединение.';
        }
        
        // Пробрасываем ошибку дальше для обработки вызывающим кодом
        throw error;
    }
}

// Экспортируем экземпляр API-клиента
export const api = new ApiClient();

// Экспортируем вспомогательные функции
export {
    fetchRates,
    convertCurrency,
    getCurrencyFlag,
    isCurrencySupported,
    CONFIG
}; 