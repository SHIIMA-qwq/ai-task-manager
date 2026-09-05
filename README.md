# AI Task Manager

Веб-приложение для управления задачами: создание, просмотр, изменение статуса и удаление задач.

## Описание

Приложение состоит из трёх частей:

- **backend** — REST API на Node.js + Express, хранит задачи в PostgreSQL;
- **frontend** — веб-интерфейс на React, взаимодействует с backend только через REST API;
- **python** — вспомогательный скрипт `export_tasks.py`, выгружает задачи из PostgreSQL в CSV.

## Стек технологий

- Frontend: React + JavaScript
- Backend: Node.js + Express
- База данных: PostgreSQL
- Дополнительно: Python (psycopg2)
- Контроль версий: Git

## Структура проекта

```text
ai-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/db.js            # подключение к PostgreSQL (pg Pool)
│   │   ├── models/tasks.model.js   # SQL-запросы к таблице tasks
│   │   ├── controllers/tasks.controller.js  # обработка запросов, валидация
│   │   ├── routes/tasks.routes.js  # маршруты /tasks
│   │   ├── middleware/errorHandler.js  # централизованная обработка ошибок
│   │   ├── app.js                  # сборка Express-приложения
│   │   └── server.js               # точка входа, запуск сервера
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── api/tasksApi.js         # обёртка над fetch для REST API
│   │   ├── components/
│   │   │   ├── TaskForm.js         # форма создания задачи
│   │   │   ├── TaskList.js         # таблица задач
│   │   │   └── TaskRow.js          # строка задачи (статус, удаление)
│   │   ├── App.js                  # состояние приложения, загрузка/CRUD
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql                  # SQL-скрипт создания таблицы tasks
├── python/
│   ├── export_tasks.py             # экспорт задач в CSV
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

## Требования для запуска

- Node.js 18+ и npm
- PostgreSQL 13+
- Python 3.9+

## Быстрый запуск (Windows)

После выполнения настройки PostgreSQL и `.env` (см. разделы ниже) можно
запускать backend и frontend одной командой: дважды кликните файл
`start-project.bat` в корне проекта. Он откроет два окна — backend и
frontend — и запустит приложение в браузере автоматически.

## 1. Настройка PostgreSQL

Создайте базу данных:

```bash
createdb ai_task_manager
# или через psql:
psql -U postgres -c "CREATE DATABASE ai_task_manager;"
```

Примените SQL-схему:

```bash
psql -U postgres -d ai_task_manager -f database/schema.sql
```

Это создаст таблицу `tasks` с полями `id`, `title`, `description`, `status`, `created_at`.

## 2. Backend

### Установка зависимостей

```bash
cd backend
npm install
```

### Настройка .env

```bash
cp .env.example .env
```

Отредактируйте `.env`, указав свои данные для подключения к PostgreSQL:

```env
PORT=5000
PGHOST=localhost
PGPORT=5432
PGDATABASE=ai_task_manager
PGUSER=postgres
PGPASSWORD=postgres
```

### Запуск

```bash
npm start
```

Backend будет доступен на `http://localhost:5000`. Проверить, что сервер работает, можно запросом `GET http://localhost:5000/health`.

## 3. Frontend

### Установка зависимостей

```bash
cd frontend
npm install
```

### Настройка .env

```bash
cp .env.example .env
```

По умолчанию frontend обращается к `http://localhost:5000`:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Запуск

```bash
npm start
```

Приложение откроется на `http://localhost:3000`.

## 4. Python-скрипт экспорта

### Установка зависимостей

Рекомендуется использовать виртуальное окружение:

```bash
cd python
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Настройка .env

```bash
cp .env.example .env
```

Укажите те же параметры подключения, что и для backend.

### Запуск

```bash
python export_tasks.py
```

По умолчанию создаётся файл `tasks_export.csv` в текущей папке. Можно указать другой путь:

```bash
python export_tasks.py --output my_tasks.csv
```

## Описание API

Базовый URL: `http://localhost:5000`

| Метод  | Маршрут      | Описание                    |
| ------ | ------------ | ---------------------------- |
| GET    | `/tasks`     | Получить список всех задач   |
| POST   | `/tasks`     | Создать новую задачу         |
| PUT    | `/tasks/:id` | Изменить статус задачи       |
| DELETE | `/tasks/:id` | Удалить задачу               |

Допустимые значения `status`: `new`, `in_progress`, `done`.

### Примеры запросов

**Создание задачи**

```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Изучить React", "description": "Пройти базовый курс"}'
```

Ответ:

```json
{
  "id": 1,
  "title": "Изучить React",
  "description": "Пройти базовый курс",
  "status": "new",
  "created_at": "2026-01-15T10:00:00.000Z"
}
```

**Получение списка задач**

```bash
curl http://localhost:5000/tasks
```

**Изменение статуса**

```bash
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

**Удаление задачи**

```bash
curl -X DELETE http://localhost:5000/tasks/1
```

## Git

Проект уже содержит `.gitignore`, исключающий `node_modules`, `.env`, кэш Python и другие временные файлы.

Пример последовательности команд для первой публикации:

```bash
git init
git add .
git commit -m "Initial project setup"
git add database/schema.sql
git commit -m "Add PostgreSQL schema"
git add backend/
git commit -m "Implement tasks REST API"
git add frontend/
git commit -m "Implement React task manager"
git add python/
git commit -m "Add CSV export script"
git add README.md
git commit -m "Add README"
git branch -M main
git remote add origin <ВАШ_URL_РЕПОЗИТОРИЯ>
git push -u origin main
```
