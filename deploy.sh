#!/bin/bash

# Vibe Project 部署脚本
set -e

COMMAND=$1

deploy_api() {
  echo "🚀 正在部署 API (Cloudflare Workers)..."
  cd api
  npm install
  echo "📦 执行数据库迁移..."
  npm run db:migrate:remote
  npm run deploy
  cd ..
  echo "✅ API 部署完成！"
}

deploy_web() {
  echo "🚀 正在部署 Web (Vercel)..."
  echo "提示: Vercel 通常推荐通过 Git Push 自动部署。"
  echo "如果你想手动部署，请确保已安装 vercel cli 并运行 'vercel --prod'。"
  # 你可以在这里添加 npx vercel --prod 如果环境已配置
  cd web
  npm install
  # npm run build # Vercel 云端会自动运行构建
  cd ..
  echo "✅ Web 部署指令已发送 (请检查 Vercel 控制台)！"
}

case $COMMAND in
  "api")
    deploy_api
    ;;
  "web")
    deploy_web
    ;;
  "all")
    deploy_api
    deploy_web
    ;;
  *)
    echo "使用说明: ./deploy.sh [api|web|all]"
    exit 1
    ;;
esac
