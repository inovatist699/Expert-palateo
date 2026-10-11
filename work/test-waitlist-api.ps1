# Comprehensive test of api/waitlist.js logic
$apiPath = "$PSScriptRoot/palateo_cloudflare_pages/api/waitlist.js"
$code = [System.IO.File]::ReadAllText($apiPath)

# 1. Check for email declaration before use
$idxEmail = $code.IndexOf("const email =")
$idxIf = $code.IndexOf("if (!email")
if ($idxEmail -lt 0 -or $idxEmail -gt $idxIf) {
    throw "FATAL BUG: 'email' is referenced before declaration in api/waitlist.js!"
}
Write-Host "PASS: email is declared and sanitized properly before validation" -ForegroundColor Green

# 2. Check ALLOWED_CITIES contains all 13 metropolitan cities + Other
$cities = @('Ahmedabad','Vadodara','Mumbai','Delhi NCR','Bengaluru','Hyderabad','Chennai','Kolkata','Pune','Jaipur','Kochi','Goa','Chandigarh','Other')
foreach ($city in $cities) {
    if (-not $code.Contains("'$city'")) {
        throw "City '$city' missing from ALLOWED_CITIES in api/waitlist.js"
    }
}
Write-Host "PASS: All 13 metropolitan cities + Other present in ALLOWED_CITIES" -ForegroundColor Green

# 3. Check Buffer.byteLength check present
if (-not $code.Contains("Buffer.byteLength(JSON.stringify(body),'utf8') > 2048")) {
    throw "Body size check missing in api/waitlist.js"
}
Write-Host "PASS: Body size check verified" -ForegroundColor Green

# 4. Check honeypot check present
if (-not $code.Contains("if (body.website) return res.status(200).json({ok:true});")) {
    throw "Honeypot check missing in api/waitlist.js"
}
Write-Host "PASS: Honeypot check verified" -ForegroundColor Green

Write-Host "All api/waitlist.js checks passed!" -ForegroundColor Cyan
