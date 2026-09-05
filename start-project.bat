@echo off
echo Starting AI Task Manager...
echo.

start "Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

start "Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo Backend and Frontend are starting in separate windows.
echo Do not close those windows while using the app.
echo Frontend will open in your browser automatically.
