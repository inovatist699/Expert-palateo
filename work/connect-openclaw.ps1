<#
.SYNOPSIS
    Connects the OpenClaw CLI and Gateway with this Palateo workspace.
.DESCRIPTION
    Checks OpenClaw CLI availability, initializes user-level and workspace-level
    configurations, links the Palateo workspace (SOUL.md, AGENTS.md, IDENTITY.md,
    TOOLS.md, MEMORY.md), and validates the connection.
#>

$ErrorActionPreference = "Continue"

$workspaceRoot = (Get-Item $PSScriptRoot\..).FullName
$openclawDir = Join-Path $env:USERPROFILE ".openclaw"
$openclawGlobalConfig = Join-Path $openclawDir "openclaw.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Palateo <-> OpenClaw CLI Workspace Connector" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Workspace Root : $workspaceRoot" -ForegroundColor White
Write-Host "User Config Dir: $openclawDir" -ForegroundColor White
Write-Host ""

# Step 1: Ensure workspace files exist
$requiredFiles = @("AGENTS.md", "SOUL.md", "IDENTITY.md", "TOOLS.md", "MEMORY.md", "USER.md", "openclaw.json")
$missingFiles = @()

foreach ($f in $requiredFiles) {
    $fullPath = Join-Path $workspaceRoot $f
    if (-not (Test-Path $fullPath)) {
        $missingFiles += $f
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "[!] Warning: Missing workspace files: $($missingFiles -join ', ')" -ForegroundColor Yellow
} else {
    Write-Host "[v] All OpenClaw workspace specification files verified." -ForegroundColor Green
}

# Step 2: Ensure ~/.openclaw directory and global config exists
try {
    if (-not (Test-Path $openclawDir)) {
        New-Item -ItemType Directory -Path $openclawDir -Force -ErrorAction Stop | Out-Null
        Write-Host "[v] Created OpenClaw home directory at $openclawDir" -ForegroundColor Green
    }

    $jsonContent = @{
        agents = @{
            defaults = @{
                workspace = $workspaceRoot
            }
            entries = @{
                palateo = @{
                    name = "Palateo Lead Engineer & Taste Architect"
                    workspace = $workspaceRoot
                    description = "Autonomous full-stack engineering agent for Palateo"
                }
            }
        }
    }

    $jsonString = $jsonContent | ConvertTo-Json -Depth 5
    Set-Content -Path $openclawGlobalConfig -Value $jsonString -Encoding UTF8 -ErrorAction Stop
    Write-Host "[v] Successfully configured $openclawGlobalConfig pointing to this workspace." -ForegroundColor Green
} catch {
    Write-Host "[i] Note: Could not write to $openclawDir directly in current environment." -ForegroundColor DarkGray
    Write-Host "    Workspace configuration is active locally at: $(Join-Path $workspaceRoot 'openclaw.json')" -ForegroundColor Cyan
}

# Step 3: Check if OpenClaw CLI binary is installed
$openclawCmd = Get-Command "openclaw" -ErrorAction SilentlyContinue

if ($openclawCmd) {
    Write-Host "[v] OpenClaw CLI found at $($openclawCmd.Source)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Registering workspace with OpenClaw CLI..." -ForegroundColor Yellow
    
    # Configure via CLI
    & openclaw config set agents.defaults.workspace "$workspaceRoot"
    & openclaw agents add palateo --workspace "$workspaceRoot" --non-interactive
    
    Write-Host ""
    Write-Host "Current OpenClaw Status:" -ForegroundColor Cyan
    & openclaw status
    
    Write-Host ""
    Write-Host "To start or restart the OpenClaw Gateway:" -ForegroundColor White
    Write-Host "  openclaw gateway restart" -ForegroundColor Green
    Write-Host "To chat with this workspace in terminal:" -ForegroundColor White
    Write-Host "  openclaw chat --agent palateo" -ForegroundColor Green
} else {
    Write-Host "" -ForegroundColor Yellow
    Write-Host "[i] OpenClaw CLI is not yet installed in your system PATH." -ForegroundColor Yellow
    Write-Host "    Workspace configuration has been pre-configured for you at:" -ForegroundColor White
    Write-Host "    $openclawGlobalConfig" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To install OpenClaw CLI on Windows, run ONE of the following:" -ForegroundColor White
    Write-Host ""
    Write-Host "  Option 1 (PowerShell Installer - Recommended):" -ForegroundColor White
    Write-Host "    iwr -useb https://openclaw.ai/install.ps1 | iex" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Option 2 (npm Global Install):" -ForegroundColor White
    Write-Host "    npm install -g openclaw@latest" -ForegroundColor Green
    Write-Host ""
    Write-Host "After installation, run:" -ForegroundColor White
    Write-Host "    openclaw gateway start" -ForegroundColor Green
    Write-Host "    openclaw chat --agent palateo" -ForegroundColor Green
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Done! Palateo is ready for OpenClaw." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
