const express = require('express');
const tasksController = require('../controllers/tasks.controller');

const router = express.Router();

router.get('/', tasksController.listTasks);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTaskStatus);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
