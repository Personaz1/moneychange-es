class ExchangeRatesDisplay {
    constructor() {
        // Ищем таблицы на всех страницах по единому ID
        this.ratesTables = document.querySelectorAll('#mainPageRatesTable');
        
        this.lastUpdatedElements = document.querySelectorAll('.last-updated');
        this.tickerContent = document.getElementById('ticker-content');
        
        // Добавляем все поддерживаемые валюты
        this.currencyToCountry = {
            'USD': 'us',
            'CAD': 'ca',
            'NOK': 'no',
            'SEK': 'se',
            'DKK': 'dk',
            'GBP': 'gb',
            'CHF': 'ch'
        };
        
        // Источник данных - Strapi Rates
        this.strapiRatesUrl = 'http://localhost:1337/api/rates';

        // Фиксированная маржа
        this.commission = 0.026; // 2.6%
        console.warn(`Using hardcoded commission: ${this.commission * 100}%`);

        this.loadRates();
        setInterval(() => this.loadRates(), 5 * 60 * 1000);
    }

    async loadRates() {
        console.log("Attempting to load rates from Strapi /api/rates...");
        try {
            const response = await fetch(this.strapiRatesUrl);
            if (!response.ok) {
                throw new Error(`Strapi Rates HTTP error! Status: ${response.status}`);
            }
            const rates = await response.json();
            console.log("Strapi Rates Data received:", rates);
            
            // Обновляем все таблицы по единому ID
            if (this.ratesTables && this.ratesTables.length > 0) {
                this.ratesTables.forEach(table => {
                    this.updateRatesTable(table, rates);
                });
            }
            
            // Обновляем тикер
            if (this.tickerContent) {
                this.updateTicker(rates);
            }
            
            this.updateLastUpdated(Date.now());

        } catch (error) {
            console.error('Error loading rates:', error);
            this.updateLastUpdated(null);
        }
    }

    updateRatesTable(tableBody, rates) {
        console.log("Updating rates table with data:", rates);
        
        // Обрабатываем все валюты
        for (const currency in this.currencyToCountry) {
            if (rates[currency]) {
                // Берем базовый курс из API, либо используем 1 для валют с единичным курсом
                const baseRate = rates[currency].buy || 1;
                
                // Корректно рассчитываем курсы с маржой:
                // Для USD и остальных валют с курсами близкими к 1:
                // - Курс покупки = базовый курс * (1 - маржа) -> примерно 0.97
                // - Курс продажи = базовый курс * (1 + маржа) -> примерно 1.03
                const buyRate = baseRate * (1 - this.commission);
                const sellRate = baseRate * (1 + this.commission);
                
                // Обновляем существующие ячейки
                const buyCell = tableBody.querySelector(`.rate-buy-${currency}`);
                const sellCell = tableBody.querySelector(`.rate-sell-${currency}`);
                
                if (buyCell) buyCell.textContent = buyRate.toFixed(4);
                if (sellCell) sellCell.textContent = sellRate.toFixed(4);
                
                console.log(`Updated ${currency} rates: buy=${buyRate.toFixed(4)}, sell=${sellRate.toFixed(4)}`);
            }
        }
    }

    updateTicker(rates) {
        if (!this.tickerContent) return;
        
        let tickerHtml = '';
        
        // Добавляем все валюты в тикер
        for (const currency in this.currencyToCountry) {
            if (rates[currency]) {
                const baseRate = rates[currency].buy || 1;
                const buyRate = baseRate * (1 - this.commission);
                const sellRate = baseRate * (1 + this.commission);
                tickerHtml += `<span>EUR/${currency} ${buyRate.toFixed(4)} / ${sellRate.toFixed(4)}</span> `;
            }
        }
        
        this.tickerContent.innerHTML = tickerHtml + tickerHtml; // Дублируем для непрерывности
    }

    updateLastUpdated(timestamp) {
        this.lastUpdatedElements.forEach(element => {
            if (timestamp) {
                const date = new Date(timestamp);
                element.textContent = `Last updated: ${date.toLocaleString()}`;
            } else {
                element.textContent = 'Update failed';
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ExchangeRatesDisplay();
}); 