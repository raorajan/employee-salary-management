const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    ...options,
    headers,
  });
  
  const data = await res.json().catch(() => ({}));
  
  if (res.status === 401 && !url.includes('/auth/login')) {
    // Session expired or invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // We don't throw here so the app can handle the redirect via isAuthenticated state
    // But throwing an error is usually better so the caller knows it failed
  }

  if (!res.ok) {
    const error = new Error(data.message || data.error || res.statusText);
    error.response = { data, status: res.status };
    throw error;
  }
  return data;
}


// Auth API
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  changePassword: (body) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
};

export const api = {
  employees: {
    list: () => request('/employees'),
    create: (body) => request('/employees', { method: 'POST', body: JSON.stringify(body) }),
    remove: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
    update: (id, body) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
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
