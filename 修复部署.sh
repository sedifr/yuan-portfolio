#!/bin/bash

echo "🚀 开始部署修复..."
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查 Git 状态
echo "📋 检查 Git 状态..."
git status
echo ""

# 添加修改的文件
echo "📦 添加修改的文件..."
git add data-loader.js "AI应用空白问题-诊断指南.md"
echo "✅ 文件已添加"
echo ""

# 提交
echo "💾 提交修改..."
git commit -m "Fix: 修复 AI 应用不显示的问题

- 在 loadApps() 函数中添加自动触发 reveal 动画的代码
- 应用加载后会依次显示,有漂亮的动画效果
- 添加了详细的调试日志和诊断指南"
echo "✅ 提交完成"
echo ""

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
git push origin main
echo "✅ 推送完成"
echo ""

echo "=========================================="
echo "🎉 部署完成!"
echo "=========================================="
echo ""
echo "接下来:"
echo "1. 等待 1-2 分钟让 Vercel 自动部署"
echo "2. 访问你的网站: https://portfolio-demo-phi-liard.vercel.app"
echo "3. 强制刷新(Cmd+Shift+R)清除缓存"
echo "4. 点击'アプリケーション'菜单"
echo "5. ✅ 应用应该会漂亮地依次显示出来了!"
echo ""
