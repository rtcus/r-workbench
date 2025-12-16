# 修复Git配置并推送到GitHub
# 解决Git仓库在错误位置的问题

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  修复Git配置并推送到GitHub" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 确保在项目目录
$projectDir = "c:\Users\huPan\Downloads\r-w"
Set-Location $projectDir

Write-Host "当前目录: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# 1. 删除用户目录下的错误Git仓库
Write-Host "[1/7] 清理错误的Git仓库..." -ForegroundColor Yellow
$userGitDir = "C:\Users\huPan\.git"
if (Test-Path $userGitDir) {
    Write-Host "  → 检测到用户目录的.git，正在删除..." -ForegroundColor Yellow
    try {
        Remove-Item -Path $userGitDir -Recurse -Force -ErrorAction Stop
        Write-Host "  ✓ 已删除用户目录的.git" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ 无法删除，可能需要管理员权限" -ForegroundColor Yellow
        Write-Host "  → 继续尝试在项目目录初始化..." -ForegroundColor Yellow
    }
}

# 2. 删除项目目录的.git（如果存在）
Write-Host "`n[2/7] 清理项目目录的.git..." -ForegroundColor Yellow
$projectGitDir = Join-Path $projectDir ".git"
if (Test-Path $projectGitDir) {
    Write-Host "  → 删除项目目录的.git..." -ForegroundColor Yellow
    Remove-Item -Path $projectGitDir -Recurse -Force
    Write-Host "  ✓ 已删除" -ForegroundColor Green
}

# 3. 在项目目录初始化Git
Write-Host "`n[3/7] 在项目目录初始化Git..." -ForegroundColor Yellow
git init
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Git仓库初始化成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ Git初始化失败" -ForegroundColor Red
    exit 1
}

# 验证Git仓库位置
$gitRoot = git rev-parse --show-toplevel 2>$null
$gitRoot = $gitRoot -replace '/', '\'
Write-Host "  Git仓库位置: $gitRoot" -ForegroundColor Cyan

# 4. 添加文件
Write-Host "`n[4/7] 添加项目文件..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 文件添加成功" -ForegroundColor Green
    
    # 显示将要提交的文件
    $stagedFiles = git diff --cached --name-only
    $fileCount = ($stagedFiles | Measure-Object).Count
    Write-Host "  → 准备提交 $fileCount 个文件" -ForegroundColor Cyan
    
    # 显示前10个文件
    Write-Host "  主要文件:" -ForegroundColor Gray
    $stagedFiles | Select-Object -First 10 | ForEach-Object {
        Write-Host "    - $_" -ForegroundColor Gray
    }
    if ($fileCount -gt 10) {
        Write-Host "    ... 还有 $($fileCount - 10) 个文件" -ForegroundColor Gray
    }
} else {
    Write-Host "  ✗ 添加文件失败" -ForegroundColor Red
    exit 1
}

# 5. 提交
Write-Host "`n[5/7] 创建提交..." -ForegroundColor Yellow
git commit -m "feat: R跟单台系统 - LeanCloud迁移到Vercel

- 将LeanCloud配置从前端移至Vercel Serverless Functions
- 实现安全的API代理层，保护敏感信息
- 添加完整的本地开发环境支持
- 包含详细的部署文档和测试指南
- 支持跟单工作台、报关数据、HS编码等完整功能"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 提交成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ 提交失败" -ForegroundColor Red
    exit 1
}

# 6. 配置远程仓库
Write-Host "`n[6/7] 配置远程仓库..." -ForegroundColor Yellow
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
    Write-Host "  ✓ 远程仓库配置成功" -ForegroundColor Green
    Write-Host "  → $remoteUrl" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ 远程仓库配置失败" -ForegroundColor Red
    exit 1
}

# 7. 推送到GitHub
Write-Host "`n[7/7] 推送到GitHub..." -ForegroundColor Yellow
Write-Host "  → 切换到main分支并推送..." -ForegroundColor Yellow
Write-Host ""

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "  ✓✓✓ 推送成功！✓✓✓" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 代码已成功推送到GitHub！" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "GitHub仓库地址:" -ForegroundColor Yellow
    Write-Host "  → https://github.com/rtcus/r-workbench" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "现在可以访问上面的链接查看代码" -ForegroundColor White
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "下一步：部署到Vercel" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣  访问 https://vercel.com" -ForegroundColor White
    Write-Host "2️⃣  使用GitHub账号登录" -ForegroundColor White
    Write-Host "3️⃣  点击 'Add New Project'" -ForegroundColor White
    Write-Host "4️⃣  选择 'r-workbench' 仓库" -ForegroundColor White
    Write-Host "5️⃣  配置环境变量:" -ForegroundColor White
    Write-Host ""
    Write-Host "    LEANCLOUD_APP_ID = qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz" -ForegroundColor Gray
    Write-Host "    LEANCLOUD_APP_KEY = n1MnTEgdQGWk2jouFA55NF1n" -ForegroundColor Gray
    Write-Host "    LEANCLOUD_SERVER_URL = https://qwtz0xzn.lc-cn-n1-shared.com" -ForegroundColor Gray
    Write-Host ""
    Write-Host "6️⃣  点击 'Deploy' 按钮" -ForegroundColor White
    Write-Host ""
    Write-Host "详细步骤请查看: VERCEL-DEPLOY-GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Red
    Write-Host "  ✗ 推送失败" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "1. 需要GitHub身份验证" -ForegroundColor White
    Write-Host "2. 仓库权限问题" -ForegroundColor White
    Write-Host "3. 网络连接问题" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方法:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "方法1: 使用Personal Access Token" -ForegroundColor Cyan
    Write-Host "  1. 访问 https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. 点击 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "  3. 勾选 'repo' 权限" -ForegroundColor White
    Write-Host "  4. 生成并复制Token" -ForegroundColor White
    Write-Host "  5. 重新运行此脚本，在提示时：" -ForegroundColor White
    Write-Host "     用户名: 你的GitHub用户名" -ForegroundColor Gray
    Write-Host "     密码: 粘贴Token（不是密码）" -ForegroundColor Gray
    Write-Host ""
    Write-Host "方法2: 使用SSH" -ForegroundColor Cyan
    Write-Host "  git remote set-url origin git@github.com:rtcus/r-workbench.git" -ForegroundColor Gray
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
