import { auth } from './auth.js';
import { config } from '../config.js';

class AdminNavigation {
    constructor() {
        this.currentSection = 'dashboard';
        this.setupEventListeners();
        this.initializeTheme();
        this.activateSection(window.location.hash);
    }

    setupEventListeners() {
        // Навигация по разделам
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.activateSection(targetSection);
                history.pushState(null, null, `#${targetSection}`);
            });
        });

        // Переключение темы
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Выход из системы
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Обработка кнопки сворачивания сайдбара
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Обновление при изменении размера окна
        window.addEventListener('resize', () => this.handleWindowResize());

        // Обработка хэша при загрузке страницы и его изменении
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                this.activateSection(hash);
            }
        });
    }

    activateSection(section) {
        // Получаем имя секции из хэша или используем переданное
        let targetSection = section;
        if (targetSection.startsWith('#')) {
            targetSection = targetSection.substring(1);
        }

        // Если секция не указана или не существует, используем дашборд
        if (!targetSection || !document.getElementById(targetSection)) {
            targetSection = 'dashboard';
        }

        // Обновляем активную ссылку в меню
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            link.classList.toggle('active', linkTarget === targetSection);
        });

        // Показываем нужную секцию
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.toggle('active', section.id === targetSection);
        });

        // Обновляем текущую секцию
        this.currentSection = targetSection;

        // Обновляем заголовок страницы
        this.updatePageTitle(targetSection);
    }

    updatePageTitle(section) {
        // Обновляем заголовок страницы в зависимости от раздела
        const titleMap = {
            'dashboard': 'Обзор',
            'exchange-rates': 'Курсы валют',
            'users': 'Пользователи',
            'settings': 'Настройки'
        };

        const title = titleMap[section] || 'Админ-панель';
        document.title = `MoneyChange Admin | ${title}`;
    }

    initializeTheme() {
        // Проверяем сохраненную тему
        const savedTheme = localStorage.getItem('adminTheme') || 'light';
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
            this.updateThemeIcon(true);
        }
        
        // Устанавливаем тему для всей страницы
        document.documentElement.dataset.theme = savedTheme;
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('adminTheme', isDark ? 'dark' : 'light');
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
        
        this.updateThemeIcon(isDark);
        
        // Генерируем событие для обновления графиков
        document.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: isDark ? 'dark' : 'light' }
        }));
    }

    updateThemeIcon(isDark) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        
        if (isDark) {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('title', 'Переключить на светлую тему');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('title', 'Переключить на тёмную тему');
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('main');
        const header = document.querySelector('.header');
        
        if (!sidebar || !content || !header) return;
        
        const isCollapsed = sidebar.classList.toggle('collapsed');
        
        if (isCollapsed) {
            content.classList.add('expanded');
            header.classList.add('expanded');
        } else {
            content.classList.remove('expanded');
            header.classList.remove('expanded');
        }
        
        // Сохраняем состояние
        localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
    }

    handleWindowResize() {
        // Реализация адаптивной верстки в зависимости от размера окна
        const isMobile = window.innerWidth < 768;
        const sidebar = document.querySelector('.sidebar');
        
        if (!sidebar) return;
        
        if (isMobile && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            document.querySelector('main')?.classList.add('expanded');
            document.querySelector('.header')?.classList.add('expanded');
        } else if (!isMobile && sidebar.classList.contains('collapsed')) {
            // Проверяем сохраненное состояние
            const savedState = localStorage.getItem('sidebarState');
            if (savedState !== 'collapsed') {
                sidebar.classList.remove('collapsed');
                document.querySelector('main')?.classList.remove('expanded');
                document.querySelector('.header')?.classList.remove('expanded');
            }
        }
    }

    async logout() {
        try {
            // Показываем спиннер
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                const originalText = logoutBtn.innerHTML;
                logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                logoutBtn.disabled = true;
                
                // ОТКЛЮЧЕНО: Выходим из системы
                console.log("Выход отключен, перенаправление на логин отключено");
                
                // Восстанавливаем кнопку
                setTimeout(() => {
                    logoutBtn.innerHTML = originalText;
                    logoutBtn.disabled = false;
                }, 1000);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // ОТКЛЮЧЕНО: перенаправление на логин
        }
    }
}

// Инициализация навигации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AdminNavigation();
}); 