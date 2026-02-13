/**
 * 📦 文件上传模块 (R2 存储)
 *
 * 功能：文件上传 + 静态资源代理
 * 依赖：wrangler.toml 中启用 R2 绑定 (MEDIA_BUCKET)
 * 禁用：在 api/src/index.ts 中注释 app.route('/upload', upload) 即可
 */
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

// 上传文件
app.post('/', async (c) => {
  try {
    if (!c.env.MEDIA_BUCKET) {
      return c.json({ error: 'R2 storage not configured. Enable MEDIA_BUCKET in wrangler.toml' }, 500);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    const ext = file.name.split('.').pop() || 'bin';
    const key = `${nanoid()}.${ext}`;

    await c.env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const url = `/api/upload/${key}`;
    return c.json({ 
      data: {
        url,
        key,
        size: file.size,
        type: file.type
      }
    });
  } catch (e: any) {
    console.error('Upload error:', e);
    return c.json({ error: e.message }, 500);
  }
});

// 代理访问已上传的文件
app.get('/:key', async (c) => {
  if (!c.env.MEDIA_BUCKET) {
    return c.json({ error: 'R2 storage not configured' }, 500);
  }

  const key = c.req.param('key');
  const object = await c.env.MEDIA_BUCKET.get(key);

  if (!object) {
    return c.json({ error: 'Object Not Found' }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000');

  return new Response(object.body, {
    headers,
  });
});

export default app;
