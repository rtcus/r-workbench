# 📖 文档索引

快速找到你需要的文档和信息。

## 🚀 快速开始

**我想快速部署** → [QUICK_START.md](QUICK_START.md)  
**我想了解详细步骤** → [DEPLOYMENT.md](DEPLOYMENT.md)  
**我想了解系统架构** → [ARCHITECTURE.md](ARCHITECTURE.md)

## 📚 完整文档列表

### 核心文档

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [README.md](README.md) | 项目概述、使用说明 | 所有人 |
| [QUICK_START.md](QUICK_START.md) | 10分钟快速部署 | 新手 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 详细部署流程 | 运维人员 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 系统架构说明 | 开发者 |

### 辅助文档

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [CHECKLIST.md](CHECKLIST.md) | 部署检查清单 | 运维人员 |
| [CHANGELOG.md](CHANGELOG.md) | 版本更新记录 | 所有人 |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 项目总结 | 管理者 |
| [INDEX.md](INDEX.md) | 本文档索引 | 所有人 |

## 🎯 按使用场景查找

### 场景1: 我是新手，第一次部署

1. 阅读 [QUICK_START.md](QUICK_START.md)
2. 准备GitHub和Vercel账号
3. 跟着步骤操作
4. 遇到问题查看 [DEPLOYMENT.md](DEPLOYMENT.md) 故障排查部分

### 场景2: 我想了解技术细节

1. 阅读 [ARCHITECTURE.md](ARCHITECTURE.md)
2. 查看代码文件：
   - `api/leancloud.js` - 后端实现
   - `js/api-client.js` - 前端实现
3. 阅读 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

### 场景3: 我负责部署到生产环境

1. 阅读 [DEPLOYMENT.md](DEPLOYMENT.md)
2. 使用 [CHECKLIST.md](CHECKLIST.md) 逐项检查
3. 运行部署脚本：
   - Windows: `.\deploy.ps1`
   - Linux/Mac: `./deploy.sh`
4. 验证部署结果

### 场景4: 我需要维护已部署的系统

1. 查看 [README.md](README.md) 的日常维护部分
2. 监控Vercel控制台
3. 定期查看 [CHANGELOG.md](CHANGELOG.md)
4. 遇到问题查看故障排查

### 场景5: 我想修改或扩展功能

1. 阅读 [ARCHITECTURE.md](ARCHITECTURE.md) 了解架构
2. 查看 `api/leancloud.js` 了解后端API
3. 查看 `js/api-client.js` 了解前端API
4. 本地开发测试
5. 推送到Git自动部署

## 🔍 按问题类型查找

### 部署相关

| 问题 | 查看文档 | 章节 |
|------|---------|------|
| 如何部署到Vercel？ | DEPLOYMENT.md | 步骤2 |
| 如何配置环境变量？ | DEPLOYMENT.md | 步骤3 |
| 部署失败怎么办？ | DEPLOYMENT.md | 故障排查 |
| 如何回滚版本？ | DEPLOYMENT.md | 监控和管理 |

### 开发相关

| 问题 | 查看文档 | 位置 |
|------|---------|------|
| 如何本地开发？ | DEPLOYMENT.md | 本地开发部分 |
| API如何调用？ | README.md | API说明 |
| 如何添加新接口？ | ARCHITECTURE.md | 扩展性部分 |
| 兼容性如何保证？ | ARCHITECTURE.md | 向后兼容部分 |

### 安全相关

| 问题 | 查看文档 | 位置 |
|------|---------|------|
| 配置如何隐藏？ | ARCHITECTURE.md | 安全机制 |
| 如何管理密钥？ | DEPLOYMENT.md | 环境变量配置 |
| 会话如何管理？ | ARCHITECTURE.md | 会话管理 |

### 性能相关

| 问题 | 查看文档 | 位置 |
|------|---------|------|
| 性能如何优化？ | ARCHITECTURE.md | 性能优化 |
| CDN如何配置？ | 自动配置 | Vercel自动处理 |
| 如何监控性能？ | DEPLOYMENT.md | 监控和日志 |

## 📁 代码文件索引

### 后端代码

| 文件 | 说明 | 大小 |
|------|------|------|
| `api/leancloud.js` | Vercel Serverless API | ~8KB |

**主要功能**:
- 用户认证（login, logout, getCurrentUser）
- 数据查询（query）
- 数据操作（save, update, delete, saveAll）
- 文件上传（uploadFile）

### 前端代码

| 文件 | 说明 | 大小 |
|------|------|------|
| `js/api-client.js` | API客户端 | ~12KB |
| `js/common.js` | 通用功能（已修改） | - |
| `js/home.js` | 首页逻辑 | - |
| `js/tracking.js` | 跟单管理 | - |
| `js/customs.js` | 报关数据 | - |
| `js/hscode.js` | HS编码 | - |
| `js/exporter.js` | 出口商 | - |
| `js/files.js` | 文件管理 | - |

### 配置文件

| 文件 | 说明 |
|------|------|
| `package.json` | npm依赖配置 |
| `vercel.json` | Vercel部署配置 |
| `.env.example` | 环境变量示例 |
| `.gitignore` | Git忽略规则 |
| `.vercelignore` | Vercel忽略规则 |

### HTML/CSS

| 文件 | 说明 |
|------|------|
| `r-workbench.html` | 主页面（已修改） |
| `css/common.css` | 通用样式 |

## 🛠️ 工具脚本

| 文件 | 平台 | 用途 |
|------|------|------|
| `deploy.sh` | Linux/Mac | 一键部署脚本 |
| `deploy.ps1` | Windows | PowerShell部署脚本 |

**使用方法**:
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows PowerShell
.\deploy.ps1
```

## 📊 流程图索引

### 部署流程

见 [DEPLOYMENT.md](DEPLOYMENT.md)

```
本地代码 → Git → GitHub → Vercel → 生产环境
```

### 数据流程

见 [ARCHITECTURE.md](ARCHITECTURE.md)

```
前端 → API客户端 → Vercel API → LeanCloud
```

### 登录流程

见 [ARCHITECTURE.md](ARCHITECTURE.md) - 数据流程 - 用户登录流程

## 🔗 外部资源

### 官方文档

- **Vercel**: https://vercel.com/docs
- **LeanCloud**: https://docs.leancloud.cn
- **Node.js**: https://nodejs.org/docs
- **Git**: https://git-scm.com/doc

### 在线工具

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub**: https://github.com
- **LeanCloud控制台**: https://console.leancloud.cn

### 社区支持

- **Vercel Discord**: https://vercel.com/discord
- **Stack Overflow**: https://stackoverflow.com
- **GitHub Discussions**: 项目仓库的Discussions标签

## 📞 快速联系

### 获取帮助

1. **查文档**: 先查看相关文档
2. **搜索**: Stack Overflow搜索类似问题
3. **日志**: 查看Vercel和浏览器控制台日志
4. **社区**: 在相关社区提问

### 报告问题

在GitHub仓库提交Issue，包含：
- 问题描述
- 复现步骤
- 错误日志
- 环境信息

## 🎓 学习路径

### 初学者路径

1. 阅读 [QUICK_START.md](QUICK_START.md)
2. 跟着步骤完成部署
3. 测试基本功能
4. 阅读 [README.md](README.md) 了解系统

### 进阶路径

1. 阅读 [ARCHITECTURE.md](ARCHITECTURE.md)
2. 查看源代码实现
3. 本地开发测试
4. 尝试修改和扩展功能

### 运维路径

1. 阅读 [DEPLOYMENT.md](DEPLOYMENT.md)
2. 熟悉Vercel控制台
3. 配置监控和告警
4. 制定应急预案

## ✅ 检查清单

- [ ] 已阅读 README.md
- [ ] 已完成部署（使用QUICK_START或DEPLOYMENT）
- [ ] 已验证所有功能正常
- [ ] 已配置环境变量
- [ ] 已了解基本架构
- [ ] 知道如何获取帮助

## 🎉 下一步

完成部署后：

1. ⭐ Star项目（如果在GitHub上）
2. 📝 记录部署URL和账号信息
3. 🔔 配置Vercel通知
4. 📊 定期检查系统状态
5. 🔄 保持代码更新

---

**提示**: 
- 收藏本文档，快速查找信息
- 有问题先查索引，再看详细文档
- 保持文档和代码同步更新

**最后更新**: 2024-12-16
