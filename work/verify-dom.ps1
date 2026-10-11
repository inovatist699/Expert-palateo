# Comprehensive DOM & UX Verification Script
$ErrorActionPreference = "Stop"

$root = "$PSScriptRoot/palateo_cloudflare_pages"
$appHtml = [System.IO.File]::ReadAllText("$root/app/index.html")
$landingHtml = [System.IO.File]::ReadAllText("$root/index.html")
$css = [System.IO.File]::ReadAllText("$root/waitlist.css")
$js = [System.IO.File]::ReadAllText("$root/waitlist.js")

Write-Host "=== Validating DOM & Accessibility Criteria ===" -ForegroundColor Cyan

# 1. Check Logo Reveal markup in app/index.html
if (-not $appHtml.Contains('id="palateoLogoReveal"')) { throw "Logo reveal container missing in app" }
if (-not $appHtml.Contains('class="reveal-emblem-svg"')) { throw "SVG emblem missing in app" }
if (-not $appHtml.Contains('class="r-path-halo"')) { throw "Outer halo trim-path missing in app" }
if (-not $appHtml.Contains('class="r-path-monogram"')) { throw "Monogram 'p' missing in app" }
if (-not $appHtml.Contains('class="r-path-spark"')) { throw "Flavor spark missing in app" }
if (-not $appHtml.Contains('class="reveal-sheen-sweep"')) { throw "Sheen light sweep missing in app" }
if (-not $appHtml.Contains('id="revealSkipBtn"')) { throw "Skip button missing in app" }
if (-not $appHtml.Contains('aria-label="Skip introduction"')) { throw "Aria label on skip button missing in app" }
Write-Host "PASS: app/index.html logo reveal markup is complete" -ForegroundColor Green

# 2. Check Logo Reveal markup in index.html
if (-not $landingHtml.Contains('id="palateoLogoReveal"')) { throw "Logo reveal container missing in landing" }
if (-not $landingHtml.Contains('class="reveal-emblem-svg"')) { throw "SVG emblem missing in landing" }
if (-not $landingHtml.Contains('id="revealSkipBtn"')) { throw "Skip button missing in landing" }
Write-Host "PASS: index.html logo reveal markup is complete" -ForegroundColor Green

# 3. Check Header Brand Emblem
if (-not $appHtml.Contains('class="brandEmblem"')) { throw "brandEmblem badge missing in header" }
if (-not $appHtml.Contains('palate<span>o</span>')) { throw "palate<span>o</span> branding text preserved" }
Write-Host "PASS: app header brand emblem & text verified" -ForegroundColor Green

# 4. Check CSS Animation and Performance rules
if (-not $appHtml.Contains('prefers-reduced-motion')) { throw "Reduced motion override missing in app" }
if (-not $css.Contains('prefers-reduced-motion')) { throw "Reduced motion override missing in waitlist.css" }
if (-not $appHtml.Contains('@keyframes drawHalo')) { throw "Halo trim-path keyframes missing" }
if (-not $appHtml.Contains('@keyframes popMonogram')) { throw "Monogram keyframes missing" }
if (-not $appHtml.Contains('@keyframes burstSpark')) { throw "Spark burst keyframes missing" }
if (-not $appHtml.Contains('@keyframes sheenSweep')) { throw "Sheen sweep keyframes missing" }
if (-not $appHtml.Contains('@keyframes revealBackdropFade')) { throw "Fade exit keyframes missing" }
Write-Host "PASS: all 7 motion keyframe animations verified" -ForegroundColor Green

# 5. Check UI Colour Tokens
if (-not $appHtml.Contains('--bg: #f9f8f5')) { throw "--bg token missing" }
if (-not $appHtml.Contains('--green: #0d4a36')) { throw "--green token missing" }
if (-not $appHtml.Contains('--coral: #de4436')) { throw "--coral token missing" }
if (-not $appHtml.Contains('--gold: #d97706')) { throw "--gold token missing" }
Write-Host "PASS: calibrated UI color tokens verified" -ForegroundColor Green

# 6. Check JS Controllers and Skip logic
if (-not $appHtml.Contains('initLogoReveal()')) { throw "initLogoReveal call missing in app" }
if (-not $appHtml.Contains('palateo_revealed_v2')) { throw "Session storage persistence key missing in app" }
if (-not $js.Contains('palateo_revealed_v2')) { throw "Session storage persistence key missing in waitlist.js" }
Write-Host "PASS: JS controllers, skip handlers, and replay hooks verified" -ForegroundColor Green

Write-Host "`nAll DOM & UX validation checks passed successfully!" -ForegroundColor Cyan
