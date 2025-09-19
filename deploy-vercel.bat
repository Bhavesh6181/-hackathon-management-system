@echo off
REM 🚀 Vercel Full-Stack Deployment Script for Windows

echo 🚀 Starting Vercel Full-Stack Deployment...

REM Colors for output
echo [INFO] Checking requirements...

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

echo [SUCCESS] Requirements check passed!

REM Install dependencies for all parts
echo [INFO] Installing dependencies...

echo [INFO] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Root dependency installation failed!
    pause
    exit /b 1
)

echo [INFO] Installing API dependencies...
cd api
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] API dependency installation failed!
    pause
    exit /b 1
)
cd ..

echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend dependency installation failed!
    pause
    exit /b 1
)

echo [INFO] Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo [SUCCESS] Build completed successfully!

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Vercel CLI!
        pause
        exit /b 1
    )
)

echo.
echo 🎯 Vercel Full-Stack Deployment
echo ==============================
echo.
echo Your project is now ready for Vercel deployment!
echo.
echo 📋 Next steps:
echo 1. Run: vercel login
echo 2. Run: vercel --prod
echo 3. Set environment variables in Vercel dashboard:
echo    - MONGODB_URI
echo    - JWT_SECRET
echo    - SESSION_SECRET
echo    - NODE_ENV=production
echo.
echo 📚 For detailed instructions, see VERCEL-DEPLOYMENT.md
echo.

set /p choice="Do you want to deploy now? (y/n): "

if /i "%choice%"=="y" (
    echo [INFO] Starting Vercel deployment...
    call vercel --prod
    if %errorlevel% neq 0 (
        echo [ERROR] Vercel deployment failed!
        pause
        exit /b 1
    )
    echo [SUCCESS] 🎉 Deployment completed!
) else (
    echo [INFO] Deployment skipped. You can run 'vercel --prod' when ready.
)

echo.
echo 📋 Environment Variables to set in Vercel:
echo ==========================================
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon_management
echo JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
echo SESSION_SECRET=your-super-secret-session-key-minimum-32-characters
echo NODE_ENV=production
echo.
echo 🌐 Your app will be available at: https://your-app.vercel.app
echo.

pause
exit /b 0
