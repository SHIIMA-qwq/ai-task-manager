const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Общая обработка ответа fetch: бросает ошибку с текстом от backend, если запрос не удался
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Ошибка запроса: ${response.status}`);
  }

  return data;
}

export async function fetchTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  return handleResponse(response);
}

export async function createTask({ title, description }) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(response);
}

export async function updateTaskStatus(id, status) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
