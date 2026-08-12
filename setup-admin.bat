@echo off
REM FindIt Campus Admin Dashboard - Quick Setup Script (Windows)

cls
echo.
echo ======================================
echo FindIt Campus - Admin Setup
echo ======================================
echo.

REM Check if we're in the right directory
if not exist "Server\seedAdmin.js" (
    echo Error: Run this script from the project root directory
    pause
    exit /b 1
)

REM Step 1: Install dependencies
echo Step 1: Checking dependencies...
if not exist "Server\node_modules" (
    echo Installing server dependencies...
    cd Server
    call npm install
    cd ..
)

if not exist "Client\node_modules" (
    echo Installing client dependencies...
    cd Client
    call npm install
    cd ..
)

echo Dependencies ready!
echo.

REM Step 2: Create admin account
echo Step 2: Creating admin account...
cd Server
call node seedAdmin.js
cd ..
echo.

REM Step 3: Summary
cls
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next Steps:
echo.
echo 1. Start the backend:
echo    cd Server ^&^& npm start
echo.
echo 2. In a new terminal, start the frontend:
echo    cd Client ^&^& npm run dev
echo.
echo 3. Access the admin panel:
echo    http://localhost:5173/admin/login
echo.
echo Admin Credentials:
echo    Email: admin@findit.com
echo    Password: admin@123
echo.
echo IMPORTANT: Change the default password after first login!
echo.
echo ======================================
pause
