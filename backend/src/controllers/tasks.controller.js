const tasksModel = require('../models/tasks.model');

// GET /tasks
async function listTasks(req, res, next) {
  try {
    const tasks = await tasksModel.getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

// POST /tasks
async function createTask(req, res, next) {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Поле "title" обязательно и не должно быть пустым' });
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Поле "description" должно быть строкой' });
    }

    const task = await tasksModel.createTask({
      title: title.trim(),
      description: description ? description.trim() : null,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

// PUT /tasks/:id
async function updateTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Некорректный id задачи' });
    }

    if (!status || !tasksModel.ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Поле "status" обязательно и должно быть одним из: ${tasksModel.ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const task = await tasksModel.updateTaskStatus(Number(id), status);

    if (!task) {
      return res.status(404).json({ error: `Задача с id=${id} не найдена` });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

// DELETE /tasks/:id
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Некорректный id задачи' });
    }

    const deleted = await tasksModel.deleteTask(Number(id));

    if (!deleted) {
      return res.status(404).json({ error: `Задача с id=${id} не найдена` });
    }

    res.status(200).json({ message: 'Задача удалена', id: deleted.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
};
