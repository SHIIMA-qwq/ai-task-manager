"""
export_tasks.py

Подключается к PostgreSQL, получает все задачи из таблицы `tasks`
и сохраняет их в CSV-файл.

Параметры подключения к БД берутся из переменных окружения
(см. .env.example в этой папке), чтобы не хранить пароль в коде.

Запуск:
    python export_tasks.py
    python export_tasks.py --output tasks_export.csv
"""

import argparse
import csv
import os
import sys

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    """Открывает соединение с PostgreSQL, используя переменные окружения."""
    try:
        return psycopg2.connect(
            host=os.getenv("PGHOST", "localhost"),
            port=os.getenv("PGPORT", "5432"),
            dbname=os.getenv("PGDATABASE", "ai_task_manager"),
            user=os.getenv("PGUSER", "postgres"),
            password=os.getenv("PGPASSWORD", ""),
        )
    except psycopg2.OperationalError as exc:
        print(f"Не удалось подключиться к базе данных: {exc}", file=sys.stderr)
        sys.exit(1)


def fetch_tasks(connection):
    """Получает все задачи из таблицы tasks."""
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT id, title, description, status, created_at "
            "FROM tasks ORDER BY created_at DESC"
        )
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
    return columns, rows


def write_csv(columns, rows, output_path):
    """Сохраняет строки в CSV-файл."""
    with open(output_path, "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(columns)
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description="Экспорт задач из PostgreSQL в CSV")
    parser.add_argument(
        "--output",
        default="tasks_export.csv",
        help="Путь к выходному CSV-файлу (по умолчанию: tasks_export.csv)",
    )
    args = parser.parse_args()

    connection = get_db_connection()
    try:
        columns, rows = fetch_tasks(connection)
    finally:
        connection.close()

    write_csv(columns, rows, args.output)
    print(f"Экспортировано задач: {len(rows)}")
    print(f"Файл сохранён: {os.path.abspath(args.output)}")


if __name__ == "__main__":
    main()
