const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api';



export async function fetchJSON(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...opts.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'API Error' }));
    throw error;
  }

  return res.json();
}

const api = {
  get: (path, opts) => fetchJSON(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => fetchJSON(path, { ...opts, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, opts) => fetchJSON(path, { ...opts, method: 'PUT', body: JSON.stringify(body) }),
  delete: (path, opts) => fetchJSON(path, { ...opts, method: 'DELETE' }),
};

export default api;

