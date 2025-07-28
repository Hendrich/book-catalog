@echo off
REM Setup script for Windows - Book Catalog API
REM This script sets up the development environment on Windows

echo 🚀 Setting up Book Catalog API...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env exists
if not exist .env (
    echo 📄 Creating .env file from template...
    copy .env.template .env
    echo ⚠️  Please edit .env file with your configuration
) else (
    echo ✅ .env file already exists
)

REM Create logs directory if it doesn't exist
if not exist logs (
    mkdir logs
    echo ✅ Created logs directory
)

echo 🎉 Setup complete! Next steps:
echo 1. Edit .env file with your database and authentication settings
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:3000/api-docs for API documentation

pause
