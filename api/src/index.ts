import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';
import type { ApiResponse, HelloMessage } from '@shared/types';

// ============================================================
// 📦 模块路由导入
// 注释掉不需要的路由即可禁用对应功能
// ============================================================
import ai from './routes/ai';
import upload from './routes/upload';
import items from './routes/items';

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

// ============================================================
// 📦 模块路由注册
// 注释掉不需要的路由即可禁用对应功能
// ============================================================
app.route('/ai', ai);         // 🤖 AI 智能分析 + 聊天
app.route('/upload', upload);  // 📎 文件上传 (需要 R2)
app.route('/items', items);    // 📋 CRUD 示例

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
