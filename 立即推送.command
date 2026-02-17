#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 正在推送到 GitHub..."
git push origin main
if [ $? -eq 0 ]; then
    echo "✅ 推送成功!"
    echo "⏳ Vercel 正在自动部署,请等待 1-2 分钟..."
else
    echo "❌ 推送失败,请检查网络或 GitHub 认证"
fi
sleep 5
