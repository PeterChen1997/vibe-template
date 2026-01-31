import { Hono } from 'hono';
import type { Env } from '../types';
import type { AiAnalyzeRequest, ApiResponse } from '@shared/types';

const ai = new Hono<{ Bindings: Env }>();

ai.post('/analyze', async (c) => {
  const { text } = await c.req.json<AiAnalyzeRequest>();

  if (!c.env.POE_API_KEY) {
    return c.json({ error: 'POE_API_KEY not configured' }, 500);
  }

  // Check if streaming is requested
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
        model: 'claude-3-5-sonnet', // or any model supported by Poe
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

export default ai;
