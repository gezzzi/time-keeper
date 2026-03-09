@echo off
title Time Keeper
cd /d "%~dp0"

REM Check if server is already running and healthy
curl -s -o nul --connect-timeout 3 --max-time 5 http://localhost:4005 >nul 2>&1
if not errorlevel 1 (
    echo Server is already running. Opening browser...
    start "" http://localhost:4005
    goto running
)

REM Kill any zombie process that might be holding the port
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":4005" ^| findstr "LISTENING"') do (
    echo Cleaning up stale process on port 4005...
    taskkill /f /pid %%p >nul 2>&1
)
ping -n 2 127.0.0.1 >nul

REM Start the dev server in the background
start /b cmd /c "npm run dev"

REM Wait for the server to be ready
echo Waiting for server to start...
:wait
ping -n 2 127.0.0.1 >nul
curl -s -o nul --connect-timeout 3 --max-time 10 http://localhost:4005 >nul 2>&1
if errorlevel 1 goto wait

echo Server is ready. Opening Time Keeper...

REM Open in default browser via URL handler (ensures foreground activation)
start "" http://localhost:4005

:running
echo.
echo Time Keeper is running on http://localhost:4005
echo Press any key to stop the server and exit.
pause >nul

REM Kill only the processes listening on our port (not all node.exe)
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":4005" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%p >nul 2>&1
)
