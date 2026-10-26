@echo off
title EU & Germany Academic & Open Access Job Radar
echo ====================================================
echo    Scanning EU & Germany Academic & Open Access Jobs
echo ====================================================
echo.
node "%~dp0EU-Job-Radar\job-scout.mjs"
echo.
if exist "%~dp0EU-Job-Radar\jobs-radar.html" (
    start chrome "%~dp0EU-Job-Radar\jobs-radar.html" 2>nul || start msedge "%~dp0EU-Job-Radar\jobs-radar.html" 2>nul
)
echo Dashboard opened in your web browser!
echo Press any key to close this terminal...
pause >nul
