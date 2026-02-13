/**
 * 🎨 主题系统
 *
 * 支持 light / dark / system 三种模式。
 * system 模式会自动跟随系统偏好设置。
 *
 * 禁用：在 App.tsx 中移除 <ThemeProvider> 包裹即可。
 */
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  return <>{children}</>;
};
