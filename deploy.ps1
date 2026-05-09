# Service Tap Deployment Script
# This script builds the frontend and pushes everything to GitHub

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Cyan

# 1. Build the frontend
Write-Host "📦 Building Frontend..." -ForegroundColor Yellow
cd client
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Build failed!" -ForegroundColor Red; exit }
cd ..

# 2. Sync build to server/public
Write-Host "🔄 Syncing build to server/public..." -ForegroundColor Yellow
if (Test-Path "server/public") { Remove-Item -Recurse -Force "server/public" }
New-Item -ItemType Directory -Path "server/public"
Copy-Item -Path "client/dist/*" -Destination "server/public" -Recurse -Force

# 3. Git Push
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git add .
$msg = "Update: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
git commit -m $msg
git push origin main

Write-Host "✅ Done! Now pull the changes on your cPanel." -ForegroundColor Green
