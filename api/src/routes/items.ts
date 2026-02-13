/**
 * 📋 CRUD 路由模板
 *
 * 这是一个通用的资源增删改查路由示例。
 * 复制此文件并修改表名、字段即可快速创建新的业务路由。
 *
 * 特性：
 * - snake_case (DB) → camelCase (API) 自动转换
 * - Auth 中间件保护写操作
 * - 标准 RESTful 接口
 *
 * 禁用：在 api/src/index.ts 中注释 app.route('/items', items) 即可
 */
import { Hono } from 'hono';
import type { Env } from '../types';
import type { Item, ApiResponse } from '@shared/types';
import { authMiddleware } from '../middleware/auth';

const items = new Hono<{ Bindings: Env }>();

// ============================================================
// DB snake_case → API camelCase 转换
// 根据你的表结构修改此函数
// ============================================================
const toCamelCase = (row: any): Item => ({
  id: row.id,
  name: row.name,
  description: row.description,
  imageUrl: row.image_url,
  categoryId: row.category_id,
  createdAt: row.created_at,
});

// 获取所有
items.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM items ORDER BY created_at DESC'
  ).all();
  return c.json({ data: results.map(toCamelCase) });
});

// 获取单个
items.get('/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare(
    'SELECT * FROM items WHERE id = ?'
  ).bind(id).first();
  
  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.json({ data: toCamelCase(row) });
});

// 创建 (需要管理员权限)
items.post('/', authMiddleware, async (c) => {
  const body = await c.req.json<Omit<Item, 'id'>>();
  const id = crypto.randomUUID();
  
  await c.env.DB.prepare(
    'INSERT INTO items (id, name, description, image_url, category_id) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    id, 
    body.name, 
    body.description || null, 
    body.imageUrl || null,
    body.categoryId || null,
  ).run();

  return c.json({ data: { id, ...body }, message: '创建成功' });
});

// 更新 (需要管理员权限)
items.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<Partial<Item>>();
  
  await c.env.DB.prepare(
    'UPDATE items SET name = COALESCE(?, name), description = COALESCE(?, description), image_url = COALESCE(?, image_url), category_id = COALESCE(?, category_id) WHERE id = ?'
  ).bind(
    body.name, 
    body.description, 
    body.imageUrl, 
    body.categoryId,
    id,
  ).run();

  return c.json({ message: '更新成功' });
});

// 删除 (需要管理员权限)
items.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM items WHERE id = ?').bind(id).run();
  return c.json({ message: '已删除' });
});

export default items;
