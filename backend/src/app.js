const express = require('express');
const cors = require('cors');
const tasksRoutes = require('./routes/tasks.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Простой health-check, удобно для проверки, что сервер поднялся
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/tasks', tasksRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
