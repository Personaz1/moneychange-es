/**
 * Основной модуль админ-панели
 * Загружает все необходимые модули и управляет панелью администратора
 */
import { auth } from './auth.js';
import { config } from '../config.js';
import { RatesManager } from './rates.js';

class AdminPanel {
    constructor() {
        // Элементы интерфейса
        this.sidebar = document.getElementById('sidebar');
        this.contentSections = document.querySelectorAll('.content-section');
        this.menuLinks = document.querySelectorAll('.menu-link');

        // Модули админки
        this.modules = {};
        
        // Инициализация
        this.init();
    }
    
    async init() {
        // Проверяем авторизацию
        if (!auth.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Настройка меню и навигации
        this.setupNavigation();
        
        // Загружаем модули динамически
        await this.loadModules();
        
        // Инициализируем активную секцию
        this.activateSection(this.getActiveSection());
    }
    
    /**
     * Настраивает навигацию по разделам
     */
    setupNavigation() {
        // Обработчик для меню
        if (this.menuLinks) {
            this.menuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Удаляем активный класс у всех ссылок
                    this.menuLinks.forEach(item => item.classList.remove('active'));
                    
                    // Добавляем активный класс текущей ссылке
                    link.classList.add('active');
                    
                    // Получаем ID секции
                    const sectionId = link.getAttribute('href').substr(1);
                    
                    // Активируем секцию
                    this.activateSection(sectionId);
                    
                    // Обновляем URL с хэшем
                    window.location.hash = sectionId;
                    
                    // Если мобильный вид, закрываем меню
                    if (window.innerWidth < 992) {
                        document.body.classList.remove('sidebar-open');
                    }
                });
            });
        }
        
        // Обработчик для переключения меню на мобильных устройствах
        const toggleButton = document.getElementById('toggleSidebar');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-open');
            });
        }
        
        // Обработчик выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.logout();
            });
        }
    }
    
    /**
     * Получает ID активной секции из URL или возвращает секцию по умолчанию
     */
    getActiveSection() {
        // Проверяем хэш в URL
        const hash = window.location.hash;
        if (hash && hash.length > 1) {
            const sectionId = hash.substr(1);
            const section = document.getElementById(sectionId);
            if (section) {
                return sectionId;
            }
        }
        
        // Возвращаем ID первой секции
        return this.contentSections.length > 0 ? this.contentSections[0].id : 'dashboard';
    }
    
    /**
     * Активирует указанную секцию
     */
    activateSection(sectionId) {
        // Скрываем все секции
        this.contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем выбранную секцию
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
            
            // Обновляем активную ссылку в меню
            this.menuLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
            
            // Вызываем обработчик изменения раздела
            this.onSectionChange(sectionId);
        }
    }
    
    /**
     * Загружает все необходимые модули для админки
     */
    async loadModules() {
        try {
            // Загружаем модули для разных разделов
            const modulePromises = [
                import('./rates.js').then(module => {
                    if (module.RatesManager) {
                        this.modules.rates = new module.RatesManager(); // Создаем экземпляр
                    } else {
                        console.error('RatesManager class not found in rates.js module');
                    }
                }),
                import('./images.js').then(module => this.modules.images = module) // Оставляем как есть, если images.js не экспортирует класс для инстанцирования
            ];
            
            // Ждем загрузки всех модулей
            await Promise.all(modulePromises);
            
            console.log('Все модули успешно загружены');
        } catch (error) {
            console.error('Ошибка при загрузке модулей:', error);
            this.showError('Не удалось загрузить все необходимые модули');
        }
    }
    
    /**
     * Обработчик изменения активного раздела
     */
    onSectionChange(sectionId) {
        // Здесь можно добавить специфическую логику для каждого раздела
        console.log(`Активирован раздел: ${sectionId}`);
        
        // Например, инициализация специфических элементов для каждого раздела
        switch (sectionId) {
            case 'rates':
            case 'exchange-rates': // Добавляем поддержку старого id
                if (!this.modules.rates) {
                    // Попытка создать экземпляр, если он не был создан при загрузке
                    // Обычно этого не должно происходить, если loadModules отработал корректно
                    console.warn('RatesManager instance was not created during module load. Attempting to create now.');
                    try {
                        // Динамический импорт здесь может быть сложнее
                        // Лучше убедиться, что loadModules всегда создает инстанс
                    } catch (e) {
                        console.error('Failed to dynamically create RatesManager instance:', e);
                        this.showError('Ошибка инициализации модуля курсов валют.');
                    }
                } else {
                    // Экземпляр уже существует, можно вызвать метод обновления, если нужно
                    // this.modules.rates.loadRates(); // Убираем, т.к. loadRates вызывается в конструкторе
                }
                break;
                
            case 'images':
                // Модуль изображений уже инициализирован в images.js
                break;
                
            case 'settings':
                // Инициализация настроек
                this.initSettings();
                break;
        }
    }
    
    /**
     * Инициализирует раздел настроек
     */
    initSettings() {
        const saveBtn = document.getElementById('saveSettingsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }
    }
    
    /**
     * Сохраняет настройки
     */
    async saveSettings() {
        try {
            // Получаем значения из формы
            const settings = {
                siteName: document.querySelector('#settingsForm input[placeholder="MoneyChange"]').value,
                margin: document.querySelector('#settingsForm input[placeholder="2.5"]').value,
                apiKey: document.querySelector('#settingsForm input[placeholder="API Key"]').value,
                apiUrl: document.querySelector('#settingsForm input[placeholder="API URL"]').value
            };
            
            // Здесь должен быть запрос к API
            // await fetch('/api/settings', {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         ...auth.getAuthHeader()
            //     },
            //     body: JSON.stringify(settings)
            // });
            
            this.showSuccess('Настройки успешно сохранены');
            
        } catch (error) {
            console.error('Ошибка при сохранении настроек:', error);
            this.showError('Не удалось сохранить настройки');
        }
    }
    
    /**
     * Показывает сообщение об ошибке
     */
    showError(message) {
        this.showNotification(message, 'danger');
    }
    
    /**
     * Показывает сообщение об успехе
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    /**
     * Показывает уведомление
     */
    showNotification(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const id = 'toast-' + Date.now();
        const html = `
            <div id="${id}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-${type} text-white">
                    <strong class="me-auto">${type === 'success' ? 'Успех' : type === 'danger' ? 'Ошибка' : 'Информация'}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
        const toastElement = document.getElementById(id);
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        toast.show();
        
        // Удаляем элемент после скрытия
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
}); 