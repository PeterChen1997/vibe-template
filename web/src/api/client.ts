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
  
  /**
   * AI 智能解析 (支持流式输出)
   */
  analyzeContentStream: async (
    text: string,
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<string> => {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/ai/analyze?stream=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'AI analysis failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('ReadableStream not supported');

    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices?.[0]?.delta?.content) {
              const content = parsed.choices[0].delta.content;
              fullContent += content;
              onChunk(content, fullContent);
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }

    return fullContent;
  },
};
