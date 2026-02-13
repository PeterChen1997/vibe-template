// ============================================================
// 通用 API 响应
// ============================================================
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HelloMessage {
  message: string;
}

// ============================================================
// AI 模块类型
// ============================================================
export interface AiAnalyzeRequest {
  text: string;
  imageUrl?: string;
}

export interface AiAnalyzeResponse {
  content: string;
}

export interface ChatRequest {
  text: string;
  context?: ChatMessage[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// ============================================================
// CRUD 示例类型
// 根据你的业务需求修改或扩展
// ============================================================
export interface Category {
  id: string;
  name: string;
  sortOrder?: number;
}

export interface Item {
  id: string;
  categoryId?: string;
  name: string;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
}
