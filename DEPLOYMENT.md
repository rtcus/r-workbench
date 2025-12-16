# 完整部署流程指南

本文档提供详细的分步部署指南，从零开始部署R跟单台系统到生产环境。

## 📋 准备工作

### 必需账号

1. **GitHub账号** - 用于代码托管
2. **Vercel账号** - 用于部署（可用GitHub登录）
3. **LeanCloud账号** - 已有（数据库）

### 必需工具

```bash
# 安装Node.js (v14+)
# 访问 https://nodejs.org 下载安装

# 验证安装
node --version
npm --version

# 安装Git
# 访问 https://git-scm.com 下载安装
git --version
```

## 🚀 部署步骤

### 步骤1️⃣: 准备项目代码

#### 1.1 初始化Git仓库

```bash
# 进入项目目录
cd c:/Users/huPan/Downloads/r-w

# 初始化Git（如果还没有）
git init

# 添加所有文件到暂存区
git add .

# 查看状态，确认文件已添加
git status

# 提交到本地仓库
git commit -m "迁移到Vercel后端架构 - 保护LeanCloud配置"
```

#### 1.2 创建GitHub仓库

1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `r-workbench` (或其他名称)
   - Description: "R跟单台系统 - Vercel后端架构"
   - 选择 **Private** (推荐，保护代码)
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

#### 1.3 推送代码到GitHub

```bash
# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/r-workbench.git

# 推送代码
git branch -M main
git push -u origin main

# 验证推送成功
# 访问GitHub仓库页面，应该能看到所有文件
```

### 步骤2️⃣: 部署到Vercel

#### 2.1 注册/登录Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"
4. 授权Vercel访问你的GitHub账号

#### 2.2 导入项目

1. 在Vercel仪表板，点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 中找到你的仓库 `r-workbench`
3. 点击 "Import"

#### 2.3 配置项目

**Framework Preset**: 选择 "Other" 或保持默认

**Root Directory**: 保持默认 `./`

**Build and Output Settings**: 
- Build Command: 留空（静态站点不需要）
- Output Directory: 留空
- Install Command: `npm install`

点击展开 "Environment Variables"

### 步骤3️⃣: 配置环境变量 ⚠️ 重要

在Vercel项目配置页面，添加以下环境变量：

#### 添加变量步骤：

1. 在 "Environment Variables" 部分
2. 输入变量名
3. 输入变量值
4. 选择环境（勾选 Production, Preview, Development）
5. 点击 "Add"

#### 需要添加的变量：

| Name | Value | 环境 |
|------|-------|------|
| `LEANCLOUD_APP_ID` | `qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz` | All |
| `LEANCLOUD_APP_KEY` | `n1MnTEgdQGWk2jouFA55NF1n` | All |
| `LEANCLOUD_SERVER_URL` | `https://qwtz0xzn.lc-cn-n1-shared.com` | All |

**配置示例截图说明**:
```
Name:  LEANCLOUD_APP_ID
Value: qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz
[✓] Production
[✓] Preview  
[✓] Development
[Add] 按钮
```

#### 验证配置

确认所有3个环境变量都已添加，每个都勾选了所有环境。

### 步骤4️⃣: 开始部署

1. 确认所有配置正确
2. 点击 "Deploy" 按钮
3. 等待部署完成（通常需要1-3分钟）

部署过程中可以看到：
- ✓ Building
- ✓ Deploying  
- ✓ Running Checks

### 步骤5️⃣: 验证部署

#### 5.1 访问网站

部署成功后，Vercel会提供一个URL，如：
```
https://r-workbench-xxx.vercel.app
```

点击访问该URL

#### 5.2 测试功能

1. **登录功能**
   - 输入用户名和密码
   - 点击登录
   - 验证是否成功登录

2. **数据加载**
   - 查看首页统计数据
   - 进入跟单工作台
   - 验证数据是否正常显示

3. **数据操作**
   - 尝试新增一条数据
   - 尝试编辑数据
   - 验证数据是否正确保存

4. **检查控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签
   - 确认没有错误信息

### 步骤6️⃣: 配置自定义域名（可选）

#### 6.1 添加域名

1. 在Vercel项目页面，点击 "Settings"
2. 点击左侧 "Domains"
3. 输入你的域名（如 `r.yourdomain.com`）
4. 点击 "Add"

#### 6.2 配置DNS

根据Vercel提供的DNS记录，在你的域名服务商添加：

**CNAME记录**:
```
Type: CNAME
Name: r (或其他子域名)
Value: cname.vercel-dns.com
```

或 **A记录**:
```
Type: A
Name: @ 或 r
Value: 76.76.21.21
```

#### 6.3 等待生效

- DNS传播通常需要几分钟到24小时
- Vercel会自动配置SSL证书（免费）
- 证书激活后即可通过HTTPS访问

## 🔄 后续更新流程

每次更新代码后：

```bash
# 1. 修改代码
# 2. 测试功能

# 3. 提交更改
git add .
git commit -m "描述你的更改"

# 4. 推送到GitHub
git push

# 5. Vercel会自动部署
# 访问 https://vercel.com/your-username/r-workbench/deployments
# 查看部署状态
```

**自动部署流程**:
```
Git Push → GitHub → Vercel检测到更新 → 自动构建 → 自动部署 → 生产环境更新
```

## 📊 监控和管理

### Vercel仪表板

访问 https://vercel.com/dashboard 可以：

1. **查看部署历史**
   - 所有部署记录
   - 每次部署的详细日志
   - 回滚到之前的版本

2. **查看实时日志**
   - Functions 标签查看API日志
   - 实时错误监控
   - 性能指标

3. **管理环境变量**
   - 更新配置
   - 添加新变量
   - 删除旧变量

4. **性能分析**
   - 页面加载速度
   - API响应时间
   - 流量统计

### 常用操作

#### 回滚到之前版本

1. 进入项目 → Deployments
2. 找到要回滚的版本
3. 点击 "..." → "Promote to Production"

#### 查看API日志

1. 进入项目 → Functions
2. 点击 `api/leancloud.js`
3. 查看调用记录和错误日志

#### 更新环境变量

1. Settings → Environment Variables
2. 找到要更改的变量
3. 点击 "Edit" 修改
4. **重新部署**使变更生效

## 🔧 本地开发

### 安装依赖

```bash
cd c:/Users/huPan/Downloads/r-w
npm install
```

### 配置本地环境

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填入LeanCloud配置
notepad .env.local
```

### 启动本地开发服务器

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login

# 启动开发服务器
vercel dev
```

访问 http://localhost:3000

### 本地测试

测试所有功能正常后再推送到生产环境：

```bash
# 测试登录
# 测试数据查询
# 测试数据保存
# 测试文件上传

# 确认无误后推送
git add .
git commit -m "本地测试通过"
git push
```

## 🐛 故障排查

### 问题1: 部署失败

**症状**: 部署过程中出现错误

**解决步骤**:
1. 查看Vercel部署日志
2. 检查 `package.json` 是否正确
3. 确认所有依赖都已安装
4. 检查 `vercel.json` 配置

### 问题2: API调用失败

**症状**: 前端报错 "请求失败"

**检查清单**:
- [ ] Vercel环境变量是否正确配置
- [ ] LeanCloud服务是否正常
- [ ] 浏览器控制台有无CORS错误
- [ ] API路径是否正确 (`/api/leancloud`)

**解决**:
```bash
# 检查Vercel环境变量
vercel env ls

# 查看API日志
# 访问 Vercel Dashboard → Functions → Logs
```

### 问题3: 登录失败

**症状**: 输入正确的用户名密码仍无法登录

**检查**:
1. 打开浏览器开发者工具 (F12)
2. 查看 Network 标签
3. 找到 `/api/leancloud` 请求
4. 查看 Response

**可能原因**:
- LeanCloud配置错误
- 用户名/密码错误
- SessionToken过期

**解决**:
```javascript
// 清除本地存储
localStorage.clear();
// 刷新页面重新登录
```

### 问题4: 本地开发无法启动

**症状**: `vercel dev` 报错

**解决**:
```bash
# 检查Node版本
node --version  # 需要 v14+

# 删除node_modules重新安装
rm -rf node_modules
npm install

# 确认.env.local存在
ls .env.local

# 重新启动
vercel dev
```

### 问题5: 数据无法保存

**症状**: 点击保存后数据未更新

**检查**:
1. 浏览器控制台错误信息
2. Vercel API日志
3. LeanCloud控制台数据

**调试**:
```javascript
// 在浏览器控制台测试
await api.save('Tracking', {
    containerNo: 'TEST123',
    arrivalDate: '2024-01-01'
});
// 查看返回结果
```

## 📞 获取帮助

### Vercel文档
- 官方文档: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions

### LeanCloud文档
- 官方文档: https://docs.leancloud.cn
- JavaScript SDK: https://leancloud.cn/docs/sdk_setup-js.html

### 社区支持
- Vercel Discord: https://vercel.com/discord
- Stack Overflow: 搜索相关问题

## ✅ 部署检查清单

部署前确认：

- [ ] 代码已推送到GitHub
- [ ] `.gitignore` 包含 `.env` 和 `node_modules`
- [ ] `package.json` 依赖正确
- [ ] `vercel.json` 配置正确
- [ ] Vercel环境变量已配置
- [ ] 本地测试通过

部署后验证：

- [ ] 网站可以访问
- [ ] 登录功能正常
- [ ] 数据查询正常
- [ ] 数据保存正常
- [ ] 文件上传正常
- [ ] 无控制台错误

## 🎉 完成！

恭喜！你已成功将R跟单台系统部署到生产环境。

现在你的LeanCloud配置已经：
- ✅ 从前端代码中移除
- ✅ 安全存储在Vercel服务器
- ✅ 不会暴露在GitHub仓库中
- ✅ 前端通过API安全访问

享受你的安全、可靠的部署吧！🚀
