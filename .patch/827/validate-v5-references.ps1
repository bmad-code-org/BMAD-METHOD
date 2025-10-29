#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Validates v5 references in the BMAD-METHOD codebase.

.DESCRIPTION
    Searches for all v5 references and categorizes them as:
    - ALLOWED: Intentional version markers (e.g., CHANGELOG)
    - DISALLOWED: Documentation that should say v6
    - MANUAL_REVIEW: Code/config requiring contextual analysis

.PARAMETER Fix
    If specified, attempts to automatically fix DISALLOWED references.

.PARAMETER DryRun
    If specified with -Fix, shows what would be changed without making changes.

.EXAMPLE
    .\validate-v5-references.ps1
    Validates all v5 references and reports violations.

.EXAMPLE
    .\validate-v5-references.ps1 -Fix -DryRun
    Shows what would be fixed without making changes.

.EXAMPLE
    .\validate-v5-references.ps1 -Fix
    Automatically fixes all DISALLOWED v5 references.
#>

param(
    [switch]$Fix,
    [switch]$DryRun
)

# Configuration
$ScriptRoot = $PSScriptRoot
if (-not $ScriptRoot) { $ScriptRoot = $PWD.Path }
$RootPath = Split-Path -Parent (Split-Path -Parent $ScriptRoot)
$FilePatterns = @("*.md", "*.yaml", "*.yml", "*.js", "*.xml")
$ExcludeDirs = @("node_modules", ".git", ".patch")

# Allowed v5 references (intentional version markers)
$AllowedPatterns = @(
    @{
        File = "CHANGELOG.md"
        Pattern = "## \[v5\.0\.0\]"
        Reason = "Version history marker"
    },
    @{
        File = "CHANGELOG.md"
        Pattern = "expansion packs from v5 to modules in v5"
        Reason = "Historical context description"
    }
)

# Files that require manual review (code/config)
$ManualReviewExtensions = @(".js", ".json", ".xml")

Write-Host "🔍 BMAD v5 Reference Validator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Find all matching files
Write-Host "📁 Scanning workspace..." -ForegroundColor Yellow
$AllFiles = Get-ChildItem -Path $RootPath -Recurse -Include $FilePatterns |
    Where-Object { 
        $file = $_
        -not ($ExcludeDirs | Where-Object { $file.FullName -like "*\$_\*" })
    }

Write-Host "   Found $($AllFiles.Count) files to check" -ForegroundColor Gray
Write-Host ""

# Search for v5 references
Write-Host "🔎 Searching for v5 references..." -ForegroundColor Yellow
$V5References = $AllFiles | Select-String -Pattern "\bv5\b" -AllMatches

Write-Host "   Found $($V5References.Count) v5 references" -ForegroundColor Gray
Write-Host ""

# Categorize references
$Allowed = @()
$Disallowed = @()
$ManualReview = @()
$FixedCount = 0

foreach ($ref in $V5References) {
    $relativePath = $ref.Path.Replace($RootPath, "").TrimStart("\")
    $extension = [System.IO.Path]::GetExtension($ref.Path)
    $fileName = [System.IO.Path]::GetFileName($ref.Path)
    
    # Check if this is an allowed reference
    $isAllowed = $false
    foreach ($allowed in $AllowedPatterns) {
        if ($relativePath -like "*$($allowed.File)" -and $ref.Line -match $allowed.Pattern) {
            $Allowed += [PSCustomObject]@{
                Path = $relativePath
                Line = $ref.LineNumber
                Content = $ref.Line.Trim()
                Reason = $allowed.Reason
            }
            $isAllowed = $true
            break
        }
    }
    
    if ($isAllowed) { continue }
    
    # Check if requires manual review
    if ($ManualReviewExtensions -contains $extension) {
        $ManualReview += [PSCustomObject]@{
            Path = $relativePath
            Line = $ref.LineNumber
            Content = $ref.Line.Trim()
            Extension = $extension
        }
        continue
    }
    
    # Otherwise, it's disallowed (should be v6)
    $Disallowed += [PSCustomObject]@{
        Path = $relativePath
        Line = $ref.LineNumber
        Content = $ref.Line.Trim()
        FullPath = $ref.Path
    }
}

# Report Results
Write-Host "📊 RESULTS" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ ALLOWED (Intentional Version Markers): $($Allowed.Count)" -ForegroundColor Green
if ($Allowed.Count -gt 0) {
    foreach ($item in $Allowed) {
        Write-Host "   📄 $($item.Path):$($item.Line)" -ForegroundColor Gray
        Write-Host "      $($item.Content)" -ForegroundColor DarkGray
        Write-Host "      Reason: $($item.Reason)" -ForegroundColor DarkGray
        Write-Host ""
    }
}

Write-Host "⚠️  MANUAL REVIEW REQUIRED (Code/Config): $($ManualReview.Count)" -ForegroundColor Yellow
if ($ManualReview.Count -gt 0) {
    $ManualReview | Group-Object Extension | ForEach-Object {
        Write-Host "   $($_.Name) files: $($_.Count)" -ForegroundColor Gray
        foreach ($item in $_.Group | Select-Object -First 5) {
            Write-Host "      $($item.Path):$($item.Line)" -ForegroundColor DarkGray
            Write-Host "         $($item.Content)" -ForegroundColor DarkGray
        }
        if ($_.Count -gt 5) {
            Write-Host "      ... and $($_.Count - 5) more" -ForegroundColor DarkGray
        }
    }
    Write-Host ""
}

Write-Host "❌ DISALLOWED (Should be v6): $($Disallowed.Count)" -ForegroundColor Red
if ($Disallowed.Count -gt 0) {
    # Group by file
    $DisallowedByFile = $Disallowed | Group-Object Path | Sort-Object Count -Descending
    
    Write-Host "   Top files with v5 references:" -ForegroundColor Gray
    foreach ($fileGroup in $DisallowedByFile | Select-Object -First 10) {
        Write-Host "      $($fileGroup.Name): $($fileGroup.Count) references" -ForegroundColor DarkGray
    }
    
    if ($DisallowedByFile.Count -gt 10) {
        Write-Host "      ... and $($DisallowedByFile.Count - 10) more files" -ForegroundColor DarkGray
    }
    Write-Host ""
}

# Fix disallowed references if requested
if ($Fix -and $Disallowed.Count -gt 0) {
    Write-Host ""
    Write-Host "🔧 FIXING DISALLOWED REFERENCES" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($DryRun) {
        Write-Host "   [DRY RUN MODE - No files will be modified]" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Group by file for efficient processing
    $DisallowedByFile = $Disallowed | Group-Object FullPath
    
    foreach ($fileGroup in $DisallowedByFile) {
        $filePath = $fileGroup.Name
        $relativePath = $filePath.Replace($RootPath, "").TrimStart("\")
        $refCount = $fileGroup.Count
        
        Write-Host "   📝 $relativePath ($refCount references)" -ForegroundColor Yellow
        
        if (-not $DryRun) {
            # Read file content
            $content = Get-Content -Path $filePath -Raw
            
            # Replace v5 with v6
            # Use word boundary regex to avoid replacing in unintended contexts
            $newContent = $content -replace '\bv5\b', 'v6'
            
            # Write back
            Set-Content -Path $filePath -Value $newContent -NoNewline
            
            $FixedCount += $refCount
            Write-Host "      ✅ Fixed $refCount references" -ForegroundColor Green
        } else {
            Write-Host "      [Would fix $refCount references]" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    if (-not $DryRun) {
        Write-Host "✅ Fixed $FixedCount v5 references across $($DisallowedByFile.Count) files" -ForegroundColor Green
    } else {
        Write-Host "   [Dry run complete - run without -DryRun to apply changes]" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "📋 SUMMARY" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "   Total v5 references found: $($V5References.Count)" -ForegroundColor White
Write-Host "   ✅ Allowed (intentional): $($Allowed.Count)" -ForegroundColor Green
Write-Host "   ⚠️  Manual review required: $($ManualReview.Count)" -ForegroundColor Yellow
Write-Host "   ❌ Disallowed (should be v6): $($Disallowed.Count)" -ForegroundColor Red
if ($Fix -and -not $DryRun) {
    Write-Host "   🔧 Fixed: $FixedCount" -ForegroundColor Green
}
Write-Host ""

# Exit code
if ($Disallowed.Count -gt 0 -and -not $Fix) {
    Write-Host "❌ VALIDATION FAILED - Found $($Disallowed.Count) v5 references that should be v6" -ForegroundColor Red
    Write-Host "   Run with -Fix to automatically correct, or -Fix -DryRun to preview changes" -ForegroundColor Yellow
    exit 1
} elseif ($ManualReview.Count -gt 0) {
    Write-Host "⚠️  MANUAL REVIEW NEEDED - Found $($ManualReview.Count) code/config references" -ForegroundColor Yellow
    Write-Host "   Review these files manually to determine if they should be updated" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "✅ VALIDATION PASSED - All v5 references are appropriate" -ForegroundColor Green
    exit 0
}
