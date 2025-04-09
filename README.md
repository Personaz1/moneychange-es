# MoneyChange - Современный сайт обмена валют

Проект представляет собой современный, лаконичный и удобный сайт для обмена валют с актуальными курсами.

## Особенности

* Современный дизайн с адаптивной вёрсткой
* Интерактивный калькулятор обмена валют:
  * Поддержка основных валют (EUR, USD, CAD, NOK, SEK, DKK, GBP, CHF)
  * Автоматический расчет кросс-курсов через EUR
  * Учет комиссии 2.6% при конвертации
  * Двойная комиссия при кросс-конвертации
* Автоматическое обновление курсов валют через API
* Мультиязычность (EN, ES, RU)
* Административная панель для управления курсами
* Темная/светлая тема

## Технологии

* Frontend:  
   * HTML5, CSS3  
   * JavaScript (ES6+)  
   * Bootstrap 5  
   * Поддержка мобильных устройств
* Backend:  
   * Strapi CMS (Node.js)  
   * SQLite база данных  
   * RESTful API для курсов валют
* Деплой:
   * Nginx/Apache конфигурация
   * SSL/HTTPS поддержка
   * Кэширование статики

## Установка и запуск

### Frontend

1. Клонировать репозиторий:
```bash
git clone https://github.com/Personaz1/moneychange-es.git
cd moneychange-es
```

2. Запустить локальный сервер:
```bash
python -m http.server 8000
```

3. Открыть в браузере: http://localhost:8000

### Backend (Strapi)

1. Перейти в директорию backend:
```bash
cd backend
```

2. Установить зависимости:
```bash
npm install
```

3. Запустить Strapi:
```bash
npm run develop
```

4. Открыть админку: http://localhost:1337/admin

## Структура проекта

```
├── css/                # Стили проекта
│   ├── style.css      # Основные стили
│   └── calculator.css  # Стили калькулятора
├── js/                 # JavaScript файлы
│   ├── calculator.js   # Калькулятор валют
│   ├── exchange-rates.js # Работа с курсами
│   ├── locale.js      # Мультиязычность
│   ├── theme.js       # Темная/светлая тема
│   └── locales/       # Файлы переводов
├── images/            # Изображения и ресурсы
│   ├── flags/        # Флаги валют
│   └── team/         # Фото команды
├── backend/          # Бэкенд на Strapi
│   ├── src/api/     # API контроллеры
│   └── config/      # Конфигурация Strapi
├── index.html       # Главная страница
├── prices.html      # Страница с курсами
├── contact.html     # Контакты
├── nginx.conf       # Конфигурация Nginx
├── .htaccess        # Конфигурация Apache
└── DEVELOPMENT.md   # Документация разработки
```

## Деплой

### Nginx

1. Установить SSL сертификаты:
```bash
certbot certonly --webroot -w /var/www/moneychange -d moneychange.es -d www.moneychange.es
```

2. Использовать конфигурацию из `nginx.conf`
3. Настроить права доступа:
```bash
chown -R www-data:www-data /var/www/moneychange
chmod -R 755 /var/www/moneychange
```

### Apache

1. Включить необходимые модули:
```bash
a2enmod rewrite
a2enmod headers
a2enmod expires
```

2. Использовать конфигурацию из `.htaccess`

## Разработка

Подробная информация о разработке находится в файле [DEVELOPMENT.md](DEVELOPMENT.md)

## Настройка сервера

### Apache
Используйте файл `.htaccess` для скрытия расширения `.html`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
```

### Nginx
Используйте файл `nginx.conf` для скрытия расширения `.html`:

```nginx
location / {
    try_files $uri $uri.html $uri/ =404;
}
```

## Запуск проекта

### Фронтенд
1. Установите HTTP-сервер (например, Apache, Nginx)
2. Скопируйте файлы в корневую директорию веб-сервера
3. Настройте сервер для скрытия расширения .html

### Бэкэнд (Strapi)
1. Перейдите в директорию `backend/`
2. Установите зависимости:
```bash
npm install
```
3. Запустите сервер разработки:
```bash
npm run develop
```
4. Или запустите продакшн-сервер:
```bash
npm run build
npm run start
```

## Обновление курсов валют

Курсы валют обновляются автоматически через крон-задачу в Strapi (каждый час). Также доступно ручное обновление через API:

```
GET /api/rates/update
```

## Настройка API ключа

Создайте `.env` файл в директории `backend/` с вашим API ключом:

```
EXCHANGE_RATES_API_KEY=your_api_key
``` 