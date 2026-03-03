@echo off
title Time Keeper
cd /d "%~dp0"

REM Build if needed
if not exist ".next\BUILD_ID" (
    echo Building Time Keeper...
    call npm run build
    if %errorlevel% neq 0 (
        echo Build failed.
        pause
        exit /b 1
    )
)

REM Start the production server in the background
start /b cmd /c "npm run start"

REM Wait for the server to be ready
echo Waiting for server to start...
:wait
ping -n 2 127.0.0.1 >nul
curl -s http://localhost:4005 >nul 2>&1
if errorlevel 1 goto wait

echo Server is ready. Opening Time Keeper...

REM Open in Chrome
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://localhost:4005

echo.
echo Time Keeper is running.
echo Press any key to stop the server and exit.
pause >nul
taskkill /f /im node.exe >nul 2>&1
