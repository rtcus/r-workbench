# R跟单台系统 - Windows PowerShell部署脚本

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  R跟单台系统 - 部署脚本 (Windows)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 检查命令是否存在
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        Write-Host "✓ $Command 已安装" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ 未找到 $Command，请先安装" -ForegroundColor Red
        return $false
    }
}

# Step 1: 检查依赖
Write-Host "Step 1: 检查系统依赖..." -ForegroundColor Yellow
$hasGit = Test-Command "git"
$hasNode = Test-Command "node"
$hasNpm = Test-Command "npm"

if (-not ($hasGit -and $hasNode -and $hasNpm)) {
    Write-Host "请安装缺失的依赖后重试" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: 检查环境变量文件
Write-Host "Step 2: 检查环境变量配置..." -ForegroundColor Yellow
if (-not (Test-Path .env.local)) {
    Write-Host "⚠ 未找到 .env.local 文件" -ForegroundColor Yellow
    Write-Host "从 .env.example 复制..."
    Copy-Item .env.example .env.local
    Write-Host "⚠ 请编辑 .env.local 填入你的LeanCloud配置" -ForegroundColor Yellow
    Write-Host "按回车继续..."
    Read-Host
}
Write-Host "✓ .env.local 存在" -ForegroundColor Green
Write-Host ""

# Step 3: 安装依赖
Write-Host "Step 3: 安装项目依赖..." -ForegroundColor Yellow
npm install
Write-Host "✓ 依赖安装完成" -ForegroundColor Green
Write-Host ""

# Step 4: Git检查
Write-Host "Step 4: 检查Git状态..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    Write-Host "初始化Git仓库..."
    git init
    Write-Host "✓ Git初始化完成" -ForegroundColor Green
}

# 检查是否有远程仓库
$remotes = git remote
if (-not ($remotes -contains "origin")) {
    Write-Host "⚠ 未配置远程仓库" -ForegroundColor Yellow
    $repoUrl = Read-Host "请输入GitHub仓库URL (例: https://github.com/username/r-workbench.git)"
    git remote add origin $repoUrl
    Write-Host "✓ 远程仓库已配置" -ForegroundColor Green
}
Write-Host ""

# Step 5: 提交代码
Write-Host "Step 5: 提交代码到Git..." -ForegroundColor Yellow
git add .
try {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "部署: $timestamp"
} catch {
    Write-Host "没有新的改动"
}
Write-Host "✓ 代码已提交" -ForegroundColor Green
Write-Host ""

# Step 6: 推送到GitHub
Write-Host "Step 6: 推送到GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
} catch {
    git push -u origin master
}
Write-Host "✓ 代码已推送" -ForegroundColor Green
Write-Host ""

# Step 7: Vercel部署
Write-Host "Step 7: 部署到Vercel..." -ForegroundColor Yellow
if (Test-Command "vercel") {
    Write-Host "开始Vercel部署..."
    vercel --prod
    Write-Host "✓ 部署完成" -ForegroundColor Green
} else {
    Write-Host "⚠ 未安装Vercel CLI" -ForegroundColor Yellow
    $answer = Read-Host "安装Vercel CLI? (y/n)"
    if ($answer -eq "y") {
        npm install -g vercel
        Write-Host "请运行 'vercel login' 登录，然后再次运行此脚本"
        exit 0
    } else {
        Write-Host "请手动访问 https://vercel.com 完成部署"
    }
}
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🎉 部署完成！" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步："
Write-Host "1. 访问Vercel控制台配置环境变量"
Write-Host "2. 确保添加了以下变量："
Write-Host "   - LEANCLOUD_APP_ID"
Write-Host "   - LEANCLOUD_APP_KEY"
Write-Host "   - LEANCLOUD_SERVER_URL"
Write-Host "3. 访问你的网站测试功能"
Write-Host ""
Write-Host "详细文档: README.md"
Write-Host "快速开始: QUICK_START.md"
Write-Host "部署指南: DEPLOYMENT.md"
Write-Host ""
