import React from 'react';

const STATUS_LABELS = {
  new: 'Новая',
  in_progress: 'В процессе',
  done: 'Выполнена',
};

function TaskRow({ task, onStatusChange, onDelete }) {
  return (
    <tr>
      <td>{task.title}</td>
      <td>{task.description || '—'}</td>
      <td>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td>{new Date(task.created_at).toLocaleString('ru-RU')}</td>
      <td>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          Удалить
        </button>
      </td>
    </tr>
  );
}

export default TaskRow;
