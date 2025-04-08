# TorrExchange - Сервис обмена валют

Современная веб-платформа для обмена валют с актуальными курсами и простым интерфейсом.

## Особенности

- Актуальные курсы валют с API обновлением
- Поддержка множества валют (EUR, USD, CAD, NOK, SEK, DKK, GBP, CHF)
- Мультиязычный интерфейс (EN, ES, RU)
- Калькулятор обмена валют
- Адаптивный дизайн
- Админ-панель на Strapi CMS

## Технологии

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Strapi CMS
- API: Exchange Rates API
- Базы данных: SQLite (для разработки)

## Структура проекта

```
moneychange/
├── css/               # Стили
├── images/            # Изображения и флаги
├── js/                # JavaScript файлы
│   ├── exchange-rates.js  # Логика курсов валют
│   ├── locale.js      # Мультиязычность
│   ├── theme.js       # Настройки темы
│   └── ticker.js      # Бегущая строка с курсами
├── index.html         # Главная страница
└── README.md          # Документация
```

## Установка и запуск

1. Клонировать репозиторий
   ```
   git clone https://github.com/Personaz1/torrexchange.git
   cd torrexchange
   ```

2. Запустить фронтенд (требуется Python)
   ```
   python -m http.server 8000
   ```

3. Запустить бэкенд (требуется Node.js и Strapi)
   ```
   cd backend
   npm install
   npm run develop
   ```

4. Открыть в браузере
   ```
   http://localhost:8000
   ```

## Статус разработки

Для получения подробной информации о текущем состоянии и истории разработки см. [DEVELOPMENT.md](DEVELOPMENT.md).

## Лицензия

Проект распространяется под лицензией MIT License.

---

© 2025 TorrExchange. Все права защищены. 