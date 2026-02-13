-- ============================================================
-- 示例初始化迁移
-- 根据你的业务需求修改此文件
-- 运行: npm run db:migrate (本地) / npm run db:migrate:remote (生产)
-- ============================================================

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 通用资源表 (对应 api/src/routes/items.ts)
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  name TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 插入示例分类
INSERT INTO categories (id, name, sort_order) VALUES ('cat_all', '全部', 0);
INSERT INTO categories (id, name, sort_order) VALUES ('cat_default', '默认', 1);
