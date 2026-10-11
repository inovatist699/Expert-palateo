$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")

# Find isExcludedVenue implementation
$idx = $appHtml.IndexOf("function isExcludedVenue(r){")
$idxEnd = $appHtml.IndexOf("function isQualifiedVenue", $idx)
$fnCode = $appHtml.Substring($idx, $idxEnd - $idx)

Write-Host "isExcludedVenue code:"
Write-Host $fnCode

if ($fnCode.Contains("if(name.includes('bombay canteen'))return false;")) {
    Write-Host "PASS: The Bombay Canteen is explicitly exempted from exclusion!" -ForegroundColor Green
} else {
    throw "FAIL: The Bombay Canteen exemption missing"
}
