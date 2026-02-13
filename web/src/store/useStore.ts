/**
 * 🗄️ Zustand 状态管理
 *
 * 通用状态 Store，含认证和主题管理。
 * 使用 persist 中间件实现 localStorage 持久化。
 *
 * 用法：
 *   import { useStore } from '@/store/useStore';
 *   const { isAdmin, theme, setTheme } = useStore();
 *
 * 扩展：直接在 AppState 接口和 create 回调中添加新的 slice 即可。
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // 认证
  token: string | null;
  setToken: (token: string | null) => void;
  isAdmin: boolean;

  // 主题
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // 认证
      token: null,
      isAdmin: false,
      setToken: (token) => set({ token, isAdmin: !!token }),

      // 主题
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'vibe-app-storage',
      partialize: (state) => ({
        token: state.token,
        isAdmin: state.isAdmin,
        theme: state.theme,
      }),
    }
  )
);
