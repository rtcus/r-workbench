# R跟单台系统 - 本地测试启动脚本
# 使用方法: 在项目根目录执行 ./start-local.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  R跟单台系统 - 本地测试环境" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查Node.js
Write-Host "[1/4] 检查Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Node.js版本: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js未安装，请先安装Node.js" -ForegroundColor Red
    Write-Host "  下载地址: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 2. 检查环境配置
Write-Host "`n[2/4] 检查环境配置..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✓ 环境配置文件存在" -ForegroundColor Green
} else {
    Write-Host "  ⚠ 未找到.env.local，从.env.example创建..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "  ✓ 已创建.env.local" -ForegroundColor Green
    } else {
        Write-Host "  ✗ .env.example文件不存在" -ForegroundColor Red
        exit 1
    }
}

# 3. 安装依赖
Write-Host "`n[3/4] 检查项目依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  → 正在安装依赖包，请稍候..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ 依赖安装完成" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 依赖安装失败" -ForegroundColor Red
        Write-Host "  请尝试手动运行: npm install" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "  ✓ 依赖包已存在" -ForegroundColor Green
}

# 4. 启动开发服务器
Write-Host "`n[4/4] 启动Vercel开发服务器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  服务器启动中..." -ForegroundColor Cyan
Write-Host "  请等待服务器完全启动后访问" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "提示:" -ForegroundColor Yellow
Write-Host "  • 通常会在 http://localhost:3000 启动" -ForegroundColor White
Write-Host "  • 按 Ctrl+C 停止服务器" -ForegroundColor White
Write-Host "  • 修改代码后会自动重启" -ForegroundColor White
Write-Host ""

# 启动Vercel开发服务器
npx vercel dev --yes
