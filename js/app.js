// Основной файл приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initCurrencyTicker();
    // initStocksTicker(); // Отключаем инициализацию тикера акций
    initLanguageSwitcher();
    initContactForm();
});

// Инициализация тикера валют
function initCurrencyTicker() {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;

    // Дублируем контент для бесконечной анимации
    tickerContent.innerHTML += tickerContent.innerHTML;
}

// Инициализация тикера акций (отключен)
function initStocksTicker() {
    // Функция отключена, так как тикер акций больше не используется
    return;
    
    // Старый код:
    // const stocksContent = document.querySelector('.stocks-content');
    // if (!stocksContent) return;
    // 
    // // Дублируем контент для бесконечной анимации
    // stocksContent.innerHTML += stocksContent.innerHTML;
}

// Инициализация переключателя языков
function initLanguageSwitcher() {
    const langFlags = document.querySelectorAll('.lang-flag');
    langFlags.forEach(flag => {
        flag.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// Переключение языка
function switchLanguage(lang) {
    // Сохраняем выбранный язык
    localStorage.setItem('selectedLanguage', lang);
    
    // Обновляем активный класс
    document.querySelectorAll('.lang-flag').forEach(flag => {
        flag.classList.remove('active');
        if (flag.getAttribute('data-lang') === lang) {
            flag.classList.add('active');
        }
    });
    
    // Здесь будет логика перевода
    console.log('Switching language to:', lang);
}

// Инициализация формы контактов
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Здесь будет логика отправки формы
        console.log('Form submitted');
        
        // Очищаем форму
        this.reset();
        
        // Показываем сообщение об успехе
        alert('Thank you for your message. We will contact you soon!');
    });
} 