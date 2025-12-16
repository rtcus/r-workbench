# R跟单台系统

> 🔒 安全的Vercel后端架构 | 🚀 10分钟快速部署 | 📚 完整文档支持

[![部署状态](https://img.shields.io/badge/部署-就绪-success)](DEPLOYMENT.md)
[![文档](https://img.shields.io/badge/文档-完善-blue)](INDEX.md)
[![版本](https://img.shields.io/badge/版本-1.0.0-brightgreen)](CHANGELOG.md)

## 🎯 快速导航

- 🚀 [10分钟快速部署](QUICK_START.md) - 新手推荐
- 📖 [完整部署指南](DEPLOYMENT.md) - 详细步骤
- 🏗️ [系统架构说明](ARCHITECTURE.md) - 技术细节
- ✅ [部署检查清单](CHECKLIST.md) - 验证工具
- 📑 [文档索引](INDEX.md) - 查找文档

## 架构说明

本项目采用以下架构保护敏感配置信息：

```
GitHub (前端代码) 
   ↓
Vercel (托管前端 + Serverless后端)
   ↓
LeanCloud (数据库)
```

### 技术栈

- **前端**: HTML5, CSS3, JavaScript, Bootstrap 5
- **后端**: Vercel Serverless Functions (Node.js)
- **数据库**: LeanCloud
- **部署**: Vercel
- **版本控制**: GitHub

## 项目结构

```
r-w/
├── api/                      # Vercel Serverless Functions
│   └── leancloud.js         # 后端API - 处理所有LeanCloud请求
├── css/                      # 样式文件
│   └── common.css
├── js/                       # JavaScript文件
│   ├── api-client.js        # API客户端 - 前端调用后端
│   ├── common.js            # 通用功能
│   ├── home.js              # 首页逻辑
│   ├── tracking.js          # 跟单管理
│   ├── customs.js           # 报关数据
│   ├── hscode.js            # HS编码
│   ├── exporter.js          # 出口商管理
│   └── files.js             # 文件管理
├── r-workbench.html         # 主页面
├── package.json             # 项目依赖
├── vercel.json              # Vercel配置
├── .env.example             # 环境变量示例
└── .gitignore               # Git忽略文件

```

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd r-w
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`:

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的LeanCloud配置：

```env
LEANCLOUD_APP_ID=your_app_id
LEANCLOUD_APP_KEY=your_app_key
LEANCLOUD_SERVER_URL=your_server_url
```

### 4. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 部署到Vercel

#### 方式一：通过Vercel CLI（推荐）

```bash
# 安装Vercel CLI（如果未安装）
npm install -g vercel

# 登录Vercel
vercel login

# 部署
vercel --prod
```

#### 方式二：通过GitHub集成

1. 将代码推送到GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署

## 环境变量配置

### Vercel部署环境变量

在Vercel控制台配置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `LEANCLOUD_APP_ID` | LeanCloud应用ID | qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz |
| `LEANCLOUD_APP_KEY` | LeanCloud应用Key | n1MnTEgdQGWk2jouFA55NF1n |
| `LEANCLOUD_SERVER_URL` | LeanCloud服务器地址 | https://qwtz0xzn.lc-cn-n1-shared.com |

**重要**: 
- ✅ 这些配置只存在于Vercel服务器端
- ✅ 前端代码中不包含任何敏感信息
- ✅ GitHub仓库中不会暴露配置

## API说明

### 前端调用方式

```javascript
// 使用全局api对象
const api = new APIClient();

// 登录
const user = await api.login('username', 'password');

// 查询数据
const results = await api.query('Tracking', { 
    billNo: 'BILL123' 
}, { 
    limit: 10 
});

// 保存数据
const saved = await api.save('Tracking', {
    containerNo: 'CONT123',
    arrivalDate: '2024-01-01'
});

// 更新数据
await api.update('Tracking', objectId, {
    customsStatus: '放行'
});

// 删除数据
await api.delete('Tracking', objectId);
```

### 向后兼容

为了兼容现有代码，`api-client.js` 提供了AV对象的模拟：

```javascript
// 原有的AV代码仍然可以工作
const user = await AV.User.logIn(username, password);
const query = new AV.Query('Tracking');
query.equalTo('billNo', 'BILL123');
const results = await query.find();
```

## 部署流程详解

### 第一步：准备GitHub仓库

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit - 迁移到Vercel后端架构"

# 关联远程仓库
git remote add origin <your-github-repo-url>

# 推送到GitHub
git push -u origin master
```

### 第二步：连接Vercel

1. 访问 https://vercel.com
2. 使用GitHub账号登录
3. 点击 "Add New Project"
4. 选择你的GitHub仓库
5. 点击 "Import"

### 第三步：配置环境变量

在Vercel项目设置中：

1. 进入 "Settings" → "Environment Variables"
2. 添加以下变量：
   - `LEANCLOUD_APP_ID`
   - `LEANCLOUD_APP_KEY`
   - `LEANCLOUD_SERVER_URL`
3. 选择环境：Production, Preview, Development

### 第四步：部署

点击 "Deploy" 按钮，Vercel会自动：
1. 安装依赖 (`npm install`)
2. 构建项目
3. 部署Serverless Functions
4. 提供生产环境URL

### 第五步：验证部署

访问Vercel提供的URL，测试：
1. 登录功能
2. 数据查询
3. 数据保存
4. 文件上传

## 自动化部署

配置完成后，每次推送到GitHub都会自动触发部署：

```bash
git add .
git commit -m "Update features"
git push
```

Vercel会自动：
- ✅ 拉取最新代码
- ✅ 运行构建
- ✅ 部署到生产环境
- ✅ 提供预览URL

## 安全最佳实践

1. **永远不要**将 `.env` 文件提交到Git
2. **永远不要**在前端代码中硬编码敏感信息
3. 定期轮换API密钥
4. 使用环境变量管理所有配置
5. 在生产环境启用HTTPS

## 故障排查

### 问题1：API请求失败

检查：
- Vercel环境变量是否正确配置
- LeanCloud服务是否正常
- 浏览器控制台错误信息

### 问题2：本地开发无法连接

检查：
- `.env.local` 文件是否存在
- Vercel CLI是否安装
- 运行 `vercel dev` 而不是普通的http-server

### 问题3：部署后白屏

检查：
- Vercel部署日志
- 浏览器控制台错误
- `vercel.json` 路由配置

## 性能优化

- 使用CDN加速静态资源
- 启用Vercel Edge Network
- 合理设置缓存策略
- 压缩图片和资源文件

## 监控和日志

在Vercel控制台可以查看：
- 部署历史
- 实时日志
- 性能指标
- 错误追踪

## 更新日志

### v1.0.0 (2024-12-16)
- ✅ 将LeanCloud配置迁移到Vercel后端
- ✅ 实现Serverless API架构
- ✅ 保护敏感信息不在前端暴露
- ✅ 向后兼容现有代码
- ✅ 完整部署文档

## 技术支持

如有问题，请提交Issue或联系开发团队。

## 许可证

Private Project - All Rights Reserved
