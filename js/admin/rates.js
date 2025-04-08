import { config } from '../config.js';

class RatesManager {
    constructor() {
        this.ratesTableBody = document.getElementById('adminExchangeRatesTable');
        this.refreshButton = document.getElementById('refreshRatesFromApiBtn');
        this.lastUpdatedElement = document.getElementById('ratesLastUpdated');
        this.apiEndpoint = '/api/rates.php';
        this.currencyToCountry = {
            'USD': 'us',
            'CAD': 'ca',
            'NOK': 'no',
            'SEK': 'se',
            'DKK': 'dk',
            'GBP': 'gb',
            'CHF': 'ch'
        };
        
        this.setupEventListeners();
        this.loadRates();
    }

    setupEventListeners() {
        if (this.refreshButton) {
            this.refreshButton.addEventListener('click', () => this.loadRates(true));
        }
    }

    async loadRates(forceRefresh = false) {
        if (!this.ratesTableBody) return;
        this.ratesTableBody.innerHTML = '<tr><td colspan="3" class="text-center">Загрузка данных...</td></tr>';
        
        const url = forceRefresh ? `${this.apiEndpoint}?refresh=1` : this.apiEndpoint;
        
        try {
            const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            const data = await response.json();
            
            if (!data.success || !data.rates) {
                throw new Error('Invalid rates data received');
            }

            this.displayRates(data.rates);
            this.updateLastUpdated(data.timestamp);

            if (forceRefresh) {
                this.showSuccess('Курсы успешно обновлены из API.');
            }

        } catch (error) {
            console.error('Error loading rates:', error);
            this.showError('Не удалось загрузить курсы валют. ' + error.message);
            this.ratesTableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Ошибка загрузки курсов</td></tr>`;
            this.updateLastUpdated(null);
        }
    }

    displayRates(rates) {
        const currencyOrder = ['USD', 'CAD', 'NOK', 'SEK', 'DKK', 'GBP', 'CHF'];
        let html = '';

        currencyOrder.forEach(currency => {
            const rate = rates[`EUR/${currency}`];
            if (rate) {
                const countryCode = this.currencyToCountry[currency];
                const flagSrc = `/images/flags/${countryCode}.svg`;
                
                html += `
                    <tr>
                        <td>
                            <img src="${flagSrc}"
                                 alt="${currency}"
                                 class="currency-flag"
                                 onerror="this.style.display='none'; console.error('Failed to load flag:', this.src)">
                            ${currency}
                    </td>
                        <td>${rate.buy.toFixed(4)}</td>
                        <td>${rate.sell.toFixed(4)}</td>
                </tr>
            `;
            } else {
                 html += `
                    <tr>
                        <td>${currency}</td>
                        <td colspan="2" class="text-muted">Нет данных</td>
                    </tr>
                `;
            }
        });

        this.ratesTableBody.innerHTML = html || '<tr><td colspan="3" class="text-center">Нет доступных курсов</td></tr>';
    }
    
    updateLastUpdated(timestamp) {
        if (this.lastUpdatedElement) {
            if (timestamp) {
                const date = new Date(timestamp * 1000);
                 this.lastUpdatedElement.textContent = `Последнее обновление: ${date.toLocaleString()}`;
            } else {
                this.lastUpdatedElement.textContent = 'Последнее обновление: Неизвестно';
            }
        }
    }

    showError(message) {
        window.showToast(message, 'danger');
    }

    showSuccess(message) {
        window.showToast(message, 'success');
    }
}

// Экспортируем класс для использования в admin.js
export { RatesManager }; 