@echo off
TITLE VoxFlow Neural Production Suite - Ignition
COLOR 0B

echo.
echo    __      __             ___________.__                 
echo    \ \    / /____ ___  ___\_   _____/|  |   ______  _  __ 
echo     \ \  / /  _ \\  \/  / |    __)  |  |  /  _ \ \/ \/ / 
echo      \  / (  <_> )>    <  |     \   |  |_ (  <_> )     /  
echo       \/   \____/__/\_ \ \___  /   |____/ \____/ \/\_/   
echo                        \/     \/                         
echo.
echo    [SYSTEM] Initializing Titan-X Neural Core v4.2...
echo    [SYSTEM] Environment: Localhost Stabilization Mode
echo.

:: 1. Start Backend in a new window
echo    [1/2] Launching Backend Neural Core (Port 5001)...
start cmd /k "cd backend && python main.py"

:: 2. Wait a few seconds for backend to ignite
timeout /t 5 /nobreak > nul

:: 3. Start Frontend in a new window
echo    [2/2] Launching Frontend Dashboard (Port 3000)...
start cmd /k "cd frontend && npm run dev"

echo.
echo    [SUCCESS] All nodes synchronized.
echo    [LINK] Dashboard active at http://localhost:3000
echo    [LINK] Backend active at http://localhost:5001
echo.
echo    Press any key to close this monitor window...
pause > nul
