// Блокировка всех редиректов
console.log("АКТИВИРОВАНА БЛОКИРОВКА ПЕРЕНАПРАВЛЕНИЙ");

// Сохраняем оригинальные методы
const originalAssign = window.location.assign;
const originalReplace = window.location.replace;
const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href');

// Функция для определения, нужно ли блокировать URL
function shouldBlockUrl(url) {
    if (typeof url !== 'string') return false;
    
    return url.includes('login.html') || 
           url.includes('/login') || 
           url.includes('login.php');
}

// Перехватываем window.location.href
Object.defineProperty(window.location, 'href', {
    set: function(url) {
        console.log('[ЗАЩИТА] Попытка перенаправления на:', url);
        
        if (shouldBlockUrl(url)) {
            console.warn('[ЗАЩИТА] Перенаправление на логин ЗАБЛОКИРОВАНО');
            return;
        }
        
        return originalHref.set.call(this, url);
    },
    get: function() {
        return originalHref.get.call(this);
    }
});

// Перехватываем window.location.assign
window.location.assign = function(url) {
    console.log('[ЗАЩИТА] Попытка перенаправления через assign на:', url);
    
    if (shouldBlockUrl(url)) {
        console.warn('[ЗАЩИТА] Перенаправление на логин ЗАБЛОКИРОВАНО');
        return;
    }
    
    return originalAssign.call(this, url);
};

// Перехватываем window.location.replace
window.location.replace = function(url) {
    console.log('[ЗАЩИТА] Попытка перенаправления через replace на:', url);
    
    if (shouldBlockUrl(url)) {
        console.warn('[ЗАЩИТА] Перенаправление на логин ЗАБЛОКИРОВАНО');
        return;
    }
    
    return originalReplace.call(this, url);
};

// Для принудительной авторизации устанавливаем фейковый токен
localStorage.setItem('moneychange_auth', JSON.stringify({
    accessToken: 'fake_admin_token_' + Date.now(),
    refreshToken: 'fake_refresh_token_' + Date.now(),
    user: {
        id: 'admin',
        name: 'Администратор',
        email: 'admin@moneychange.es',
        role: 'ADMIN'
    }
}));

console.log('[ЗАЩИТА] Фейковый токен добавлен в localStorage');
console.log('[ЗАЩИТА] Система защиты от перенаправлений активна'); 