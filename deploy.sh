#!/bin/bash

# R跟单台系统 - 一键部署脚本
# 适用于Linux/Mac系统

set -e  # 遇到错误立即退出

echo "======================================"
echo "  R跟单台系统 - 部署脚本"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ 未找到 $1，请先安装${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ $1 已安装${NC}"
    fi
}

# Step 1: 检查依赖
echo "Step 1: 检查系统依赖..."
check_command git
check_command node
check_command npm
echo ""

# Step 2: 检查环境变量文件
echo "Step 2: 检查环境变量配置..."
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠ 未找到 .env.local 文件${NC}"
    echo "从 .env.example 复制..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠ 请编辑 .env.local 填入你的LeanCloud配置${NC}"
    echo "按回车继续..."
    read
fi
echo -e "${GREEN}✓ .env.local 存在${NC}"
echo ""

# Step 3: 安装依赖
echo "Step 3: 安装项目依赖..."
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# Step 4: Git检查
echo "Step 4: 检查Git状态..."
if [ ! -d .git ]; then
    echo "初始化Git仓库..."
    git init
    echo -e "${GREEN}✓ Git初始化完成${NC}"
fi

# 检查是否有远程仓库
if ! git remote | grep -q origin; then
    echo -e "${YELLOW}⚠ 未配置远程仓库${NC}"
    echo "请输入GitHub仓库URL (例: https://github.com/username/r-workbench.git):"
    read REPO_URL
    git remote add origin $REPO_URL
    echo -e "${GREEN}✓ 远程仓库已配置${NC}"
fi
echo ""

# Step 5: 提交代码
echo "Step 5: 提交代码到Git..."
git add .
git commit -m "部署: $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有新的改动"
echo -e "${GREEN}✓ 代码已提交${NC}"
echo ""

# Step 6: 推送到GitHub
echo "Step 6: 推送到GitHub..."
git push -u origin main || git push -u origin master
echo -e "${GREEN}✓ 代码已推送${NC}"
echo ""

# Step 7: Vercel部署
echo "Step 7: 部署到Vercel..."
if command -v vercel &> /dev/null; then
    echo "开始Vercel部署..."
    vercel --prod
    echo -e "${GREEN}✓ 部署完成${NC}"
else
    echo -e "${YELLOW}⚠ 未安装Vercel CLI${NC}"
    echo "安装Vercel CLI? (y/n)"
    read -r answer
    if [ "$answer" = "y" ]; then
        npm install -g vercel
        echo "请运行 'vercel login' 登录，然后再次运行此脚本"
        exit 0
    else
        echo "请手动访问 https://vercel.com 完成部署"
    fi
fi
echo ""

echo "======================================"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "======================================"
echo ""
echo "下一步："
echo "1. 访问Vercel控制台配置环境变量"
echo "2. 确保添加了以下变量："
echo "   - LEANCLOUD_APP_ID"
echo "   - LEANCLOUD_APP_KEY"
echo "   - LEANCLOUD_SERVER_URL"
echo "3. 访问你的网站测试功能"
echo ""
echo "详细文档: README.md"
echo "快速开始: QUICK_START.md"
echo "部署指南: DEPLOYMENT.md"
echo ""
