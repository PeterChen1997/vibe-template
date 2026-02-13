/**
 * 🤖 AI 聊天页面
 *
 * 通用多轮对话界面，支持 Markdown 渲染、快捷问题、自动滚动。
 * 禁用：在 App.tsx 的路由表中移除 /ai 路由即可。
 *
 * 依赖：react-markdown
 */
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../api/client';
import type { ChatMessage } from '@shared/types';

const Icons = {
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Bot: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path></svg>,
};

export const AIPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '您好！我是您的 AI 助手。有什么我可以帮助您的吗？' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // 📝 修改此数组来自定义快捷问题
  // ============================================================
  const quickQuestions = [
    '帮我写一个简单的 TODO 应用方案',
    '解释一下 React hooks 的最佳实践',
    '帮我分析这段代码的性能瓶颈',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chat(text, messages.map(({role, content}) => ({role, content})));
      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: response.data?.content || ''
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我遇到了点问题，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 overflow-hidden">
      {/* Markdown Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          font-weight: 700;
          margin: 1.25rem 0 0.75rem 0;
          color: inherit;
        }
        .markdown-content h1 { font-size: 1.25rem; }
        .markdown-content h2 { font-size: 1.1rem; }
        .markdown-content h3 { font-size: 1rem; }
        .markdown-content p { margin-bottom: 0.85rem; line-height: 1.6; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .markdown-content li { margin-bottom: 0.5rem; }
        .markdown-content strong { font-weight: 700; color: #6366f1; }
        .markdown-content code {
          background-color: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          padding: 0.125rem 0.375rem;
          border-radius: 0.375rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
        }
      `}} />

      {/* Header */}
      <header className="px-6 py-4 border-b border-indigo-100/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-3 z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
          <Icons.Bot />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-gray-100">AI 助手</h1>
          <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest opacity-80">Powered by AI</p>
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth bg-gray-50/50 dark:bg-gray-900/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-5 py-3.5 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-indigo-500 text-white rounded-tr-none shadow-indigo-100/50 dark:shadow-none'
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-tl-none'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-indigo-400 px-5 py-3.5 rounded-[1.5rem] rounded-tl-none text-sm flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
              正在思考...
            </div>
          </div>
        )}

        {/* Quick Questions */}
        {!loading && messages.length < 5 && (
          <div className="pt-4 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">您可以这样问我：</p>
            <div className="flex flex-wrap gap-2.5">
              {quickQuestions.map((q, i) => (
                <button
                   key={i}
                   onClick={() => handleSend(q)}
                   className="px-4 py-2 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 rounded-xl text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-600 transition-all shadow-sm active:scale-95"
                >
                   {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-10">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="输入你的问题..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-[1.25rem] py-3.5 px-6 text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-200 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-indigo-500 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none active:scale-90 hover:bg-indigo-600 transition-all disabled:opacity-30 disabled:shadow-none disabled:bg-gray-200 dark:disabled:bg-gray-800"
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
};
