@echo off
REM 🚀 Hackathon Management System Deployment Script for Windows

echo 🚀 Starting deployment process...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [INFO] Requirements check passed!

REM Build frontend
echo [INFO] Building frontend...
cd frontend

echo [INFO] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend dependency installation failed!
    pause
    exit /b 1
)

echo [INFO] Building frontend for production...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)

echo [SUCCESS] Frontend build completed successfully!
cd ..

echo.
echo 🎯 Hackathon Management System Deployment
echo ========================================
echo.
echo Choose deployment option:
echo 1) Deploy frontend to Vercel only
echo 2) Deploy backend to Railway only  
echo 3) Deploy both (recommended)
echo 4) Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_railway
if "%choice%"=="3" goto deploy_both
if "%choice%"=="4" goto exit
echo [ERROR] Invalid choice. Please run the script again.
pause
exit /b 1

:deploy_vercel
echo [INFO] Deploying frontend to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    call npm install -g vercel
)

cd frontend
call vercel --prod
if %errorlevel% neq 0 (
    echo [ERROR] Vercel deployment failed!
    pause
    exit /b 1
)
echo [SUCCESS] Frontend deployed to Vercel successfully!
cd ..
goto end

:deploy_railway
echo [INFO] Deploying backend to Railway...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Railway CLI not found. Installing...
    call npm install -g @railway/cli
)

cd backend
call railway up
if %errorlevel% neq 0 (
    echo [ERROR] Railway deployment failed!
    pause
    exit /b 1
)
echo [SUCCESS] Backend deployed to Railway successfully!
cd ..
goto end

:deploy_both
call :deploy_vercel
call :deploy_railway
goto end

:end
echo.
echo [SUCCESS] 🎉 Deployment completed!
echo.
echo 📋 Next steps:
echo 1. Set environment variables in your deployment platform
echo 2. Update CORS settings with your frontend URL
echo 3. Test your deployed application
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
pause
exit /b 0

:exit
echo [INFO] Deployment cancelled.
pause
exit /b 0
