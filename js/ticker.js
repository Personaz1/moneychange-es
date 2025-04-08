// Файл для инициализации тикера валют
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация тикера валют
    initCurrencyTicker();
});

// Инициализация тикера валют
function initCurrencyTicker() {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;

    // Дублируем контент для бесконечной анимации
    tickerContent.innerHTML += tickerContent.innerHTML;
} 