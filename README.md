# Vibe Repo Template 🚀

极简、高效、低成本（免费级）的全栈开源项目模板。

[English](#english-version) | [中文说明](#chinese-version)

---

<a name="chinese-version"></a>
## 🇨🇳 中文说明

### 核心架构
- **前端 (Web)**: React + Vite，部署于 **Vercel**。
- **后端 (API)**: Hono，部署于 **Cloudflare Workers**。
- **共享库 (Shared)**: `shared/` 目录存放前后端通用的类型与工具。
- **CI/CD**: **GitHub Actions** 自动化流水线。

### ⚙️ 环境变量与机密 (Secrets) 详述

为了实现自动化部署，请在 **GitHub Settings > Secrets > Actions** 中添加：

| 平台 | Secret 名称 | 描述 | 获取方式 |
| :--- | :--- | :--- | :--- |
| **GitHub** | `CLOUDFLARE_API_TOKEN` | 部署 Workers 的令牌 | CF > My Profile > API Tokens > Create (Edit Workers 模板) |
| **GitHub** | `CLOUDFLARE_ACCOUNT_ID` | CF 账户 ID | CF 控制台侧边栏底部 |
| **GitHub** | `VERCEL_TOKEN` | Vercel 认证令牌 | Vercel Settings > Tokens > Create |
| **GitHub** | `VERCEL_ORG_ID` | Vercel 组织 ID | `vercel link` 命令后在 `.vercel/project.json` 查看 |
| **GitHub** | `VERCEL_PROJECT_ID` | Vercel 项目 ID | `vercel link` 命令后在 `.vercel/project.json` 查看 |

#### 运行时环境变量

- **Cloudflare (Backend)**:
  - `ACCESS_TOKEN`: API 鉴权密钥。通过 `wrangler secret put ACCESS_TOKEN` 设置。
  - `DB`: D1 数据库绑定。详见 `api/wrangler.toml`。

- **Vercel (Frontend)**:
  - 核心配置在 `web/vercel.json`：将 `destination` 替换为你部署后的真实 Workers 域名。
  - 前端请求统一使用相对路径 `/api/*`。

### 🚀 自动化部署
1. 推送代码至 `main` 分支。
2. GitHub Actions 自动根据路径变动触发 `Deploy API` 或 `Deploy Web` 工作流。

---

<a name="english-version"></a>
## 🇺🇸 English Version

### Tech Stack
- **Frontend**: React/Vite/Vercel
- **Backend**: Hono/Cloudflare Workers
- **Shared**: Common Types & Utils
- **CI/CD**: GitHub Actions

### Environment Variables
Configure `CLOUDFLARE_API_TOKEN`, `VERCEL_TOKEN`, etc., in GitHub Secrets. Update `web/vercel.json` with your backend worker URL.

---
## License
MIT
