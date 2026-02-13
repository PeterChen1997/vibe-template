/**
 * 🏠 首页
 *
 * 模板欢迎页，展示 API 连接状态和技术栈信息。
 * 替换此文件的内容来创建你自己的首页。
 */
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { HelloMessage } from '@shared/types';
import { AIAnalyzer } from '../components/AIAnalyzer';

export const HomePage = () => {
  const [status, setStatus] = useState<string>('Loading...');
  const [data, setData] = useState<HelloMessage | null>(null);

  useEffect(() => {
    api.get('/health')
      .then(res => setStatus(`API Status: ${res.message || 'ok'}`))
      .catch(err => setStatus(`API Error: ${err.message}`));

    api.get<HelloMessage>('/hello')
      .then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch(() => setData({ message: 'Welcome to Vibe Template' }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center p-4 pb-24">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-2xl max-w-md w-full text-white text-center">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-md">Vibe Template</h1>
        <p className="text-lg opacity-90 mb-8 italic">
          High-efficiency, low-cost, full-stack template.
        </p>
        
        <div className="space-y-4 text-left">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <span className="text-xs uppercase tracking-wider opacity-60">Status</span>
            <p className="font-mono text-sm">{status}</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <span className="text-xs uppercase tracking-wider opacity-60">Message</span>
            <p className="text-xl font-semibold">
              {data ? data.message : '...'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <AIAnalyzer />
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <a 
            href="https://vercel.com" 
            target="_blank" 
            className="hover:scale-110 transition-transform bg-white/10 px-4 py-2 rounded-full text-xs"
          >
            Vercel
          </a>
          <a 
            href="https://workers.cloudflare.com" 
            target="_blank" 
            className="hover:scale-110 transition-transform bg-white/10 px-4 py-2 rounded-full text-xs"
          >
            Workers
          </a>
          <a 
            href="https://hono.dev" 
            target="_blank" 
            className="hover:scale-110 transition-transform bg-white/10 px-4 py-2 rounded-full text-xs"
          >
            Hono
          </a>
        </div>
      </div>
    </div>
  );
};
