/**
 * rate controller
 */

import { factories } from '@strapi/strapi'
import axios from 'axios'
import * as fs from 'fs/promises'
import * as path from 'path'

const USD_CURRENCY_FILE = path.join(__dirname, '../data/USD_CURRENCY')
const EUR_CURRENCY_FILE = path.join(__dirname, '../data/EUR_CURRENCY')
const API_KEY = process.env.EXCHANGE_RATES_API_KEY
const API_URL = 'http://api.exchangeratesapi.io/v1/latest'

// Список всех поддерживаемых валют
const SUPPORTED_CURRENCIES = ['USD', 'CAD', 'NOK', 'SEK', 'DKK', 'GBP', 'CHF']

export default factories.createCoreController('api::rate.rate', ({ strapi }) => ({
    async updateRates(ctx) {
        try {
            // Получаем текущее время
            const now = new Date()

            // Получаем маржу из глобальных настроек
            const globalSettings = await strapi.db.query('api::setting.setting').findOne()
            const margin = (globalSettings?.margin_percentage || 2.6) / 100 // Конвертируем процент в десятичную дробь

            // Сначала получаем курс USD (базовый)
            const usdResponse = await axios.get(API_URL, {
                params: {
                    access_key: API_KEY,
                    base: 'USD',
                    symbols: ['EUR', ...SUPPORTED_CURRENCIES].join(',')
                }
            })

            if (!usdResponse.data || !usdResponse.data.rates) {
                throw new Error('Invalid API response for USD rates')
            }

            // Сохраняем оригинальный ответ API в USD_CURRENCY
            const usdData = {
                timestamp: usdResponse.data.timestamp || Date.now(),
                base: 'USD',
                rates: usdResponse.data.rates
            }
            await fs.writeFile(USD_CURRENCY_FILE, JSON.stringify(usdData, null, 2))

            // Получаем базовый курс EUR/USD
            const eurUsdRate = 1 / usdResponse.data.rates.EUR // конвертируем USD/EUR в EUR/USD

            // Создаем объект для хранения всех курсов относительно EUR
            const eurRates = {
                timestamp: now.getTime(),
                base: 'EUR',
                rates: {}
            }

            // Рассчитываем курсы всех валют относительно EUR через USD
            for (const currency of SUPPORTED_CURRENCIES) {
                if (currency === 'USD') {
                    eurRates.rates[currency] = eurUsdRate
                } else {
                    // EUR/CUR = (USD/EUR) / (USD/CUR)
                    const usdToCurrencyRate = usdResponse.data.rates[currency]
                    eurRates.rates[currency] = eurUsdRate * usdToCurrencyRate
                }

                // Создаем две записи для каждой валюты - для покупки и продажи
                const baseRate = eurRates.rates[currency]
                
                const buyData = {
                    base_currency: 'EUR',
                    quote_currency: currency,
                    rate_value: baseRate * (1 - margin), // Покупаем у клиента дешевле
                    manual_override: false
                }

                const sellData = {
                    base_currency: currency,
                    quote_currency: 'EUR',
                    rate_value: 1 / (baseRate * (1 + margin)), // Продаем клиенту дороже
                    manual_override: false
                }

                // Ищем существующие записи
                const existingBuyRate = await strapi.db.query('api::rate.rate').findOne({
                    where: {
                        base_currency: 'EUR',
                        quote_currency: currency
                    }
                })

                const existingSellRate = await strapi.db.query('api::rate.rate').findOne({
                    where: {
                        base_currency: currency,
                        quote_currency: 'EUR'
                    }
                })

                // Обновляем или создаем записи, только если нет ручного переопределения
                if (existingBuyRate && !existingBuyRate.manual_override) {
                    await strapi.db.query('api::rate.rate').update({
                        where: { id: existingBuyRate.id },
                        data: buyData
                    })
                } else if (!existingBuyRate) {
                    await strapi.db.query('api::rate.rate').create({
                        data: buyData
                    })
                }

                if (existingSellRate && !existingSellRate.manual_override) {
                    await strapi.db.query('api::rate.rate').update({
                        where: { id: existingSellRate.id },
                        data: sellData
                    })
                } else if (!existingSellRate) {
                    await strapi.db.query('api::rate.rate').create({
                        data: sellData
                    })
                }
            }

            // Сохраняем рассчитанные курсы в EUR_CURRENCY
            await fs.writeFile(EUR_CURRENCY_FILE, JSON.stringify(eurRates, null, 2))

            return ctx.send({
                message: 'Rates updated successfully',
                timestamp: now,
                margin_percentage: globalSettings?.margin_percentage || 2.6,
                usdRates: usdData.rates,
                eurRates: eurRates.rates
            })
        } catch (error) {
            console.error('Error updating rates:', error)
            return ctx.throw(500, 'Failed to update rates')
        }
    },

    async find(ctx) {
        try {
            // Получаем все курсы
            const rates = await strapi.db.query('api::rate.rate').findMany()
            
            // Форматируем ответ
            const formattedRates = rates.reduce((acc, rate) => {
                if (rate.base_currency === 'EUR') {
                    acc[rate.quote_currency] = {
                        buy: rate.rate_value
                    }
                } else if (rate.quote_currency === 'EUR') {
                    if (!acc[rate.base_currency]) {
                        acc[rate.base_currency] = {}
                    }
                    acc[rate.base_currency].sell = 1 / rate.rate_value
                }
                return acc
            }, {})

            return ctx.send(formattedRates)
        } catch (error) {
            console.error('Error in find method:', error)
            return ctx.throw(500, 'Failed to fetch rates')
        }
    },

    async toggleManualOverride(ctx) {
        try {
            const { id } = ctx.params
            const { manual_override } = ctx.request.body

            const rate = await strapi.db.query('api::rate.rate').findOne({
                where: { id }
            })

            if (!rate) {
                return ctx.notFound('Rate not found')
            }

            await strapi.db.query('api::rate.rate').update({
                where: { id },
                data: { manual_override }
            })

            return ctx.send({
                message: 'Manual override setting updated successfully',
                manual_override
            })
        } catch (error) {
            console.error('Error toggling manual override:', error)
            return ctx.throw(500, 'Failed to update settings')
        }
    }
}))
