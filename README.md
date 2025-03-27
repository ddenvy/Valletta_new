# Valletta - Система управления вакансиями и кандидатами

## Описание
Valletta - это веб-приложение для управления вакансиями и кандидатами, построенное с использованием Next.js (фронтенд) и Node.js/Express (бэкенд). Система позволяет рекрутерам управлять вакансиями, отслеживать кандидатов и проводить скрининг.

## Технологический стек
- **Фронтенд:**
  - Next.js 14 (App Router)
  - TypeScript
  - Bootstrap 5
  - React Query
  - Axios

- **Бэкенд:**
  - Node.js
  - Express
  - TypeScript
  - MongoDB
  - Multer (для загрузки файлов)

## Структура проекта
```
valletta/
├── frontend/           # Next.js приложение
│   ├── app/           # Страницы и роуты
│   ├── components/    # React компоненты
│   ├── services/      # API сервисы
│   └── types/         # TypeScript типы
│
├── backend/           # Express сервер
│   ├── src/
│   │   ├── controllers/  # Контроллеры
│   │   ├── models/       # MongoDB модели
│   │   ├── routes/       # API роуты
│   │   └── services/     # Бизнес-логика
│   └── uploads/          # Загруженные файлы
│
└── docker-compose.yml   # Docker конфигурация
```

## API Endpoints

### Вакансии
- `GET /api/v1/vacancies` - Получить все вакансии
- `GET /api/v1/vacancies/:id` - Получить вакансию по ID
- `POST /api/v1/vacancies` - Создать новую вакансию
- `PUT /api/v1/vacancies/:id` - Обновить вакансию
- `DELETE /api/v1/vacancies/:id` - Удалить вакансию

### Кандидаты
- `GET /api/v1/candidates` - Получить всех кандидатов
- `GET /api/v1/candidates/:id` - Получить кандидата по ID
- `POST /api/v1/candidates` - Создать нового кандидата
- `PUT /api/v1/candidates/:id` - Обновить кандидата
- `DELETE /api/v1/candidates/:id` - Удалить кандидата

### Файлы
- `POST /api/v1/files/upload` - Загрузить файл
- `GET /api/v1/files/:filename` - Получить файл
- `DELETE /api/v1/files/:filename` - Удалить файл

## Установка и запуск

### Требования
- Node.js 18+
- MongoDB
- Docker (опционально)

### Локальный запуск

1. Клонировать репозиторий:
```bash
git clone [repository-url]
cd valletta
```

2. Установить зависимости:
```bash
# Установка зависимостей фронтенда
cd frontend
npm install

# Установка зависимостей бэкенда
cd ../backend
npm install
```

3. Создать файлы окружения:
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# backend/.env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/valletta
FRONTEND_URL=http://localhost:3000
```

4. Запустить приложение:
```bash
# Запуск бэкенда
cd backend
npm run dev

# Запуск фронтенда (в новом терминале)
cd frontend
npm run dev
```

### Docker запуск
```bash
docker-compose up -d
```

## Разработка

### Соглашения по коду
- Использовать TypeScript для всех файлов
- Следовать принципам функционального программирования
- Использовать React Server Components где возможно
- Минимизировать использование 'use client'
- Использовать Bootstrap для стилизации

### Структура компонентов
- Компоненты должны быть в папке `components`
- Каждый компонент должен иметь свой файл стилей
- Использовать TypeScript интерфейсы для пропсов
- Следовать принципу единой ответственности

### API Сервисы
- Все API вызовы должны быть в папке `services`
- Использовать Axios для HTTP запросов
- Обрабатывать ошибки и показывать уведомления
- Использовать типизацию для ответов API

## Безопасность
- Все API endpoints защищены rate limiting
- Используется CORS для защиты от cross-origin запросов
- Файлы проверяются на безопасность перед загрузкой
- Используется helmet для защиты заголовков

## Мониторинг и логирование
- Все ошибки логируются на бэкенде
- Используется Winston для логирования
- Реализован health check endpoint
- Отслеживание метрик производительности

## Поддержка
При возникновении проблем:
1. Проверить логи сервера
2. Убедиться в правильности конфигурации
3. Проверить подключение к базе данных
4. Проверить права доступа к файлам 