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
| **共享库** | `shared/` 目录 (类型 & 工具) | — |

---

## 📁 目录结构

```text
├── .github/workflows/     # CI/CD (仅 API)
│   └── deploy-api.yml     # Workers 自动部署
│   ├── routes/            # 路由定义 (如 ai.ts)
│   ├── src/               # Hono 应用代码
│   ├── migrations/        # D1 数据库迁移
│   └── wrangler.toml      # Cloudflare 配置
├── web/                   # 前端
│   ├── src/               # React 应用代码
│   ├── vercel.json        # Vercel 代理配置
│   └── .env.example       # 环境变量示例
├── shared/                # 前后端共享
│   ├── types/             # 通用类型定义
│   └── utils/             # 通用工具函数
└── package.json           # Monorepo 配置 (workspaces)
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

### 3. 配置数据库 (首次)

```bash
# 本地创建 D1 数据库
cd api && npx wrangler d1 create vibe-db

# 将返回的 database_id 填入 api/wrangler.toml
```

### 4. AI 功能配置 (可选)

项目内置了 AI 智能分析功能 (基于 Poe API)：

1. 获取您的 **Poe API Key**。
2. 在 `api/wrangler.toml` 中配置 `POE_API_KEY`。
3. 本地开发时，可在 `api/.dev.vars` 中添加 `POE_API_KEY=your_key`。

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
| `POE_API_KEY` | Poe API 密钥 | `wrangler secret put POE_API_KEY` |

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

推送代码到 `main` 分支后，若 `api/` 或 `shared/` 目录有变动，GitHub Actions 会自动触发部署。

### Web 部署 (自动)

Vercel 会自动监听仓库变化，推送即部署，无需额外配置。

### 手动部署

```bash
# 仅部署 API
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
| `npm run deploy:api` | 手动部署 API |
| `npm run db:migrate` | 本地执行数据库迁移 |
| `npm run db:migrate:remote` | 远程执行数据库迁移 |

---

## 📝 路径别名

项目已配置路径别名，推荐使用：

```typescript
// 前端
import { api } from '@/api/client';
import type { ApiResponse } from '@shared/types';

// 后端
import type { ApiResponse } from '@shared/types';
```

---

## 📄 License

MIT
