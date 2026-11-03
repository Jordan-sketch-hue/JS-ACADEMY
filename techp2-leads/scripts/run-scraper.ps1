# Load .env.local and run scraper
$envFile = Join-Path $PSScriptRoot "..\.env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim('"'), 'Process')
        }
    }
}
npx ts-node --compiler-options '{"module":"commonjs"}' (Join-Path $PSScriptRoot "scraper.ts")
