# 📁 项目结构说明

本文档详细说明项目的文件组织结构。

## 🌳 完整目录树

```
r-w/
│
├── 📄 核心HTML
│   └── r-workbench.html          (69.93 KB) 主页面
│
├── 🎨 样式文件
│   └── css/
│       └── common.css             (25.88 KB) 全局样式
│
├── 💻 JavaScript文件
│   └── js/
│       ├── api-client.js          (14.9 KB)  ⭐ 新增：API客户端
│       ├── common.js              (48.06 KB) 🔧 修改：移除LeanCloud配置
│       ├── home.js                (46.2 KB)  首页逻辑
│       ├── tracking.js            (56.08 KB) 跟单管理
│       ├── customs.js             (49.19 KB) 报关数据
│       ├── hscode.js              (13.08 KB) HS编码管理
│       ├── exporter.js            (12.86 KB) 出口商管理
│       └── files.js               (15.58 KB) 文件管理
│
├── 🚀 Vercel后端API
│   └── api/
│       └── leancloud.js           (7.91 KB)  ⭐ 新增：Serverless API
│
├── ⚙️ 配置文件
│   ├── package.json               (335 B)    npm依赖配置
│   ├── vercel.json                (730 B)    Vercel部署配置
│   ├── .env.example               (285 B)    环境变量示例
│   ├── .gitignore                 (314 B)    Git忽略规则
│   └── .vercelignore              (84 B)     Vercel忽略规则
│
├── 🛠️ 部署脚本
│   ├── deploy.sh                  (3.09 KB)  Linux/Mac部署脚本
│   └── deploy.ps1                 (4.17 KB)  Windows部署脚本
│
└── 📚 文档文件
    ├── README.md                  (6.41 KB)  项目主文档
    ├── QUICK_START.md             (3.15 KB)  快速开始指南
    ├── DEPLOYMENT.md              (9.63 KB)  完整部署指南
    ├── ARCHITECTURE.md            (11.61 KB) 系统架构说明
    ├── CHECKLIST.md               (5.62 KB)  部署检查清单
    ├── CHANGELOG.md               (3.79 KB)  更新日志
    ├── PROJECT_SUMMARY.md         (8.49 KB)  项目总结
    ├── PROJECT_STRUCTURE.md       (本文件)    项目结构说明
    └── INDEX.md                   (7.17 KB)  文档索引

总计: 29个文件
```

## 📊 文件统计

### 按类型统计

| 类型 | 数量 | 总大小 |
|------|------|--------|
| JavaScript | 8 | ~256 KB |
| Markdown文档 | 9 | ~56 KB |
| HTML | 1 | ~70 KB |
| CSS | 1 | ~26 KB |
| JSON配置 | 2 | ~1 KB |
| Shell脚本 | 2 | ~7 KB |
| 其他配置 | 3 | ~1 KB |
| **总计** | **26** | **~417 KB** |

### 按功能分类

| 功能 | 文件数 | 说明 |
|------|--------|------|
| 前端业务代码 | 7 | home, tracking, customs等 |
| 后端API | 1 | api/leancloud.js |
| API客户端 | 1 | js/api-client.js |
| 配置文件 | 5 | package.json, vercel.json等 |
| 部署脚本 | 2 | deploy.sh, deploy.ps1 |
| 文档 | 9 | README, DEPLOYMENT等 |
| HTML/CSS | 2 | 页面和样式 |

## 🎯 关键文件详解

### ⭐ 新增文件（本次更新）

#### 1. api/leancloud.js
**功能**: Vercel Serverless后端API
```javascript
// 处理所有前端到LeanCloud的请求
module.exports = async (req, res) => {
    // 接收前端请求
    // 使用环境变量初始化LeanCloud
    // 执行数据库操作
    // 返回结果
}
```

**支持的操作**:
- login, logout, getCurrentUser
- query, save, update, delete
- uploadFile, saveAll

**大小**: 7.91 KB  
**行数**: ~300行

---

#### 2. js/api-client.js
**功能**: 前端API客户端
```javascript
class APIClient {
    // 封装API调用
    // 管理sessionToken
    // 提供AV兼容层
}
```

**核心类**:
- APIClient - 主客户端类
- AV.User - 用户认证
- AV.Query - 数据查询
- AV.Object - 对象操作
- AV.File - 文件上传

**大小**: 14.9 KB  
**行数**: ~500行

---

#### 3. 配置文件

**package.json**
```json
{
  "dependencies": {
    "leancloud-storage": "^4.13.2"
  }
}
```

**vercel.json**
```json
{
  "version": 2,
  "builds": [
    { "src": "api/**/*.js", "use": "@vercel/node" }
  ]
}
```

**.env.example**
```env
LEANCLOUD_APP_ID=your_app_id
LEANCLOUD_APP_KEY=your_app_key
LEANCLOUD_SERVER_URL=your_server_url
```

---

#### 4. 文档文件

| 文档 | 大小 | 主要内容 |
|------|------|----------|
| README.md | 6.41 KB | 项目概述、快速开始 |
| QUICK_START.md | 3.15 KB | 10分钟快速部署 |
| DEPLOYMENT.md | 9.63 KB | 详细部署流程 |
| ARCHITECTURE.md | 11.61 KB | 系统架构详解 |
| CHECKLIST.md | 5.62 KB | 部署检查清单 |
| CHANGELOG.md | 3.79 KB | 版本更新记录 |
| PROJECT_SUMMARY.md | 8.49 KB | 项目总结 |
| INDEX.md | 7.17 KB | 文档索引 |

### 🔧 修改文件

#### 1. r-workbench.html
**修改内容**:
```html
<!-- 移除 -->
<script src="https://cdn.rtcus.cn/libs/leancloud-storage/av-min.js"></script>

<!-- 新增 -->
<script src="js/api-client.js"></script>
```

**影响**: 使用新的API客户端替代直接LeanCloud SDK

---

#### 2. js/common.js
**修改内容**:
```javascript
// 移除
AV.init({
    appId: 'qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz',
    appKey: 'n1MnTEgdQGWk2jouFA55NF1n',
    serverURL: 'https://qwtz0xzn.lc-cn-n1-shared.com'
});

// 新增注释
// API客户端已在 api-client.js 中初始化
// LeanCloud配置已迁移到Vercel后端
```

**影响**: 敏感配置不再暴露在前端

## 📦 依赖关系

```
r-workbench.html
    ├── css/common.css
    ├── js/api-client.js ⭐
    ├── js/common.js 🔧
    ├── js/home.js
    ├── js/tracking.js
    ├── js/customs.js
    ├── js/hscode.js
    ├── js/exporter.js
    └── js/files.js

api/leancloud.js
    └── leancloud-storage (npm包)

部署流程
    ├── package.json
    ├── vercel.json
    └── .env (环境变量)
```

## 🔄 数据流向

```
用户浏览器
    ↓
r-workbench.html
    ↓
js/api-client.js
    ↓ (HTTP POST)
api/leancloud.js (Vercel)
    ↓ (LeanCloud SDK)
LeanCloud服务器
```

## 📝 文件用途说明

### HTML/CSS
- `r-workbench.html`: 主页面，包含所有UI组件
- `css/common.css`: 全局样式定义

### JavaScript - 前端业务
- `js/home.js`: 首页逻辑（统计卡片、快速链接）
- `js/tracking.js`: 跟单工作台（数据管理、导入导出）
- `js/customs.js`: 报关数据管理
- `js/hscode.js`: HS编码查询和同步
- `js/exporter.js`: 出口商信息管理
- `js/files.js`: 文件上传和匹配

### JavaScript - 核心功能
- `js/common.js`: 通用功能（登录、导航、日期选择器）
- `js/api-client.js`: API客户端（⭐新增）

### 后端
- `api/leancloud.js`: Serverless API（⭐新增）

### 配置
- `package.json`: npm依赖
- `vercel.json`: Vercel配置
- `.env.example`: 环境变量模板
- `.gitignore`: Git忽略
- `.vercelignore`: Vercel忽略

### 脚本
- `deploy.sh`: Linux/Mac部署
- `deploy.ps1`: Windows部署

### 文档
- 8个Markdown文档，涵盖各个方面

## 🎨 代码组织原则

### 1. 分离关注点
- **前端**: 用户界面和交互
- **后端**: 数据操作和业务逻辑
- **配置**: 环境和部署设置

### 2. 模块化
- 每个JS文件负责特定功能
- API客户端独立封装
- 样式统一管理

### 3. 文档完善
- README作为入口
- 详细的部署指南
- 清晰的架构说明

## 🔒 安全相关文件

### 不应提交到Git
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
node_modules/
.vercel/
```

### 应该提交到Git
```
.env.example       (示例配置)
.gitignore        (忽略规则)
所有源代码文件
所有文档文件
配置文件
```

## 📈 项目规模

- **总文件数**: 29个
- **代码文件**: 11个 (HTML, CSS, JS)
- **配置文件**: 5个
- **文档文件**: 9个
- **脚本文件**: 2个
- **其他文件**: 3个

## 🎯 关键指标

- **前端代码**: ~256 KB
- **后端代码**: ~8 KB
- **文档**: ~56 KB
- **总计**: ~417 KB

**小巧精悍**: 整个项目不到500KB！

## 🚀 扩展指南

### 添加新页面
1. 在HTML添加页面内容
2. 创建对应的JS文件（如 `js/newpage.js`）
3. 在HTML引入新JS文件
4. 在导航中添加链接

### 添加新API
1. 在 `api/leancloud.js` 添加处理函数
2. 在 `js/api-client.js` 添加客户端方法
3. 在业务代码中调用

### 添加新功能
1. 评估影响范围（前端/后端）
2. 修改相应文件
3. 更新文档
4. 测试验证
5. 提交部署

## 📚 相关文档

- 详细架构: [ARCHITECTURE.md](ARCHITECTURE.md)
- 部署指南: [DEPLOYMENT.md](DEPLOYMENT.md)
- API文档: [README.md](README.md)

---

**最后更新**: 2024-12-16
**项目版本**: 1.0.0
