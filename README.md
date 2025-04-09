# MoneyChange - Torrevieja Currency Exchange

Сайт обмена валют в Торревьехе, Испания.

## Структура проекта

- `index.html` - Главная страница
- `prices.html` - Страница с курсами валют
- `contact.html` - Контактная страница
- `js/` - JavaScript файлы
  - `exchange-rates.js` - Основной файл для отображения курсов валют
  - `locale.js` - Многоязычность
  - `locales/` - Переводы
- `css/` - Стили
- `images/` - Изображения
- `backend/` - Strapi бэкэнд для API курсов валют

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