const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  employees: {
    list: () => request('/employees'),
    create: (body) => request('/employees', { method: 'POST', body: JSON.stringify(body) }),
    remove: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
  },
  attendance: {
    list: (params) => request('/attendance' + (params ? '?' + new URLSearchParams(params).toString() : '')),
    mark: (body) => request('/attendance/mark', { method: 'POST', body: JSON.stringify(body) }),
  },
  salary: {
    list: (params) => request('/salary' + (params ? '?' + new URLSearchParams(params).toString() : '')),
    process: (body) => request('/salary/process', { method: 'POST', body: JSON.stringify(body) }),
  },
  advances: {
    list: () => request('/advances'),
    create: (body) => request('/advances', { method: 'POST', body: JSON.stringify(body) }),
  },
  activity: {
    list: () => request('/activity'),
  },
};
