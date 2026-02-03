<#
.SYNOPSIS
    BMAD Auto Loop - Automated Story Development Cycle
.DESCRIPTION
    Executes BMAD workflow in a loop: create-story -> dev-story -> code-review -> commit
    Continues until all stories reach 'done' state in sprint-status.yaml
.PARAMETER MaxIterations
    Safety limit for maximum loop iterations (default: 30)
.PARAMETER Verbose
    Enable detailed debug logging
.EXAMPLE
    .\bmad-loop.ps1
    .\bmad-loop.ps1 -MaxIterations 50 -Verbose
#>

param(
    [int]$MaxIterations = 30,
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ============================================================
# CONFIGURATION LOADING
# ============================================================
# The bmad-auto-config.yaml file is generated during BMAD installation.
# It contains the project root and output folder paths specific to this project.
# This allows the script to work with any output folder configuration.

$ConfigPath = Join-Path $ScriptDir "bmad-auto-config.yaml"

if (-not (Test-Path $ConfigPath)) {
    Write-Host @"
[ERROR] Configuration file not found: $ConfigPath

This file is generated automatically when you install BMAD with Claude Code support.
To fix this, run: npx bmad-method install
And select 'Claude Code' as your IDE.
"@ -ForegroundColor Red
    exit 1
}

# Simple YAML parser for flat key-value config
# Handles both quoted and unquoted values
$config = @{}
Get-Content $ConfigPath | ForEach-Object {
    # Match lines like: key: "value" or key: value (ignore comments starting with #)
    if ($_ -match '^([^#]\w+):\s*"?([^"]+)"?\s*$') {
        $config[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}

# Validate required config values
$ProjectRoot = $config['project_root']
if (-not $ProjectRoot) {
    Write-Host "[ERROR] 'project_root' not found in config file" -ForegroundColor Red
    exit 1
}

$ImplementationArtifacts = $config['implementation_artifacts']
if (-not $ImplementationArtifacts) {
    # Fallback to default if not specified
    $ImplementationArtifacts = "_bmad-output/implementation-artifacts"
}

# Build paths from config
$SprintStatusPath = Join-Path $ProjectRoot $ImplementationArtifacts "sprint-status.yaml"
$ProgressLog = Join-Path $ScriptDir "bmad-progress.log"
$PromptTemplate = Join-Path $ScriptDir "bmad-prompt.md"

# ============================================================
# LOGGING FUNCTION
# ============================================================

function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "White"
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host $Message -ForegroundColor $Color
    Add-Content -Path $ProgressLog -Value "[$timestamp] $Message"
}

# ============================================================
# GET NEXT ACTION
# ============================================================
# Analyzes sprint-status.yaml and returns the next action to take
# Priority order: code-review > dev-story > create-story

function Get-NextAction {
    if (-not (Test-Path $SprintStatusPath)) {
        Write-Log "[ERROR] sprint-status.yaml not found: $SprintStatusPath" "Red"
        return "error"
    }

    # Read file content
    $content = Get-Content $SprintStatusPath -Raw
    $lines = $content -split "`n"

    # Filter story lines (pattern: digits-digits-*) excluding retrospectives
    $storyLines = $lines | Where-Object {
        $_ -match '^\s*[0-9]+-[0-9]+-' -and $_ -notmatch 'retrospective'
    }

    if ($Verbose) {
        Write-Log "[DEBUG] Found $($storyLines.Count) story lines" "Gray"
    }

    # Count stories in each state
    $reviewCount = ($storyLines | Where-Object { $_ -match ':\s*review\s*$' }).Count
    $readyCount = ($storyLines | Where-Object { $_ -match ':\s*ready-for-dev\s*$' }).Count
    $backlogCount = ($storyLines | Where-Object { $_ -match ':\s*backlog\s*$' }).Count
    $doneCount = ($storyLines | Where-Object { $_ -match ':\s*done\s*$' }).Count
    $totalCount = $storyLines.Count

    if ($Verbose) {
        Write-Log "[DEBUG] Review: $reviewCount, Ready: $readyCount, Backlog: $backlogCount, Done: $doneCount" "Gray"
    }

    # Priority order: review > ready-for-dev > backlog
    if ($reviewCount -gt 0) {
        Write-Log "[NEXT] Found story in REVIEW state" "Green"
        return "code-review"
    }

    if ($readyCount -gt 0) {
        Write-Log "[NEXT] Found story in READY-FOR-DEV state" "Green"
        return "dev-story"
    }

    if ($backlogCount -gt 0) {
        Write-Log "[NEXT] Found story in BACKLOG state" "Green"
        return "create-story"
    }

    # Check if all done
    if ($doneCount -eq $totalCount -and $totalCount -gt 0) {
        return "complete"
    }

    # Check for in-progress (waiting state)
    $inProgressCount = ($storyLines | Where-Object { $_ -match ':\s*in-progress\s*$' }).Count
    if ($inProgressCount -gt 0) {
        Write-Log "[WAIT] Found $inProgressCount story(ies) in-progress" "Yellow"
    }

    return "wait"
}

# ============================================================
# INVOKE CLAUDE COMMAND
# ============================================================

function Invoke-ClaudeCommand {
    param([string]$Command)

    Write-Log "[EXEC] Executing Claude Code: $Command" "Cyan"

    # Create customized prompt from template
    $prompt = Get-Content $PromptTemplate -Raw
    $prompt = $prompt -replace '\{COMMAND\}', $Command
    $prompt = $prompt -replace '\{TIMESTAMP\}', (Get-Date -Format "yyyy-MM-dd HH:mm:ss")

    # Save to temp file
    $tempPrompt = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempPrompt -Value $prompt

    try {
        # Execute Claude Code
        Get-Content $tempPrompt | claude --dangerously-skip-permissions
        $success = $LASTEXITCODE -eq 0

        if (-not $success) {
            Write-Log "[ERROR] Claude execution failed with exit code: $LASTEXITCODE" "Red"
        }

        return $success
    }
    finally {
        Remove-Item $tempPrompt -Force -ErrorAction SilentlyContinue
    }
}

# ============================================================
# GIT COMMIT
# ============================================================

function Invoke-GitCommit {
    Write-Log "[GIT] Checking for changes to commit..." "Yellow"

    $status = git status --porcelain

    if (-not $status) {
        Write-Log "[INFO] No changes to commit" "Gray"
        return $true
    }

    Write-Log "[GIT] Committing changes..." "Yellow"

    try {
        git add -A
        git commit -m "feat: BMAD auto-commit after code-review"
        Write-Log "[SUCCESS] Changes committed successfully" "Green"
        return $true
    }
    catch {
        Write-Log "[ERROR] Git commit failed: $_" "Red"
        return $false
    }
}

# ============================================================
# MAIN LOOP
# ============================================================

Write-Log "[START] BMAD Auto Loop Started" "Green"
Write-Log "Max iterations: $MaxIterations" "Gray"
Write-Log "Project root: $ProjectRoot" "Gray"
Write-Log "Sprint status: $SprintStatusPath" "Gray"
Write-Host ""

for ($iteration = 1; $iteration -le $MaxIterations; $iteration++) {
    Write-Log "=======================================" "Cyan"
    Write-Log "=== Iteration $iteration/$MaxIterations ===" "Cyan"
    Write-Log "=======================================" "Cyan"

    $action = Get-NextAction

    switch ($action) {
        "create-story" {
            Write-Log "[ACTION] CREATE STORY" "Yellow"
            Invoke-ClaudeCommand "/bmad-bmm-create-story"
        }
        "dev-story" {
            Write-Log "[ACTION] DEVELOP STORY" "Yellow"
            Invoke-ClaudeCommand "/bmad-bmm-dev-story"
        }
        "code-review" {
            Write-Log "[ACTION] CODE REVIEW" "Yellow"
            $success = Invoke-ClaudeCommand "/bmad-bmm-code-review"
            if ($success) {
                Invoke-GitCommit
            }
        }
        "complete" {
            Write-Log "[COMPLETE] ALL STORIES COMPLETED!" "Green"
            Write-Log "Sprint status: All stories are DONE" "Green"
            Write-Log "Total iterations: $iteration" "Gray"
            exit 0
        }
        "wait" {
            Write-Log "[WAIT] Waiting state - story might be in-progress" "Yellow"
            Write-Log "Skipping this iteration..." "Gray"
        }
        "error" {
            Write-Log "[ERROR] Error state - stopping loop" "Red"
            exit 1
        }
    }

    Write-Host ""
    Start-Sleep -Seconds 5
}

Write-Log "[TIMEOUT] Max iterations reached without completion" "Yellow"
Write-Log "Check sprint-status.yaml for current state" "Gray"
exit 1
