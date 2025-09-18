@echo off
setlocal enabledelayedexpansion

echo.
echo 🏛️  BMAD C4 Architecture Expansion Pack Installer
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "agents\c4-architect.md" (
    echo ❌ Error: Please run this script from the bmad-c4-architecture directory
    echo    Current directory: %CD%
    pause
    exit /b 1
)

REM Check if BMAD-METHOD root exists
if not exist "..\..\bmad-core" (
    echo ❌ Error: BMAD-METHOD root directory not found
    echo    Expected: ..\..\bmad-core
    echo    Current directory: %CD%
    pause
    exit /b 1
)

echo 📁 Installing C4 Architecture Expansion Pack...
echo.

REM Create directories if they don't exist
if not exist "..\..\bmad-core\agents" mkdir "..\..\bmad-core\agents"
if not exist "..\..\bmad-core\tasks" mkdir "..\..\bmad-core\tasks"
if not exist "..\..\bmad-core\templates" mkdir "..\..\bmad-core\templates"
if not exist "..\..\bmad-core\data" mkdir "..\..\bmad-core\data"
if not exist "..\..\bmad-core\checklists" mkdir "..\..\bmad-core\checklists"
if not exist "..\..\bmad-core\agent-teams" mkdir "..\..\bmad-core\agent-teams"
if not exist "..\..\bmad-core\workflows" mkdir "..\..\bmad-core\workflows"

REM Copy agent files
echo 📄 Copying agent files...
copy "agents\c4-architect.md" "..\..\bmad-core\agents\" >nul
if errorlevel 1 (
    echo ❌ Failed to copy agent files
    pause
    exit /b 1
)

REM Copy task files
echo 📄 Copying task files...
for %%f in (tasks\*.md) do (
    copy "%%f" "..\..\bmad-core\tasks\" >nul
    if errorlevel 1 (
        echo ❌ Failed to copy task file: %%f
        pause
        exit /b 1
    )
)

REM Copy template files
echo 📄 Copying template files...
for %%f in (templates\*.yaml) do (
    copy "%%f" "..\..\bmad-core\templates\" >nul
    if errorlevel 1 (
        echo ❌ Failed to copy template file: %%f
        pause
        exit /b 1
    )
)

REM Copy data files
echo 📄 Copying data files...
for %%f in (data\*.md) do (
    copy "%%f" "..\..\bmad-core\data\" >nul
    if errorlevel 1 (
        echo ❌ Failed to copy data file: %%f
        pause
        exit /b 1
    )
)

REM Copy checklist files
echo 📄 Copying checklist files...
for %%f in (checklists\*.md) do (
    copy "%%f" "..\..\bmad-core\checklists\" >nul
    if errorlevel 1 (
        echo ❌ Failed to copy checklist file: %%f
        pause
        exit /b 1
    )
)

REM Copy agent team files
echo 📄 Copying agent team files...
for %%f in (agent-teams\*.yaml) do (
    copy "%%f" "..\..\bmad-core\agent-teams\" >nul
    if errorlevel 1 (
        echo ❌ Failed to copy agent team file: %%f
        pause
        exit /b 1
    )
)

REM Copy workflow files
echo 📄 Copying workflow files...
for %%f in (workflows\*.yaml) do (
    copy "%%f" "..\..\bmad-core\workflows\" >nul
    if errorlevel 1 (
        echo ❌ Failed to copy workflow file: %%f
        pause
        exit /b 1
    )
)

echo.
echo ✅ Installation completed successfully!
echo.
echo 🎯 What's been installed:
echo    - C4 Architect Agent (Simon)
echo    - 9 specialized tasks for C4 model creation
echo    - 4 interactive templates
echo    - C4 model guidelines and best practices
echo    - Quality assurance checklists
echo    - 3 agent team configurations
echo    - 2 specialized workflows
echo.
echo 🚀 Next steps:
echo    1. Go back to BMAD-METHOD root: cd ..\..
echo    2. Test the agent: node tools/cli.js agent c4-architect
echo    3. Set up Structurizr Lite for diagram visualization
echo.
echo 📚 For detailed usage instructions, see:
echo    - expansion-packs/bmad-c4-architecture/README.md
echo    - expansion-packs/bmad-c4-architecture/utils/structurizr-setup.md
echo.

REM Check for Docker
echo 🔍 Checking for Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker not found. You can install Docker Desktop or use Java 17+ instead.
    echo    Visit: https://www.docker.com/products/docker-desktop/
) else (
    echo ✅ Docker found - recommended for Structurizr Lite
    echo 💡 To start Structurizr Lite with Docker:
    echo    docker pull structurizr/lite
    echo    docker run -it --rm -p 8080:8080 -v C:\structurizr:/usr/local/structurizr structurizr/lite
)

echo.
echo 🏛️  C4 Architecture Expansion Pack is ready to use!
echo.
pause