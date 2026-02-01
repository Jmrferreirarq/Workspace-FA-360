@echo off
REM FA-360 Quick Deploy Script
REM Validates build and deploys to Vercel

echo ========================================
echo FA-360 Platform - Quick Deploy
echo ========================================
echo.

echo [1/4] Running type-check...
call npm run type-check
if %errorlevel% neq 0 (
    echo ERROR: Type-check failed!
    pause
    exit /b 1
)
echo ✓ Type-check passed
echo.

echo [2/4] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build successful
echo.

echo [3/4] Committing changes...
git add .
git commit -m "fix: resolve TypeScript errors and update dependencies"
echo ✓ Changes committed
echo.

echo [4/4] Pushing to Vercel...
git push origin main
echo ✓ Pushed to repository
echo.

echo ========================================
echo ✓ Deploy complete!
echo Vercel will auto-deploy in ~2 minutes
echo Check: https://360-puce.vercel.app/
echo ========================================
pause
