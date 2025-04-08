import { config } from '../config.js';

// Модуль аутентификации для админ-панели MoneyChange
export class Auth {
    constructor() {
        this.storageKey = config.AUTH.TOKEN_KEY;
        this.token = null;
        this.user = null;
        
        // Загружаем сохраненные данные, если они есть
        this.loadFromStorage();
        
        // Обновляем интерфейс в соответствии с состоянием авторизации
        this.updateUI();
    }
    
    // Загрузка данных из localStorage
    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                const authData = JSON.parse(stored);
                this.token = authData.accessToken;
                this.user = authData.user;
            } catch (error) {
                console.error('Error parsing auth data:', error);
                this.clearAuth();
            }
        }
    }
    
    // Сохранение данных в localStorage
    saveToStorage() {
        if (this.token && this.user) {
            const authData = {
                accessToken: this.token,
                user: this.user
            };
            localStorage.setItem(this.storageKey, JSON.stringify(authData));
        } else {
            this.clearAuth();
        }
    }
    
    // Очистка данных авторизации
    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem(this.storageKey);
    }
    
    // Проверка авторизации
    isAuthenticated() {
        return !!this.token;
    }
    
    // Проверка, является ли пользователь администратором
    isAdmin() {
        return this.user && this.user.role === 'ADMIN';
    }
    
    // Получение заголовков для авторизованных запросов
    getAuthHeader() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }

    // Проверка авторизации
    checkAuth() {
        return this.isAuthenticated() && this.isAdmin();
    }
    
    // Обновление UI в соответствии с состоянием авторизации
    updateUI() {
        const authStatusEl = document.getElementById('authStatus');
        const authUserEl = document.getElementById('authUser');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (this.isAuthenticated() && this.user) {
            if (authStatusEl) authStatusEl.textContent = 'Авторизован';
            if (authUserEl) authUserEl.textContent = this.user.email;
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
        } else {
            if (authStatusEl) authStatusEl.textContent = 'Не авторизован';
            if (authUserEl) authUserEl.textContent = '';
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }
    
    // Выход из системы
    logout() {
        this.clearAuth();
        this.updateUI();
        window.location.href = 'login.html';
    }

    /**
     * Перенаправляет на страницу входа, если пользователь не авторизован
     */
    redirectToLogin() {
        if (!this.isAuthenticated() && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Настраивает обработчик для кнопки выхода
     */
    setupLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    /**
     * Проверяет доступ пользователя к защищенным страницам
     * Вызывается при загрузке страницы
     */
    checkAccess() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }
}

// Создаем и экспортируем глобальный экземпляр класса Auth
export const auth = new Auth();

// Автоматическая проверка доступа при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Не проверяем доступ на странице логина
    if (!window.location.pathname.includes('login.html')) {
        if (!auth.checkAccess()) {
            return; // Прерываем выполнение, если нет доступа
        }
        
        // Настраиваем обработчик выхода
        auth.setupLogoutHandler();
    }
}); 