import { auth } from './auth.js';
import api from '../api.js';

class Dashboard {
    constructor() {
        this.chartsInitialized = false;
        this.setupEventListeners();
        this.initializeCharts();
        this.loadDashboardData();
    }

    setupEventListeners() {
        const periodButtons = document.querySelectorAll('.period-btn');
        if (periodButtons) {
            periodButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    periodButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.updateChartPeriod(btn.dataset.period);
                });
            });
        }
        
        // Кнопка обновления данных
        const updateRatesBtn = document.getElementById('updateRatesBtn');
        if (updateRatesBtn) {
            updateRatesBtn.addEventListener('click', () => {
                this.updateRatesChart();
            });
        }
    }

    async loadDashboardData() {
        try {
            console.log('Загрузка данных для дашборда...');
            
            // В реальном проекте здесь был бы запрос к API
            // Используем демо-данные вместо реального API
            setTimeout(() => {
                this.displayStats({
                    totalUsers: 1456,
                    activeSessions: 284,
                    todayExchanges: 97,
                    totalVolume: '€68.9K',
                    usersTrend: 8.4,
                    sessionsTrend: 12.6,
                    exchangesTrend: -2.1,
                    volumeTrend: 9.5
                });
                
                this.displayPopularPairs([
                    { pair: 'EUR/USD', rate: 1.0924, change: 0.15 },
                    { pair: 'EUR/GBP', rate: 0.8528, change: -0.08 },
                    { pair: 'EUR/CHF', rate: 0.9752, change: 0.23 },
                    { pair: 'EUR/AUD', rate: 1.6375, change: 0.56 },
                    { pair: 'EUR/CAD', rate: 1.4821, change: -0.12 }
                ]);
                
                console.log('Демо-данные загружены успешно');
            }, 500);
        } catch (error) {
            console.error('Ошибка загрузки данных для дашборда:', error);
            window.showToast('Ошибка загрузки данных панели управления', 'error');
        }
    }

    displayStats(stats) {
        // Обновляем значения на карточках статистики
        const statsMap = {
            'totalUsers': { value: stats.totalUsers, trend: stats.usersTrend },
            'activeSessions': { value: stats.activeSessions, trend: stats.sessionsTrend },
            'todayExchanges': { value: stats.todayExchanges, trend: stats.exchangesTrend },
            'totalVolume': { value: stats.totalVolume, trend: stats.volumeTrend }
        };
        
        // Обновляем каждую карточку
        Object.keys(statsMap).forEach(key => {
            const card = document.getElementById(key);
            if (!card) return;
            
            const valueEl = card.querySelector('.stat-value');
            const trendEl = card.querySelector('.stat-trend');
            
            if (valueEl) valueEl.textContent = statsMap[key].value;
            
            if (trendEl) {
                const trend = statsMap[key].trend;
                const isUp = trend >= 0;
                trendEl.innerHTML = `
                    <i class="fas fa-arrow-${isUp ? 'up' : 'down'}"></i> 
                    ${Math.abs(trend).toFixed(1)}%
                `;
                trendEl.className = `stat-trend ${isUp ? 'up' : 'down'}`;
            }
        });
    }

    displayPopularPairs(pairs) {
        const table = document.getElementById('popularPairsTable');
        if (!table) return;
        
        const rows = pairs.map(pair => {
            const isPositive = pair.change >= 0;
            return `
                <tr>
                    <td>${pair.pair}</td>
                    <td>${pair.rate.toFixed(4)}</td>
                    <td class="text-${isPositive ? 'success' : 'danger'}">
                        ${isPositive ? '+' : ''}${pair.change.toFixed(2)}%
                    </td>
                </tr>
            `;
        }).join('');
        
        table.innerHTML = rows;
    }

    updateRatesChart() {
        const btn = document.getElementById('updateRatesBtn');
        
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Обновление...';
            btn.disabled = true;
            
            // Имитируем запрос к API (задержка)
            setTimeout(() => {
                if (this.chartsInitialized) {
                    // Имитируем обновление данных
                    const data = this.getChartData(document.querySelector('.period-btn.active')?.dataset.period || 'day');
                    
                    // Добавляем небольшие случайные отклонения для демонстрации динамики
                    data.eurusd = data.eurusd.map(val => val * (1 + (Math.random() * 0.002 - 0.001)));
                    data.eurgbp = data.eurgbp.map(val => val * (1 + (Math.random() * 0.002 - 0.001)));
                    
                    this.chart.updateSeries([
                        { name: 'EUR/USD', data: data.eurusd },
                        { name: 'EUR/GBP', data: data.eurgbp }
                    ]);
                    
                    window.showToast('Данные успешно обновлены', 'success');
                }
                
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        }
    }

    initializeCharts() {
        if (typeof ApexCharts === 'undefined') {
            console.warn('ApexCharts не загружен');
            return;
        }
        
        const chartEl = document.getElementById('exchangeRatesChart');
        if (!chartEl) return;
        
        // Демо-данные для графика
        const data = this.getChartData();
        
        const options = {
            series: [{
                name: 'EUR/USD',
                data: data.eurusd
            }, {
                name: 'EUR/GBP',
                data: data.eurgbp
            }],
            chart: {
                type: 'line',
                height: 350,
                fontFamily: 'Inter, sans-serif',
                toolbar: {
                    show: false
                },
                background: 'transparent'
            },
            colors: ['#2563eb', '#64748b'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2.5
            },
            grid: {
                borderColor: '#e2e8f0',
                strokeDashArray: 4,
                xaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            markers: {
                size: 4,
                strokeWidth: 0,
                hover: {
                    size: 6
                }
            },
            xaxis: {
                categories: data.dates,
                labels: {
                    style: {
                        colors: '#64748b',
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif'
                    }
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#64748b',
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif'
                    },
                    formatter: function(val) {
                        return val.toFixed(4);
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return val.toFixed(4);
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                offsetY: -15,
                labels: {
                    colors: '#334155'
                }
            },
            responsive: [{
                breakpoint: 600,
                options: {
                    chart: {
                        height: 240
                    },
                    legend: {
                        show: false
                    }
                }
            }]
        };
        
        if (document.body.classList.contains('dark')) {
            options.chart.foreColor = '#94a3b8';
            options.grid.borderColor = '#1e293b';
            options.xaxis.labels.style.colors = '#94a3b8';
            options.yaxis.labels.style.colors = '#94a3b8';
            options.legend.labels.colors = '#f1f5f9';
        }
        
        this.chart = new ApexCharts(chartEl, options);
        this.chart.render();
        this.chartsInitialized = true;
        
        // Обработчик изменения темы
        document.addEventListener('theme-changed', () => {
            if (!this.chartsInitialized) return;
            
            const isDark = document.body.classList.contains('dark');
            this.chart.updateOptions({
                chart: {
                    foreColor: isDark ? '#94a3b8' : '#334155'
                },
                grid: {
                    borderColor: isDark ? '#1e293b' : '#e2e8f0'
                },
                xaxis: {
                    labels: {
                        style: {
                            colors: isDark ? '#94a3b8' : '#64748b'
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: isDark ? '#94a3b8' : '#64748b'
                        }
                    }
                },
                legend: {
                    labels: {
                        colors: isDark ? '#f1f5f9' : '#334155'
                    }
                }
            });
        });
    }

    updateChartPeriod(period) {
        if (!this.chartsInitialized) return;
        
        const data = this.getChartData(period);
        this.chart.updateSeries([{
            name: 'EUR/USD',
            data: data.eurusd
        }, {
            name: 'EUR/GBP',
            data: data.eurgbp
        }]);
        
        this.chart.updateOptions({
            xaxis: {
                categories: data.dates
            }
        });
    }

    getChartData(period = 'day') {
        // Демо-данные
        switch (period) {
            case 'day':
                return {
                    dates: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
                    eurusd: [1.0892, 1.0901, 1.0895, 1.0912, 1.0924, 1.0935, 1.0928, 1.0915, 1.0924],
                    eurgbp: [0.8512, 0.8525, 0.8531, 0.8522, 0.8518, 0.8515, 0.8525, 0.8532, 0.8528]
                };
            case 'week':
                return {
                    dates: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                    eurusd: [1.0856, 1.0882, 1.0915, 1.0932, 1.0901, 1.0918, 1.0924],
                    eurgbp: [0.8498, 0.8512, 0.8525, 0.8517, 0.8522, 0.8531, 0.8528]
                };
            case 'month':
                return {
                    dates: ['01', '05', '10', '15', '20', '25', '30'],
                    eurusd: [1.0825, 1.0856, 1.0892, 1.0915, 1.0878, 1.0901, 1.0924],
                    eurgbp: [0.8476, 0.8498, 0.8512, 0.8531, 0.8517, 0.8522, 0.8528]
                };
            default:
                return this.getChartData('day');
        }
    }
}

// Инициализация дашборда при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
}); 