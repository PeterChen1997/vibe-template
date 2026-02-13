/**
 * 🤖 AI 模块
 *
 * 功能：
 * - POST /analyze — 智能分析 (支持流式/非流式)
 * - POST /chat — 多轮对话 (非流式，支持上下文)
 *
 * 依赖：POE_API_KEY 环境变量
 * 禁用：在 api/src/index.ts 中注释 app.route('/ai', ai) 即可
 */
import { Hono } from 'hono';
import type { Env } from '../types';
import type { AiAnalyzeRequest, ChatRequest, ApiResponse } from '@shared/types';
import { authMiddleware } from '../middleware/auth';

const ai = new Hono<{ Bindings: Env }>();

// 所有 AI 接口都需要认证
ai.use('*', authMiddleware);

/**
 * 智能分析接口 (支持流式输出)
 * POST /ai/analyze
 * POST /ai/analyze?stream=1 (流式)
 */
ai.post('/analyze', async (c) => {
  const { text } = await c.req.json<AiAnalyzeRequest>();

  if (!c.env.POE_API_KEY) {
    return c.json({ error: 'POE_API_KEY not configured' }, 500);
  }

  const useStream = c.req.query('stream') === '1';

  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant. Provide concise and clear answers in Chinese.'
    },
    {
      role: 'user',
      content: text
    }
  ];

  try {
    const response = await fetch('https://api.poe.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.POE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gemini-3-flash',
        messages,
        stream: useStream
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Poe API error: ${error}`);
    }

    if (useStream) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const result = await response.json() as any;
      const content = result.choices[0].message.content;
      return c.json({ data: { content } } as ApiResponse);
    }
  } catch (err: any) {
    console.error('AI Error:', err);
    return c.json({ error: 'Failed to call AI service', message: err.message }, 500);
  }
});

/**
 * 多轮聊天接口 (非流式)
 * POST /ai/chat
 * 
 * Body: { text: string, context: ChatMessage[] }
 */
ai.post('/chat', async (c) => {
  const { text, context = [] } = await c.req.json<ChatRequest>();

  if (!c.env.POE_API_KEY) {
    return c.json({ error: 'POE_API_KEY not configured' }, 500);
  }

  const systemPrompt = `你是一个智能助手。请始终以中文回答用户。
你可以帮助用户解答问题、分析内容、提供建议。`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...context,
    { role: 'user', content: text }
  ];

  try {
    const response = await fetch('https://api.poe.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.POE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gemini-3-flash',
        messages,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Poe API error: ${error}`);
    }

    const result = await response.json() as any;
    const content = result.choices[0].message.content;
    
    return c.json({ data: { content } } as ApiResponse);
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    return c.json({ error: 'Failed to call AI service', message: err.message }, 500);
  }
});

export default ai;
