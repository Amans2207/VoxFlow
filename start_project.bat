@echo off
TITLE VoxFlow - SYSTEM IGNITION
COLOR 0B

echo.
echo    [SYSTEM] Launching VoxFlow Production Suite...
echo.

:: Start Backend
start cmd /k "cd backend && python main.py"

:: Start Frontend
start cmd /k "cd frontend && npm run dev"

echo    [SUCCESS] Both nodes active.
echo    [LINK] http://localhost:3000
pause
