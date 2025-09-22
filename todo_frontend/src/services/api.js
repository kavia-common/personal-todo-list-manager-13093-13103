const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Lightweight fetch helper
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let detail = 'Request failed';
    try {
      if (contentType.includes('application/json')) {
        const errJson = await response.json();
        detail = errJson?.detail || JSON.stringify(errJson);
      } else {
        detail = await response.text();
      }
    } catch {
      // ignore
    }
    const error = new Error(`${response.status} ${response.statusText}: ${detail}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  if (contentType.includes('application/json')) return response.json();
  return response.text();
}

// PUBLIC_INTERFACE
export async function fetchTodos() {
  /** Retrieve list of todos from backend */
  const data = await request('/todos', { method: 'GET' });
  return data.items || [];
}

// PUBLIC_INTERFACE
export async function createTodo(payload) {
  /** Create a new todo item */
  return request('/todos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function updateTodo(id, payload) {
  /** Update an existing todo item by id */
  return request(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Delete a todo item by id */
  return request(`/todos/${id}`, { method: 'DELETE' });
}
