const { Pool } = require('pg');
require('dotenv').config();

// Пул соединений с PostgreSQL.
// Параметры подключения берутся из переменных окружения (см. .env.example),
// чтобы не хранить чувствительные данные в коде.
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

pool.on('error', (err) => {
  console.error('Неожиданная ошибка пула подключений PostgreSQL:', err);
  process.exit(1);
});

module.exports = pool;
