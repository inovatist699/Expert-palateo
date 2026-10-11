$html = [System.IO.File]::ReadAllText("$PSScriptRoot/palateo_cloudflare_pages/app/index.html")
$pattern = '(?s)<script>([\s\S]*?)</script>'
if ($html -match $pattern) {
    $s = $matches[1] -replace "`r`n?", "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($s)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $hash = 'sha256-' + [System.Convert]::ToBase64String($sha.ComputeHash($bytes))
    Write-Output "Calculated: $hash"
    
    $vercelPath = "$PSScriptRoot/palateo_cloudflare_pages/vercel.json"
    $vercel = Get-Content $vercelPath -Raw
    if ($vercel -match 'sha256-[A-Za-z0-9+/=]+') {
        Write-Output "Found in vercel.json: $($matches[0])"
        if ($matches[0] -eq $hash) {
            Write-Output "SUCCESS: Hashes match!"
        } else {
            Write-Output "MISMATCH: vercel.json has $($matches[0]), calculated $hash"
        }
    }
}
