# Git Push Script for R-Workbench
# Push project to GitHub repository

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub Repository" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Set project directory
$projectDir = "c:\Users\huPan\Downloads\r-w"
Set-Location $projectDir

Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Step 1: Clean up wrong Git repository
Write-Host "[1/7] Cleaning up wrong Git repository..." -ForegroundColor Yellow
$userGitDir = "C:\Users\huPan\.git"
if (Test-Path $userGitDir) {
    Write-Host "  -> Removing .git from user directory..." -ForegroundColor Yellow
    try {
        Remove-Item -Path $userGitDir -Recurse -Force -ErrorAction Stop
        Write-Host "  OK Removed user directory .git" -ForegroundColor Green
    } catch {
        Write-Host "  ! Cannot remove, may need admin rights" -ForegroundColor Yellow
        Write-Host "  -> Continuing to initialize in project directory..." -ForegroundColor Yellow
    }
}

# Step 2: Clean up project .git
Write-Host "`n[2/7] Cleaning up project .git..." -ForegroundColor Yellow
$projectGitDir = Join-Path $projectDir ".git"
if (Test-Path $projectGitDir) {
    Write-Host "  -> Removing project .git..." -ForegroundColor Yellow
    Remove-Item -Path $projectGitDir -Recurse -Force
    Write-Host "  OK Removed" -ForegroundColor Green
}

# Step 3: Initialize Git in project directory
Write-Host "`n[3/7] Initializing Git in project directory..." -ForegroundColor Yellow
git init
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "  X Git initialization failed" -ForegroundColor Red
    exit 1
}

# Verify Git repository location
$gitRoot = git rev-parse --show-toplevel 2>$null
$gitRoot = $gitRoot -replace '/', '\'
Write-Host "  Git repository location: $gitRoot" -ForegroundColor Cyan

# Step 4: Add files
Write-Host "`n[4/7] Adding project files..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK Files added successfully" -ForegroundColor Green
    
    # Show files to be committed
    $stagedFiles = git diff --cached --name-only
    $fileCount = ($stagedFiles | Measure-Object).Count
    Write-Host "  -> Preparing to commit $fileCount files" -ForegroundColor Cyan
    
    # Show first 10 files
    Write-Host "  Main files:" -ForegroundColor Gray
    $stagedFiles | Select-Object -First 10 | ForEach-Object {
        Write-Host "    - $_" -ForegroundColor Gray
    }
    if ($fileCount -gt 10) {
        Write-Host "    ... and $($fileCount - 10) more files" -ForegroundColor Gray
    }
} else {
    Write-Host "  X Adding files failed" -ForegroundColor Red
    exit 1
}

# Step 5: Commit
Write-Host "`n[5/7] Creating commit..." -ForegroundColor Yellow
git commit -m "feat: R-Workbench System - LeanCloud Migration to Vercel

- Migrate LeanCloud config from frontend to Vercel Serverless Functions
- Implement secure API proxy layer to protect sensitive information
- Add complete local development environment support
- Include detailed deployment documentation and testing guides
- Support full features: tracking, customs data, HS codes, etc."

if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK Commit successful" -ForegroundColor Green
} else {
    Write-Host "  X Commit failed" -ForegroundColor Red
    exit 1
}

# Step 6: Configure remote repository
Write-Host "`n[6/7] Configuring remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/rtcus/r-workbench.git"

# Check if origin already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "  -> Updating remote repository URL..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK Remote repository configured" -ForegroundColor Green
    Write-Host "  -> $remoteUrl" -ForegroundColor Cyan
} else {
    Write-Host "  X Remote repository configuration failed" -ForegroundColor Red
    exit 1
}

# Step 7: Push to GitHub
Write-Host "`n[7/7] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "  -> Switching to main branch and pushing..." -ForegroundColor Yellow
Write-Host ""

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "  SUCCESS: Pushed to GitHub!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "GitHub Repository:" -ForegroundColor Yellow
    Write-Host "  -> https://github.com/rtcus/r-workbench" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can now visit the link above to view your code" -ForegroundColor White
    Write-Host ""
    Write-Host "-------------------------------------------" -ForegroundColor Cyan
    Write-Host "Next Step: Deploy to Vercel" -ForegroundColor Yellow
    Write-Host "-------------------------------------------" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Visit https://vercel.com" -ForegroundColor White
    Write-Host "2. Login with GitHub account" -ForegroundColor White
    Write-Host "3. Click 'Add New Project'" -ForegroundColor White
    Write-Host "4. Select 'r-workbench' repository" -ForegroundColor White
    Write-Host "5. Configure environment variables:" -ForegroundColor White
    Write-Host ""
    Write-Host "    LEANCLOUD_APP_ID = qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz" -ForegroundColor Gray
    Write-Host "    LEANCLOUD_APP_KEY = n1MnTEgdQGWk2jouFA55NF1n" -ForegroundColor Gray
    Write-Host "    LEANCLOUD_SERVER_URL = https://qwtz0xzn.lc-cn-n1-shared.com" -ForegroundColor Gray
    Write-Host ""
    Write-Host "6. Click 'Deploy' button" -ForegroundColor White
    Write-Host ""
    Write-Host "For detailed steps, see: VERCEL-DEPLOY-GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Red
    Write-Host "  FAILED: Push failed" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "1. GitHub authentication required" -ForegroundColor White
    Write-Host "2. Repository permission issue" -ForegroundColor White
    Write-Host "3. Network connection problem" -ForegroundColor White
    Write-Host ""
    Write-Host "Solution:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Method 1: Use Personal Access Token" -ForegroundColor Cyan
    Write-Host "  1. Visit https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Click 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "  3. Check 'repo' permission" -ForegroundColor White
    Write-Host "  4. Generate and copy Token" -ForegroundColor White
    Write-Host "  5. Run this script again, when prompted:" -ForegroundColor White
    Write-Host "     Username: your GitHub username" -ForegroundColor Gray
    Write-Host "     Password: paste Token (not your password)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Method 2: Use SSH" -ForegroundColor Cyan
    Write-Host "  git remote set-url origin git@github.com:rtcus/r-workbench.git" -ForegroundColor Gray
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
