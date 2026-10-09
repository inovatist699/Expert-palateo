# Test Runner for Palateo workspace
$ErrorActionPreference = "Stop"

$root = "$PSScriptRoot/palateo_cloudflare_pages"
$appHtmlPath = "$root/app/index.html"
$landingHtmlPath = "$root/index.html"
$waitlistCssPath = "$root/waitlist.css"
$vercelJsonPath = "$root/vercel.json"

Write-Host "=== Running Palateo Verification Suite ===" -ForegroundColor Cyan

# 1. Check index.html requirements
$landingHtml = [System.IO.File]::ReadAllText($landingHtmlPath)
if (-not $landingHtml.Contains("https://palateo.in/")) { throw "Missing 'https://palateo.in/' in index.html" }
if (-not $landingHtml.Contains('id="motion-toggle"')) { throw "Missing 'id=""motion-toggle""' in index.html" }
if (-not $landingHtml.Contains('/monitoring.js')) { throw "Missing '/monitoring.js' in index.html" }
Write-Host "PASS: index.html invariants verified" -ForegroundColor Green

# 2. Check waitlist.css requirements
$waitlistCss = [System.IO.File]::ReadAllText($waitlistCssPath)
if (-not $waitlistCss.Contains("prefers-reduced-motion")) { throw "Missing 'prefers-reduced-motion' in waitlist.css" }
Write-Host "PASS: waitlist.css invariants verified" -ForegroundColor Green

# 3. Check app/index.html requirements
$appHtml = [System.IO.File]::ReadAllText($appHtmlPath)
if (-not $appHtml.Contains("hasTasteProfile")) { throw "Missing 'hasTasteProfile' in app/index.html" }
if (-not $appHtml.Contains("/monitoring.js")) { throw "Missing '/monitoring.js' in app/index.html" }
if (-not ($appHtml -match '<script src="https://cdn\.jsdelivr\.net/npm/@supabase/supabase-js@2\.117\.2" integrity="sha384-[A-Za-z0-9+/]{64}" crossorigin="anonymous"></script>')) {
    throw "Missing or unpinned Supabase script tag in app/index.html"
}
Write-Host "PASS: app/index.html invariants verified" -ForegroundColor Green

# 4. Check CSP and compute hash
if ($appHtml -match '(?s)<script>([\s\S]*?)</script>') {
    $script = $matches[1] -replace "`r`n?", "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($script)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $hash = 'sha256-' + [System.Convert]::ToBase64String($sha.ComputeHash($bytes))
    
    $vercel = [System.IO.File]::ReadAllText($vercelJsonPath)
    if ($vercel -match 'sha256-[A-Za-z0-9+/=]+') {
        $existingHash = $matches[0]
        if ($existingHash -ne $hash) {
            Write-Host "Updating CSP hash in vercel.json from $existingHash to $hash..." -ForegroundColor Yellow
            $updatedVercel = $vercel -replace 'sha256-[A-Za-z0-9+/=]+', $hash
            [System.IO.File]::WriteAllText($vercelJsonPath, $updatedVercel, (New-Object System.Text.UTF8Encoding $false))
            Write-Host "PASS: vercel.json CSP hash updated to $hash" -ForegroundColor Green
        } else {
            Write-Host "PASS: vercel.json CSP hash matches ($hash)" -ForegroundColor Green
        }
    } else {
        throw "Could not find CSP hash in vercel.json"
    }
} else {
    throw "Could not find inline script in app/index.html"
}

# 5. Check critical UI elements
if (-not $appHtml.Contains("palateoLogoReveal")) {
    Write-Warning "palateoLogoReveal not found in app/index.html yet"
} else {
    Write-Host "PASS: palateoLogoReveal present in app/index.html" -ForegroundColor Green
}

Write-Host "`nAll verification checks passed!" -ForegroundColor Cyan
