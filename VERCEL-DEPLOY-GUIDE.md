# 🚀 Vercel 部署详细指南

## 📋 前提条件

- ✅ 代码已推送到GitHub: https://github.com/rtcus/r-workbench
- ✅ 有GitHub账号
- ✅ 准备好LeanCloud配置信息

## 🎯 部署步骤（5-10分钟）

### 第1步: 访问Vercel并登录 (1分钟)

1. 打开浏览器访问: **https://vercel.com**
2. 点击右上角 **"Sign Up"** 或 **"Login"**
3. 选择 **"Continue with GitHub"**
4. 授权Vercel访问你的GitHub账号

### 第2步: 导入项目 (2分钟)

1. 登录后，点击 **"Add New..."** 按钮
2. 选择 **"Project"**
3. 在仓库列表中找到 **"r-workbench"**
   - 如果看不到，点击 **"Adjust GitHub App Permissions"** 授权
4. 点击 **"Import"** 按钮

### 第3步: 配置项目 (3分钟)

#### 3.1 项目设置

Vercel会自动检测到配置，保持默认即可：
- **Framework Preset**: Other
- **Root Directory**: ./
- **Build Command**: (留空)
- **Output Directory**: (留空)

#### 3.2 配置环境变量 ⚠️ 重要！

点击 **"Environment Variables"** 展开，添加以下3个环境变量：

**环境变量1**:
```
Name:  LEANCLOUD_APP_ID
Value: qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz

✓ Production
✓ Preview  
✓ Development
```
点击 **"Add"**

**环境变量2**:
```
Name:  LEANCLOUD_APP_KEY
Value: n1MnTEgdQGWk2jouFA55NF1n

✓ Production
✓ Preview
✓ Development
```
点击 **"Add"**

**环境变量3**:
```
Name:  LEANCLOUD_SERVER_URL
Value: https://qwtz0xzn.lc-cn-n1-shared.com

✓ Production
✓ Preview
✓ Development
```
点击 **"Add"**

### 第4步: 开始部署 (2-3分钟)

1. 确认所有配置正确
2. 点击底部的 **"Deploy"** 按钮
3. 等待部署完成（通常1-3分钟）

你会看到部署进度：
```
Building...  ⏳
→ Installing dependencies
→ Building project
→ Deploying to Edge Network
Deployed! ✓
```

### 第5步: 访问和测试 (2分钟)

#### 5.1 获取部署URL

部署成功后，Vercel会显示：
- **Production URL**: `https://r-workbench-xxx.vercel.app`
- 点击 **"Visit"** 或复制URL到浏览器

#### 5.2 测试功能

1. **测试登录**:
   - 打开部署的网站
   - 输入用户名和密码
   - 点击登录

2. **测试数据加载**:
   - 查看首页统计数据
   - 进入"跟单工作台"
   - 查看数据是否正常加载

3. **验证安全性**:
   - 按 `F12` 打开开发者工具
   - 查看 **Sources** 标签
   - 确认前端代码中**没有**LeanCloud配置信息

## ✅ 部署完成！

恭喜！你的应用现在已经：
- 🔒 **安全**: LeanCloud配置在服务器端，前端无法访问
- 🌍 **全球加速**: 部署在Vercel的全球CDN
- 🔄 **自动更新**: 推送代码到GitHub即自动部署
- 📊 **监控**: 可在Vercel查看访问和性能数据

## 🔧 后续配置（可选）

### 1. 配置自定义域名

在Vercel项目设置中：
1. 点击 **"Settings"** → **"Domains"**
2. 添加你的域名
3. 按提示配置DNS

### 2. 查看部署日志

如果遇到问题：
1. 在Vercel项目页面点击 **"Deployments"**
2. 点击具体的部署记录
3. 查看 **"Build Logs"** 和 **"Function Logs"**

### 3. 配置环境变量（如需修改）

1. 项目设置 → **"Environment Variables"**
2. 编辑或添加变量
3. 点击 **"Save"**
4. 重新部署生效

## 📱 访问地址

### 默认域名
```
https://r-workbench.vercel.app
https://r-workbench-rtcus.vercel.app
```

### 自定义域名（配置后）
```
https://your-domain.com
```

## 🔄 日常更新流程

### 更新代码并自动部署

```bash
# 1. 修改代码
# 2. 提交更改
git add .
git commit -m "feat: 添加新功能"

# 3. 推送到GitHub
git push

# Vercel会自动检测并部署，无需手动操作！
```

### 查看部署状态

1. 访问 Vercel Dashboard
2. 查看 **"Deployments"** 标签
3. 每次推送都会创建新的部署记录

## 🐛 常见问题

### Q1: 部署失败，显示"Build Error"

**解决方法**:
1. 检查 `package.json` 是否正确
2. 查看Build Logs中的具体错误
3. 确认所有文件已正确推送到GitHub

### Q2: 网站能访问但登录失败

**可能原因**:
- 环境变量配置错误
- LeanCloud配置信息不正确

**解决方法**:
1. 检查Vercel环境变量是否正确设置
2. 在项目设置中验证三个环境变量
3. 查看Function Logs中的错误信息

### Q3: API请求404错误

**解决方法**:
1. 确认 `vercel.json` 文件存在
2. 检查路由配置
3. 重新部署项目

### Q4: 修改代码后没有自动部署

**解决方法**:
1. 确认代码已推送到GitHub: `git push`
2. 检查Vercel项目是否连接到正确的GitHub仓库
3. 查看Vercel的 **Integrations** 设置

### Q5: 环境变量修改后不生效

**解决方法**:
1. 修改环境变量后需要重新部署
2. 方法1: 推送新代码触发部署
3. 方法2: 在Vercel手动点击 **"Redeploy"**

## 📊 监控和分析

### 查看访问统计

1. Vercel Dashboard → 项目
2. 点击 **"Analytics"** 标签
3. 查看访问量、性能指标

### 查看函数日志

1. 项目页面 → **"Functions"**
2. 点击 **"Logs"**
3. 查看API请求日志和错误

### 性能监控

1. 点击 **"Speed Insights"**（如果启用）
2. 查看页面加载性能
3. 优化建议

## 🎉 下一步

- [ ] 配置自定义域名
- [ ] 启用Vercel Analytics
- [ ] 设置部署通知（Slack/邮件）
- [ ] 配置Preview部署
- [ ] 设置分支部署策略

## 🆘 需要帮助？

### 官方资源
- Vercel文档: https://vercel.com/docs
- Vercel支持: https://vercel.com/support
- GitHub集成: https://vercel.com/docs/git/vercel-for-github

### 项目文档
- 快速开始: `QUICK_START.md`
- 架构说明: `ARCHITECTURE.md`
- 完整部署文档: `DEPLOYMENT.md`

---

**部署愉快！** 🚀

如有任何问题，请查看文档或联系技术支持。
