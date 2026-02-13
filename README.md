# Vibe Repo Template 🚀

极简、高效、零成本的全栈开源项目模板。

---

## 📐 技术架构

| 层 | 技术栈 | 部署平台 |
| :--- | :--- | :--- |
| **前端** | React + Vite + TailwindCSS + Zustand | Vercel (Git 集成自动部署) |
| **后端** | Hono + TypeScript | Cloudflare Workers (GitHub Actions) |
| **数据库** | Cloudflare D1 (SQLite) | Cloudflare |
| **存储** | Cloudflare R2 (可选) | Cloudflare |
| **AI** | Poe API (可选) | — |
| **共享库** | `shared/` 目录 (类型 & 工具) | — |
| **E2E 测试** | Playwright | — |

---

## 📦 内置模块

模板采用 **"默认包含、注释即禁用"** 的插件设计，所有模块均可通过一行注释快速启用/禁用。

| 模块 | 说明 | 禁用方式 |
| :--- | :--- | :--- |
| 🔐 Auth 中间件 | Bearer Token 管理员鉴权 | 不在路由中引用 |
| 📎 文件上传 | R2 文件上传 + 代理访问 | 注释 `index.ts` 的 `app.route` |
| 📋 CRUD 模板 | 通用增删改查路由 (含 snake→camelCase) | 注释 `index.ts` 的 `app.route` |
| 🤖 AI 分析 | 流式/非流式智能分析 | 注释 `index.ts` 的 `app.route` |
| 💬 AI 聊天 | 多轮对话 + Markdown 渲染 | 注释 `App.tsx` 路由行 |
| 🎨 暗色模式 | light / dark / system 三模式 | 移除 `<ThemeProvider>` |
| 📱 底部导航 | iOS 风格 + safe-area 适配 | 移除 `<BottomNav />` |
| ⚙️ 设置页 | Token 管理 + 主题切换 | 注释 `App.tsx` 路由行 |
| 📷 图片裁剪 | 选择 → 裁剪 → 上传 | 不引用组件即可 |
| 🧪 E2E 测试 | Playwright 冒烟测试 | — |

---

## 📁 目录结构

```text
├── .github/workflows/      # CI/CD
│   └── deploy-api.yml      # Workers 自动部署 (支持手动触发)
├── api/                     # 后端 (Cloudflare Workers)
│   ├── src/
│   │   ├── index.ts         # 入口 (路由注册，注释即禁用)
│   │   ├── types.ts         # 环境变量类型
│   │   ├── middleware/
│   │   │   └── auth.ts      # 🔐 认证中间件
│   │   └── routes/
│   │       ├── ai.ts        # 🤖 AI 分析 + 聊天
│   │       ├── upload.ts    # 📎 文件上传 (R2)
│   │       └── items.ts     # 📋 CRUD 路由模板
│   ├── migrations/          # D1 数据库迁移
│   └── wrangler.toml        # Cloudflare 配置
├── web/                     # 前端 (React + Vite)
│   ├── src/
│   │   ├── App.tsx          # 🧭 路由配置 (注释即禁用页面)
│   │   ├── api/client.ts    # 🌐 API 客户端
│   │   ├── store/useStore.ts # 🗄️ Zustand 状态管理
│   │   ├── components/
│   │   │   ├── ThemeProvider.tsx   # 🎨 暗色模式
│   │   │   ├── BottomNav.tsx      # 📱 底部导航
│   │   │   ├── AIAnalyzer.tsx     # 🤖 AI 分析组件
│   │   │   └── ImageUploader.tsx  # 📷 图片裁剪上传
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       # 🏠 首页
│   │   │   ├── AIPage.tsx         # 💬 AI 聊天
│   │   │   └── SettingsPage.tsx   # ⚙️ 设置
│   │   └── utils/cropImage.ts     # 🖼️ 裁剪工具
│   └── vercel.json          # Vercel 代理 + SPA 回退
├── shared/                  # 前后端共享
│   ├── types/               # 通用类型定义
│   └── utils/               # 通用工具函数
├── e2e/                     # E2E 测试
│   └── smoke.spec.ts        # 冒烟测试
├── playwright.config.ts     # Playwright 配置
├── deploy.sh                # 部署脚本 (含 DB 迁移)
└── package.json             # Monorepo 配置 (workspaces)
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

这会同时启动：
- 前端: `http://localhost:5173`
- 后端: `http://localhost:8787`

> 开发模式下 `/api` 请求会自动代理到 Workers (已配置 Vite proxy)。

### 3. 配置数据库 (首次)

```bash
# 本地创建 D1 数据库
cd api && npx wrangler d1 create vibe-db

# 将返回的 database_id 填入 api/wrangler.toml
# 然后执行迁移
npm run db:migrate
```

### 4. AI 功能配置 (可选)

项目内置了 AI 智能分析 + 多轮聊天功能 (基于 Poe API)：

1. 获取您的 **Poe API Key**。
2. 本地开发：在 `api/.dev.vars` 中添加 `POE_API_KEY=your_key`。
3. 生产环境：运行 `wrangler secret put POE_API_KEY`。

### 5. R2 文件上传 (可选)

1. 在 Cloudflare 控制台创建 R2 存储桶 `vibe-media`。
2. 取消 `api/wrangler.toml` 中 R2 相关行的注释。

---

## ⚙️ 环境变量配置

### GitHub Secrets (用于 API 自动部署)

在 GitHub 仓库 `Settings > Secrets > Actions` 中添加：

| Secret 名称 | 描述 | 获取方式 |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | CF API 令牌 | [My Profile > API Tokens](https://dash.cloudflare.com/profile/api-tokens) (使用 "Edit Cloudflare Workers" 模板) |
| `CLOUDFLARE_ACCOUNT_ID` | CF 账户 ID | Cloudflare 控制台侧边栏底部 |

### Cloudflare Workers 运行时变量

| 变量名 | 描述 | 设置方式 |
| :--- | :--- | :--- |
| `ACCESS_TOKEN` | API 鉴权密钥 | `wrangler secret put ACCESS_TOKEN` |
| `DB` | D1 数据库绑定 | 在 `wrangler.toml` 中配置 |
| `POE_API_KEY` | Poe API 密钥 (可选) | `wrangler secret put POE_API_KEY` |
| `MEDIA_BUCKET` | R2 存储桶 (可选) | 在 `wrangler.toml` 中配置 |

### Vercel 配置

> **重要**：前端部署使用 **Vercel 原生 Git 集成**，无需 GitHub Actions。

1. 在 [Vercel 控制台](https://vercel.com/new) 导入仓库时，设置：
   - **Root Directory**: `web`
   - **Framework Preset**: Vite

2. 修改 `web/vercel.json` 中的 API 代理地址：
   ```json
   {
     "rewrites": [{
       "source": "/api/:path*",
       "destination": "https://你的域名.workers.dev/:path*"
     }]
   }
   ```

---

## 🔄 部署流程

### API 部署 (自动)

推送代码到 `main` 分支后，若 `api/` 或 `shared/` 目录有变动，GitHub Actions 会自动触发部署（含数据库迁移）。也可在 Actions 页面手动触发。

### Web 部署 (自动)

Vercel 会自动监听仓库变化，推送即部署，无需额外配置。

### 手动部署

```bash
# 部署全部 (API + Web)
./deploy.sh all

# 仅部署 API (含 DB 迁移)
npm run deploy:api

# 本地部署 Web (需先 vercel link)
cd web && vercel --prod
```

---

## 🛠 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `npm run dev` | 同时启动前后端开发服务器 |
| `npm run build` | 构建前后端 |
| `npm run deploy:api` | 手动部署 API (含 DB 迁移) |
| `npm run db:migrate` | 本地执行数据库迁移 |
| `npm run db:migrate:remote` | 远程执行数据库迁移 |
| `npx playwright test` | 运行 E2E 测试 |

---

## 📝 路径别名

项目已配置路径别名，推荐使用：

```typescript
// 前端
import { api } from '@/api/client';
import { useStore } from '@/store/useStore';
import type { ApiResponse } from '@shared/types';

// 后端
import type { ApiResponse } from '@shared/types';
```

---

## 📄 License

MIT
