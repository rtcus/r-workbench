# 🧪 本地测试指南

## 📋 准备工作

在开始之前，请确保：
- ✅ 已安装 Node.js (v14或更高版本)
- ✅ 已安装 Git
- ✅ 项目文件已下载到本地

## 🚀 快速启动（3步）

### 方法1: 使用启动脚本（推荐）

**Windows用户**:
```powershell
# 1. 打开PowerShell，进入项目目录
cd c:/Users/huPan/Downloads/r-w

# 2. 执行启动脚本
./start-local.ps1
```

### 方法2: 手动启动

```bash
# 1. 进入项目目录
cd c:/Users/huPan/Downloads/r-w

# 2. 创建环境配置（首次运行）
copy .env.example .env.local

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

## 🌐 访问测试

服务器启动后，你会看到类似输出：
```
Vercel CLI 33.0.0
> Ready! Available at http://localhost:3000
```

**测试步骤**:
1. 打开浏览器访问: `http://localhost:3000`
2. 输入用户名和密码登录
3. 测试各个功能模块：
   - ✅ 首页统计数据
   - ✅ 跟单工作台
   - ✅ 报关数据管理
   - ✅ HS编码管理
   - ✅ 出口商管理
   - ✅ 文件管理

## 🔍 测试检查清单

### 1. 登录功能
- [ ] 能正常登录
- [ ] 错误密码提示正确
- [ ] 记住我功能正常

### 2. 数据加载
- [ ] 首页统计数据正常显示
- [ ] 跟单列表能加载
- [ ] 报关数据能加载
- [ ] 分页功能正常

### 3. 数据操作
- [ ] 能新增跟单记录
- [ ] 能编辑数据
- [ ] 能删除数据
- [ ] 导入功能正常
- [ ] 导出功能正常

### 4. 查询功能
- [ ] 日期范围查询
- [ ] 模糊搜索
- [ ] 状态筛选
- [ ] 清空条件

### 5. 文件管理
- [ ] 能上传文件
- [ ] 文件自动匹配
- [ ] 能下载文件
- [ ] 能删除文件

## 🐛 常见问题

### 问题1: 端口被占用
**错误信息**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方法**:
```bash
# 方法1: 关闭占用端口的程序
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F

# 方法2: 指定其他端口
npx vercel dev --listen 3001
```

### 问题2: 依赖安装失败
**错误信息**: `npm ERR! ...`

**解决方法**:
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules
rm -rf node_modules

# 重新安装
npm install
```

### 问题3: API请求失败
**错误信息**: `Failed to fetch` 或 `Network error`

**检查项**:
1. 确认`.env.local`文件存在且配置正确
2. 检查LeanCloud配置信息是否正确
3. 查看浏览器控制台(F12)的错误信息
4. 检查网络连接

### 问题4: 页面空白或404
**可能原因**:
- Vercel开发服务器未完全启动
- 路由配置问题

**解决方法**:
1. 等待服务器完全启动（看到"Ready!"提示）
2. 访问 `http://localhost:3000` 而不是 `http://localhost:3000/r-workbench.html`
3. 刷新浏览器（Ctrl+F5强制刷新）

## 📊 开发工具

### Chrome开发者工具（F12）

**Network标签**:
- 查看API请求和响应
- 检查请求头和响应数据
- 查看加载时间

**Console标签**:
- 查看JavaScript错误
- 查看日志输出
- 测试API调用

**Application标签**:
- 查看LocalStorage（会话信息）
- 清除浏览器缓存
- 查看Cookies

### 查看API日志

Vercel开发服务器会在终端显示API请求日志：
```
POST /api/leancloud 200 125ms
GET  /api/leancloud 200 45ms
```

## 🔄 修改代码后

Vercel开发服务器支持热重载：
- **前端文件** (HTML/CSS/JS): 刷新浏览器即可
- **后端API**: 自动重启，刷新浏览器

## 📝 测试建议

### 边界条件测试
1. **日期范围**:
   - 空日期
   - 无效日期
   - 很大的日期范围

2. **数据输入**:
   - 特殊字符
   - 超长文本
   - 空值/null值

3. **并发操作**:
   - 快速点击
   - 同时打开多个页面

### 性能测试
1. **大数据量**:
   - 导入100+条记录
   - 查询大量数据
   - 分页性能

2. **网络环境**:
   - 模拟慢速网络（Chrome DevTools → Network → Throttling）
   - 离线状态

## ✅ 测试完成后

确认以下项目都正常后，即可推送到GitHub：
- [x] 所有核心功能正常
- [x] 没有控制台错误
- [x] API请求成功
- [x] 数据能正常保存
- [x] 用户体验流畅

## 🚀 下一步：推送到GitHub

测试通过后，执行：
```bash
# 初始化Git
git init
git add .
git commit -m "feat: 完成LeanCloud配置迁移，本地测试通过"

# 推送到GitHub（需先创建仓库）
git remote add origin https://github.com/your-username/r-workbench.git
git branch -M main
git push -u origin main
```

然后参考 `QUICK_START.md` 部署到Vercel。

---

**需要帮助?** 
- 查看完整文档: `DEPLOYMENT.md`
- 查看架构说明: `ARCHITECTURE.md`
