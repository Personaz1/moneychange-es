class CurrencyCalculator {
    constructor() {
        // Инициализация элементов интерфейса
        this.amount = document.getElementById('amount');
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toCurrency = document.getElementById('toCurrency');
        this.resultAmountFrom = document.getElementById('result-amount-from');
        this.resultAmountTo = document.getElementById('result-amount-to');
        this.resultCurrencyFrom = document.getElementById('result-currency-from');
        this.resultCurrencyTo = document.getElementById('result-currency-to');
        this.rateInfo = document.getElementById('rateInfo');
        this.switchButton = document.getElementById('switchCurrencies');
        this.copyButton = document.querySelector('.copy-btn');

        // Комиссия в процентах
        this.commission = 0.026; // 2.6%
        console.warn(`Using hardcoded commission: ${this.commission * 100}%`);
        
        // URL API такой же как в exchange-rates.js
        this.strapiRatesUrl = 'http://localhost:1337/api/rates';
        
        // Хранилище для курсов валют
        this.rates = {};

        // Поддерживаемые валюты (как в exchange-rates.js)
        this.currencyToCountry = {
            'USD': 'us',
            'CAD': 'ca',
            'NOK': 'no',
            'SEK': 'se',
            'DKK': 'dk',
            'GBP': 'gb',
            'CHF': 'ch'
        };

        // Привязываем обработчики событий
        this.amount?.addEventListener('input', () => this.calculate());
        this.fromCurrency?.addEventListener('change', () => this.calculate());
        this.toCurrency?.addEventListener('change', () => this.calculate());
        
        if (this.switchButton) {
            this.switchButton.addEventListener('click', () => this.switchCurrencies());
        }
        if (this.copyButton) {
            this.copyButton.addEventListener('click', () => this.copyResult());
        }

        // Загружаем курсы и запускаем автообновление
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
            
            // Обрабатываем все валюты
            for (const currency in this.currencyToCountry) {
                if (rates[currency]) {
                    // Берем базовый курс из API, либо используем 1 для валют с единичным курсом
                    const baseRate = rates[currency].buy || 1;
                    
                    // Корректно рассчитываем курсы с маржой
                    const buyRate = baseRate * (1 - this.commission);
                    const sellRate = baseRate * (1 + this.commission);
                    
                    this.rates[currency] = {
                        buy: buyRate,
                        sell: sellRate
                    };
                    
                    console.log(`Updated ${currency} rates: buy=${buyRate.toFixed(4)}, sell=${sellRate.toFixed(4)}`);
                }
            }

            // Обновляем расчет
            this.calculate();
        } catch (error) {
            console.error('Error loading rates:', error);
            this.showError('Не удалось загрузить курсы валют');
        }
    }

    calculate() {
        if (!this.rates || Object.keys(this.rates).length === 0) {
            this.showError('Загрузка курсов валют...');
            return;
        }

        const amount = parseFloat(this.amount?.value) || 0;
        const fromCurrency = this.fromCurrency?.value;
        const toCurrency = this.toCurrency?.value;

        if (!amount || !fromCurrency || !toCurrency) {
            this.resetDisplay();
            return;
        }

        try {
            let finalAmount, rate;

            // Если валюты одинаковые
            if (fromCurrency === toCurrency) {
                finalAmount = amount;
                rate = 1;
            }
            // Если конвертируем из EUR
            else if (fromCurrency === 'EUR') {
                rate = this.rates[toCurrency]?.sell || 0;
                finalAmount = amount * rate;
            }
            // Если конвертируем в EUR
            else if (toCurrency === 'EUR') {
                rate = this.rates[fromCurrency]?.buy || 0;
                finalAmount = amount * rate;
            }
            // Конвертация через EUR
            else {
                const toEurRate = this.rates[fromCurrency]?.buy || 0;
                const fromEurRate = this.rates[toCurrency]?.sell || 0;
                rate = fromEurRate / toEurRate;
                finalAmount = amount * rate;
            }

            // Обновляем отображение
            this.updateDisplay(amount, finalAmount, fromCurrency, toCurrency, rate);
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('Ошибка при расчете курса');
        }
    }

    updateDisplay(amount, finalAmount, fromCurrency, toCurrency, rate) {
        // Обновляем суммы
        this.resultAmountFrom.textContent = amount.toFixed(2);
        this.resultAmountTo.textContent = finalAmount.toFixed(2);

        // Обновляем валюты с флагами
        this.resultCurrencyFrom.textContent = this.getCurrencyWithFlag(fromCurrency);
        this.resultCurrencyTo.textContent = this.getCurrencyWithFlag(toCurrency);

        // Обновляем информацию о курсе
        if (this.rateInfo) {
            const commissionText = fromCurrency === toCurrency ? '' :
                                 (fromCurrency === 'EUR' || toCurrency === 'EUR') ? 
                                 ` (комиссия ${(this.commission * 100).toFixed(1)}%)` :
                                 ` (двойная комиссия ${(this.commission * 200).toFixed(1)}%)`;
            
            this.rateInfo.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}${commissionText}`;
        }

        // Добавляем анимацию
        this.resultAmountTo.classList.add('highlight');
        setTimeout(() => this.resultAmountTo.classList.remove('highlight'), 300);
    }

    switchCurrencies() {
        const fromValue = this.fromCurrency.value;
        const toValue = this.toCurrency.value;
        
        this.fromCurrency.value = toValue;
        this.toCurrency.value = fromValue;
        
        this.calculate();

        if (this.switchButton) {
            this.switchButton.classList.add('rotate');
            setTimeout(() => this.switchButton.classList.remove('rotate'), 300);
        }
    }

    copyResult() {
        const textToCopy = `${this.resultAmountFrom.textContent} ${this.fromCurrency.value} = ${this.resultAmountTo.textContent} ${this.toCurrency.value}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.copyButton.classList.add('copied');
            setTimeout(() => this.copyButton.classList.remove('copied'), 1000);
        });
    }

    getCurrencyWithFlag(currency) {
        const flags = {
            'EUR': '🇪🇺',
            'USD': '🇺🇸',
            'GBP': '🇬🇧',
            'CHF': '🇨🇭',
            'NOK': '🇳🇴',
            'SEK': '🇸🇪',
            'DKK': '🇩🇰',
            'CAD': '🇨🇦'
        };
        return `${flags[currency] || ''} ${currency}`;
    }

    showError(message) {
        if (this.rateInfo) {
            this.rateInfo.textContent = message;
            this.rateInfo.classList.add('error');
        }
    }

    resetDisplay() {
        this.resultAmountFrom.textContent = '0.00';
        this.resultAmountTo.textContent = '0.00';
        if (this.rateInfo) {
            this.rateInfo.textContent = 'Введите сумму для конвертации';
        }
    }
}

// Инициализация калькулятора при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyCalculator();
}); 