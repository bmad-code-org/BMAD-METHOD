# BMAD C4 Architecture Expansion Pack Installation Script for PowerShell
# This script handles line ending conversion and runs the bash installer

Write-Host "🏛️  BMAD C4 Architecture Expansion Pack Installer (PowerShell)" -ForegroundColor Blue
Write-Host "================================================================" -ForegroundColor Blue
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "agents\c4-architect.md")) {
    Write-Host "❌ Error: Please run this script from the bmad-c4-architecture directory" -ForegroundColor Red
    Write-Host "Current directory: $PWD" -ForegroundColor Red
    exit 1
}

# Check if BMAD-METHOD root exists
if (-not (Test-Path "..\..\bmad-core")) {
    Write-Host "❌ Error: BMAD-METHOD root directory not found" -ForegroundColor Red
    Write-Host "Expected: ..\..\bmad-core" -ForegroundColor Red
    Write-Host "Current directory: $PWD" -ForegroundColor Red
    exit 1
}

# Fix line endings in install.sh
Write-Host "🔧 Fixing line endings in install.sh..." -ForegroundColor Blue
try {
    (Get-Content install.sh -Raw) -replace "`r`n", "`n" | Set-Content install.sh -NoNewline
    Write-Host "✅ Line endings converted successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not convert line endings: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Check if bash is available
if (Get-Command bash -ErrorAction SilentlyContinue) {
    Write-Host "🚀 Running bash installer..." -ForegroundColor Blue
    bash install.sh
} else {
    Write-Host "❌ Bash not found. Please install Git for Windows or WSL" -ForegroundColor Red
    Write-Host "Alternative: Use the Windows batch file (install.bat)" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🏛️  Installation completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Blue
Write-Host "  1. Go back to BMAD-METHOD root: cd ..\.." -ForegroundColor White
Write-Host "  2. Test the agent: node tools/cli.js agent c4-architect" -ForegroundColor White
Write-Host "  3. Set up Structurizr Lite for diagram visualization" -ForegroundColor White
