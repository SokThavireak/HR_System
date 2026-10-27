@echo off
echo ==================================================
echo       Starting HRMS Full-Stack Application
echo ==================================================
echo.
echo Launching Backend in new window...
start "HRMS Backend (Port 8081)" cmd /k "%~dp0start-backend.bat"

echo Launching Frontend in new window...
start "HRMS Frontend (Port 3000)" cmd /k "%~dp0start-frontend.bat"

echo.
echo ==================================================
echo Both services are launching!
echo Frontend will be at: http://localhost:3000
echo Backend will be at:  http://localhost:8081
echo ==================================================
