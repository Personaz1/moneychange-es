// Утилиты для работы с браузером
const Browser = {
    // Проверка поддержки темной темы
    prefersDarkTheme: () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    // Установка темы
    setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Обновляем иконку переключателя
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    },

    // Получение текущей темы
    getCurrentTheme: () => {
        return localStorage.getItem('theme') || 
               (Browser.prefersDarkTheme() ? 'dark' : 'light');
    },

    // Определение языка браузера
    getBrowserLanguage: () => {
        return navigator.language || navigator.userLanguage;
    },

    // Проверка поддержки определенной функции
    supports: {
        localStorage: () => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch(e) {
                return false;
            }
        },
        
        webp: () => {
            const elem = document.createElement('canvas');
            if (!!(elem.getContext && elem.getContext('2d'))) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }
            return false;
        },
        
        touch: () => {
            return 'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0 || 
                   navigator.msMaxTouchPoints > 0;
        }
    },

    // Определение устройства
    device: {
        isMobile: () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        isTablet: () => {
            return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
        },
        
        isDesktop: () => {
            return !Browser.device.isMobile() && !Browser.device.isTablet();
        }
    },

    // Работа с cookie
    cookie: {
        set: (name, value, days) => {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        },
        
        get: (name) => {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        
        delete: (name) => {
            document.cookie = name + '=; Max-Age=-99999999;';
        }
    },

    // Работа с viewport
    viewport: {
        width: () => {
            return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        },
        
        height: () => {
            return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        },
        
        isInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }
}; 