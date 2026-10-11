# Test all 13 metropolitan cities across Palateo files
$ErrorActionPreference = "Stop"

$root = "$PSScriptRoot/palateo_cloudflare_pages"
$indexHtml = [System.IO.File]::ReadAllText("$root/index.html")
$waitlistJs = [System.IO.File]::ReadAllText("$root/waitlist.js")
$apiJs = [System.IO.File]::ReadAllText("$root/api/waitlist.js")
$appHtml = [System.IO.File]::ReadAllText("$root/app/index.html")

$expected13 = @(
    'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Vadodara', 'Jaipur', 
    'Kochi', 'Goa', 'Chandigarh'
)

Write-Host "=== Testing 13 Metropolitan Cities Coverage ===" -ForegroundColor Cyan

# 1. Header badge
if ($indexHtml -notmatch '<span class="header-city-text">13 METRO CITIES LIVE</span>') {
    throw "index.html header badge does not say '13 METRO CITIES LIVE'"
}
Write-Host "PASS: index.html header badge verified" -ForegroundColor Green

# 2. Ticker
foreach ($c in $expected13) {
    $cUpper = $c.ToUpper()
    if ($indexHtml.IndexOf($cUpper) -lt 0) {
        throw "City '$cUpper' missing from index.html ticker"
    }
}
Write-Host "PASS: All 13 cities present in index.html ticker" -ForegroundColor Green

# 3. Quiz pill buttons in index.html
foreach ($c in $expected13) {
    if ($indexHtml.IndexOf("data-city=""$c""") -lt 0) {
        throw "City button for '$c' missing from interactive quiz in index.html"
    }
}
Write-Host "PASS: All 13 city buttons present in interactive quiz" -ForegroundColor Green

# 4. Metro card grid in index.html
foreach ($c in $expected13) {
    $cUpper = $c.ToUpper()
    if ($indexHtml -notmatch "<div class=""metro-badge"">$cUpper</div>") {
        throw "Metro card for '$cUpper' missing from index.html"
    }
}
Write-Host "PASS: All 13 metro cards present in index.html" -ForegroundColor Green

# 5. Join section in index.html
foreach ($c in $expected13) {
    $cUpper = $c.ToUpper()
    if ($indexHtml.IndexOf("<span>$cUpper</span>") -lt 0) {
        throw "City tag '<span>$cUpper</span>' missing in join section of index.html"
    }
}
Write-Host "PASS: All 13 cities present in join section of index.html" -ForegroundColor Green

# 6. Select dropdown in index.html
foreach ($c in $expected13) {
    if ($indexHtml.IndexOf("<option value=""$c"">$c</option>") -lt 0) {
        throw "Option value for '$c' missing from select in index.html"
    }
}
Write-Host "PASS: All 13 cities present in select dropdown of index.html" -ForegroundColor Green

# 7. cityMatches in waitlist.js
foreach ($c in $expected13) {
    if ($waitlistJs.IndexOf("'$c': {") -lt 0) {
        throw "cityMatches in waitlist.js missing entry for '$c'"
    }
}
Write-Host "PASS: All 13 cities defined in waitlist.js cityMatches" -ForegroundColor Green

# 8. ALLOWED_CITIES in api/waitlist.js
foreach ($c in $expected13) {
    if ($apiJs.IndexOf("'$c'") -lt 0) {
        throw "api/waitlist.js ALLOWED_CITIES missing '$c'"
    }
}
Write-Host "PASS: All 13 cities present in api/waitlist.js" -ForegroundColor Green

# 9. CITY_MAP_BOUNDS in app/index.html
foreach ($c in $expected13) {
    if ($appHtml -notmatch "(?:^|\s)('?$([regex]::Escape($c))'?):\s*\{") {
        throw "app/index.html CITY_MAP_BOUNDS missing bounds for '$c'"
    }
}
Write-Host "PASS: All 13 cities present in app/index.html bounds" -ForegroundColor Green

Write-Host "`nAll 13 cities verified across all application surfaces!" -ForegroundColor Green
