# Git 初始化和推送脚本
# 用于将项目推送到 GitHub

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Git 初始化和推送到 GitHub" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 确保在项目目录
$projectDir = "c:/Users/huPan/Downloads/r-w"
Set-Location $projectDir

# 1. 检查并清理错误的Git仓库
Write-Host "[1/6] 检查Git状态..." -ForegroundColor Yellow
$gitTopLevel = git rev-parse --show-toplevel 2>$null
if ($gitTopLevel -and $gitTopLevel -ne $projectDir.Replace('\', '/')) {
    Write-Host "  ⚠ 检测到Git仓库在错误位置: $gitTopLevel" -ForegroundColor Yellow
    Write-Host "  → 将在项目目录重新初始化Git" -ForegroundColor Yellow
}

# 删除项目目录中的.git（如果存在）
if (Test-Path ".git") {
    Write-Host "  → 删除现有.git目录..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
}

# 2. 初始化Git仓库
Write-Host "`n[2/6] 初始化Git仓库..." -ForegroundColor Yellow
git init
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Git仓库初始化成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ Git初始化失败" -ForegroundColor Red
    exit 1
}

# 3. 添加文件
Write-Host "`n[3/6] 添加项目文件..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    $fileCount = (git diff --cached --numstat | Measure-Object).Count
    Write-Host "  ✓ 已添加 $fileCount 个文件变更" -ForegroundColor Green
} else {
    Write-Host "  ✗ 添加文件失败" -ForegroundColor Red
    exit 1
}

# 4. 提交
Write-Host "`n[4/6] 创建初始提交..." -ForegroundColor Yellow
git commit -m "feat: 完成LeanCloud配置迁移到Vercel后端

- 将LeanCloud配置从前端移至Vercel Serverless Functions
- 实现安全的API代理层
- 添加完整的本地开发环境支持
- 包含详细的部署文档和测试指南"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 提交成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ 提交失败" -ForegroundColor Red
    exit 1
}

# 5. 添加远程仓库
Write-Host "`n[5/6] 配置远程仓库..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/rtcus/r-workbench.git"

# 检查是否已存在origin
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "  → 更新远程仓库URL..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 远程仓库配置成功: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "  ✗ 远程仓库配置失败" -ForegroundColor Red
    exit 1
}

# 6. 推送到GitHub
Write-Host "`n[6/6] 推送到GitHub..." -ForegroundColor Yellow
Write-Host "  → 正在推送到 main 分支..." -ForegroundColor Yellow
Write-Host ""

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "  ✓ 推送成功！" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "GitHub仓库: https://github.com/rtcus/r-workbench" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "下一步：部署到Vercel" -ForegroundColor Yellow
    Write-Host "1. 访问 https://vercel.com" -ForegroundColor White
    Write-Host "2. 使用GitHub账号登录" -ForegroundColor White
    Write-Host "3. 点击 'Add New Project'" -ForegroundColor White
    Write-Host "4. 选择 'r-workbench' 仓库" -ForegroundColor White
    Write-Host "5. 配置环境变量（见下方）" -ForegroundColor White
    Write-Host ""
    Write-Host "环境变量配置:" -ForegroundColor Yellow
    Write-Host "  LEANCLOUD_APP_ID = qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz" -ForegroundColor White
    Write-Host "  LEANCLOUD_APP_KEY = n1MnTEgdQGWk2jouFA55NF1n" -ForegroundColor White
    Write-Host "  LEANCLOUD_SERVER_URL = https://qwtz0xzn.lc-cn-n1-shared.com" -ForegroundColor White
    Write-Host ""
    Write-Host "详细步骤请查看: QUICK_START.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Red
    Write-Host "  ✗ 推送失败" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "1. 仓库不存在或无权限" -ForegroundColor White
    Write-Host "2. 需要GitHub身份验证" -ForegroundColor White
    Write-Host "3. 网络连接问题" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方法:" -ForegroundColor Yellow
    Write-Host "1. 确认已创建GitHub仓库: https://github.com/rtcus/r-workbench" -ForegroundColor White
    Write-Host "2. 如需身份验证，请按提示输入用户名和密码/Token" -ForegroundColor White
    Write-Host "3. 或使用SSH: git remote set-url origin git@github.com:rtcus/r-workbench.git" -ForegroundColor White
    Write-Host ""
    exit 1
}
