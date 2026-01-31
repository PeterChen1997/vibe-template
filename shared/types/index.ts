export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
export interface HelloMessage {
  message: string;
}

export interface AiAnalyzeRequest {
  text: string;
}

export interface AiAnalyzeResponse {
  content: string;
}
