const axios = require('axios');

// Функция для получения курса EUR к базовой валюте (USD)
const getEurRate = (rates) => {
  if (!rates || !rates.EUR) {
    throw new Error('EUR rate not found in API response');
  }
  return rates.EUR; // Курс USD к EUR (сколько EUR за 1 USD)
};

// Функция для пересчета курса валюты к EUR
// rate: курс базовой валюты (USD) к целевой валюте (TARGET)
// eurRate: курс базовой валюты (USD) к EUR
// Результат: курс EUR к целевой валюте (TARGET)
const convertToEurRate = (rate, eurRate) => {
  if (eurRate === 0) throw new Error('EUR rate cannot be zero');
  // (USD / TARGET) / (USD / EUR) = EUR / TARGET
  return rate / eurRate;
};

module.exports = {
  /**
   * Задача для обновления курсов валют из Open Exchange Rates
   * Запускается каждый час в 00 минут.
   */
  updateRates: {
    // task: async ({ strapi }) => { // В Strapi v4/v5 используется такая сигнатура
     task: async () => { // Используем глобальный strapi объект, если сигнатура выше не работает
      const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID || '9a03abecb131499c8b20166631a59f99'; // Берем из .env или используем найденный
      const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${appId}&base=USD`;
      const margin = 0.0264; // Маржа из старого кода

      console.log('[CronTask] updateRates started...');

      try {
        // 1. Получаем курсы от OER (база USD)
        console.log(`[CronTask] Fetching rates from ${apiUrl.replace(appId, '***')}...`);
        const response = await axios.get(apiUrl);
        const ratesFromApi = response.data.rates;

        if (!ratesFromApi) {
          throw new Error('No rates received from API');
        }
        console.log('[CronTask] Rates fetched successfully.');

        // 2. Получаем курс USD/EUR
        const usdToEurRate = getEurRate(ratesFromApi); // Сколько EUR за 1 USD
        if (usdToEurRate === 0) throw new Error('USD/EUR rate is zero');
        const eurToUsdRate = 1 / usdToEurRate; // Сколько USD за 1 EUR

        // 3. Получаем существующие курсы из Strapi, где нет ручного переопределения
        const ratesToUpdate = await strapi.entityService.findMany('api::rate.rate', {
          filters: {
            manual_override: { $ne: true } // Выбираем те, где manual_override НЕ true
          },
          fields: ['id', 'base_currency', 'quote_currency'], // Получаем только нужные поля
        });
        console.log(`[CronTask] Found ${ratesToUpdate.length} rates in Strapi to potentially update.`);

        // 4. Обрабатываем каждый курс, который нужно обновить
        for (const rateEntry of ratesToUpdate) {
          const base = rateEntry.base_currency;
          const quote = rateEntry.quote_currency;

          let newRateValue;

          // Логика расчета как в старом коде (относительно EUR)
          try {
              if (base === 'EUR' && quote === 'EUR') {
                  newRateValue = 1;
              } else if (base === 'EUR') {
                  // EUR -> QUOTE
                  // Нужно: курс QUOTE к USD / курс EUR к USD
                  if (!ratesFromApi[quote]) continue; // Пропускаем, если нет курса для quote
                  const usdToQuoteRate = ratesFromApi[quote];
                  newRateValue = usdToQuoteRate / usdToEurRate; // (USD/QUOTE) / (USD/EUR) = EUR/QUOTE
              } else if (quote === 'EUR') {
                  // BASE -> EUR
                  // Нужно: курс EUR к USD / курс BASE к USD
                   if (!ratesFromApi[base]) continue; // Пропускаем, если нет курса для base
                   const usdToBaseRate = ratesFromApi[base];
                   newRateValue = usdToEurRate / usdToBaseRate; // (USD/EUR) / (USD/BASE) = BASE/EUR ... нужна инверсия? -> (1 / usdToBaseRate) / (1 / usdToEurRate) = usdToEurRate / usdToBaseRate
                   // Проверяем PHP: $rate_to_eur = $eur_rate / $rate; где $eur_rate = rates[EUR], $rate = rates[CUR] (все от USD)
                   // PHP: EUR/CUR = (USD/EUR) / (USD/CUR) - Да, логика верна.
                   newRateValue = usdToEurRate / usdToBaseRate;
              } else {
                 // BASE -> QUOTE (кросс через EUR)
                 // BASE -> EUR -> QUOTE
                 if (!ratesFromApi[base] || !ratesFromApi[quote]) continue; // Пропускаем
                 const usdToBaseRate = ratesFromApi[base];
                 const usdToQuoteRate = ratesFromApi[quote];
                 const baseToEur = usdToEurRate / usdToBaseRate; // Курс BASE к EUR
                 const eurToQuote = usdToQuoteRate / usdToEurRate; // Курс EUR к QUOTE
                 // Нам нужен курс BASE к QUOTE
                 // (USD/QUOTE) / (USD/BASE) = BASE/QUOTE
                 newRateValue = usdToQuoteRate / usdToBaseRate;
              }
              
               // Применяем округление если значение число
               if (typeof newRateValue === 'number' && !isNaN(newRateValue)) {
                   // Мы не будем применять маржу тут, так как храним "чистый" курс
                   // Маржу будет применять фронтенд при отображении Buy/Sell
                   newRateValue = parseFloat(newRateValue.toFixed(6)); // Округляем до 6 знаков

                    // Обновляем запись в Strapi
                    await strapi.entityService.update('api::rate.rate', rateEntry.id, {
                        data: {
                            rate_value: newRateValue,
                        },
                    });
                    console.log(`[CronTask] Updated rate for ${base}/${quote} to ${newRateValue}`);
               } else {
                    console.warn(`[CronTask] Could not calculate rate for ${base}/${quote}`);
               }

          } catch(calcError){
              console.error(`[CronTask] Error calculating rate for ${base}/${quote}:`, calcError.message);
          }
        }

         // 5. Можно добавить логику для создания НОВЫХ пар, если их нет в Strapi, но есть в API OER
         // (пропустить пока для простоты)

        console.log('[CronTask] updateRates finished successfully.');

      } catch (error) {
        console.error('[CronTask] Error in updateRates task:', error.response ? error.response.data : error.message);
      }
    },
    options: {
      // rule: '*/5 * * * *', // Каждые 5 минут (для теста)
      rule: '0 * * * *', // Каждый час в 00 минут
      tz: 'Europe/Madrid', // Укажи свою таймзону
    },
  },
}; 