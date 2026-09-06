import React, { useEffect, useState, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from './api/tasksApi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate({ title, description }) {
    setIsSubmitting(true);
    setError('');
    try {
      const newTask = await createTask({ title, description });
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(id, status) {
    setError('');
    const previousTasks = tasks;
    // Оптимистичное обновление интерфейса
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTaskStatus(id, status);
    } catch (err) {
      setError(err.message);
      setTasks(previousTasks);
    }
  }

  async function handleDelete(id) {
    setError('');
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setError(err.message);
      setTasks(previousTasks);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>AI Task Manager</h1>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <TaskForm onCreate={handleCreate} isSubmitting={isSubmitting} />

      <section className="window-panel task-list-section">
        <div className="window-titlebar">
          <span className="window-titlebar-label">Список задач</span>
        </div>
        <div className="window-body">
          {isLoading ? (
            <p className="loading-state">Загрузка задач...</p>
          ) : (
            <TaskList
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
