import React, { useState } from 'react';

function TaskForm({ onCreate, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Название задачи обязательно');
      return;
    }

    try {
      await onCreate({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <section className="window-panel task-form-panel">
      <div className="window-titlebar">
        <span className="window-titlebar-label">Новая задача</span>
      </div>
      <form className="window-body task-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="title">Название</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Изучить React"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Необязательно"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {formError && <p className="error-text">{formError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Добавление...' : 'Добавить задачу'}
        </button>
      </form>
    </section>
  );
}

export default TaskForm;
