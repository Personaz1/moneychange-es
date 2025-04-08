import { auth } from './auth.js';
import { config } from '../config.js';
import { api } from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Если пользователь уже авторизован - перенаправляем в админ-панель
    if (auth.isAuthenticated()) {
        window.location.href = 'panel.html';
    }

    // Обработчик отправки формы логина
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            // Показываем индикатор загрузки
            document.getElementById('loginButton').disabled = true;
            document.getElementById('loginButton').textContent = 'Вход...';
            
            // Отправляем запрос на аутентификацию
            const response = await api.post(config.AUTH.LOGIN_URL, {
                email,
                password
            });
            
            // Сохраняем данные авторизации
            auth.token = response.accessToken;
            auth.user = response.user;
            auth.saveToStorage();
            
            // Перенаправляем в админ-панель
            window.location.href = 'panel.html';
        } catch (error) {
            console.error('Login error:', error);
            
            // Показываем сообщение об ошибке
            let message = 'Ошибка при входе. Пожалуйста, попробуйте еще раз.';
            if (error.status === 401) {
                message = 'Неверный email или пароль';
            } else if (error.status === 403) {
                message = 'Доступ запрещен';
            }
            
            showError(message);
            
            // Сбрасываем состояние кнопки
            document.getElementById('loginButton').disabled = false;
            document.getElementById('loginButton').textContent = 'Войти';
        }
    });

    // Функция для отображения ошибки
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Скрываем ошибку через 5 секунд
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}); 