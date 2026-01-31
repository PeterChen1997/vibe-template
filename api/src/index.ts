import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';
import type { ApiResponse, HelloMessage } from '@shared/types';

const app = new Hono<{ Bindings: Env }>();

// 请求日志
app.use('*', logger());

// CORS 配置
app.use('*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  credentials: true,
}));

// 健康检查
app.get('/health', (c) => {
  const res: ApiResponse = { message: 'ok' };
  return c.json(res);
});

// 示例路由
app.get('/hello', (c) => {
  const result: ApiResponse<HelloMessage> = {
    data: { message: 'Hello from Vibe API (Workers)' }
  };
  return c.json(result);
});

// 404 处理
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// 全局错误处理
app.onError((err, c) => {
  console.error('Unhandled Error:', err);
  return c.json({ 
    error: 'Internal Server Error',
    message: err.message 
  }, 500);
});

export default app;
