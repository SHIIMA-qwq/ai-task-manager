const pool = require('../config/db');

// Допустимые статусы задачи. Дублируют CHECK-ограничение в БД,
// чтобы возвращать понятную ошибку ещё до похода в базу.
const ALLOWED_STATUSES = ['new', 'in_progress', 'done'];

async function getAllTasks() {
  const result = await pool.query(
    'SELECT id, title, description, status, created_at FROM tasks ORDER BY created_at DESC'
  );
  return result.rows;
}

async function getTaskById(id) {
  const result = await pool.query(
    'SELECT id, title, description, status, created_at FROM tasks WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function createTask({ title, description }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status)
     VALUES ($1, $2, 'new')
     RETURNING id, title, description, status, created_at`,
    [title, description || null]
  );
  return result.rows[0];
}

async function updateTaskStatus(id, status) {
  const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2
     RETURNING id, title, description, status, created_at`,
    [status, id]
  );
  return result.rows[0] || null;
}

async function deleteTask(id) {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  ALLOWED_STATUSES,
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskStatus,
  deleteTask,
};
