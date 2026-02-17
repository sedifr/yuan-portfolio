#!/bin/bash

cd "$(dirname "$0")"

echo "🚀 开始推送到 GitHub..."
echo ""

git push origin main

echo ""
echo "=========================================="
echo "🎉 推送完成!"
echo "=========================================="
echo ""
echo "接下来:"
echo "1. 等待 1-2 分钟让 Vercel 自动部署"
echo "2. 我会在浏览器里帮你自动刷新验证!"
echo ""
