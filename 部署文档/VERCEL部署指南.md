# 🚀 Vercel 自动同步版 - 部署指南

## 🎯 新版本特性

✅ **完全自动化** - 后台点"保存"就自动上线,不需要任何手动操作
✅ **完全免费** - 使用 Vercel + GitHub,永久免费
✅ **版本控制** - 每次保存都有历史记录,可以随时回滚
✅ **全球加速** - Vercel CDN,全球访问速度都很快
✅ **稳定可靠** - 不会像腾讯云那样丢失图片或卡顿

---

## 📋 准备工作

### 需要的账号(全部免费):
1. ✅ GitHub 账号 - [注册地址](https://github.com/signup)
2. ✅ Vercel 账号 - [注册地址](https://vercel.com/signup)

### 需要的工具:
- ✅ 已安装 Git
- ✅ 可选:安装 Node.js (推荐但非必须)

---

## 第一部分:上传到 GitHub (5分钟)

### 步骤 1: 创建 GitHub 仓库

1. **登录 GitHub**,点击右上角 `+` → `New repository`

2. **填写仓库信息**:
   ```
   Repository name: yuan-portfolio
   Description: 袁灏的作品集网站
   ✅ Public (公开)
   ❌ 不勾选 "Add a README file"
   ```

3. **点击 `Create repository`**

### 步骤 2: 上传项目文件

**方法 A:使用 GitHub 网页上传(最简单)**

1. 在新创建的仓库页面,点击 `uploading an existing file`

2. **拖拽整个 `portfolio-demo` 文件夹**到页面

3. 等待上传完成,点击 `Commit changes`

**方法 B:使用命令行(推荐)**

在你的 `portfolio-demo` 文件夹里执行:

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "Initial commit - Portfolio website"

# 关联到你的 GitHub 仓库(替换下面的 YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/yuan-portfolio.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3: 创建 GitHub Personal Access Token

**这是自动同步的关键步骤!**

1. 打开 GitHub → 右上角头像 → `Settings`

2. 左侧菜单拉到最下面 → `Developer settings`

3. 点击 `Personal access tokens` → `Tokens (classic)`

4. 点击 `Generate new token` → `Generate new token (classic)`

5. **填写信息**:
   ```
   Note: Portfolio Auto Sync
   Expiration: No expiration (永不过期)

   勾选权限:
   ✅ repo (完整的仓库控制)
   ```

6. 点击 `Generate token`

7. **⚠️ 重要!复制生成的 token 并保存**
   - 格式类似:`ghp_xxxxxxxxxxxxxxxxxxxx`
   - 这个 token 只会显示一次,务必保存!

---

## 第二部分:部署到 Vercel (3分钟)

### 步骤 1: 连接 GitHub

1. **访问** [https://vercel.com/new](https://vercel.com/new)

2. **选择 `Import Git Repository`**

3. **选择** `Import from GitHub`

4. **授权 Vercel 访问你的 GitHub**

5. **找到并选择** `yuan-portfolio` 仓库

### 步骤 2: 配置项目

1. **Project Name**: `yuan-portfolio` (或你喜欢的名字)

2. **Framework Preset**: `Other` (保持默认)

3. **Root Directory**: `./` (保持默认)

4. **⚠️ 重要!添加环境变量**:

   点击 `Environment Variables`,添加以下 4 个变量:

   | Name | Value |
   |------|-------|
   | `GITHUB_TOKEN` | 你刚才保存的 token (ghp_xxx...) |
   | `GITHUB_OWNER` | 你的 GitHub 用户名 |
   | `GITHUB_REPO` | `yuan-portfolio` |
   | `GITHUB_BRANCH` | `main` |

   **示例**:
   ```
   GITHUB_TOKEN = ghp_xxxxxxxxxxxxxxxxxxxx
   GITHUB_OWNER = yourusername
   GITHUB_REPO = yuan-portfolio
   GITHUB_BRANCH = main
   ```

5. **点击 `Deploy`**

### 步骤 3: 等待部署

- 部署需要 30-60 秒
- 你会看到进度条和日志
- 成功后会显示 `🎉 Congratulations!`

---

## 第三部分:获取网址并测试 (2分钟)

### 步骤 1: 复制网站链接

部署成功后,你会看到:

```
https://yuan-portfolio-xxx.vercel.app
```

点击访问,确认网站正常显示!

### 步骤 2: 测试自动同步功能

1. **打开管理后台**:
   ```
   https://你的网址/admin.html
   ```

2. **登录**(密码:`yuan2026`)

3. **添加一个测试作品**:
   - 填写标题(三种语言)
   - 上传封面图
   - 点击"提交"

4. **观察自动保存**:
   - 会显示"正在保存到云端..."
   - 成功后显示"保存成功!数据已自动同步到 GitHub"

5. **等待 30-60 秒**,刷新你的网站

6. **✅ 新作品应该已经出现了!**

---

## 🎉 完成!你现在有了:

✅ 网站地址:`https://你的域名.vercel.app`
✅ 管理后台:`https://你的域名.vercel.app/admin.html`
✅ 自动同步:后台保存 → 立刻上线,完全自动化!

---

## 💡 后续使用

### 添加新作品(超级简单):

1. 打开管理后台
2. 填写作品信息
3. 点击"保存"
4. ✅ 完成!等 1 分钟就自动上线了

**不需要:**
- ❌ 下载文件
- ❌ 上传到控制台
- ❌ 执行命令
- ❌ 任何手动操作

---

## 🔧 常见问题

### Q1: 保存时显示"自动保存失败:GitHub 未配置"

**原因**:环境变量没有正确设置

**解决方法**:
1. 登录 Vercel
2. 进入你的项目 → `Settings` → `Environment Variables`
3. 检查 4 个环境变量是否都正确填写
4. 如果有错误,修改后点击 `Redeploy` 重新部署

### Q2: 保存后网站没更新?

**可能原因 1**:Vercel 还在部署中
- 等待 30-60 秒
- 强制刷新浏览器(Ctrl+F5)

**可能原因 2**:GitHub 仓库没有更新
- 检查 GitHub 仓库是否有新的 commit
- 如果没有,说明 API 调用失败,检查环境变量

### Q3: 图片显示不出来?

**解决方法**:
1. 确保图片文件在 `assets/images/` 文件夹里
2. 确保 GitHub 仓库里有这些图片
3. 如果是新上传的图片,需要重新部署 Vercel

### Q4: 如何绑定自己的域名?

1. 登录 Vercel
2. 进入你的项目 → `Settings` → `Domains`
3. 添加你的域名
4. 按照提示配置 DNS
5. 等待 DNS 生效(约 10 分钟)

### Q5: 如何查看部署历史?

1. 登录 Vercel
2. 进入你的项目 → `Deployments`
3. 可以看到所有的部署记录
4. 点击任意部署可以查看详情
5. 可以回滚到之前的版本

### Q6: 如何修改管理后台密码?

1. 在 GitHub 仓库里找到 `admin-logic.js`
2. 修改第一行:`const ADMIN_PASSWORD = 'yuan2026';`
3. 改成你想要的密码
4. 提交修改
5. Vercel 会自动重新部署

---

## 📊 费用说明

**完全免费!**

- ✅ Vercel:免费套餐包含 100GB 带宽/月
- ✅ GitHub:公开仓库完全免费
- ✅ 你的网站流量不会超出免费额度

---

## 🆚 对比腾讯云

| 功能 | Vercel 方案 | 腾讯云方案 |
|------|------------|-----------|
| 部署难度 | ⭐ 简单 | ⭐⭐⭐ 复杂 |
| 更新流程 | 点保存就上线 | 下载→上传→刷新 |
| 文件夹识别 | ✅ 完美 | ❌ 经常出问题 |
| 图片丢失 | ✅ 不会 | ❌ 偶尔会 |
| 动效卡顿 | ✅ 流畅 | ❌ 有时卡 |
| 版本控制 | ✅ 有 | ❌ 无 |
| 全球访问 | ✅ 快 | ⭐⭐ 一般 |
| 费用 | 免费 | 免费 |

---

## 🎓 进阶技巧

### 1. 本地预览

如果你想在部署前本地测试:

```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目文件夹执行
vercel dev

# 访问 http://localhost:3000 预览
```

### 2. 手动触发部署

如果你修改了代码但 Vercel 没有自动部署:

```bash
# 在项目文件夹执行
git add .
git commit -m "Update files"
git push

# 或者在 Vercel 控制台点击 "Redeploy"
```

### 3. 查看日志

如果出现问题,可以在 Vercel 控制台查看详细日志:

```
项目页面 → Deployments → 点击最新的部署 → View Function Logs
```

---

## 📞 需要帮助?

如果遇到问题:

1. **检查部署日志**:Vercel 控制台 → Deployments → 最新部署 → Logs
2. **检查 GitHub**:确认文件是否正确上传
3. **检查环境变量**:确认 4 个变量都正确设置
4. **强制刷新浏览器**:Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)

---

**🎉 恭喜!你的作品集网站现在是完全自动化的了!**

**享受这种"点保存就上线"的爽快感吧!** 🚀
