# Run from solace-auto-imports: powershell -ExecutionPolicy Bypass -File scripts\invoke-setup.ps1
# Reads Supabase keys from .vercel\.env.production.local (never commit secrets).
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot\..

function Get-CleanEnv([string]$path, [string]$key) {
  if (-not (Test-Path $path)) { return $null }
  $line = Get-Content $path | Where-Object { $_ -match "^\s*$key\s*=" } | Select-Object -First 1
  if (-not $line) { return $null }
  $val = ($line -split '=', 2)[1].Trim().Trim('"').Trim("'")
  return ($val -replace '\\r\\n|\\n|\\r', '').Trim()
}

$envFile = '.vercel\.env.production.local'
$supabaseUrl = Get-CleanEnv $envFile 'NEXT_PUBLIC_SUPABASE_URL'
$anonKey = Get-CleanEnv $envFile 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
$serviceKey = Get-CleanEnv $envFile 'SUPABASE_SERVICE_ROLE_KEY'

node scripts\write-setup-result.mjs | Tee-Object -FilePath SETUP-OUTPUT.txt
Get-Content SETUP-RESULT.json -ErrorAction SilentlyContinue

$npx = 'npx'
& $npx vercel env rm SOLACE_ARCHITECT_EMAILS production -y 2>$null
'jordanmorrisr@gmail.com' | & $npx vercel env add SOLACE_ARCHITECT_EMAILS production
& $npx vercel env rm SOLACE_ADMIN_EMAILS production -y 2>$null
'solaceimports@gmail.com' | & $npx vercel env add SOLACE_ADMIN_EMAILS production

if ($supabaseUrl) {
  & $npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production -y 2>$null
  $supabaseUrl | & $npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
}
if ($anonKey) {
  & $npx vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production -y 2>$null
  $anonKey | & $npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
}
if ($serviceKey) {
  & $npx vercel env rm SUPABASE_SERVICE_ROLE_KEY production -y 2>$null
  $serviceKey | & $npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
}

& $npx vercel env ls production
& $npx vercel --prod
