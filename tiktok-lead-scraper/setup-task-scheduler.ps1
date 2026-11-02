# Run this once as Administrator to schedule the scraper daily at 6AM
# Right-click PowerShell → "Run as Administrator", then paste this path

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$batFile   = Join-Path $scriptDir "run-scraper.bat"

# Copy your real .env values into the .env file first if not done already
$envFile = Join-Path $scriptDir ".env"
if (-not (Test-Path $envFile)) {
  Write-Host "ERROR: .env file missing. Copy .env.example to .env and fill in your Supabase keys." -ForegroundColor Red
  exit 1
}

$action  = New-ScheduledTaskAction -Execute $batFile -WorkingDirectory $scriptDir
$trigger = New-ScheduledTaskTrigger -Daily -At "6:00AM"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable

Register-ScheduledTask `
  -TaskName   "JST-TikTok-Lead-Scraper" `
  -Action     $action `
  -Trigger    $trigger `
  -Settings   $settings `
  -RunLevel   Highest `
  -Force

Write-Host ""
Write-Host "Scheduled task registered: runs daily at 6AM." -ForegroundColor Green
Write-Host "Logs will appear in: $scriptDir\logs\scraper.log"
Write-Host "To run immediately: schtasks /run /tn JST-TikTok-Lead-Scraper"
