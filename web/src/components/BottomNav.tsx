/**
 * 📱 底部导航栏
 *
 * iOS 风格底部导航，支持 safe-area-inset 适配。
 * 修改 navItems 数组即可添加/移除导航项。
 *
 * 禁用：在 App.tsx 的 Layout 组件中移除 <BottomNav /> 即可。
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Bot, Settings as SettingsIcon } from 'lucide-react';

const Icons = {
  Home: LayoutGrid,
  AI: Bot,
  Settings: SettingsIcon
};

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================================
  // 📝 修改此数组来自定义导航项
  // ============================================================
  const navItems = [
    { path: '/', label: '首页', icon: Icons.Home },
    { path: '/ai', label: 'AI 助手', icon: Icons.AI },
    { path: '/settings', label: '设置', icon: Icons.Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl border-t border-white/30 dark:border-gray-800/50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] flex justify-around items-center h-20 pb-[env(safe-area-inset-bottom)] z-50 px-2 transition-all duration-300">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center space-y-1.5 w-full h-full transition-all duration-300 ${
              isActive ? 'text-indigo-500 scale-110 font-bold' : 'text-gray-400 dark:text-gray-500 opacity-60'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}>
              <Icon size={24} />
            </div>
            <span className="text-[10px] tracking-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
