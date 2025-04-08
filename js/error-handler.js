class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandler();
        this.setupNetworkErrorHandler();
    }

    setupGlobalErrorHandler() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.logError({
                type: 'javascript',
                message: msg,
                url: url,
                line: lineNo,
                column: columnNo,
                error: error?.stack,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                error: event.reason?.stack,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });
        });
    }

    setupNetworkErrorHandler() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    this.logError({
                        type: 'network',
                        status: response.status,
                        statusText: response.statusText,
                        url: args[0],
                        timestamp: new Date().toISOString()
                    });
                }
                return response;
            } catch (error) {
                this.logError({
                    type: 'network',
                    message: error.message,
                    url: args[0],
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        };
    }

    async logError(errorData) {
        try {
            const response = await fetch('/api/log-error.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorData)
            });

            if (!response.ok) {
                console.error('Failed to log error:', errorData);
            }
        } catch (e) {
            console.error('Error logging failed:', e);
        }

        // Показываем пользователю сообщение об ошибке
        this.showErrorMessage(errorData);
    }

    showErrorMessage(errorData) {
        const message = this.getLocalizedErrorMessage(errorData);
        
        // Создаем и показываем уведомление
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-btn">&times;</button>
            </div>
        `;

        // Добавляем стили если их еще нет
        if (!document.getElementById('error-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'error-notification-styles';
            styles.textContent = `
                .error-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #fff;
                    border-left: 4px solid #dc3545;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    padding: 16px;
                    border-radius: 4px;
                    z-index: 9999;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }
                .error-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .error-notification i {
                    color: #dc3545;
                    font-size: 20px;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 20px;
                    padding: 0;
                    margin-left: auto;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `;
            document.head.appendChild(styles);
        }

        // Добавляем уведомление в DOM
        document.body.appendChild(notification);

        // Добавляем обработчик для кнопки закрытия
        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getLocalizedErrorMessage(errorData) {
        const i18n = window.getTranslation || (key => key);
        
        switch (errorData.type) {
            case 'network':
                if (errorData.status === 404) {
                    return i18n('error_404');
                }
                return i18n('api_error');
            case 'javascript':
                return i18n('error_unexpected');
            case 'promise':
                return i18n('error_async');
            default:
                return i18n('error_unknown');
        }
    }
}

// Инициализируем обработчик ошибок при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.errorHandler = new ErrorHandler();
}); 