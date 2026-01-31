import React, { useState } from 'react';
import { api } from '../api/client';

export const AIAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setResult('');
    setError(null);

    try {
      await api.analyzeContentStream(input, (_chunk, fullContent) => {
        setResult(fullContent);
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || '分析失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="relative group">
        <textarea
          className="w-full min-h-[150px] p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all resize-none"
          placeholder="请输入您想分析的内容 (例如：帮我总结这段代码，或者写一个周报)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              handleAnalyze();
            }
          }}
        />
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <span className="text-xs text-white/40">Cmd + Enter 可快速提交</span>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>分析中...</span>
              </>
            ) : (
              <>
                <span>✨ 智能分析</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl text-red-200 text-sm animate-shake">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <span>🤖 AI 分析结果</span>
            </h3>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white text-xs"
              title="复制内容"
            >
              📋 复制
            </button>
          </div>
          <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed opacity-90">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
