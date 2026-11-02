@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
echo Running TikTok lead scraper...
node src/index.js --mode=scrape >> logs\scraper.log 2>&1
echo Done. Check Supabase for new leads or open leads-*.csv in this folder.
