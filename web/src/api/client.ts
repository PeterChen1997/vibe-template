/**
 * 通用 API 请求客户端 (通过 Vercel 代理)
 */
import type { ApiResponse } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getAccessToken = () => {
  return localStorage.getItem('ACCESS_TOKEN') || 'vibe-dev-token';
};

export const setAccessToken = (token: string) => {
  localStorage.setItem('ACCESS_TOKEN', token);
};

export const apiClient = async <T = unknown>(
  path: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${path}`;
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.error('Unauthorized: Please check your ACCESS_TOKEN');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  get: <T = unknown>(path: string) => apiClient<T>(path, { method: 'GET' }),
  post: <T = unknown>(path: string, data: unknown) => 
    apiClient<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T = unknown>(path: string, data: unknown) => 
    apiClient<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T = unknown>(path: string) => apiClient<T>(path, { method: 'DELETE' }),
};
