const express = require('express');
const cors = require('cors');
const tasksRoutes = require('./routes/tasks.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Логирование каждого запроса в консоль — удобно для отладки и отчётности
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString('ru-RU')} ${req.method} ${req.originalUrl}`);
  next();
});

// Простой health-check, удобно для проверки, что сервер поднялся
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/tasks', tasksRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
