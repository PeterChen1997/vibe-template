/**
 * 🌐 API 客户端
 *
 * 功能：
 * - 标准 CRUD (GET/POST/PUT/DELETE)
 * - AI 流式分析 (analyzeContentStream)
 * - AI 聊天 (chat)
 * - 文件上传 (upload)
 * - Token 管理 (getAccessToken / setAccessToken)
 */
import type { ApiResponse, ChatMessage } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getAccessToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('vibe-app-storage') || '{}');
    return stored?.state?.token || 'vibe-dev-token';
  } catch {
    return 'vibe-dev-token';
  }
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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
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
   * 📎 文件上传
   */
  upload: async (file: File): Promise<ApiResponse<{ url: string; key: string; size: number; type: string }>> => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * 🤖 AI 多轮聊天 (非流式)
   */
  chat: async (text: string, context: ChatMessage[] = []): Promise<ApiResponse<{ content: string }>> => {
    return apiClient('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ text, context }),
    });
  },

  /**
   * 🤖 AI 智能解析 (支持流式输出)
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
