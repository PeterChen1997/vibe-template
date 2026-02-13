/**
 * 🧭 应用入口 + 路由配置
 *
 * Layout = ThemeProvider + 页面内容 + 底部导航
 *
 * 禁用页面/功能：
 * - 注释路由行即可移除对应页面
 * - 移除 <BottomNav /> 可禁用底部导航
 * - 移除 <ThemeProvider> 可禁用主题系统
 */
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { AIPage } from './pages/AIPage';
import { SettingsPage } from './pages/SettingsPage';

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#F8F8FC] dark:bg-gray-900 transition-colors duration-300">
        <Outlet />
        <BottomNav />
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* ============================================================ */}
          {/* 📝 在这里添加或注释路由来管理页面 */}
          {/* ============================================================ */}
          <Route path="/" element={<HomePage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
