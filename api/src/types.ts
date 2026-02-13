export interface Env {
  DB: D1Database;
  MEDIA_BUCKET?: R2Bucket;   // 可选：文件上传需要，在 wrangler.toml 中启用
  ACCESS_TOKEN: string;
  CORS_ORIGIN: string;
  POE_API_KEY: string;
}
