// Централизованный обработчик ошибок Express.
// Ловит как ошибки, переданные через next(err), так и необработанные исключения в маршрутах.
function errorHandler(err, req, res, next) {
  console.error('Ошибка сервера:', err);

  // Ошибка нарушения CHECK-ограничения PostgreSQL (например, некорректный статус)
  if (err.code === '23514') {
    return res.status(400).json({ error: 'Некорректное значение поля (нарушено ограничение базы данных)' });
  }

  // Ошибка подключения к базе данных
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: 'Нет соединения с базой данных' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Внутренняя ошибка сервера',
  });
}

// Обработчик несуществующих маршрутов (404)
function notFoundHandler(req, res) {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
}

module.exports = { errorHandler, notFoundHandler };
