@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

REM Load environment variables from .env if present
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        set "line=%%A"
        if not "!line:~0,1!"=="#" (
            if not "%%A"=="" set "%%A=%%B"
        )
    )
)

where mvn >nul 2>nul
if %errorlevel% neq 0 (
    if not exist "tools\apache-maven-3.9.9\bin\mvn.cmd" (
        echo ==================================================
        echo  Maven not detected. Downloading portable Maven...
        echo ==================================================
        if not exist "tools" mkdir tools
        curl -L -o tools\maven.zip https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip
        tar -xf tools\maven.zip -C tools
        del tools\maven.zip
        echo Maven ready!
    )
    set "PATH=%~dp0tools\apache-maven-3.9.9\bin;%PATH%"
)

REM Ensure 'hr_system' database exists in PostgreSQL
set "PGPASSWORD=051126"
where psql >nul 2>nul
if %errorlevel% neq 0 (
    for /d %%D in ("C:\Program Files\PostgreSQL\*") do (
        if exist "%%D\bin\psql.exe" set "PATH=%%D\bin;%PATH%"
    )
)
where psql >nul 2>nul
if %errorlevel% equ 0 (
    echo Checking database 'hr_system'...
    psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE hr_system;" >nul 2>nul
)

echo Starting HRMS Spring Boot Backend on http://localhost:8081 ...
mvn spring-boot:run
pause
