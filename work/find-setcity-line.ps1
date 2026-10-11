$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$lines = $appHtml -split "`r?`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function setCity') {
        Write-Host "Found at line $($i+1): $($lines[$i])"
        break
    }
}
