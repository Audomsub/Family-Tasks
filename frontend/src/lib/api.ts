const API_BASE = '/api';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const fetcher = async (endpoint: string) => {
  const res = await fetch(`${API_BASE}${endpoint}`, { headers: getHeaders() });
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    (error as any).status = res.status;
    throw error;
  }
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text; // Return as plain string if it's not JSON
  }
};

export const api = {
  get: fetcher,
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API POST ${endpoint} failed`);
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
  patch: async (endpoint: string, data?: any) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`API PATCH ${endpoint} failed`);
    const text = await res.text();
    if (!text) return true;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
  put: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API PUT ${endpoint} failed`);
    const text = await res.text();
    if (!text) return true;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
  del: async (endpoint: string) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`API DELETE ${endpoint} failed`);
    const text = await res.text();
    if (!text) return true;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
};
