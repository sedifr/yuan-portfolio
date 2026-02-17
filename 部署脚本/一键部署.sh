#!/bin/bash

# 袁灏作品集 - Vercel 自动同步版 - 一键部署脚本
# ========================================

echo "🚀 开始部署流程..."
echo ""

# 检查 Git 是否安装
if ! command -v git &> /dev/null
then
    echo "❌ 错误:Git 未安装"
    echo "请先安装 Git: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git 已安装: $(git --version)"
echo ""

# 第一步:初始化 Git 仓库
echo "📝 第一步:初始化 Git 仓库..."
git init
git branch -m main
echo "✅ Git 仓库初始化完成"
echo ""

# 第二步:配置 Git 用户信息(如果还没配置)
if [ -z "$(git config user.name)" ]; then
    echo "⚠️  需要配置 Git 用户信息"
    read -p "请输入你的名字: " git_name
    read -p "请输入你的邮箱: " git_email
    git config user.name "$git_name"
    git config user.email "$git_email"
    echo "✅ Git 用户信息配置完成"
else
    echo "✅ Git 用户信息已配置: $(git config user.name)"
fi
echo ""

# 第三步:添加所有文件
echo "📦 第三步:添加所有文件到 Git..."
git add .
echo "✅ 所有文件已添加"
echo ""

# 第四步:创建第一次提交
echo "💾 第四步:创建提交..."
git commit -m "Initial commit - Auto sync version with Vercel

Features:
- Auto sync admin panel (save → auto deploy)
- Vercel serverless API integration
- GitHub as data storage
- Complete deployment documentation
- Multi-language support (JA/ZH/EN)
- All images and assets included"
echo "✅ 提交创建完成"
echo ""

# 第五步:提示创建 GitHub 仓库
echo "=========================================="
echo "🌟 第五步:创建 GitHub 仓库"
echo "=========================================="
echo ""
echo "请在浏览器中完成以下步骤:"
echo ""
echo "1. 访问: https://github.com/new"
echo "2. Repository name: yuan-portfolio"
echo "3. 选择 Public (公开)"
echo "4. ❌ 不要勾选 'Add a README file'"
echo "5. 点击 'Create repository'"
echo ""
read -p "完成后按 Enter 继续..."
echo ""

# 第六步:关联远程仓库
echo "🔗 第六步:关联 GitHub 仓库..."
echo ""
read -p "请输入你的 GitHub 用户名: " github_username
echo ""
git remote add origin "https://github.com/$github_username/yuan-portfolio.git"
echo "✅ 远程仓库已关联"
echo ""

# 第七步:推送到 GitHub
echo "⬆️  第七步:推送到 GitHub..."
echo ""
echo "即将推送代码到 GitHub,可能需要输入密码或 token..."
echo ""
git push -u origin main
echo ""
echo "✅ 代码已推送到 GitHub!"
echo ""

# 第八步:提示创建 GitHub Token
echo "=========================================="
echo "🔑 第八步:创建 GitHub Token"
echo "=========================================="
echo ""
echo "请在浏览器中完成以下步骤:"
echo ""
echo "1. 访问: https://github.com/settings/tokens"
echo "2. 点击 'Generate new token' → 'Generate new token (classic)'"
echo "3. Note: Portfolio Auto Sync"
echo "4. Expiration: No expiration"
echo "5. ✅ 勾选 'repo' (完整的仓库控制)"
echo "6. 点击 'Generate token'"
echo "7. 复制生成的 token (格式: ghp_xxxxx...)"
echo ""
read -p "完成后按 Enter 继续..."
echo ""

# 第九步:提示部署到 Vercel
echo "=========================================="
echo "🚀 第九步:部署到 Vercel"
echo "=========================================="
echo ""
echo "请在浏览器中完成以下步骤:"
echo ""
echo "1. 访问: https://vercel.com/new"
echo "2. 点击 'Import Git Repository'"
echo "3. 选择你的 GitHub 仓库: yuan-portfolio"
echo "4. 添加环境变量 (重要!):"
echo ""
echo "   GITHUB_TOKEN = 你刚才复制的 token"
echo "   GITHUB_OWNER = $github_username"
echo "   GITHUB_REPO = yuan-portfolio"
echo "   GITHUB_BRANCH = main"
echo ""
echo "5. 点击 'Deploy'"
echo "6. 等待 30-60 秒,部署完成!"
echo ""
echo "=========================================="
echo "🎉 恭喜!部署流程完成!"
echo "=========================================="
echo ""
echo "✅ 你的网站即将上线!"
echo ""
echo "接下来:"
echo "1. 复制 Vercel 给你的网址"
echo "2. 访问 你的网址/admin.html"
echo "3. 密码: yuan2026"
echo "4. 添加作品 → 点保存 → 等 1 分钟 → 自动上线!"
echo ""
echo "🌟 享受自动同步的爽快感吧!"
echo ""
