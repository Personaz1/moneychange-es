/**
 * Translations for MoneyChange website
 */

// Проверяем, объявлена ли переменная, и объявляем через var, если нет
if (typeof translations === 'undefined') {
  var translations = {
    // English translations
    'en': {
      // General
      'language': 'Language',
      'english': 'English',
      'spanish': 'Spanish',
      
      // Header
      'contact_us': 'CONTACT US',
      'home': 'Home',
      'prices': 'Prices',
      'contact': 'Contact',
      
      // Currency Exchange
      'exchange': 'EXCHANGE',
      'low_commission': 'Low commission',
      'with_the_best': 'with the best',
      'service': 'service',
      'faster_safer': 'The Faster & Safer Money Exchange in Torrevieja (Alicante)',
      
      // Rates
      'up_to_date_rates': 'Up-to-date Rates',
      'currency': 'CURRENCY',
      'we_buy': 'WE BUY (EUR)',
      'we_sell': 'WE SELL (EUR)',
      'last_updated': 'Last updated:',
      
      // Calculator
      'currency_calculator': 'Currency Calculator',
      'amount': 'Amount',
      'from': 'You Give',
      'to': 'You Get',
      'calculate': 'Calculate',
      
      // Visit
      'visit_us': 'VISIT US',
      'exchange_points': 'Exchange Points',
      'opening_hours': 'Opening Hours',
      'monday_friday': 'Monday - Friday',
      'saturday': 'Saturday',
      'sunday': 'Sunday',
      'closed': 'Closed',
      
      // Footer
      'all_rights_reserved': 'All rights reserved',
      'privacy_policy': 'Privacy Policy',
      'terms_of_service': 'Terms of Service',
      
      // Client reviews section
      'client_reviews': 'Client Reviews',
      'what_clients_say': 'See what our clients say about us',
      'john_review': 'Best exchange rates in town! The staff speaks multiple languages which is very convenient. Highly recommended!',
      'anne_review': 'I exchange all my money here whenever I visit Torrevieja. Great rates and friendly service!',
      'michael_review': 'Reliable exchange point with competitive rates. Fast service and professional staff. The only downside is occasional queues during peak hours.',
      'oliver_review': 'Trustworthy exchange point with honest rates. The staff is always helpful and will provide consultation if needed.',
      
      // Table headers
      'currency_column': 'Currency',
      'buy_column': 'Buy',
      'sell_column': 'Sell',
      
      // Currency names
      'usd_full': 'US Dollar',
      'gbp_full': 'British Pound',
      'eur_full': 'Euro',
      'chf_full': 'Swiss Franc',
      'nok_full': 'Norwegian Krone',
      'sek_full': 'Swedish Krona',
      'dkk_full': 'Danish Krone',
      'pln_full': 'Polish Złoty',
      'czk_full': 'Czech Koruna',
      
      // Addresses
      'address_1': 'C. Concepción, 5',
      'address_1_details': 'next to Chocolatería Valor',
      'address_2': 'C. Apolo 80, A',
      'address_2_details': 'inside tobacco shop',
      'city': 'Torrevieja (Alicante)',
      
      // Meta information
      'meta_title': 'MoneyChange - Currency Exchange in Torrevieja',
      'meta_description': 'Best currency exchange rates in Torrevieja. Exchange EUR, USD, GBP and other currencies with no commission. Fast and safe money exchange service.',
      'meta_keywords': 'currency exchange, money exchange, forex, Torrevieja, euros, dollars, pounds',
      
      // Error messages
      'api_error': 'Failed to connect to the server',
      'connection_error': 'Connection error. Please check your internet connection.',
      'validation_error': 'Please check the entered amount',
      
      // Success messages
      'rate_updated': 'Exchange rates updated successfully',
      'calculation_success': 'Calculation completed successfully',
      
      // Mobile specific
      'menu_toggle': 'Toggle menu',
      'show_rates': 'Show all rates',
      'hide_rates': 'Hide rates',
      
      // Accessibility
      'currency_flag': 'Flag of {country}',
      'exchange_rate_info': 'Exchange rate for {currency}',
      'navigation_menu': 'Main navigation menu',
      'skip_to_content': 'Skip to main content',
      
      // New sections from old site
      'need_a_deal': 'NEED A DEAL?',
      'remember_bring': 'Remember to bring with you',
      'id_passport': 'Personal ID / Passport',
      'money_cash': 'Money',
      'satisfied_clients': 'Satisfied Clients',
      'our_team': 'OUR TEAM',
      'most_qualified': 'The most qualified staff',
      
      // New error messages
      'error_404': 'The requested resource was not found',
      'error_unexpected': 'An unexpected error occurred',
      'error_async': 'Failed to complete the operation',
      'error_unknown': 'An unknown error occurred',
      
      // New footer sections
      'about_us': 'About Us',
      'about_description': 'MoneyChange - your reliable currency exchange partner in Spain.',
      'quick_links': 'Quick Links',
      'social_media': 'Social Media',
      'copyright': '© 2024 MoneyChange. All rights reserved.',
    },
    
    // Spanish translations
    'es': {
      // General
      'language': 'Idioma',
      'english': 'Inglés',
      'spanish': 'Español',
      
      // Header
      'contact_us': 'CONTÁCTANOS',
      'home': 'Inicio',
      'prices': 'Precios',
      'contact': 'Contacto',
      
      // Currency Exchange
      'exchange': 'CAMBIO',
      'low_commission': 'Baja comisión',
      'with_the_best': 'con el mejor',
      'service': 'servicio',
      'faster_safer': 'El cambio de dinero más rápido y seguro en Torrevieja (Alicante)',
      
      // Rates
      'up_to_date_rates': 'Tasas actualizadas',
      'currency': 'MONEDA',
      'we_buy': 'COMPRAMOS (EUR)',
      'we_sell': 'VENDEMOS (EUR)',
      'last_updated': 'Última actualización:',
      
      // Calculator
      'currency_calculator': 'Calculadora de divisas',
      'amount': 'Cantidad',
      'from': 'Tú das',
      'to': 'Tú recibes',
      'calculate': 'Calcular',
      
      // Visit
      'visit_us': 'VISÍTANOS',
      'exchange_points': 'Puntos de cambio',
      'opening_hours': 'Horario de apertura',
      'monday_friday': 'Lunes - Viernes',
      'saturday': 'Sábado',
      'sunday': 'Domingo',
      'closed': 'Cerrado',
      
      // Footer
      'all_rights_reserved': 'Todos los derechos reservados',
      'privacy_policy': 'Política de Privacidad',
      'terms_of_service': 'Términos de Servicio',
      
      // Client reviews section
      'client_reviews': 'Opiniones de Clientes',
      'what_clients_say': 'Vea lo que dicen nuestros clientes sobre nosotros',
      'john_review': '¡Los mejores tipos de cambio de la ciudad! El personal habla varios idiomas, lo que es muy conveniente. ¡Altamente recomendado!',
      'anne_review': 'Cambio todo mi dinero aquí cada vez que visito Torrevieja. ¡Buenas tarifas y servicio amable!',
      'michael_review': 'Punto de cambio confiable con tarifas competitivas. Servicio rápido y personal profesional. El único inconveniente son las colas ocasionales durante las horas pico.',
      'oliver_review': 'Punto de cambio confiable con tarifas honestas. El personal siempre es útil y proporcionará asesoramiento si es necesario.',
      
      // Table headers
      'currency_column': 'Moneda',
      'buy_column': 'Compramos',
      'sell_column': 'Vendemos',
      
      // Currency names
      'usd_full': 'Dólar Estadounidense',
      'gbp_full': 'Libra Esterlina',
      'eur_full': 'Euro',
      'chf_full': 'Franco Suizo',
      'nok_full': 'Corona Noruega',
      'sek_full': 'Corona Sueca',
      'dkk_full': 'Corona Danesa',
      'pln_full': 'Złoty Polaco',
      'czk_full': 'Corona Checa',
      
      // Addresses
      'address_1': 'C. Concepción, 5',
      'address_1_details': 'junto a Chocolatería Valor',
      'address_2': 'C. Apolo 80, A',
      'address_2_details': 'dentro de tabacos',
      'city': 'Torrevieja (Alicante)',
      
      // Meta information
      'meta_title': 'MoneyChange - Casa de Cambio en Torrevieja',
      'meta_description': 'Mejores tipos de cambio en Torrevieja. Cambie EUR, USD, GBP y otras divisas sin comisión. Servicio de cambio de dinero rápido y seguro.',
      'meta_keywords': 'casa de cambio, cambio de divisas, forex, Torrevieja, euros, dólares, libras',
      
      // Error messages
      'api_error': 'No se pudo conectar al servidor',
      'connection_error': 'Error de conexión. Por favor, verifique su conexión a internet.',
      'validation_error': 'Por favor, verifique el monto ingresado',
      
      // Success messages
      'rate_updated': 'Tipos de cambio actualizados correctamente',
      'calculation_success': 'Cálculo completado correctamente',
      
      // Mobile specific
      'menu_toggle': 'Alternar menú',
      'show_rates': 'Mostrar todas las tasas',
      'hide_rates': 'Ocultar tasas',
      
      // Accessibility
      'currency_flag': 'Bandera de {country}',
      'exchange_rate_info': 'Tipo de cambio para {currency}',
      'navigation_menu': 'Menú de navegación principal',
      'skip_to_content': 'Ir al contenido principal',
      
      // New sections from old site
      'need_a_deal': '¿NECESITA UN CAMBIO?',
      'remember_bring': 'Recuerde traer con usted',
      'id_passport': 'DNI / Pasaporte',
      'money_cash': 'Dinero',
      'satisfied_clients': 'Clientes Satisfechos',
      'our_team': 'NUESTRO EQUIPO',
      'most_qualified': 'El personal más cualificado',
      
      // New error messages
      'error_404': 'No se encontró el recurso solicitado',
      'error_unexpected': 'Ocurrió un error inesperado',
      'error_async': 'No se pudo completar la operación',
      'error_unknown': 'Ocurrió un error desconocido',
      
      // New footer sections
      'about_us': 'Sobre Nosotros',
      'about_description': 'MoneyChange - su socio confiable para el cambio de divisas en España.',
      'quick_links': 'Enlaces Rápidos',
      'social_media': 'Redes Sociales',
      'copyright': '© 2024 MoneyChange. Todos los derechos reservados.',
    },
    
    // Russian translations
    'ru': {
      // General
      'language': 'Язык',
      'english': 'Английский',
      'spanish': 'Испанский',
      
      // Header
      'contact_us': 'СВЯЖИТЕСЬ С НАМИ',
      'home': 'Главная',
      'prices': 'Цены',
      'contact': 'Контакт',
      
      // Currency Exchange
      'exchange': 'ОБМЕН',
      'low_commission': 'Низкая комиссия',
      'with_the_best': 'с лучшими',
      'service': 'сервис',
      'faster_safer': 'Самый быстрый и безопасный обмен в Торревьехе (Аликанте)',
      
      // Rates
      'up_to_date_rates': 'Текущие курсы',
      'currency': 'ВАЛЮТА',
      'we_buy': 'МЫ ПОКУПАЕМ (EUR)',
      'we_sell': 'МЫ ПРОДАЕМ (EUR)',
      'last_updated': 'Последнее обновление:',
      
      // Calculator
      'currency_calculator': 'Калькулятор валют',
      'amount': 'Сумма',
      'from': 'Вы даете',
      'to': 'Вы получаете',
      'calculate': 'Рассчитать',
      
      // Visit
      'visit_us': 'ПОСЕТИТЕ НАС',
      'exchange_points': 'Пункты обмена',
      'opening_hours': 'Часы работы',
      'monday_friday': 'Понедельник - Пятница',
      'saturday': 'Суббота',
      'sunday': 'Воскресенье',
      'closed': 'Закрыто',
      
      // Footer
      'all_rights_reserved': 'Все права защищены',
      'privacy_policy': 'Политика конфиденциальности',
      'terms_of_service': 'Условия обслуживания',
      
      // Client reviews section
      'client_reviews': 'Отзывы клиентов',
      'what_clients_say': 'Узнайте, что говорят о нас наши клиенты',
      'john_review': 'Лучшие курсы обмена в городе! Персонал говорит на нескольких языках, что очень удобно. Настоятельно рекомендую!',
      'anne_review': 'Я обмениваю все свои деньги здесь, когда посещаю Торревьеху. Отличные курсы и дружелюбный сервис!',
      'michael_review': 'Надежный пункт обмена с конкурентоспособными курсами. Быстрый сервис и профессиональный персонал. Единственный недостаток - случайные очереди в часы пик.',
      'oliver_review': 'Надежный пункт обмена с честными курсами. Персонал всегда готов помочь и предоставит консультацию при необходимости.',
      
      // Table headers
      'currency_column': 'Валюта',
      'buy_column': 'Покупаем',
      'sell_column': 'Продаем',
      
      // Currency names
      'usd_full': 'Доллар США',
      'gbp_full': 'Британский Фунт',
      'eur_full': 'Евро',
      'chf_full': 'Швейцарский Франк',
      'nok_full': 'Норвежская Крона',
      'sek_full': 'Шведская Крона',
      'dkk_full': 'Датская Крона',
      'pln_full': 'Польский Злотый',
      'czk_full': 'Чешская Крона',
      
      // Addresses
      'address_1': 'C. Concepción, 5',
      'address_1_details': 'рядом с Chocolatería Valor',
      'address_2': 'C. Apolo 80, A',
      'address_2_details': 'в табачном киоске',
      'city': 'Торревьеха (Аликанте)',
      
      // Meta information
      'meta_title': 'MoneyChange - Обмен валют в Торревьехе',
      'meta_description': 'Лучшие курсы обмена валют в Торревьехе. Обмен EUR, USD, GBP и других валют без комиссии. Быстрый и надежный обмен денег.',
      'meta_keywords': 'обмен валют, обмен денег, форекс, Торревьеха, евро, доллары, фунты',
      
      // Error messages
      'api_error': 'Не удалось подключиться к серверу',
      'connection_error': 'Ошибка подключения. Пожалуйста, проверьте подключение к интернету.',
      'validation_error': 'Пожалуйста, проверьте введенную сумму',
      
      // Success messages
      'rate_updated': 'Курсы валют успешно обновлены',
      'calculation_success': 'Расчет успешно завершен',
      
      // Mobile specific
      'menu_toggle': 'Открыть/закрыть меню',
      'show_rates': 'Показать все курсы',
      'hide_rates': 'Скрыть курсы',
      
      // Accessibility
      'currency_flag': 'Флаг {country}',
      'exchange_rate_info': 'Курс обмена для {currency}',
      'navigation_menu': 'Главное меню навигации',
      'skip_to_content': 'Перейти к основному содержанию',
      
      // New sections from old site
      'need_a_deal': 'НУЖЕН ОБМЕН?',
      'remember_bring': 'Не забудьте взять с собой',
      'id_passport': 'Удостоверение личности / Паспорт',
      'money_cash': 'Деньги',
      'satisfied_clients': 'Довольных Клиентов',
      'our_team': 'НАША КОМАНДА',
      'most_qualified': 'Самый квалифицированный персонал',
      
      // New error messages
      'error_404': 'Запрашиваемый ресурс не найден',
      'error_unexpected': 'Произошла непредвиденная ошибка',
      'error_async': 'Не удалось выполнить операцию',
      'error_unknown': 'Произошла неизвестная ошибка',
      
      // New footer sections
      'about_us': 'О нас',
      'about_description': 'MoneyChange - ваш надежный партнер по обмену валюты в Испании.',
      'quick_links': 'Быстрые ссылки',
      'social_media': 'Мы в соцсетях',
      'copyright': '© 2024 MoneyChange. Все права защищены.',
    }
  }; // Закрывающая скобка для всего объекта translations
} else {
  console.warn("Variable 'translations' already declared. Skipping re-declaration.");
}

// Get translated text
function getTranslation(key, lang) {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang] && translations[currentLang][key] 
    ? translations[currentLang][key] 
    : key;
}

// Get current language
function getCurrentLanguage() {
  return localStorage.getItem('selectedLanguage') || 'en';
}

// Set current language
function setLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    updatePageTexts();
  }
}

// Update all texts on the page
function updatePageTexts() {
  const elements = document.querySelectorAll('[data-i18n]');
  const currentLang = getCurrentLanguage();
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key, currentLang);
    
    // Check if element is an input with placeholder
    if (element.placeholder !== undefined) {
      element.placeholder = translation;
    } 
    // Check if element is a button with value
    else if (element.value !== undefined && element.tagName === 'BUTTON') {
      element.value = translation;
    } 
    // For other elements, set innerHTML
    else {
      element.innerHTML = translation;
    }
  });
}

// Initialize localization
function initLocalization() {
  // Set initial language
  const lang = getCurrentLanguage();
  document.documentElement.setAttribute('lang', lang);
  
  // Setup language switcher
  const langSwitcher = document.getElementById('language-switcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
    
    // Set current language in dropdown
    langSwitcher.value = lang;
  }
  
  // Update all texts on the page
  updatePageTexts();
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTranslation,
    getCurrentLanguage,
    setLanguage,
    updatePageTexts,
    initLocalization,
    translations
  };
} else if (typeof window !== 'undefined') {
  // Expose to window object for browser usage
  window.locale = {
    getTranslation,
    getCurrentLanguage,
    setLanguage,
    updatePageTexts,
    initLocalization,
    translations
  };
  
  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', function() {
    // Import translations
    importTranslations();
    
    // Setup language flag click handlers
    setupLanguageFlags();
    
    // Initial translation based on stored preference or browser language
    applyStoredOrDefaultLanguage();
  });
}

// Dynamically load the translation files
function importTranslations() {
    const languages = ['en', 'es', 'ru'];
    
    languages.forEach(lang => {
        const script = document.createElement('script');
        script.src = `/js/locales/${lang}.js`;
        script.async = true;
        document.head.appendChild(script);
    });
}

// Apply stored language or detect browser language
function applyStoredOrDefaultLanguage() {
    const storedLang = localStorage.getItem('selectedLanguage');
    
    if (storedLang) {
        changeLanguage(storedLang);
    } else {
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        
        if (browserLang.startsWith('es')) {
            changeLanguage('es');
        } else if (browserLang.startsWith('ru')) {
            changeLanguage('ru');
        } else {
            // Default to English
            changeLanguage('en');
        }
    }
}

// Setup handlers for language flag clicks
function setupLanguageFlags() {
    document.querySelectorAll('.lang-flag').forEach(flag => {
        flag.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
}

// Change the language
function changeLanguage(lang) {
    // Store the selected language
    localStorage.setItem('selectedLanguage', lang);
    
    // Mark the active language flag
    document.querySelectorAll('.lang-flag').forEach(flag => {
        if (flag.getAttribute('data-lang') === lang) {
            flag.classList.add('active');
        } else {
            flag.classList.remove('active');
        }
    });
    
    // Apply translations
    let translations;
    
    switch (lang) {
        case 'en':
            translations = window.enTranslations || {};
            break;
        case 'es':
            translations = window.esTranslations || {};
            break;
        case 'ru':
            translations = window.ruTranslations || {};
            break;
        default:
            translations = window.enTranslations || {};
    }
    
    // Apply the translations to all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[key]) {
            // For inputs, update the placeholder or value
            if (element.tagName === 'INPUT') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translations[key];
                } else {
                    element.value = translations[key];
                }
            } else {
                element.textContent = translations[key];
            }
        }
    });
} 