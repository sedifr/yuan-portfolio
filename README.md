# 袁灏作品集网站 - Vercel 自动同步版

## ⚡ 快速开始

### 第一步:上传到 GitHub

```bash
# 1. 在 GitHub 创建新仓库:yuan-portfolio

# 2. 在项目文件夹执行:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/yuan-portfolio.git
git push -u origin main
```

### 第二步:创建 GitHub Token

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token → 勾选 `repo` 权限
3. 复制生成的 token (保存好!)

### 第三步:部署到 Vercel

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 导入 GitHub 仓库:`yuan-portfolio`
3. **添加环境变量**:
   ```
   GITHUB_TOKEN = ghp_你的token
   GITHUB_OWNER = 你的GitHub用户名
   GITHUB_REPO = yuan-portfolio
   GITHUB_BRANCH = main
   ```
4. 点击 Deploy

### 第四步:测试

1. 打开:`https://你的域名.vercel.app/admin.html`
2. 密码:`yuan2026`
3. 添加一个作品 → 点保存
4. ✅ 等 1 分钟,自动上线!

---

## 📖 详细教程

查看完整的部署指南:
- [VERCEL部署指南.md](./部署文档/VERCEL部署指南.md) - 图文详解,手把手教学

---

## ✨ 特性

✅ **完全自动化** - 后台点保存 → 自动上线
✅ **完全免费** - Vercel + GitHub 永久免费
✅ **版本控制** - 可以随时回滚
✅ **全球加速** - Vercel CDN
✅ **稳定可靠** - 不丢图片,不卡顿

---

## 🛠️ 项目结构

```
portfolio-demo/
├── index.html              # 主页面
├── admin.html              # 管理后台
├── admin-logic.js          # 后台逻辑(自动同步版)
├── data-loader.js          # 数据加载
├── data/
│   ├── videos.json         # 影像作品数据
│   └── apps.json           # AI应用数据
├── assets/
│   └── images/             # 图片资源
├── api/
│   ├── save-data.js        # Vercel API (自动保存 JSON)
│   └── upload-image.js     # Vercel API (自动上传图片)
├── vercel.json             # Vercel 配置
├── package.json            # 项目配置
├── 部署文档/
│   └── VERCEL部署指南.md   # 详细教程
```

---

## 🎯 使用方法

### 添加新作品

1. 打开管理后台:`https://你的域名/admin.html`
2. 填写作品信息(三种语言)
3. 上传封面图
4. 点击"保存"
5. ✅ 完成!等 1 分钟自动上线

**不需要任何手动上传操作!**

---

## 💡 技术栈

- **前端**:原生 HTML/CSS/JavaScript
- **后端**:Vercel Serverless Functions
- **存储**:GitHub Repository
- **部署**:Vercel (自动 CI/CD)
- **CDN**:Vercel Edge Network

---

## 📞 问题排查

### 保存失败?

→ 检查 Vercel 环境变量是否正确设置

### 网站没更新?

→ 等待 30-60 秒,然后强制刷新(Ctrl+F5)

### 图片显示不出来?

→ 确保图片在 GitHub 仓库的 `assets/images/` 文件夹里

---

## 📝 License

MIT License - 自由使用和修改

---

**Made with ❤️ by 袁灏**
