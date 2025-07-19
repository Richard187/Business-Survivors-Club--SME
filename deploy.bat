@echo off
echo 🚀 SME Connect SMS System Deployment
echo =====================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create data directory
echo 📁 Creating data directory...
if not exist "sms-data" mkdir sms-data

REM Check if PM2 is installed
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing PM2...
    npm install -g pm2
)

REM Create PM2 ecosystem file
echo ⚙️ Creating PM2 configuration...
(
echo module.exports = {
echo   apps: [{
echo     name: 'sme-sms-api',
echo     script: 'sms-api.js',
echo     instances: 1,
echo     autorestart: true,
echo     watch: false,
echo     max_memory_restart: '1G',
echo     env: {
echo       NODE_ENV: 'production',
echo       PORT: 3001
echo     },
echo     env_production: {
echo       NODE_ENV: 'production',
echo       PORT: 3001
echo     }
echo   }]
echo };
) > ecosystem.config.js

echo ✅ PM2 configuration created

REM Start the application
echo 🚀 Starting SMS API server...
pm2 start ecosystem.config.js --env production

if %errorlevel% equ 0 (
    echo ✅ SMS API server started successfully
    echo.
    echo 📋 Deployment Summary:
    echo - API running on port 3001
    echo - PM2 process: sme-sms-api
    echo - Data directory: ./sms-data
    echo.
    echo 🔧 Useful Commands:
    echo - View logs: pm2 logs sme-sms-api
    echo - Restart: pm2 restart sme-sms-api
    echo - Stop: pm2 stop sme-sms-api
    echo - Status: pm2 status
    echo.
    echo 🌐 Test the API:
    echo - Health check: curl http://localhost:3001/health
    echo - Webhook: http://localhost:3001/webhook/sms
    echo.
    echo 📱 Next Steps:
    echo 1. Configure FrontlineSMS webhook to: http://your-domain.com:3001/webhook/sms
    echo 2. Update SMS number in index.html
    echo 3. Test the system with: node test-sms.js
    echo 4. Access admin dashboard at: http://your-domain.com?admin=1
) else (
    echo ❌ Failed to start SMS API server
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment completed successfully!
pause 