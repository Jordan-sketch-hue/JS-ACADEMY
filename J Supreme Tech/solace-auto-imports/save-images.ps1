# Saves logo + banner images into the Solace project.
# Usage:
#   1. Save the two pasted images from Claude somewhere (e.g. Downloads).
#   2. Run: powershell -File save-images.ps1 -Logo "C:\path\to\logo.jpg" -Banner "C:\path\to\banner.jpg"
#
# OR — copy the logo to clipboard (right-click image → Copy) then run with -FromClipboard

param(
  [string]$Logo,
  [string]$Banner,
  [switch]$FromClipboard,
  [ValidateSet('Logo','Banner')] [string]$ClipboardTarget = 'Logo'
)

$proj  = "$PSScriptRoot\images"
$logoOut   = "$proj\logo.png"
$bannerOut = "$proj\og-image.jpg"

if ($FromClipboard) {
  Add-Type -AssemblyName System.Windows.Forms
  $img = [System.Windows.Forms.Clipboard]::GetImage()
  if (-not $img) { Write-Error "No image on clipboard."; exit 1 }
  if ($ClipboardTarget -eq 'Logo') {
    $img.Save($logoOut, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Saved logo -> $logoOut ($($img.Width)x$($img.Height))"
  } else {
    $img.Save($bannerOut, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    Write-Output "Saved banner -> $bannerOut ($($img.Width)x$($img.Height))"
  }
  exit 0
}

if ($Logo) {
  Copy-Item -LiteralPath $Logo -Destination $logoOut -Force
  Write-Output "Saved logo -> $logoOut"
}
if ($Banner) {
  Copy-Item -LiteralPath $Banner -Destination $bannerOut -Force
  Write-Output "Saved banner -> $bannerOut"
}
if (-not ($Logo -or $Banner -or $FromClipboard)) {
  Write-Output "Nothing to do. Pass -Logo <path>, -Banner <path>, or -FromClipboard."
}
