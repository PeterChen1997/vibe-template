import { Context, Next } from 'hono';
import type { Env } from '../types';

export const authMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== c.env.ACCESS_TOKEN) {
    return c.json({ error: 'Unauthorized', message: '需要有效的管理 Token' }, 401);
  }

  await next();
};
