/**
 * ⚙️ 设置页面
 *
 * 功能：管理员 Token 登录/登出、用户角色显示。
 * 禁用：在 App.tsx 的路由表中移除 /settings 路由即可。
 */
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Icons = {
  ChevronLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ),
};

const themeOptions: { value: 'light' | 'dark' | 'system'; label: string }[] = [
  { value: 'light', label: '☀️ 浅色' },
  { value: 'dark', label: '🌙 深色' },
  { value: 'system', label: '💻 跟随系统' },
];

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { isAdmin, setToken, theme, setTheme } = useStore();

  const handleLogin = () => {
    const input = prompt('请输入管理员 Token：');
    if (input) {
      setToken(input);
      alert('已成功切换为管理员模式');
    }
  };

  const handleLogout = () => {
    if (confirm('确定要退出管理员模式吗？')) {
      setToken(null);
    }
  };

  const sections = [
    { title: '账户设置', items: [
      { label: isAdmin ? '管理员信息' : '点击登录管理员', icon: Icons.User, onClick: isAdmin ? undefined : handleLogin }, 
      { label: '安全与隐私', icon: Icons.Shield }
    ] },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-gray-900 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 sticky top-0 bg-[#F2F2F7]/80 dark:bg-gray-900/80 backdrop-blur-xl z-30">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-sm mr-4 text-gray-800 dark:text-gray-200 active:scale-90 transition-all"
          >
            <Icons.ChevronLeft />
          </button>
          <h1 className="text-3xl font-[900] text-gray-900 dark:text-gray-100 tracking-tight">设置</h1>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-8">
        {/* User Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] p-5 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-900/10 flex items-center justify-center text-2xl shadow-inner">
            {isAdmin ? '👑' : '👤'}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">{isAdmin ? '管理员' : '普通用户'}</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">{isAdmin ? '拥有全部管理权限' : '点击下方登录获取管理权限'}</p>
          </div>
          {isAdmin && (
            <div className="text-green-500">
               <Icons.Shield />
            </div>
          )}
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[13px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest pl-4 mb-2">
                {section.title}
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] overflow-hidden shadow-sm">
                {section.items.map((item, idx) => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between p-4 px-5 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors ${
                      idx !== section.items.length - 1 ? 'border-b border-gray-100/50 dark:border-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <item.icon />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</span>
                    </div>
                    <div className="text-gray-300 dark:text-gray-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Theme Selector */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest pl-4 mb-2">
              外观
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] overflow-hidden shadow-sm p-2">
              <div className="flex gap-2">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                      theme === opt.value
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        {isAdmin && (
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-white dark:bg-gray-800 text-[#FF3B30] font-bold rounded-[1.5rem] shadow-sm active:scale-95 transition-all mt-4 border border-transparent dark:border-red-900/20"
          >
            退出管理员模式
          </button>
        )}

        <p className="text-center text-[10px] text-gray-300 dark:text-gray-700 font-medium">Vibe Template v0.1.0</p>
      </div>
    </div>
  );
};
