# ⚡ 快速开始指南

10分钟完成从代码到生产环境的部署！

## 前提条件

- ✅ 已有GitHub账号
- ✅ 已有LeanCloud账号和配置
- ✅ 电脑已安装Git和Node.js

## 🚀 三步部署

### 第1步: 推送代码到GitHub (2分钟)

```bash
# 进入项目目录
cd c:/Users/huPan/Downloads/r-w

# 初始化Git
git init
git add .
git commit -m "Initial commit"

# 在GitHub创建新仓库后，替换下面的URL
git remote add origin https://github.com/your-username/r-workbench.git
git push -u origin main
```

**GitHub创建仓库**:
1. 访问 https://github.com/new
2. 仓库名: `r-workbench`
3. 类型: Private
4. 点击 "Create repository"

### 第2步: 部署到Vercel (5分钟)

1. **访问Vercel**: https://vercel.com
2. **登录**: 使用GitHub账号登录
3. **导入项目**:
   - 点击 "Add New..." → "Project"
   - 选择 `r-workbench` 仓库
   - 点击 "Import"

4. **配置环境变量** (重要❗):
   
   在"Environment Variables"部分添加：

   ```
   Name: LEANCLOUD_APP_ID
   Value: qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz
   ✓ Production ✓ Preview ✓ Development
   [Add]
   
   Name: LEANCLOUD_APP_KEY
   Value: n1MnTEgdQGWk2jouFA55NF1n
   ✓ Production ✓ Preview ✓ Development
   [Add]
   
   Name: LEANCLOUD_SERVER_URL
   Value: https://qwtz0xzn.lc-cn-n1-shared.com
   ✓ Production ✓ Preview ✓ Development
   [Add]
   ```

5. **开始部署**:
   - 点击 "Deploy"
   - 等待1-3分钟

### 第3步: 测试验证 (3分钟)

1. **访问网站**:
   - 部署成功后，点击提供的URL
   - 如: `https://r-workbench-xxx.vercel.app`

2. **测试登录**:
   - 输入用户名和密码
   - 点击登录

3. **检查功能**:
   - ✓ 首页统计数据
   - ✓ 跟单工作台数据加载
   - ✓ 数据新增/编辑

4. **确认安全**:
   - 按F12打开开发者工具
   - 查看Sources标签
   - 确认前端代码中**没有**LeanCloud配置信息

## ✅ 完成！

恭喜！你的系统现在：
- 🔒 LeanCloud配置已安全隐藏
- 🚀 部署在全球CDN上
- 🔄 每次Git推送自动更新
- 📊 可在Vercel查看监控数据

## 📱 访问地址

- **临时域名**: `https://r-workbench-xxx.vercel.app`
- **配置自定义域名**: 见完整文档 DEPLOYMENT.md

## 🔄 日常更新

```bash
# 修改代码后
git add .
git commit -m "更新功能"
git push

# Vercel会自动部署，无需手动操作
```

## 📖 详细文档

- **完整部署指南**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **架构说明**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **项目README**: [README.md](README.md)

## 🆘 遇到问题？

### 部署失败
- 检查环境变量是否正确配置
- 查看Vercel部署日志

### 登录失败
- F12查看控制台错误
- 确认LeanCloud配置正确

### API错误
- 访问 Vercel → Functions → Logs
- 查看具体错误信息

更多帮助见 [DEPLOYMENT.md](DEPLOYMENT.md) 的故障排查部分。

## 🎉 下一步

- [ ] 配置自定义域名
- [ ] 设置GitHub Actions自动化
- [ ] 启用Vercel Analytics
- [ ] 配置邮件通知

Happy Coding! 🚀
